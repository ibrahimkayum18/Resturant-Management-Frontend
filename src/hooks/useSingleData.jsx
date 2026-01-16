import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./useAxiosPublic";
import { use } from "react";
import { AuthContext } from "../Routes/AuthProvider";


const useSingleFood = ({id}) => {
  const {user} = use(AuthContext)
  const axiosPublic = useAxiosPublic()
  const {data: singleFood = [], refetch, isLoading} = useQuery({
    queryKey: ["getSingleFood", user.email],
    queryFn: async() => {
      const res = await axiosPublic.get(`/food-menu/${id}`)
      return res.data;
    }
  })

  return [singleFood, refetch, isLoading]

};

export default useSingleFood;
