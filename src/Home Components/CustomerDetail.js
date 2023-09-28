import React, { useState } from "react";
import styles from "./CustomerDetail.module.css";
import { useDispatch, useSelector } from "react-redux";
import { modifyCartData } from "../Redux/finalOrderSlice";
// import axios from "axios";
import CustomerSuggest from "./CustomerSuggest.js";
import axiosInstance from "../Feature Components/axiosGlobal";
import axios from "axios";

function CustomerDetail({ showDetailType }) {
	const [suggestionsContact, setSuggestionsContact] = useState([]);
	const [suggestionsName, setSuggestionsName] = useState([]);
	const dispatch = useDispatch();
	const { customerName, customerAdd, customerContact, customerLocality } = useSelector(state => state.finalOrder);
	const { systemType, IPAddress } = useSelector(state => state.serverConfig);
	// const { IPAddress } = useSelector((state) => state.serverConfig);

	let showCustomerDetail = showDetailType === "customerDetail" ? `${styles.show} ${styles.customerDetail}` : `${styles.customerDetail}`;

	const handleChange = async e => {
		//  set redux final order state base on the input
		let { name, value } = e.target;
		dispatch(modifyCartData({ [name]: value }));

		//  API call for auto suggest the customer contact

		if (name === "customerContact" && value.length > 3) {
			const { data } = await axios.get(`http://${IPAddress}:3001/users`, { params: { [name]: value } });

			// set autosuggest state for contact
			setSuggestionsContact(data);
		} else {
			setSuggestionsContact([]);
		}
		//  API call for auto suggest for name field
		if (name === "customerName" && value.length > 3) {
			const { data } = await axios.get(`http://${IPAddress}:3001/users`, { params: { [name]: value } });
			setSuggestionsName(data);
		} else {
			// set auto suggest state for the name field
			setSuggestionsName([]);
		}
	};

	return (
		<div className={showCustomerDetail}>
			<div className={styles.custemerFieldWrapper}>
				<span>Contact :</span>
				<input type="text" name="customerContact" value={customerContact} className={`${styles.customerContact}`} autoComplete="off" onChange={e => handleChange(e)} />
				{suggestionsContact.length !== 0 && <CustomerSuggest suggestions={suggestionsContact} setSuggestions={setSuggestionsContact} />}
			</div>

			<div className={styles.custemerFieldWrapper}>
				<span>Name :</span>
				<input type="text" name="customerName" value={customerName} autoComplete="off" className={`${styles.customerName}`} onChange={e => handleChange(e)} />
				{suggestionsName.length !== 0 && <CustomerSuggest suggestions={suggestionsName} setSuggestions={setSuggestionsName} />}
			</div>

			<div className={styles.custemerFieldWrapper}>
				<span>Add :</span>
				<input type="text" name="customerAdd" value={customerAdd} className={`${styles.customerAddress}`} onChange={e => handleChange(e)} />
			</div>

			<div className={styles.custemerFieldWrapper}>
				<span>Locality :</span>
				<input type="text" name="customerLocality" value={customerLocality} className={`${styles.customerLocality}`} onChange={e => handleChange(e)} />
			</div>
		</div>
	);
}

export default CustomerDetail;
