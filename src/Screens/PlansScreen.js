import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, addDoc, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState({});
  const [subscription, setSubscription] = useState(null);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchSubscription = async () => {
      try {
        const subscriptionsRef = collection(db, "customers", user.uid, "subscriptions");
        const subscriptionSnapshot = await getDocs(subscriptionsRef);

        subscriptionSnapshot.forEach((doc) => {
          setSubscription({
            role: doc.data().role,
            current_period_start: doc.data().current_period_start?.seconds,
            current_period_end: doc.data().current_period_end?.seconds,
          });
        });

        console.log("Fetched Subscription:", subscription);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [user?.uid]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const productsQuery = query(productsRef, where("active", "==", true));
        const querySnapshot = await getDocs(productsQuery);

        const productsData = {};

        // Convert Firestore query into an array for async handling
        const productPromises = querySnapshot.docs.map(async (productDoc) => {
          const product = productDoc.data();
          const productId = productDoc.id;

          // Initialize product entry
          productsData[productId] = { ...product, prices: [] };

          // Fetch prices for this product
          const pricesRef = collection(db, "products", productId, "prices");
          const priceSnapshot = await getDocs(pricesRef);

          const prices = priceSnapshot.docs.map((priceDoc) => ({
            priceId: priceDoc.id,
            priceData: priceDoc.data(),
          }));

          productsData[productId].prices = prices;
        });

        // Wait for all async operations to finish
        await Promise.all(productPromises);

        console.log("Fetched Products:", productsData); // Debugging
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log("Products State:", products);
  console.log("Subscription State:", subscription);

  const loadCheckout = async (priceId) => {
    if (!priceId) {
      alert("Error: No price ID found!");
      return;
    }

    try {
      const checkoutSessionRef = collection(db, "customers", user.uid, "checkout_sessions");
      const docRef = await addDoc(checkoutSessionRef, {
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

      onSnapshot(docRef, async (snap) => {
        const data = snap.data();
        if (!data) return;

        const { error, sessionId } = data;

        if (error) {
          alert(`An error occurred: ${error.message}`);
        }

        if (sessionId) {
          const stripe = await loadStripe("pk_test_51QmjwCGf1UXbJzkPj3YFw3GKmgisB5W4lpo7tHY898XuMUvJHfpaEvtRJTvx97Z45mRBJmj0J2XosmiP2ks3cGzC00hpAYcwZZ");
          stripe.redirectToCheckout({ sessionId });
        }
      });
    } catch (error) {
      console.error("Error loading checkout:", error);
    }
  };

  return (
    <div className="plansScreen">

        {subscription && <p>Renewal Date: {new Date(subscription?.current_period_end * 1000).toLocaleDateString()} </p>}

      {Object.entries(products).map(([productId, productData]) => {
        // Ensure prices array exists
        const hasPrices = productData?.prices?.length > 0;
        const priceId = hasPrices ? productData.prices[0].priceId : null;
        const isSubscribed = subscription?.role && subscription?.role === productData.name.toLowerCase();

        const isCurrentPackage = productData.name?.toLowerCase().includes(subscription?.role)

        return (
          <div key={productId} className={`${isCurrentPackage && 'plansScreen-plan-disabled'} plansScreen-plan`}>
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>

            <button 
              onClick={() =>!isCurrentPackage && loadCheckout(priceId)} 
              disabled={!hasPrices || isSubscribed}
            >
              {/* {isSubscribed ? "Subscribed" : hasPrices ? "Subscribe" : "No Pricing Available"} */}
              {isCurrentPackage ? 'Current Package' : 'Subscribe'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
