import axios from "axios";
import { useEffect, useState } from "react";




const Overview = () => {
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

    return (
        <div>
            {storeUser.length}
        </div>
    );
};

export default Overview;