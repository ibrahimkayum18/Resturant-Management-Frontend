import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { use, useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../Routes/AuthProvider";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51OJLNXJfbPWZcZjMbtZazfhkcWjacEkh0ciu50mxA7FyvN6zbQmWLQsArVzK3Y3jOCZmwbYm2Su0InaBkksIyNKp00ofECVZXE"
);

const Payments = () => {
  const [clientSecret, setClientSecret] = useState("");
  const axiosPublic = useAxiosPublic();
  const {user} = use(AuthContext)
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    axiosPublic
      .post("/create-payment-intent", {
        amount: 50, // REQUIRED (example: $50)
      })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(console.error);

      axiosPublic
        .get(`/cart?email=${user?.email}`)
        .then((res) => setCartProducts(res.data))
        .catch(() => toast.error("Failed to load cart"));
  }, [axiosPublic, user?.email]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Preparing payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} cartProducts={cartProducts}/>
    </Elements>
  );
};

export default Payments;
