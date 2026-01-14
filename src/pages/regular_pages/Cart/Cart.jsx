
import { use, useEffect, useState } from "react";
import { AuthContext } from "../../../Routes/AuthProvider";
import axios from "axios";


const Cart = () => {
    const [cartProduct, setCartProduct] = useState([])
    const {user, loading} = use(AuthContext);

    console.log(cartProduct)

    useEffect(() => {
        axios.get(`http://localhost:5000/cart`)
        .then(res => {
            setCartProduct(res.data)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [])
    
    
    if(loading){
        return <p className="min-h-150 flex items-center justify-center text-3xl font-bold">Loading...</p>
    }

    return (
        <div className="bg-[#f5f5f5]">
            <div className="default-width py-8 lg:py-12 ">
                <h2 className="text-center text-3xl font-bold">Cart Page</h2>
                <div>

                </div>
            </div>
        </div>
    );
};

export default Cart;