import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "../style/reg.css";

const UnsolvedRegShopReport = () => {
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
      const response = await fetch("http://localhost:5000/adminreport/shops", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch shops");
      }

      const data = await response.json();
      console.log("from reg---------", data);
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

  const updateReportsStatus = async (
    divisionName,
    districtName,
    subdistrictName,
    unionName,
    wordName,
    roadName,
    shopName
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/adminreport/regshops/updateStatus/${divisionName}/${districtName}/${subdistrictName}/${unionName}/${wordName}/${roadName}/${shopName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Solved" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updatedShopsCopy = [...shops];
      const shopIndex = updatedShopsCopy.findIndex(
        (shop) =>
          shop.s_name === shopName &&
          shop.shop_info.address.s_div === divisionName &&
          shop.shop_info.address.s_dist === districtName &&
          shop.shop_info.address.s_subdist === subdistrictName &&
          shop.shop_info.address.s_union === unionName &&
          shop.shop_info.address.s_word === wordName &&
          shop.shop_info.address.s_road === roadName
      );
      if (shopIndex !== -1) {
        updatedShopsCopy[shopIndex] = {
          ...updatedShopsCopy[shopIndex],
          shop_info: {
            ...updatedShopsCopy[shopIndex].shop_info,
            reports: updatedShopsCopy[shopIndex].shop_info.reports.map(
              (report) => ({
                ...report,
                status: "solved",
              })
            ),
            reportsCount: 0,
          },
        };
        setShops(updatedShopsCopy);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
                <td>
                  {shop.shop_info.reports.some(
                    (report) => report.status === "Unsolved"
                  ) ? (
                    <Button
                      onClick={() =>
                        updateReportsStatus(
                          shop.shop_info.address.s_div,
                          shop.shop_info.address.s_dist,
                          shop.shop_info.address.s_subdist,
                          shop.shop_info.address.s_union,
                          shop.shop_info.address.s_word,
                          shop.shop_info.address.s_road,
                          shop.s_name
                        )
                      }
                    >
                      Pending
                    </Button>
                  ) : (
                    "Solved"
                  )}
                </td>
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

export default UnsolvedRegShopReport;

// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import "../style/reg.css";

// const UnsolvedRegShopReport = () => {
//   const [shops, setShops] = useState([]);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [selectedReport, setSelectedReport] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);
//   const [shopPhotoUrl, setShopPhotoUrl] = useState("");
//   const [productPhotoUrl, setProductPhotoUrl] = useState("");
//   const [snfPhotoUrl, setSNFPhotoUrl] = useState("");
//   const [snbPhotoUrl, setSNBPhotoUrl] = useState("");
//   const [cPhotoUrl, setCPhotoUrl] = useState("");
//   const [cnfPhotoUrl, setCNFPhotoUrl] = useState("");
//   const [cnbPhotoUrl, setCNBPhotoUrl] = useState("");

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   const fetchShops = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/adminreport/shops", {
//         method: "GET",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch shops");
//       }

//       const data = await response.json();
//       console.log("from reg---------", data);
//       setShops(data);
//     } catch (error) {
//       console.error("Error fetching shops:", error);
//     }
//   };

//   const showReports = (shop) => {
//     setSelectedShop(shop);
//     setShowModal(true);
//   };

//   const hideDetails = () => {
//     setSelectedShop(null);
//     setSelectedReport(null); // Reset selected report
//     setShowModal(false);
//   };

//   const viewAddress = () => {
//     setShowAddressModal(true);
//   };

//   const viewCustomerDetails = (report) => {
//     setSelectedReport(report);
//     setShowCustomerModal(true);
//   };

//   const handleSPhotoClick = (selectedShop) => {
//     setSelectedShop(selectedShop);
//     setShopPhotoUrl(selectedShop.s_photo); // Set the URL of the full-size shop photo
//     setShowModal(true);
//   };

//   const handleCPhotoClick = (selectedReport) => {
//     setSelectedReport(selectedReport);
//     setCPhotoUrl(selectedReport.c_selfiephoto); // Set the URL of the full-size C photo
//     setShowModal(true);
//   };

//   const handleSNIDPhotoClick = (selectedShop) => {
//     setSelectedShop(selectedShop);
//     setSNFPhotoUrl(selectedShop.s_frontnid); // Set the URL of the full-size NID photo
//     setSNBPhotoUrl(selectedShop.s_backnid); // Set the URL of the full-size NID photo
//     setShowModal(true);
//   };

//   const handleCNPhotoClick = (selectedReport) => {
//     setSelectedReport(selectedReport);
//     setCNFPhotoUrl(selectedReport.c_frontnid); // Set the URL of the full-size NID photo
//     setCNBPhotoUrl(selectedReport.c_backnid); // Set the URL of the full-size NID photo
//     setShowModal(true);
//   };

//   const handlePhotoClick = (report) => {
//     setSelectedReport(report);
//     setProductPhotoUrl(report.p_photo); // Set the URL of the full-size product photo
//     setShowModal(true);
//   };

//   const updateReportsStatus = async (
//     divisionName,
//     districtName,
//     subdistrictName,
//     unionName,
//     wordName,
//     roadName,
//     shopName
//   ) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5000/adminreport/regshops/updateStatus/${divisionName}/${districtName}/${subdistrictName}/${unionName}/${wordName}/${roadName}/${shopName}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ status: "Solved" }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to update status");
//       }

//       const updatedShopsCopy = [...shops];
//       const shopIndex = updatedShopsCopy.findIndex(
//         (shop) =>
//           shop.s_name === shopName &&
//           shop.shop_info.address.s_div === divisionName &&
//           shop.shop_info.address.s_dist === districtName &&
//           shop.shop_info.address.s_subdist === subdistrictName &&
//           shop.shop_info.address.s_union === unionName &&
//           shop.shop_info.address.s_word === wordName &&
//           shop.shop_info.address.s_road === roadName
//       );
//       if (shopIndex !== -1) {
//         updatedShopsCopy[shopIndex] = {
//           ...updatedShopsCopy[shopIndex],
//           shop_info: {
//             ...updatedShopsCopy[shopIndex].shop_info,
//             reports: updatedShopsCopy[shopIndex].shop_info.reports.map(
//               (report) => ({
//                 ...report,
//                 status: "solved",
//               })
//             ),
//             reportsCount: 0,
//           },
//         };
//         setShops(updatedShopsCopy);
//       }
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="table-container-report">
//         <Table striped bordered hover className="table">
//           <thead>
//             <tr>
//               <th className="table-heading-report">Shop Name</th>
//               <th className="table-heading-report">Shop Photo</th>
//               <th className="table-heading-report">Phone</th>
//               <th className="table-heading-report">Number of Reports</th>
//               <th className="table-heading-report">Details</th>
//               <th className="table-heading-report">Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {shops.map((shop, index) => (
//               <tr key={index}>
//                 <td>{shop.s_name}</td>
//                 <td>
//                   <img
//                     src={shop.s_photo}
//                     alt="Selfie"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px",
//                     }}
//                   />
//                 </td>
//                 <td>
//                   <a
//                     href={`tel:${
//                       !shop.s_phone.startsWith("+88")
//                         ? "+88" + shop.s_phone
//                         : shop.s_phone
//                     }`}
//                     rel="noopener noreferrer"
//                   >
//                     {!shop.s_phone.startsWith("+88")
//                       ? "+88" + shop.s_phone
//                       : shop.s_phone}
//                   </a>
//                 </td>

//                 <td>{shop.shop_info.reportsCount}</td>
//                 <td>
//                   <Button onClick={() => showReports(shop)}>
//                     View Details
//                   </Button>
//                 </td>
//                 <td>
//                   {shop.shop_info.reports.some(
//                     (report) => report.status === "Unsolved"
//                   ) ? (
//                     <Button
//                       onClick={() =>
//                         updateReportsStatus(
//                           shop.shop_info.address.s_div,
//                           shop.shop_info.address.s_dist,
//                           shop.shop_info.address.s_subdist,
//                           shop.shop_info.address.s_union,
//                           shop.shop_info.address.s_word,
//                           shop.shop_info.address.s_road,
//                           shop.s_name
//                         )
//                       }
//                     >
//                       Unsolved
//                     </Button>
//                   ) : (
//                     "Solved"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>

//       <Modal
//         show={showModal}
//         onHide={hideDetails}
//         size="lg"
//         dialogClassName="custom-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             Reports for {selectedShop && selectedShop.s_name}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="report-modal-body">
//           <Table striped bordered hover className="report-table">
//             <thead>
//               <tr>
//                 <th>Product Name</th>
//                 <th>Product Photo</th>
//                 <th>Description</th>
//                 <th>View Customer Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedShop &&
//                 selectedShop.shop_info.reports.map((report, index) => (
//                   <tr key={index}>
//                     <td>{report.p_name}</td>

//                     <td>
//                       <img
//                         src={report.p_photo}
//                         alt="Selfie"
//                         style={{
//                           width: "70px",
//                           height: "70px",
//                           objectFit: "cover",
//                           borderRadius: "50%",
//                           overflow: "hidden",
//                           marginRight: "10px",
//                           cursor: "pointer", // Add cursor pointer for clickable effect
//                         }}
//                         onClick={() => handlePhotoClick(report)}
//                       />
//                     </td>
//                     <td>{report.s_report_description}</td>
//                     <td>
//                       <Button onClick={() => viewCustomerDetails(report)}>
//                         View Customer Details
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <div className="d-flex justify-content-center w-100">
//             <Button variant="primary" onClick={viewAddress}>
//               View Address
//             </Button>
//           </div>
//           <Button variant="secondary" onClick={hideDetails}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showAddressModal}
//         onHide={() => setShowAddressModal(false)}
//         size="lg"
//         dialogClassName="custom-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Address</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="report-modal-body">
//           <Table striped bordered hover className="report-table">
//             <thead>
//               <tr>
//                 <th>Shop Photo</th>
//                 <th>Shop Owner NID</th>
//                 <th>Division</th>
//                 <th>District</th>
//                 <th>Sub District</th>
//                 <th>Union</th>
//                 <th>Word</th>
//                 <th>Road</th>
//                 <th>Google Location</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>
//                   <img
//                     src={selectedShop && selectedShop.s_photo}
//                     alt="Shop Photo"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleSPhotoClick(selectedShop)}
//                   />
//                 </td>
//                 <td>
//                   <img
//                     src={selectedShop && selectedShop.s_frontnid}
//                     alt="Shop Owner NID Img"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px",
//                       cursor: "pointer",
//                     }}
//                     onClick={() => handleSNIDPhotoClick(selectedShop)}
//                   />
//                 </td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_div}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_dist}</td>
//                 <td>
//                   {selectedShop && selectedShop.shop_info.address.s_subdist}
//                 </td>
//                 <td>
//                   {selectedShop && selectedShop.shop_info.address.s_union}
//                 </td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_word}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_road}</td>
//                 <td>
//                   <a
//                     href={
//                       selectedShop && selectedShop.shop_info.address.s_location
//                     }
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {selectedShop && selectedShop.shop_info.address.s_location}
//                   </a>
//                 </td>
//               </tr>
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowAddressModal(false)}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={showCustomerModal}
//         onHide={() => setShowCustomerModal(false)}
//         size="lg"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Customer Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Customer name</th>
//                 <th>Customer Photo</th>
//                 <th>Customer NID</th>
//                 <th>Customer Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>{selectedReport && selectedReport.c_name}</td>
//                 <td>
//                   <img
//                     src={selectedReport && selectedReport.c_selfiephoto}
//                     alt="Selfie"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px",
//                       cursor: "pointer", // Add cursor pointer for clickable effect
//                     }}
//                     onClick={() => handleCPhotoClick(selectedReport)}
//                   />
//                 </td>
//                 <td>
//                   <img
//                     src={selectedReport && selectedReport.c_frontnid}
//                     alt="Selfie"
//                     style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px",
//                       cursor: "pointer", // Add cursor pointer for clickable effect
//                     }}
//                     onClick={() => handleCNPhotoClick(selectedReport)}
//                   />
//                 </td>

//                 {/* <td>
//                     <img
//                       src={selectedReport && selectedReport.c_bscknid}
//                       alt="Selfie"
//                       style={{
//                         width: "70px",
//                         height: "70px",
//                         objectFit: "cover",
//                         borderRadius: "50%",
//                         overflow: "hidden",
//                         marginRight: "10px",
//                         cursor: "pointer" // Add cursor pointer for clickable effect
//                       }}
//                       onClick={() => handleCPhotoClick(selectedReport)}
//                     />
//                   </td> */}
//                 <td>
//                   {selectedReport && selectedReport.c_phone && (
//                     <a
//                       href={`tel:${
//                         selectedReport &&
//                         !selectedReport.c_phone.startsWith("+88")
//                           ? "+88" + selectedReport.c_phone
//                           : selectedReport.c_phone
//                       }`}
//                       rel="noopener noreferrer"
//                     >
//                       {selectedReport &&
//                       !selectedReport.c_phone.startsWith("+88")
//                         ? "+88" + selectedReport.c_phone
//                         : selectedReport.c_phone}
//                     </a>
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => setShowCustomerModal(false)}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={cPhotoUrl !== ""} onHide={() => setCPhotoUrl("")} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Full Size Customer Photo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={cPhotoUrl}
//             alt="Full Size Photo"
//             style={{ maxWidth: "100%", maxHeight: "80vh" }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setCPhotoUrl("")}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={snfPhotoUrl !== "" || snbPhotoUrl !== ""}
//         onHide={() => {
//           setSNFPhotoUrl("");
//           setSNBPhotoUrl("");
//         }}
//         size="xl"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Full Size NID Photo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//           {cnfPhotoUrl !== "" && (
//             <img
//               src={snfPhotoUrl}
//               alt="Full Size NID Photo"
//               style={{
//                 maxWidth: "45%",
//                 maxHeight: "80vh",
//                 marginRight: "10px",
//               }}
//             />
//           )}
//           {cnbPhotoUrl !== "" && (
//             <img
//               src={snbPhotoUrl}
//               alt="Full Size Shop NID"
//               style={{
//                 maxWidth: "45%",
//                 maxHeight: "80vh",
//                 marginRight: "10px",
//               }}
//             />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setSNFPhotoUrl("");
//               setSNBPhotoUrl("");
//             }}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={cnfPhotoUrl !== "" || cnbPhotoUrl !== ""}
//         onHide={() => {
//           setCNFPhotoUrl("");
//           setCNBPhotoUrl("");
//         }}
//         size="xl"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Full Size NID Photo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//           {cnfPhotoUrl !== "" && (
//             <img
//               src={cnfPhotoUrl}
//               alt="Full Size NID Photo"
//               style={{
//                 maxWidth: "45%",
//                 maxHeight: "80vh",
//                 marginRight: "10px",
//               }}
//             />
//           )}
//           {cnbPhotoUrl !== "" && (
//             <img
//               src={cnbPhotoUrl}
//               alt="Full Size Shop Photo"
//               style={{
//                 maxWidth: "45%",
//                 maxHeight: "80vh",
//                 marginRight: "10px",
//               }}
//             />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setCNFPhotoUrl("");
//               setCNBPhotoUrl("");
//             }}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* <Modal show={cnPhotoUrl !== ""} onHide={() => setCNPhotoUrl("")} size="xl">
//     <Modal.Header closeButton>
//         <Modal.Title>Full Size NID Photo</Modal.Title>
//     </Modal.Header>
//     <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//         <img
//             src={cnPhotoUrl}
//             alt="Full Size Photo"
//             style={{ maxWidth: "100%", maxHeight: "80vh" }}
//         />
//     </Modal.Body>
//     <Modal.Footer>
//         <Button variant="secondary" onClick={() => setCNPhotoUrl("")}>
//             Close
//         </Button>
//     </Modal.Footer>
// </Modal> */}

//       <Modal
//         show={shopPhotoUrl !== ""}
//         onHide={() => setShopPhotoUrl("")}
//         size="xl"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Full Size Shop Photo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={shopPhotoUrl}
//             alt="Full Size Photo"
//             style={{ maxWidth: "100%", maxHeight: "80vh" }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShopPhotoUrl("")}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal
//         show={productPhotoUrl !== ""}
//         onHide={() => setProductPhotoUrl("")}
//         size="xl"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Full Size Product Photo</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
//           <img
//             src={productPhotoUrl}
//             alt="Full Size Photo"
//             style={{ maxWidth: "100%", maxHeight: "80vh" }}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setProductPhotoUrl("")}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default UnsolvedRegShopReport;

// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import "../style/reg.css";

// const RegShopReport = () => {
//   const [shops, setShops] = useState([]);
//   // const [updatedShops, setUpdatedShops] = useState([]);
//   const [selectedReport, setSelectedReport] = useState(null); // Add state for selected report
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   // useEffect(() => {
//   //   // Update the shops state when the updatedShops state changes
//   //   setShops(updatedShops);
//   // }, [updatedShops]);

//   const fetchShops = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/adminreport/shopssolved", {
//         method: "GET"
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch shops');
//       }

//       const data = await response.json();
//       console.log("Front end data ----------: ",data);
//       setShops(data);
//     } catch (error) {
//       console.error("Error fetching shops:", error);
//     }
//   };

//   const showReports = (shop) => {
//     setSelectedShop(shop);
//     setShowModal(true);
//   };

//   const hideDetails = () => {
//     setSelectedShop(null);
//     setShowModal(false);
//   };

//   const viewAddress = () => {
//     setShowAddressModal(true);
//   };

//   const viewCustomerDetails = (report) => {
//     setSelectedReport(report); // Set the selected report
//     setShowCustomerModal(true);
//   };

//   return (
//     <div>
//       <h1>Registered Shop Reports</h1>
//       <Table striped bordered hover>
//       <thead>
//           <tr>
//             <th>Shop Name</th>
//             <th>Phone</th>
//             <th>Number of Reports</th>
//             <th>Details</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {shops.map((shop, index) => (
//             <tr key={index}>
//               <td>{shop.s_name}</td>
//               <td>{shop.s_phone}</td>
//               <td>{shop.shop_info.reportsCount}</td>
//               <td>
//                 <Button onClick={() => showReports(shop)}>View Details</Button>
//               </td>
//               <td>{shop.status}</td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       <Modal show={showModal} onHide={hideDetails} size="lg" dialogClassName="custom-modal">
//         <Modal.Header closeButton>
//           <Modal.Title>Reports for {selectedShop && selectedShop.s_name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="report-modal-body">
//           <Table striped bordered hover className="report-table">
//             <thead>
//               <tr>
//                 <th>Shop Name</th>
//                 <th>Shop Photo</th>
//                 <th>Product Name</th>
//                 <th>Product Photo</th>
//                 <th>Description</th>
//                 <th>View Customer Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedShop && selectedShop.shop_info.reports.map((report, index) => (
//                 <tr key={index}>
//                   <td>{report.s_name}</td>
//                   <td>{report.s_photo}</td>
//                   <td>{report.p_name}</td>
//                   <td>
//                     <img src={report.p_photo} alt="Selfie" style={{
//                       width: "70px",
//                       height: "70px",
//                       objectFit: "cover",
//                       borderRadius: "50%",
//                       overflow: "hidden",
//                       marginRight: "10px"
//                     }} />
//                   </td>
//                   <td>{report.s_report_description}</td>
//                   <td>
//                     <Button onClick={() => viewCustomerDetails(report)}>View Customer Details</Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <div className="d-flex justify-content-center w-100">
//             <Button variant="primary" onClick={viewAddress}>View Address</Button>
//           </div>
//           <Button variant="secondary" onClick={hideDetails}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} size="lg" dialogClassName="custom-modal">
//         <Modal.Header closeButton>
//           <Modal.Title>Address</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="report-modal-body">
//           <Table striped bordered hover className="report-table">
//             <thead>
//               <tr>
//                 <th>Division</th>
//                 <th>District</th>
//                 <th>Sub District</th>
//                 <th>Union</th>
//                 <th>Word</th>
//                 <th>Road</th>
//                 <th>Google Location</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_div}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_dist}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_subdist}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_union}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_word}</td>
//                 <td>{selectedShop && selectedShop.shop_info.address.s_road}</td>
//                 <td>
//                   <a href={selectedShop && selectedShop.shop_info.address.s_location} target="_blank" rel="noopener noreferrer">
//                     {selectedShop && selectedShop.shop_info.address.s_location}
//                   </a>
//                 </td>
//               </tr>
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Customer Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Customer name</th>
//                 <th>Customer Phone</th>
//               </tr>
//             </thead>
//             <tbody>
//             <tr>
//           <td>{selectedReport && selectedReport.c_name}</td>
//           <td>{selectedReport && selectedReport.c_phone}</td>
//           </tr>
//             </tbody>
//           </Table>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default RegShopReport;

// // import React, { useState, useEffect } from "react";
// // import { Table, Button, Modal } from "react-bootstrap";

// // const NonRegShopReport = () => {
// //     const [shops, setShops] = useState([]);
// //     const [selectedShop, setSelectedShop] = useState(null);
// //     const [showModal, setShowModal] = useState(false);

// //     useEffect(() => {
// //       fetchShops();
// //     }, []);

// //     const fetchShops = async () => {
// //       try {
// //         // Dummy data for testing
// //         const dummyData = [
// //           {
// //             shopName: "ABC Store",
// //             reportsCount: 2,
// //             reports: [
// //               {
// //                 r_id: 1,
// //                 s_phone: "1234567890",
// //                 address: "123 Main St, City, State, Country",
// //                 p_name: "Product 1",
// //                 w_price: "8.00",
// //                 r_price: "10.00",
// //                 tr_price: "9.00",
// //                 tw_price: "7.50",
// //                 r_status: "unsolved"
// //               },
// //               {
// //                 r_id: 2,
// //                 s_phone: "1234567890",
// //                 address: "123 Main St, City, State, Country",
// //                 p_name: "Product 2",
// //                 w_price: "12.00",
// //                 r_price: "15.00",
// //                 tr_price: "13.00",
// //                 tw_price: "",
// //                 r_status: "unsolved"
// //               }
// //             ]
// //           },
// //           {
// //             shopName: "XYZ Mart",
// //             reportsCount: 1,
// //             reports: [
// //               {
// //                 r_id: 3,
// //                 s_phone: "9876543210",
// //                 address: "456 Elm St, City, State, Country",
// //                 p_name: "Product 2",
// //                 w_price: "12.00",
// //                 r_price: "15.00",
// //                 tr_price: "13.00",
// //                 tw_price: "",
// //                 r_status: "unsolved"
// //               }
// //             ]
// //           }
// //         ];

// //         setShops(dummyData);
// //       } catch (error) {
// //         console.error("Error fetching shops:", error);
// //       }
// //     };

// //     const showReports = (shop) => {
// //       setSelectedShop(shop);
// //       setShowModal(true);
// //     };

// //     const hideDetails = () => {
// //       setSelectedShop(null);
// //       setShowModal(false);
// //     };

// //     const toggleStatus = async (shopName) => {
// //       try {
// //         // Update the backend with the solved status for all reports of the shop
// //         await updateReportsStatus(shopName, "solved");

// //         // Update the frontend by removing the shop from the shops array
// //         const updatedShops = shops.filter((shop) => shop.shopName !== shopName);
// //         setShops(updatedShops);

// //         // Hide details if the selected shop matches the shop being removed
// //         if (selectedShop && selectedShop.shopName === shopName) {
// //           setSelectedShop(null);
// //           setShowModal(false);
// //         }
// //       } catch (error) {
// //         console.error("Error toggling report status:", error);
// //       }
// //     };

// //     const updateReportsStatus = async (shopName, newStatus) => {
// //       try {
// //         // Send a request to the backend to update the reports' status in the database
// //         // Replace this with your actual API call to update the database
// //         // console.log(Updating status of reports for shop ${shopName} to ${newStatus});
// //       } catch (error) {
// //         console.error("Error updating report status:", error);
// //       }
// //     };

// //     return (
// //       <div>
// //         <h1>Non Registered Shop Reports</h1>
// //         <Table striped bordered hover>
// //           <thead>
// //             <tr>
// //               <th>Shop Name</th>
// //               <th>Number of Reports</th>
// //               <th>Action</th>
// //               <th>Status</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {shops.map((shop, index) => (
// //               <tr key={index}>
// //                 <td>{shop.shopName}</td>
// //                 <td>{shop.reportsCount}</td>
// //                 <td>
// //                   <Button onClick={() => showReports(shop)}>View Details</Button>
// //                 </td>
// //                 <td>
// //                   {shop.reports.some(report => report.r_status === "unsolved") &&
// //                     <Button onClick={() => toggleStatus(shop.shopName)}>Unsolved</Button>
// //                   }
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </Table>

// //         <Modal show={showModal} onHide={hideDetails} size="lg">
// //           <Modal.Header closeButton>
// //             <Modal.Title>Reports for {selectedShop && selectedShop.shopName}</Modal.Title>
// //           </Modal.Header>
// //           <Modal.Body>
// //             <Table striped bordered hover>
// //               <thead>
// //                 <tr>
// //                   <th>Shop Phone Number</th>
// //                   <th>Address</th>
// //                   <th>Product Name</th>
// //                   <th>Wholesale Price</th>
// //                   <th>Retail Price</th>
// //                   <th>Taken Wholesale Price</th>
// //                   <th>Taken Retail Price</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
// //                   <tr key={index}>
// //                     <td>{report.s_phone}</td>
// //                     <td>{report.address}</td>
// //                     <td>{report.p_name}</td>
// //                     <td>{report.w_price}</td>
// //                     <td>{report.r_price}</td>
// //                     <td>{report.tw_price}</td>
// //                     <td>{report.tr_price}</td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </Table>
// //           </Modal.Body>
// //           <Modal.Footer>
// //             <Button variant="secondary" onClick={hideDetails}>
// //               Close
// //             </Button>
// //           </Modal.Footer>
// //         </Modal>
// //       </div>
// //     );
// //   };

// // export default NonRegShopReport;
