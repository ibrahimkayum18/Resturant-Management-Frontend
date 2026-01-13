import axios from "axios";
import { useEffect, useState } from "react";


const AllProducts = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/food-menu")
        .then(res => {
            setProducts(res.data)
        })
        .catch(err => {
            console.log(err.message)
        })
    }, [])

    return (
        <div>
            All Products
        </div>
    );
};

export default AllProducts;