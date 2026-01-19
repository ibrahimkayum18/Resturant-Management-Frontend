import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, use } from "react";
import CheckoutForm from "./CheckoutForm";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { AuthContext } from "../../../Routes/AuthProvider";
import toast from "react-hot-toast";

const stripePromise = loadStripe(
  "pk_test_51OJLNXJfbPWZcZjMbtZazfhkcWjacEkh0ciu50mxA7FyvN6zbQmWLQsArVzK3Y3jOCZmwbYm2Su0InaBkksIyNKp00ofECVZXE"
);

const Payments = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = use(AuthContext);

  const [clientSecret, setClientSecret] = useState("");
  const [cartProducts, setCartProducts] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    axiosPublic
      .get(`/cart?email=${user.email}`)
      .then((res) => {
        setCartProducts(res.data);

        return axiosPublic.post("/create-payment-intent", {
          cartItems: res.data,
        });
      })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(() => toast.error("Failed to prepare payment"));
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
      <CheckoutForm
        clientSecret={clientSecret}
        cartProducts={cartProducts}
      />
    </Elements>
  );
};

export default Payments;
