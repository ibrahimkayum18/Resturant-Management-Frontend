// import { useQuery } from "@tanstack/react-query";
// import { use } from "react";
import { AuthContext } from "../../../Routes/AuthProvider";
// import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAllCustomers from "../../../hooks/useAllCustomers";


const Subscribers = () => {

    const [allCustomers, refetch] = useAllCustomers()

    console.log(allCustomers)

    return (
        <div>
            Subscribers
        </div>
    );
};

export default Subscribers;