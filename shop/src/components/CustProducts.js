import React, { useState, useEffect } from "react";
import "../Style/CustProduct.css";

const CustProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/products/all-products",
          {
            method: "GET",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <div className="heading-container">
        <h3 className="page-heading">Product List</h3>
      </div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="table-heading">Product Name</th>
              <th className="table-heading">Products Image</th>
              <th className="table-heading">Retail Price</th>
              <th className="table-heading">Wholesale Price</th>
              <th className="table-heading">Product Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.p_id}>
                <td>{product.p_name}</td>
                <td>
                  <img
                    src={`${product.image_data}`}
                    alt="Product"
                    style={{
                      width: "70px", // Set the width to a smaller size
                      height: "70px", // Set the height to a smaller size
                      objectFit: "cover",
                      borderRadius: "50%", // Make the image rounded
                      overflow: "hidden", // Hide overflow to ensure rounded shape
                    }}
                  />
                </td>
                <td>{product.r_price}</td>
                <td>{product.w_price}</td>
                <td>{product.p_category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustProducts;
