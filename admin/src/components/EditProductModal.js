import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const EditProductModal = ({
  selectedProduct,
  setSelectedProduct,
  saveEditedProduct,
}) => {
  const [previousRPrice, setPreviousRPrice] = useState(null); // State to store previous r_price
  const [previousWPrice, setPreviousWPrice] = useState(null); // State to store previous w_price

  // Function to update r_price and log its previous value
  const handleRPriceChange = (e) => {
    const newRPrice = e.target.value;
    console.log("Previous r_price:", previousRPrice);
    setSelectedProduct({
      ...selectedProduct,
      r_price: newRPrice,
    });
    setPreviousRPrice(newRPrice); // Update previousRPrice after setting the new value
  };

  const handleWPriceChange = (e) => {
    const newWPrice = e.target.value;
    console.log("Previous r_price:", previousRPrice);
    setSelectedProduct({
      ...selectedProduct,
      w_price: newWPrice,
    });
    setPreviousWPrice(newWPrice); // Update previousRPrice after setting the new value
  };

  if (!selectedProduct) {
    return null; // Return null if selectedProduct is null
  }

  return (
    <Modal show={true} onHide={() => setSelectedProduct(null)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-control"
              value={selectedProduct.p_name || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  p_name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Retail Price</label>
            <input
              type="text"
              // step="0.01"
              className="form-control"
              value={selectedProduct.r_price || ""}
              onChange={handleRPriceChange} // Use handleRPriceChange for onChange event
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Wholesale Price</label>
            <input
              type="text"
              // step="0.01"
              className="form-control"
              value={selectedProduct.w_price || ""}
              onChange={handleWPriceChange} // Use handleRPriceChange for onChange event
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <input
              type="text"
              className="form-control"
              value={selectedProduct.p_category || ""}
              onChange={(e) =>
                setSelectedProduct({
                  ...selectedProduct,
                  p_category: e.target.value,
                })
              }
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => saveEditedProduct(selectedProduct)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProductModal;
