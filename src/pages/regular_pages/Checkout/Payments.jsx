import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const stripePromise = loadStripe(
  "pk_test_51OJLNXJfbPWZcZjMbtZazfhkcWjacEkh0ciu50mxA7FyvN6zbQmWLQsArVzK3Y3jOCZmwbYm2Su0InaBkksIyNKp00ofECVZXE"
);

const Payments = () => {
  const [clientSecret, setClientSecret] = useState("");
  const axiosPublic = useAxiosPublic();

  

  useEffect(() => {
    axiosPublic
      .post("/create-payment-intent", {
        amount: 50, // REQUIRED (example: $50)
      })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(console.error);
  }, [axiosPublic]);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Preparing payment...</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};

export default Payments;
