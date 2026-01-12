import { useEffect, useState } from "react";
import axios from "axios";

const useAllCustomers = () => {
  const [storeUser, setStoreUser] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => {
        setStoreUser(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return storeUser;
};

export default useAllCustomers;
