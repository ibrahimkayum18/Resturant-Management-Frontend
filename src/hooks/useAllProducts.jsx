import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { use } from "react";
import { AuthContext } from "../Routes/AuthProvider";


const useAllProducts = () => {
  const {user} = use(AuthContext)
  const axiosPublic = useAxiosPublic()
  const {data: allProducts = [], refetch} = useQuery({
    queryKey: ["myAllProducts", user.email],
    queryFn: async() => {
      const res = await axiosPublic.get(`/food-menu`)
      return res.data;
    }
  })

  return [allProducts, refetch];

};

export default useAllProducts;