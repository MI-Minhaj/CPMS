import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "../style/reg.css";

const UnsolvedNonRegShopReport = () => {
	const [unions, setUnions] = useState([]);
	const [selectedUnion, setSelectedUnion] = useState(null);
	const [selectedShop, setSelectedShop] = useState(null);
	const [selectedReport, setSelectedReport] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [shopshowModal, setShopShowModal] = useState(false);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showShopPhotoModal, setShowShopPhotoModal] = useState(false);
	const [showCustomerModal, setShowCustomerModal] = useState(false);
	const [shopPhotoUrl, setShopPhotoUrl] = useState("");
	const [productPhotoUrl, setProductPhotoUrl] = useState("");
	const [cPhotoUrl, setCPhotoUrl] = useState("");
	const [cnfPhotoUrl, setCNFPhotoUrl] = useState("");
	const [cnbPhotoUrl, setCNBPhotoUrl] = useState("");

	useEffect(() => {
		fetchUnions();
	}, []);

	const fetchUnions = async () => {
		try {
			const response = await fetch(
				"http://localhost:5000/adminreport/nonreg/unions",
				{
					method: "GET",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch unions");
			}

			const data = await response.json();

			console.log("From frontend non----------", data);
			setUnions(data);
		} catch (error) {
			console.error("Error fetching unions:", error);
		}
	};

	const showShops = (union) => {
		setSelectedUnion(union);
		setShowModal(true);
	};

	const hideDetails = () => {
		setSelectedUnion(null);
		setSelectedReport(null);
		setShowModal(false);
	};

	const hideDetailsShops = () =>{
		setSelectedShop(null);
		setShopShowModal(false);
	};

	const showReports = (shopName) => {
		setSelectedShop(shopName);
		setShopShowModal(true);
	};

	const viewAddress = (selectedShop) => {
		setSelectedShop(selectedShop);
		setShowAddressModal(true);
	};

	const viewShopPhotos = (selectedShop) => {
		console.log("Selected shop-------: ", selectedShop);
		setSelectedShop(selectedShop);
		setShowShopPhotoModal(true);
	};

	const viewCustomerDetails = (report) => {
		setSelectedReport(report);
		setShowCustomerModal(true);
	};

	const handleSPhotoClick = (report) => {
		setSelectedReport(report);
		setShopPhotoUrl(report.s_photo);
		setShowModal(true);
	};

	const handleCPhotoClick = (selectedReport) => {
		setSelectedReport(selectedReport);
		setCPhotoUrl(selectedReport.c_selfiephoto);
		setShowModal(true);
	};

	const handleCNPhotoClick = (selectedReport) => {
		setSelectedReport(selectedReport);
		setCNFPhotoUrl(selectedReport.c_frontnid);
		setCNBPhotoUrl(selectedReport.c_backnid);
		setShowModal(true);
	};

	const handlePhotoClick = (report) => {
		setSelectedReport(report);
		setProductPhotoUrl(report.p_photo);
		setShowModal(true);
	};

	const updateReportsStatus = async (
		divisionName,
		districtName,
		subdistrictName,
		unionName
	  ) => {
		try {
		  const response = await fetch(
			`http://localhost:5000/adminreport/nonreg/updateStatus/${divisionName}/${districtName}/${subdistrictName}/${unionName}`,
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
	
		  const updatedUnions = unions.map((union) => {
			if (
			  union.s_div === divisionName &&
			  union.s_dist === districtName &&
			  union.s_subdist === subdistrictName &&
			  union.s_union === unionName
			) {
			  // Update the total_shop_reports_count to 0
			  union.total_shop_reports_count = 0;
	
			  // Iterate over the shop_info.shop_info object
			  Object.keys(union.shop_info.shop_info).forEach((shopKey) => {
				const shop = union.shop_info.shop_info[shopKey];
	
				// Update the status of each report in the shop
				shop.reports.forEach((report) => {
				  report.status = "Solved";
				});
			  });
			}
	
			return union;
		  });
	
		  setUnions(updatedUnions);
		} catch (error) {
		  console.error("Error updating status:", error);
		}
	  };
	
	  const updateSReportsStatus = async (
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
			`http://localhost:5000/adminreport/nonregshops/updateStatus/${divisionName}/${districtName}/${subdistrictName}/${unionName}/${wordName}/${roadName}/${shopName}`,
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
	
		  // Update the state to reflect the changes
		  setShopName((prevUnions) =>
			prevUnions.map((union) => {
			  if (
				union.shop_info.shop_info[shopName] &&
				union.shop_info.shop_info[shopName].address.s_div ===
				  divisionName &&
				union.shop_info.shop_info[shopName].address.s_dist ===
				  districtName &&
				union.shop_info.shop_info[shopName].address.s_subdist ===
				  subdistrictName &&
				union.shop_info.shop_info[shopName].address.s_union === unionName &&
				union.shop_info.shop_info[shopName].address.s_word === wordName &&
				union.shop_info.shop_info[shopName].address.s_road === roadName &&
				union.shop_info.shop_info[shopName].address.s_name === shopName
			  ) {
				// Update the status of each report in the shop to "Solved"
				union.shop_info.shop_info[shopName].reports.forEach(
				  (report) => (report.status = "Solved")
				);
				// Update the report count to 0
				union.shop_info.shop_info[shopName].report_count = 0;
			  }
			  return union;
			})
		  );
		} catch (error) {
		  console.error("Error updating status:", error);
		}
	  };
	
	
	return (
		<div>
			<h1>Registered Shop Reports</h1>
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Union</th>
						<th>Number of Reports</th>
						<th>Details</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{unions.map((union, index) => (
						<tr key={index}>
							<td>{union.s_union}</td>
							<td>{union.total_shop_reports_count}</td>
							<td>
								<Button onClick={() => showShops(union)}>
									View Details
								</Button>
							</td>
							<td>
								{union.shop_info.shop_info &&
								Object.keys(union.shop_info.shop_info).some(
									(key) =>
										union.shop_info.shop_info[key]
											.reports &&
										union.shop_info.shop_info[
											key
										].reports.some(
											(report) =>
												report.status === "Unsolved"
										)
								) ? (
									<Button
										onClick={() =>
											updateReportsStatus(union.s_union)
										}
									>
										Unsolved
									</Button>
								) : (
									"Solved"
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<Modal
				show={showModal}
				onHide={hideDetails}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Reports for {selectedUnion && selectedUnion.s_union}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="report-modal-body">
					{selectedUnion &&
						selectedUnion.shop_info &&
						selectedUnion.shop_info.shop_info && (
							<Table
								striped
								bordered
								hover
								className="report-table"
							>
								<thead>
									<tr>
										<th>Shop Name</th>
										{/* <th>Shop Photo</th> */}
										{/* <th>Phone</th> */}
										<th>Number of Reports</th>
										<th>Details</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{selectedUnion.shop_info.shop_info &&
										Object.keys(
											selectedUnion.shop_info.shop_info
										).map((shopName, index) => {
											console.log(
												"Shop Data:",
												selectedUnion.shop_info
													.shop_info[shopName].address
											);
											return (
												<tr key={index}>
													<td>
														{
															selectedUnion
																.shop_info
																.shop_info[
																shopName
															].address.s_name
														}
													</td>
													{/* <td>
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
                  </td> */}
													{/* <td>
        <a href={tel:${(!shop.s_phone.startsWith('+88')) ? '+88' + shop.s_phone : shop.s_phone}} rel="noopener noreferrer">
            {!shop.s_phone.startsWith('+88') ? '+88' + shop.s_phone : shop.s_phone}
        </a>
</td> */}

													<td>
														{
															selectedUnion
																.shop_info
																.shop_info[
																shopName
															].reports.length
														}
													</td>
													<td>
														<Button
															onClick={() =>
																showReports(
																	selectedUnion
																		.shop_info
																		.shop_info[
																		shopName
																	]
																)
															}
														>
															View Details
														</Button>
													</td>
													<td>
														{selectedUnion.shop_info.shop_info[
															shopName
														].reports.some(
															(report) =>
																report.status ===
																"Unsolved"
														) ? (
															<Button
																onClick={() =>
																	updateSReportsStatus(
																		shopName
																	)
																}
															>
																Unsolved
															</Button>
														) : (
															"Solved"
														)}
													</td>
												</tr>
											);
										})}
								</tbody>
							</Table>
						)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={hideDetails}>
						Close
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal
				show={shopshowModal}
				onHide={hideDetails}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Reports for{" "}
						{selectedShop && selectedShop.address.s_name}
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
								selectedShop.reports.map((report, index) => (
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
												onClick={() =>
													handlePhotoClick(report)
												}
											/>
										</td>
										<td>{report.s_report_description}</td>
										<td>
											<Button
												onClick={() =>
													viewCustomerDetails(report)
												}
											>
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
						<Button
							variant="primary"
							onClick={() => viewAddress(selectedShop)}
						>
							View Address
						</Button>
						<Button
							variant="primary"
							className="ml-3"
							onClick={() => viewShopPhotos(selectedShop)}
						>
							View ShopPhotos
						</Button>
					</div>
					<Button variant="secondary" onClick={hideDetailsShops}>
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
								<th>Shop Name</th>
								<th>Division</th>
								<th>District</th>
								<th>Sub District</th>
								<th>Union</th>
								<th>Word</th>
								<th>Road</th>
								<th>Google Location</th>
							</tr>
						</thead>
						<tbody>
							{selectedShop && (
								<tr>
									<td>{selectedShop.address.s_name}</td>
									<td>{selectedShop.address.s_div}</td>
									<td>{selectedShop.address.s_dist}</td>
									<td>{selectedShop.address.s_subdist}</td>
									<td>{selectedShop.address.s_union}</td>
									<td>{selectedShop.address.s_word}</td>
									<td>{selectedShop.address.s_road}</td>
									<td>
										<a
											href={
												selectedShop.address.s_location
											}
											target="_blank"
											rel="noopener noreferrer"
										>
											{selectedShop.address.s_location}
										</a>
									</td>
								</tr>
							)}
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
				show={showShopPhotoModal}
				onHide={() => setShowShopPhotoModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Shop Photos</Modal.Title>
				</Modal.Header>
				<Modal.Body className="report-modal-body">
					<div className="d-flex flex-wrap justify-content-center">
					{selectedShop &&
								selectedShop.reports.map((report, index) => (
									<img
												src={report.s_photo}
												alt="Selfie"
												style={{
													width: "70px",
													height: "70px",
													objectFit: "cover",
													// borderRadius: "50%",
													overflow: "hidden",
													marginRight: "10px",
													cursor: "pointer", // Add cursor pointer for clickable effect
												}}
												onClick={() =>
													handleSPhotoClick(report)
												}
											/>
										))}
					</div>
					{/* <Table striped bordered hover className="report-table">
						<thead>
							<tr>
								<th>Shop Photos</th>
							</tr>
						</thead>
						<tbody>
						{selectedShop &&
								selectedShop.reports.map((report, index) => (
									<tr key={index}>
									<td>
											<img
												src={report.s_photo}
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
												onClick={() =>
													handleSPhotoClick(report)
												}
											/>
										</td>
								</tr>
							))}
						</tbody>						
					</Table> */}
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShowShopPhotoModal(false)}
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
								<td>
									{selectedReport && selectedReport.c_phone}
								</td>
								<td>
									<img
										src={
											selectedReport &&
											selectedReport.c_selfiephoto
										}
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
										onClick={() =>
											handleCPhotoClick(selectedReport)
										}
									/>
								</td>
								<td>
									<img
										src={
											selectedReport &&
											selectedReport.c_frontnid
										}
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
										onClick={() =>
											handleCNPhotoClick(selectedReport)
										}
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
									{selectedReport &&
										selectedReport.c_name && (
											<a
												href={`tel:${
													selectedReport &&
													!selectedReport.c_name.startsWith(
														"+88"
													)
														? "+88" +
														  selectedReport.c_name
														: selectedReport.c_name
												}`}
												rel="noopener noreferrer"
											>
												{selectedReport &&
												!selectedReport.c_name.startsWith(
													"+88"
												)
													? "+88" +
													  selectedReport.c_name
													: selectedReport.c_name}
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

			<Modal
				show={cPhotoUrl !== ""}
				onHide={() => setCPhotoUrl("")}
				size="xl"
			>
				<Modal.Header closeButton>
					<Modal.Title>Full Size Customer Photo</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{ display: "flex", justifyContent: "center" }}
				>
					<img
						src={cPhotoUrl}
						alt="Full Size Pic"
						style={{ maxWidth: "100%", maxHeight: "80vh" }}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setCPhotoUrl("")}
					>
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
				<Modal.Body
					style={{ display: "flex", justifyContent: "center" }}
				>
					{cnfPhotoUrl !== "" && (
						<img
							src={cnfPhotoUrl}
							alt="Full Size NID Pic"
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
							alt="Full Size Shop Pic"
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

			<Modal
				show={shopPhotoUrl !== ""}
				onHide={() => setShopPhotoUrl("")}
				size="xl"
			>
				<Modal.Header closeButton>
					<Modal.Title>Full Size Shop Photo</Modal.Title>
				</Modal.Header>
				<Modal.Body
					style={{ display: "flex", justifyContent: "center" }}
				>
					<img
						src={shopPhotoUrl}
						alt="Full Size Pic"
						style={{ maxWidth: "100%", maxHeight: "80vh" }}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setShopPhotoUrl("")}
					>
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
				<Modal.Body
					style={{ display: "flex", justifyContent: "center" }}
				>
					<img
						src={productPhotoUrl}
						alt="Full Size Pic"
						style={{ maxWidth: "100%", maxHeight: "80vh" }}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="secondary"
						onClick={() => setProductPhotoUrl("")}
					>
						Close
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default UnsolvedNonRegShopReport;






















import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import "../style/reg.css";

const UnsolvedNonRegShopReport = () => {
	const [unions, setUnions] = useState([]);
	const [selectedUnion, setSelectedUnion] = useState(null);
	const [selectedShop, setSelectedShop] = useState(null);
	const [selectedReport, setSelectedReport] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [shopshowModal, setShopShowModal] = useState(false);
	const [showAddressModal, setShowAddressModal] = useState(false);
	const [showCustomerModal, setShowCustomerModal] = useState(false);
	const [shopPhotoUrl, setShopPhotoUrl] = useState("");
	const [productPhotoUrl, setProductPhotoUrl] = useState("");
	const [cPhotoUrl, setCPhotoUrl] = useState("");
	const [cnfPhotoUrl, setCNFPhotoUrl] = useState("");
	const [cnbPhotoUrl, setCNBPhotoUrl] = useState("");

	useEffect(() => {
		fetchUnions();
	}, []);

	const fetchUnions = async () => {
		try {
			const response = await fetch(
				"http://localhost:5000/adminreport/nonreg/unions",
				{
					method: "GET",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to fetch unions");
			}

			const data = await response.json();
			console.log("From frontend non----------", data);
			setUnions(data);
		} catch (error) {
			console.error("Error fetching unions:", error);
		}
	};

	const showShops = (union) => {
		setSelectedUnion(union);
		setShowModal(true);
	};

	const hideDetails = () => {
		setSelectedUnion(null);
		setSelectedShop(null);
		setSelectedReport(null); // Reset selected report
		setShowModal(false);
	};

	const showReports = (shopName) => {
		setSelectedShop(shopName);
		setShopShowModal(true);
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

	const updateReportsStatus = async (unionName) => {
		try {
			const response = await fetch(
				http://localhost:5000/adminreport/nonreg/updateStatus/${unionName},
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

			const updatedUnionsCopy = [...unions];
			const unionIndex = updatedUnionsCopy.findIndex(
				(union) => union.s_union === unionName
			);
			if (unionIndex !== -1) {
				updatedUnionsCopy[unionIndex] = {
					...updatedUnionsCopy[unionIndex],
					shop_info: {
						...updatedUnionsCopy[unionIndex].shop_info,
						reports: updatedUnionsCopy[
							unionIndex
						].shop_info.reports.map((report) => ({
							...report,
							status: "solved",
						})),
						reportsCount: 0,
					},
				};
				setUnions(updatedUnionsCopy);
			}
		} catch (error) {
			console.error("Error updating status:", error);
		}
	};

	return (
		<div>
			{/* <h1>Non Registered Shop Reports</h1> */}
			<Table striped bordered hover>
				<thead>
					<tr>
						<th>Union</th>
						<th>Number of Reports</th>
						<th>Details</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{unions.map((union, index) => (
						<tr key={index}>
							<td>{union.s_union}</td>
							<td>{union.total_shop_reports_count}</td>
							<td>
								<Button onClick={() => showShops(union)}>
									View Details
								</Button>
							</td>
							<td>
								{union.shop_info &&
								Object.keys(union.shop_info).some(
									(key) =>
										union.shop_info[key].reports &&
										union.shop_info[key].reports.some(
											(report) =>
												report.status === "Unsolved"
										)
								) ? (
									<Button
										onClick={() =>
											updateReportsStatus(union.s_union)
										}
									>
										Unsolved
									</Button>
								) : (
									"Unsolved"
								)}
							</td>
						</tr>
					))}
				</tbody>
			</Table>

			<Modal
				show={showModal}
				onHide={hideDetails}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>
						Reported Against {selectedUnion ? selectedUnion.s_union : ""}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedUnion &&
						selectedUnion.shop_info &&
						selectedUnion.shop_info.shop_info && (
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Shop Name</th>
										<th>Shop Photo</th>
										<th>Number of Reports</th>
										<th>View Reports</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{selectedUnion.shop_info.shop_info &&
										Object.keys(
											selectedUnion.shop_info.shop_info
										).map((shopName, index) => {
											console.log(
												"Shop Data:",
												selectedUnion.shop_info
													.shop_info[shopName].reports[0]
											);
											return (
												<tr key={index}>
													<td>{shopName}</td>
													<td>
														<img
															src={
																selectedUnion
																	.shop_info
																	.shop_info[
																	shopName
																].reports[0].s_photo
															}
															alt="Selfie"
															style={{
																width: "70px",
																height: "70px",
																objectFit:
																	"cover",
																borderRadius:
																	"50%",
																overflow:
																	"hidden",
																marginRight:
																	"10px",
															}}
														/>
													</td>

													<td>
														{
															selectedUnion
																.shop_info
																.shop_info[
																shopName
															].reports.length
														}
													</td>
													<td>
														<Button
															onClick={() =>
																showReports(
																	selectedUnion
																		.shop_info
																		.shop_info[
																		shopName
																	]
																)
															}
														>
															View
														</Button>
													</td>
                                                   
													<td>
														{selectedUnion.shop_info.shop_info[
															shopName
														].reports.some(
															(report) =>
																report.status ===
																"Unsolved"
														)
															? (
                                                                <Button
                                                                    onClick={() =>
                                                                        updateReportsStatus(
                                                                            // report.status = "Solved"
                                                                        )
                                                                    }
                                                                >
                                                                    Unsolved
                                                                </Button>
                                                            )
															: "Solved"}
													</td>
												</tr>
											);
										})}
								</tbody>
							</Table>
						)}
				</Modal.Body>
			</Modal>

			<Modal
				show={shopshowModal}
				onHide={() => setShopShowModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Reported for </Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedShop &&
						selectedShop && ( // Check if reports array is not empty
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Product Name</th>
										<th>Product Photo</th>
										<th>Report Description</th>
										<th>Reported By</th>
										
									</tr>
								</thead>
								<tbody>
									{selectedShop.reports.map(
										(report, index) => (
											<tr key={index}>
												<td>{report.p_name}</td>{" "}
												{/* Use 'r_id' instead of 'report_id' */}
												<td>
                                                    <img src="/" alt="product img" ></img>
                                                </td>
												<td>{report.s_report_description}</td>
												<td>
													<Button
														onClick={() =>
															viewCustomerDetails(
																report
															)
														}
													>
														View Details
													</Button>
												</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						)}
					{selectedShop &&
						!selectedShop && ( // Additional check for empty or missing reports
							<div>No reports found for this shop.</div>
						)}
				</Modal.Body>
			</Modal>

			<Modal
				show={showAddressModal}
				onHide={() => setShowAddressModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Customer Address</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedReport ? selectedReport.c_address : ""}
				</Modal.Body>
			</Modal>

			<Modal
				show={showCustomerModal}
				onHide={() => setShowCustomerModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Customer Details</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<p>
							<strong>Customer Name: </strong>
							{selectedReport ? selectedReport.c_name : ""}
						</p>
						<p>
							<strong>Customer Phone: </strong>
							{selectedReport ? selectedReport.c_phone : ""}
						</p>
						<p>
							<strong>Customer Address: </strong>
							<Button onClick={viewAddress}>View Address</Button>
						</p>
						<p>
							<strong>Customer Photo:</strong>
							<br />
							{selectedReport && (
								<img
									src={cPhotoUrl}
									alt="Customer"
									style={{ maxWidth: "100%" }}
								/>
							)}
						</p>
						<p>
							<strong>Customer NID Front Photo:</strong>
							<br />
							{selectedReport && (
								<img
									src={cnfPhotoUrl}
									alt="NID Front"
									style={{ maxWidth: "100%" }}
								/>
							)}
						</p>
						<p>
							<strong>Customer NID Back Photo:</strong>
							<br />
							{selectedReport && (
								<img
									src={cnbPhotoUrl}
									alt="NID Back"
									style={{ maxWidth: "100%" }}
								/>
							)}
						</p>
					</div>
				</Modal.Body>
			</Modal>

			<Modal
				show={showModal && selectedShop && shopPhotoUrl}
				onHide={() => setShowModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Shop Photo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<img
						src={shopPhotoUrl}
						alt="Shop"
						style={{ maxWidth: "100%" }}
					/>
				</Modal.Body>
			</Modal>

			<Modal
				show={showModal && selectedReport && productPhotoUrl}
				onHide={() => setShowModal(false)}
				size="lg"
				dialogClassName="custom-modal"
			>
				<Modal.Header closeButton>
					<Modal.Title>Product Photo</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<img
						src={productPhotoUrl}
						alt="Product"
						style={{ maxWidth: "100%" }}
					/>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default UnsolvedNonRegShopReport;
















import React, { useState, useEffect } from "react";
import { Table, Button, Modal } from "react-bootstrap";

const ReportPage = () => {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      // Dummy data for testing
      const dummyData = [
        {
          shopName: "ABC Store",
          reportsCount: 2,
          reports: [
            {
              r_id: 1,
              s_phone: "1234567890",
              address: "123 Main St, City, State, Country",
              p_name: "Product 1",
              w_price: "8.00",
              r_price: "10.00",
              tr_price: "9.00",
              tw_price: "7.50",
              r_status: "unsolved"
            },
            {
              r_id: 2,
              s_phone: "1234567890",
              address: "123 Main St, City, State, Country",
              p_name: "Product 2",
              w_price: "12.00",
              r_price: "15.00",
              tr_price: "13.00",
              tw_price: "",
              r_status: "solved"
            }
          ]
        },
        {
          shopName: "XYZ Mart",
          reportsCount: 1,
          reports: [
            {
              r_id: 3,
              s_phone: "9876543210",
              address: "456 Elm St, City, State, Country",
              p_name: "Product 2",
              w_price: "12.00",
              r_price: "15.00",
              tr_price: "13.00",
              tw_price: "",
              r_status: "unsolved"
            }
          ]
        }
      ];

      setShops(dummyData);
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
    setShowModal(false);
  };

  const toggleStatus = async (shopName) => {
    try {
      // Update the backend with the solved status for all reports of the shop
      await updateReportsStatus(shopName, "solved");

      // Update the frontend by removing the shop from the shops array
      const updatedShops = shops.filter((shop) => shop.shopName !== shopName);
      setShops(updatedShops);

      // Hide details if the selected shop matches the shop being removed
      if (selectedShop && selectedShop.shopName === shopName) {
        setSelectedShop(null);
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error toggling report status:", error);
    }
  };

  const updateReportsStatus = async (shopName, newStatus) => {
    try {
      // Send a request to the backend to update the reports' status in the database
      // Replace this with your actual API call to update the database
      console.log(`Updating status of reports for shop ${shopName} to ${newStatus}`);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  return (
    <div>
      <h1>Shop Reports</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Shop Name</th>
            <th>Number of Reports</th>
            <th>Action</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {shops.map((shop, index) => (
            <tr key={index}>
              <td>{shop.shopName}</td>
              <td>{shop.reportsCount}</td>
              <td>
                <Button onClick={() => showReports(shop)}>View Details</Button>
              </td>
              <td>
                {shop.reports.some(report => report.r_status === "unsolved") &&
                  <Button onClick={() => toggleStatus(shop.shopName)}>Unsolved</Button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={hideDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Reports for {selectedShop && selectedShop.shopName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Shop Phone Number</th>
                <th>Address</th>
                <th>Product Name</th>
                <th>Wholesale Price</th>
                <th>Retail Price</th>
                <th>Taken Wholesale Price</th>
                <th>Taken Retail Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
                <tr key={index}>
                  <td>{report.s_phone}</td>
                  <td>{report.address}</td>
                  <td>{report.p_name}</td>
                  <td>{report.w_price}</td>
                  <td>{report.r_price}</td>
                  <td>{report.tw_price}</td>
                  <td>{report.tr_price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hideDetails}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportPage;

















// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import "../style/reg.css";

// const RegShopReport = () => {
//   const [shops, setShops] = useState([]);
//   const [selectedShop, setSelectedShop] = useState(null);
//   const [selectedReport, setSelectedReport] = useState(null); // Add selectedReport state
//   const [showModal, setShowModal] = useState(false);
//   const [showAddressModal, setShowAddressModal] = useState(false);
//   const [showCustomerModal, setShowCustomerModal] = useState(false);

//   useEffect(() => {
//       fetchShops();
//   }, []);

//   const fetchShops = async () => {
//       try {
//           const response = await fetch("http://localhost:5000/adminreport/shops");
//           if (!response.ok) {
//               throw new Error('Failed to fetch shops');
//           }
//           const data = await response.json();
//           setShops(data);
//       } catch (error) {
//           console.error("Error fetching shops:", error);
//       }
//   };

//   const showReports = (shop) => {
//       setSelectedShop(shop);
//       setShowModal(true);
//   };

    

//     const viewAddress = (address) => {
//         setSelectedReport(address);
//         setShowAddressModal(true);
//     };

//     const viewCustomerDetails = (report) => {
//         setSelectedReport(report);
//         setShowCustomerModal(true);
//     };

//     const hideDetails = () => {
//         setSelectedShop(null);
//         setShowModal(false);
//     };
//     const [status, setStatus] = useState(""); // Define state for status field

//     const updateReportsStatus = async (shopName, newStatus) => {
//         try {
//             // Send a POST request to update the status in the backend
//             // Replace 'http://example.com/api/updateReports' with your backend URL
//             const response = await fetch("http://localhost:5000/adminreport/shops/updateReports", {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     shopName: shopName,
//                     newStatus: newStatus
//                 })
//             });
//             if (!response.ok) {
//                 throw new Error('Failed to update report status');
//             }
//             // Update the status field based on the newStatus
//             setStatus(newStatus);
//         } catch (error) {
//             console.error("Error updating report status:", error);
//         }
//     };

   

//     return (
//         <div>
//             <h1>Registered Shop Reports</h1>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Shop Name</th>
//                         <th>Phone</th>
//                         <th>Number of Reports</th>
//                         <th>Details</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {shops.map((shop, index) => (
//                         <tr key={index}>
//                             <td>{shop.shopName}</td>
//                             <td>{shop.reports[0].s_phone}</td>
//                             <td>{shop.reportsCount}</td>
//                             <td>
//                                 <Button onClick={() => showReports(shop)}>View Details</Button>
//                             </td>
//                             <td>
//                                 {shop.reports.some(report => report.r_status === "unsolved") ?
//                                     <Button onClick={() => updateReportsStatus(shop.shopName, 'solved')}>Unsolved</Button> : 'solved'
//                                 }
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             <Modal show={showModal} onHide={hideDetails} size="lg" dialogClassName="custom-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Reports for {selectedShop && selectedShop.shopName}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="report-modal-body">
//                     <Table striped bordered hover className="report-table">
//                         <thead>
//                             <tr>
//                                 <th>Shop Name</th>
//                                 <th>Shop Photo</th>
//                                 <th>Product Name</th>
//                                 <th>Product Photo</th>
//                                 <th>Description</th>
//                                {/*  <th>View Address</th> */}
//                                 <th>View Customer Details</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_name}</td>
//                                     <td>{report.s_photo}</td>
//                                     <td>{report.p_name}</td>
//                                     <td>{report.p_photo}</td>
//                                     <td>{report.description}</td>
//                                     {/* <td>
//                                         <Button onClick={() => viewAddress(report.address)}>View Address</Button>
//                                     </td> */}
//                                     <td>
//                                         <Button onClick={() => viewCustomerDetails(report)}>View Customer Details</Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>

//                 <div className="d-flex justify-content-center w-100">
//       {selectedShop && selectedShop.reports && selectedShop.reports.some(report => report.r_status === "unsolved") && (
//         <Button variant="primary" onClick={() => viewAddress(selectedShop.reports[0].address)}>View Address</Button>
//       )}
//     </div>
                  
//                     <Button variant="secondary" onClick={hideDetails}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Address</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Division</th>
//                                 <th>District</th>
//                                 <th>Sub District</th>
//                                 <th>Upazila</th>
//                                 <th>Union</th>
//                                 <th>Word</th>
//                                 <th>Road</th>
//                                 <th>Google Location</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_div}</td>
//                                     <td>{report.p_dist}</td>
//                                     <td>{report.s_subdist}</td>
//                                     <td>{report.s_union}</td>
//                                     <td>{report.s_word}</td>
//                                     <td>{report.s_road}</td>
//                                     <td>
//                                         <a href={report.s_location} target="_blank" rel="noopener noreferrer">
//                                             {report.s_location}
//                                         </a>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Customer Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Customer name</th>
//                                 <th>Customer Phone</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((customer, index) => (
//                                 <tr key={index}>
//                                     <td>{customer.c_name}</td>
//                                     <td>{customer.c_phone}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default RegShopReport;










// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import "../style/reg.css";

// const RegShopReport = () => {
//     const [shops, setShops] = useState([]);
//     const [selectedShop, setSelectedShop] = useState(null);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showAddressModal, setShowAddressModal] = useState(false);
//     const [showCustomerModal, setShowCustomerModal] = useState(false);


//     const showReports = (shop) => {
//         setSelectedShop(shop);
//         setShowModal(true);
//     };

//     const viewAddress = (address) => {
//         setSelectedReport(address);
//         setShowAddressModal(true);
//     };

//     const viewCustomerDetails = (report) => {
//         setSelectedReport(report);
//         setShowCustomerModal(true);
//     };

//     const hideDetails = () => {
//         setSelectedShop(null);
//         setShowModal(false);
//     };

//   //   const updateReportsStatus = async (shopName, newStatus) => {
//   //     try {
//   //         const response = await fetch('http://example.com/api/updateReports', {
//   //             method: 'POST',
//   //             headers: {
//   //                 'Content-Type': 'application/json'
//   //             },
//   //             body: JSON.stringify({
//   //                 shopName: shopName,
//   //                 newStatus: newStatus
//   //             })
//   //         });
  
//   //         if (!response.ok) {
//   //             throw new Error('Network response was not ok');
//   //         }
  
//   //         const responseData = await response.json();
//   //         console.log(responseData);
//   //     } catch (error) {
//   //         console.error("Error updating report status:", error);
//   //     }
//   // };


//   const [status, setStatus] = useState(""); // Define state for status field

// const updateReportsStatus = async (shopName, newStatus) => {
//     try {
//         // Update the status field based on the newStatus
//         setStatus(newStatus);

//         // Send a POST request to update the status in the backend
//         // Your existing code for sending POST request here...
//     } catch (error) {
//         console.error("Error updating report status:", error);
//     }
// };

// // Display status field in your UI
// <div>
//     <p>Status: {status}</p>
//     {/* Your button code here */}
// </div>

  

//     return (
//         <div>
//             <h1>Registered Shop Reports</h1>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Shop Name</th>
//                         <th>Phone</th>
//                         <th>Number of Reports</th>
//                         <th>Details</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {shops.map((shop, index) => (
//                         <tr key={index}>
//                             <td>{shop.shopName}</td>
//                             <td>{shop.reports[0].s_phone}</td>
//                             <td>{shop.reportsCount}</td>
//                             <td>
//                                 <Button onClick={() => showReports(shop)}>View Details</Button>
//                             </td>
//                             <td>
//                             {/* <Button onClick={() => updateReportsStatus(shop.shopName, shop.reports.some(report => report.r_status === "unsolved") ? "solved" : "unsolved")}>
//     {shop.reports.some(report => report.r_status === "unsolved") ? "Mark as Solved" : "Mark as Unsolved"}
// </Button> */}

// {shop.reports.some(report => report.r_status === "unsolved") ?
//     <Button onClick={() => updateReportsStatus(shop.shopName,'solved')}>Unsolved</Button> :'solved'
// }

//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             <Modal show={showModal} onHide={hideDetails} size="lg" dialogClassName="custom-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Reports for {selectedShop && selectedShop.shopName}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="report-modal-body">
//         <Table striped bordered hover className="report-table">
//                         <thead>
//                             <tr>
//                                 <th>Shop Name</th>
//                                 <th>Shop Photo</th>
//                                 <th>Product Name</th>
//                                 <th>Product Photo</th>
//                                 <th>Description</th>
//                                 {/* <th>View Address</th> */}
//                                 <th>View Customer Details</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_name}</td>
//                                     <td>{report.s_photo}</td>
//                                     <td>{report.p_name}</td>
//                                     <td>{report.p_photo}</td>
//                                     <td>{report.description}</td>
//                                     {/* <td>
//                                         <Button onClick={() => viewAddress(report.address)}>View Address</Button>
//                                     </td> */}
//                                     <td>
//                                         <Button onClick={() => viewCustomerDetails(report)}>View Customer Details</Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>

//                 <div className="d-flex justify-content-center w-100">
//       {selectedShop && selectedShop.reports && selectedShop.reports.some(report => report.r_status === "unsolved") && (
//         <Button variant="primary" onClick={() => viewAddress(selectedShop.reports[0].address)}>View Address</Button>
//       )}
//     </div>
//                     <Button variant="secondary" onClick={hideDetails}>
//                         Close
//                     </Button>
                    
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Address</Modal.Title>
//                 </Modal.Header>
//                 {/* <Modal.Body>
//                     <p>{selectedReport && selectedReport.address}</p>
//                 </Modal.Body> */}


// <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Division</th>
//                                 <th>District</th>
//                                 <th>Sub District</th>
//                                 <th>Upazila</th>
//                                 <th>Union</th>
//                                 <th>Word</th>
//                                 <th>Road</th>
//                                 <th>Google Location</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_div}</td>
//                                     <td>{report.p_dist}</td>
//                                     <td>{report.s_subdist}</td>
//                                     <td>{report.s_union}</td>
//                                     <td>{report.s_word}</td>
//                                     <td>{report.s_road}</td>
//                                     <td>
//     <a href={report.s_location} target="_blank" rel="noopener noreferrer">
//         {report.s_location}
//     </a>
// </td>

                                    
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Customer Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Customer name</th>
//                                 <th>Customer Phone</th>
                                
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((customer, index) => (
//                                 <tr key={index}>
//                                     <td>{customer.c_name}</td>
//                                     <td>{customer.c_phone}</td>
                                    
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default RegShopReport;










// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";

// const RegShopReport = () => {
//   const [reports, setReports] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedReport, setSelectedReport] = useState(null);

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       // Fetch data from the backend API
//       const response = await fetch("your-backend-api-url");
//       if (!response.ok) {
//         throw new Error("Failed to fetch data");
//       }
//       const data = await response.json();
//       setReports(data);
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     }
//   };

//   const handleShowModal = (report) => {
//     setSelectedReport(report);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setSelectedReport(null);
//   };

//   return (
//     <div>
//       <h2>Registered Shop Report</h2>
//       <div style={{ maxHeight: "400px", overflowY: "auto" }}> {/* Set the max height and overflow */}
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Report ID</th>
//               <th>Shop Name</th>
//               <th>Address</th>
//               <th>Product Name</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {reports.map((report) => (
//               <tr key={report.r_id}>
//                 <td>{report.r_id}</td>
//                 <td>{report.shopName}</td>
//                 <td>{report.address}</td>
//                 <td>{report.productName}</td>
//                 <td>
//                   <Button onClick={() => handleShowModal(report)}>View Details</Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//       <Modal show={showModal} onHide={handleCloseModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Report Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedReport && (
//             <div>
//               <p><strong>Report ID:</strong> {selectedReport.r_id}</p>
//               <p><strong>Shop Name:</strong> {selectedReport.shopName}</p>
//               <p><strong>Address:</strong> {selectedReport.address}</p>
//               <p><strong>Product Name:</strong> {selectedReport.productName}</p>
//               {/* Add other details here */}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default RegShopReport;




















// import React, { useState, useEffect } from "react";
// import { Table, Button, Modal } from "react-bootstrap";
// import "../style/reg.css";

// const RegShopReport = () => {
//     const [shops, setShops] = useState([]);
//     const [selectedShop, setSelectedShop] = useState(null);
//     const [selectedReport, setSelectedReport] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     const [showAddressModal, setShowAddressModal] = useState(false);
//     const [showCustomerModal, setShowCustomerModal] = useState(false);

//     useEffect(() => {
//         fetchShops();
//     }, []);

//     const fetchShops = async () => {
//         try {
//             // Dummy data for testing
//             const dummyData = [
//                 {
//                     shopName: "ABC Store",
//                     reportsCount: 2,
//                     reports: [
//                         {
//                             r_id: 1,
//                             s_name: "Shop Owner",
//                             p_name: "Product 1",
//                             p_photo: "product1.jpg",
//                             description: "Description of Product 1",
//                             address: "123 Main St, City, State, Country",
//                             s_phone: "1234567890",
//                             r_price: "10.00",
//                             r_status: "unsolved"
//                         },
//                         {
//                             r_id: 2,
//                             s_name: "Shop Owner",
//                             p_name: "Product 2",
//                             p_photo: "product2.jpg",
//                             description: "Description of Product 2",
//                             address: "123 Main St, City, State, Country",
//                             s_phone: "1234567890",
//                             r_price: "15.00",
//                             r_status: "unsolved"
//                         }
//                     ]
//                 },
//                 {
//                     shopName: "XYZ Mart",
//                     reportsCount: 1,
//                     reports: [
//                         {
//                             r_id: 3,
//                             s_name: "Shop Owner",
//                             p_name: "Product 2",
//                             p_photo: "product2.jpg",
//                             description: "Description of Product 2",
//                             address: "456 Elm St, City, State, Country",
//                             s_phone: "9876543210",
//                             r_price: "15.00",
//                             r_status: "unsolved"
//                         }
//                     ]
//                 }
//             ];

//             setShops(dummyData);
//         } catch (error) {
//             console.error("Error fetching shops:", error);
//         }
//     };

//     const showReports = (shop) => {
//         setSelectedShop(shop);
//         setShowModal(true);
//     };

//     const viewAddress = (address) => {
//         setSelectedReport(address);
//         setShowAddressModal(true);
//     };

//     const viewCustomerDetails = (report) => {
//         setSelectedReport(report);
//         setShowCustomerModal(true);
//     };

//     const hideDetails = () => {
//         setSelectedShop(null);
//         setShowModal(false);
//     };

//   //   const updateReportsStatus = async (shopName, newStatus) => {
//   //     try {
//   //         const response = await fetch('http://example.com/api/updateReports', {
//   //             method: 'POST',
//   //             headers: {
//   //                 'Content-Type': 'application/json'
//   //             },
//   //             body: JSON.stringify({
//   //                 shopName: shopName,
//   //                 newStatus: newStatus
//   //             })
//   //         });
  
//   //         if (!response.ok) {
//   //             throw new Error('Network response was not ok');
//   //         }
  
//   //         const responseData = await response.json();
//   //         console.log(responseData);
//   //     } catch (error) {
//   //         console.error("Error updating report status:", error);
//   //     }
//   // };


//   const [status, setStatus] = useState(""); // Define state for status field

// const updateReportsStatus = async (shopName, newStatus) => {
//     try {
//         // Update the status field based on the newStatus
//         setStatus(newStatus);

//         // Send a POST request to update the status in the backend
//         // Your existing code for sending POST request here...
//     } catch (error) {
//         console.error("Error updating report status:", error);
//     }
// };

// // Display status field in your UI
// <div>
//     <p>Status: {status}</p>
//     {/* Your button code here */}
// </div>

  

//     return (
//         <div>
//             <h1>Registered Shop Reports</h1>
//             <Table striped bordered hover>
//                 <thead>
//                     <tr>
//                         <th>Shop Name</th>
//                         <th>Phone</th>
//                         <th>Number of Reports</th>
//                         <th>Details</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {shops.map((shop, index) => (
//                         <tr key={index}>
//                             <td>{shop.shopName}</td>
//                             <td>{shop.reports[0].s_phone}</td>
//                             <td>{shop.reportsCount}</td>
//                             <td>
//                                 <Button onClick={() => showReports(shop)}>View Details</Button>
//                             </td>
//                             <td>
//                             {/* <Button onClick={() => updateReportsStatus(shop.shopName, shop.reports.some(report => report.r_status === "unsolved") ? "solved" : "unsolved")}>
//     {shop.reports.some(report => report.r_status === "unsolved") ? "Mark as Solved" : "Mark as Unsolved"}
// </Button> */}

// {shop.reports.some(report => report.r_status === "unsolved") ?
//     <Button onClick={() => updateReportsStatus(shop.shopName,'solved')}>Unsolved</Button> :'solved'
// }

//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             <Modal show={showModal} onHide={hideDetails} size="lg" dialogClassName="custom-modal">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Reports for {selectedShop && selectedShop.shopName}</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body className="report-modal-body">
//         <Table striped bordered hover className="report-table">
//                         <thead>
//                             <tr>
//                                 <th>Shop Name</th>
//                                 <th>Shop Photo</th>
//                                 <th>Product Name</th>
//                                 <th>Product Photo</th>
//                                 <th>Description</th>
//                                 {/* <th>View Address</th> */}
//                                 <th>View Customer Details</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_name}</td>
//                                     <td>{report.s_photo}</td>
//                                     <td>{report.p_name}</td>
//                                     <td>{report.p_photo}</td>
//                                     <td>{report.description}</td>
//                                     {/* <td>
//                                         <Button onClick={() => viewAddress(report.address)}>View Address</Button>
//                                     </td> */}
//                                     <td>
//                                         <Button onClick={() => viewCustomerDetails(report)}>View Customer Details</Button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>

//                 <div className="d-flex justify-content-center w-100">
//       {selectedShop && selectedShop.reports && selectedShop.reports.some(report => report.r_status === "unsolved") && (
//         <Button variant="primary" onClick={() => viewAddress(selectedShop.reports[0].address)}>View Address</Button>
//       )}
//     </div>
//                     <Button variant="secondary" onClick={hideDetails}>
//                         Close
//                     </Button>
                    
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Address</Modal.Title>
//                 </Modal.Header>
//                 {/* <Modal.Body>
//                     <p>{selectedReport && selectedReport.address}</p>
//                 </Modal.Body> */}


// <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Division</th>
//                                 <th>District</th>
//                                 <th>Sub District</th>
//                                 <th>Upazila</th>
//                                 <th>Union</th>
//                                 <th>Word</th>
//                                 <th>Road</th>
//                                 <th>Google Location</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((report, index) => (
//                                 <tr key={index}>
//                                     <td>{report.s_div}</td>
//                                     <td>{report.p_dist}</td>
//                                     <td>{report.s_subdist}</td>
//                                     <td>{report.s_union}</td>
//                                     <td>{report.s_word}</td>
//                                     <td>{report.s_road}</td>
//                                     <td>
//     <a href={report.s_location} target="_blank" rel="noopener noreferrer">
//         {report.s_location}
//     </a>
// </td>

                                    
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showCustomerModal} onHide={() => setShowCustomerModal(false)} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Customer Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Table striped bordered hover>
//                         <thead>
//                             <tr>
//                                 <th>Customer name</th>
//                                 <th>Customer Phone</th>
                                
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {selectedShop && selectedShop.reports.filter(report => report.r_status === "unsolved").map((customer, index) => (
//                                 <tr key={index}>
//                                     <td>{customer.c_name}</td>
//                                     <td>{customer.c_phone}</td>
                                    
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </Table>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={() => setShowCustomerModal(false)}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default RegShopReport;


