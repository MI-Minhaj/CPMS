import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "../style/reg.css";

const SolvedRegShopReport = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [shopPhotoUrl, setShopPhotoUrl] = useState("");
  const [productPhotoUrl, setProductPhotoUrl] = useState("");
  const [cPhotoUrl, setCPhotoUrl] = useState("");
  const [cnfPhotoUrl, setCNFPhotoUrl] = useState("");
  const [cnbPhotoUrl, setCNBPhotoUrl] = useState("");

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/adminreport/shopssolved",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      setShops(data);
    } catch (error) {
      console.error("Error fetching shops:", error);
    }
  };

  const showReports = (shop) => {
    setSelectedShop(shop);
    setShowModal(true);
  };

  const hideDetails = () => {
    setSelectedShop(null);
    setSelectedReport(null); // Reset selected report
    setShowModal(false);
  };

  const viewAddress = () => {
    setShowAddressModal(true);
  };

  const viewCustomerDetails = (report) => {
    setSelectedReport(report);
    setShowCustomerModal(true);
  };

  const handleSPhotoClick = (selectedShop) => {
    setSelectedShop(selectedShop);
    setShopPhotoUrl(selectedShop.s_photo); // Set the URL of the full-size shop photo
    setShowModal(true);
  };

  const handleCPhotoClick = (selectedReport) => {
    setSelectedReport(selectedReport);
    setCPhotoUrl(selectedReport.c_selfiephoto); // Set the URL of the full-size C photo
    setShowModal(true);
  };

  const handleCNPhotoClick = (selectedReport) => {
    setSelectedReport(selectedReport);
    setCNFPhotoUrl(selectedReport.c_frontnid); // Set the URL of the full-size NID photo
    setCNBPhotoUrl(selectedReport.c_backnid); // Set the URL of the full-size NID photo
    setShowModal(true);
  };

  const handlePhotoClick = (report) => {
    setSelectedReport(report);
    setProductPhotoUrl(report.p_photo); // Set the URL of the full-size product photo
    setShowModal(true);
  };

  // const updateReportsStatus = async (shopName) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/adminreport/updateStatus/${shopName}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ status: "Solved" })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to update status');
  //     }

  //     const updatedShopsCopy = [...shops];
  //     const shopIndex = updatedShopsCopy.findIndex(shop => shop.s_name === shopName);
  //     if (shopIndex !== -1) {
  //       updatedShopsCopy[shopIndex] = {
  //         ...updatedShopsCopy[shopIndex],
  //         shop_info: {
  //           ...updatedShopsCopy[shopIndex].shop_info,
  //           reports: updatedShopsCopy[shopIndex].shop_info.reports.map(report => ({
  //             ...report,
  //             status: "solved"
  //           })),
  //           reportsCount: 0
  //         }
  //       };
  //       setShops(updatedShopsCopy);
  //     }
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };

  return (
    <div>
      <div className="table-container-report">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th className="table-heading-report">Shop Name</th>
              <th className="table-heading-report">Shop Photo</th>
              <th className="table-heading-report">Phone</th>
              <th className="table-heading-report">Number of Reports</th>
              <th className="table-heading-report">Details</th>
              <th className="table-heading-report">Status</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop, index) => (
              <tr key={index}>
                <td>{shop.s_name}</td>
                <td>
                  <img
                    src={shop.s_photo}
                    alt="Selfie"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "10px",
                    }}
                  />
                </td>
                <td>
                  <a
                    href={`tel:${
                      !shop.s_phone.startsWith("+88")
                        ? "+88" + shop.s_phone
                        : shop.s_phone
                    }`}
                    rel="noopener noreferrer"
                  >
                    {!shop.s_phone.startsWith("+88")
                      ? "+88" + shop.s_phone
                      : shop.s_phone}
                  </a>
                </td>

                <td>{shop.shop_info.reportsCount}</td>
                <td>
                  <Button onClick={() => showReports(shop)}>
                    View Details
                  </Button>
                </td>
                <td>{shop.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showModal}
        onHide={hideDetails}
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Reports for {selectedShop && selectedShop.s_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="report-modal-body">
          <Table striped bordered hover className="report-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Product Photo</th>
                <th>Description</th>
                <th>View Customer Details</th>
              </tr>
            </thead>
            <tbody>
              {selectedShop &&
                selectedShop.shop_info.reports.map((report, index) => (
                  <tr key={index}>
                    <td>{report.p_name}</td>

                    <td>
                      <img
                        src={report.p_photo}
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
                        onClick={() => handlePhotoClick(report)}
                      />
                    </td>
                    <td>{report.s_report_description}</td>
                    <td>
                      <Button onClick={() => viewCustomerDetails(report)}>
                        View Customer Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-center w-100">
            <Button variant="primary" onClick={viewAddress}>
              View Address
            </Button>
          </div>
          <Button variant="secondary" onClick={hideDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAddressModal}
        onHide={() => setShowAddressModal(false)}
        size="lg"
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Address</Modal.Title>
        </Modal.Header>
        <Modal.Body className="report-modal-body">
          <Table striped bordered hover className="report-table">
            <thead>
              <tr>
                <th>Shop Photo</th>
                <th>Division</th>
                <th>District</th>
                <th>Sub District</th>
                <th>Union</th>
                <th>Ward</th>
                <th>Road</th>
                <th>Google Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img
                    src={selectedShop && selectedShop.s_photo}
                    alt="Shop Photo"
                    style={{
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      overflow: "hidden",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleSPhotoClick(selectedShop)}
                  />
                </td>
                <td>{selectedShop && selectedShop.shop_info.address.s_div}</td>
                <td>{selectedShop && selectedShop.shop_info.address.s_dist}</td>
                <td>
                  {selectedShop && selectedShop.shop_info.address.s_subdist}
                </td>
                <td>
                  {selectedShop && selectedShop.shop_info.address.s_union}
                </td>
                <td>{selectedShop && selectedShop.shop_info.address.s_word}</td>
                <td>{selectedShop && selectedShop.shop_info.address.s_road}</td>
                <td>
                  <a
                    href={
                      selectedShop && selectedShop.shop_info.address.s_location
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedShop && selectedShop.shop_info.address.s_location}
                  </a>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowAddressModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCustomerModal}
        onHide={() => setShowCustomerModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Customer name</th>
                <th>Customer Photo</th>
                <th>Customer NID</th>
                <th>Customer Phone</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{selectedReport && selectedReport.c_name}</td>
                <td>
                  <img
                    src={selectedReport && selectedReport.c_selfiephoto}
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
                    onClick={() => handleCPhotoClick(selectedReport)}
                  />
                </td>
                <td>
                  <img
                    src={selectedReport && selectedReport.c_frontnid}
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
                    onClick={() => handleCNPhotoClick(selectedReport)}
                  />
                </td>

                {/* <td>
                    <img
                      src={selectedReport && selectedReport.c_bscknid}
                      alt="Selfie"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        overflow: "hidden",
                        marginRight: "10px",
                        cursor: "pointer" // Add cursor pointer for clickable effect
                      }}
                      onClick={() => handleCPhotoClick(selectedReport)}
                    />
                  </td> */}
                <td>
                  {selectedReport && selectedReport.c_phone && (
                    <a
                      href={`tel:${
                        selectedReport &&
                        !selectedReport.c_phone.startsWith("+88")
                          ? "+88" + selectedReport.c_phone
                          : selectedReport.c_phone
                      }`}
                      rel="noopener noreferrer"
                    >
                      {selectedReport &&
                      !selectedReport.c_phone.startsWith("+88")
                        ? "+88" + selectedReport.c_phone
                        : selectedReport.c_phone}
                    </a>
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCustomerModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={cPhotoUrl !== ""} onHide={() => setCPhotoUrl("")} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Full Size Customer Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={cPhotoUrl}
            alt="Full Size Photo"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setCPhotoUrl("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={cnfPhotoUrl !== "" || cnbPhotoUrl !== ""}
        onHide={() => {
          setCNFPhotoUrl("");
          setCNBPhotoUrl("");
        }}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Size NID Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
          {cnfPhotoUrl !== "" && (
            <img
              src={cnfPhotoUrl}
              alt="Full Size NID Photo"
              style={{
                maxWidth: "45%",
                maxHeight: "80vh",
                marginRight: "10px",
              }}
            />
          )}
          {cnbPhotoUrl !== "" && (
            <img
              src={cnbPhotoUrl}
              alt="Full Size Shop Photo"
              style={{
                maxWidth: "45%",
                maxHeight: "80vh",
                marginRight: "10px",
              }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setCNFPhotoUrl("");
              setCNBPhotoUrl("");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal show={cnPhotoUrl !== ""} onHide={() => setCNPhotoUrl("")} size="xl">
    <Modal.Header closeButton>
        <Modal.Title>Full Size NID Photo</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
        <img
            src={cnPhotoUrl}
            alt="Full Size Photo"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
        />
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={() => setCNPhotoUrl("")}>
            Close
        </Button>
    </Modal.Footer>
</Modal> */}

      <Modal
        show={shopPhotoUrl !== ""}
        onHide={() => setShopPhotoUrl("")}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Full Size Shop Photo</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={shopPhotoUrl}
            alt="Full Size Photo"
            style={{ maxWidth: "100%", maxHeight: "80vh" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShopPhotoUrl("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
            alt="Full Size Photo"
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
  );
};

export default SolvedRegShopReport;
