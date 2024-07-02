import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../style/ProductList.css"; // Import CSS file for styling

const ProductList = ({ products, editProduct, deleteProduct }) => {
  console.log("Products Image ------------:", products.image_data);

  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPhotoUrl, setProductPhotoUrl] = useState("");
  // const [showModal, setShowModal] = useState(false);

  const handlePhotoClick = (product) => {
    // setSelectedProduct(product);
    setProductPhotoUrl(product.image_data);
    // setShowModal(true);
  };

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
              <th className="table-heading">Product Image</th>
              <th className="table-heading">Retail Price</th>
              <th className="table-heading">Wholesale Price</th>
              <th className="table-heading">Product Category</th>
              <th className="table-heading">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.p_id}>
                <td>{product.p_name}</td>
                <td>
                  <img
                    src={product.image_data}
                    alt="Selfie"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "10px",
                      cursor: "pointer", // Add cursor pointer for clickable effect
                    }}
                    onClick={() => handlePhotoClick(product)}
                  />
                </td>
                <td>{product.r_price}</td>
                <td>{product.w_price}</td>
                <td>{product.p_category}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => editProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => deleteProduct(product.p_id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          show={productPhotoUrl !== ""}
          onHide={() => setProductPhotoUrl("")}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>Full Size Product Photo</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={productPhotoUrl}
              alt="Full Size Pic"
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setProductPhotoUrl("")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ProductList;

// // ProductList.js

// import React from "react";

// const ProductList = ({ products, editProduct, deleteProduct }) => {
//   console.log("Products Image ------------:", products.image_data);

//   return (
//     <div>
//       <div className="d-flex justify-content-center">
//         <h3>Product List</h3>
//       </div>
//       <div className="mt-3">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Product Image</th>
//               <th>Retail Price</th>
//               <th>Wholesale Price</th>
//               <th>Product Category</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product) => (
//               <tr key={product.p_id}>
//                 <td>{product.p_name}</td>
//                 <td>
//                   <img
//                     src={`${product.image_data}`}
//                     alt="Product"
//                     style={{
//                       width: "70px", // Set the width to a smaller size
//                       height: "70px", // Set the height to a smaller size
//                       objectFit: "cover",
//                       borderRadius: "50%", // Make the image rounded
//                       overflow: "hidden", // Hide overflow to ensure rounded shape
//                     }}
//                   />
//                 </td>
//                 <td>{product.r_price}</td>
//                 <td>{product.w_price}</td>
//                 <td>{product.p_category}</td>
//                 <td>
//                   <button
//                     className="btn btn-info btn-sm me-2"
//                     onClick={() => editProduct(product)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn btn-warning btn-sm"
//                     onClick={() => deleteProduct(product.p_id)}
//                   >
//                     Remove
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ProductList;
