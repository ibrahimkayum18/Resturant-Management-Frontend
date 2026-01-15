import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../Routes/AuthProvider";
import useAxiosPublic from "./useAxiosPublic";

const useCartItems = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const {
    data: cartItems = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["myCartItems", user?.email],
    enabled: !!user?.email, // ✅ IMPORTANT
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/cart?email=${user.email}`
      );
      return res.data;
    },
  });

  return [cartItems, refetch, isLoading];
};

export default useCartItems;
