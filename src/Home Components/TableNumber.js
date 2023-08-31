import React, { useEffect } from "react";
import styles from "./TableNumber.module.css";
import { useSelector, useDispatch } from "react-redux";
import { changePriceOnAreaChange, modifyCartData } from "../Redux/finalOrderSlice";
import { setActive } from "../Redux/UIActiveSlice";

function TableNumber({ showDetailType }) {
	const { tableNumber, orderCart } = useSelector((state) => state.finalOrder);
	const { areas, categories, defaultSettings } = useSelector((state) => state.bigMenu);
	const { restaurantPriceId } = useSelector((state) => state.UIActive);
	const dispatch = useDispatch();

	const hanndleChange = (e) => {
		let tableNo = e.target.value;
		let area = areas.find((area) => area.tables.some((table) => table.table_no === tableNo));
		let areaName = area?.area || "Other";
		let updatedRestaurantPriceId = area?.restaurant_price_id || +defaultSettings.default_restaurant_price || null;

		dispatch(setActive({ key: "restaurantPriceId", name: updatedRestaurantPriceId }));
		dispatch(modifyCartData({ tableNumber: tableNo }));
		dispatch(modifyCartData({ tableArea: areaName }));
	};

	useEffect(() => {
		// const start = performance.now();
		let timeOut = setTimeout(() => {
			if (orderCart.length) {
				const newCartItems = orderCart.map((cartItem) => {
					for (const category of categories) {
						for (const item of category.items) {
							if (item.id === cartItem.itemId) {
								let newPrice = null;

								if (cartItem.variation_id) {
									for (const variation of item.variations) {
										if (variation.variation_id === cartItem.variation_id && variation.restaurantPriceId === restaurantPriceId) {
											newPrice = variation.price;
											// return { ...cartItem, basePrice: variation.price };
										}
									}
								} else {
									if (restaurantPriceId === null) {
										newPrice = item.price;
										// return { ...cartItem, basePrice: item.price };
									} else {
										for (const restaurantPrice of item.restaurantPrices) {
											if (restaurantPrice.restaurant_price_id === restaurantPriceId) {
												newPrice = restaurantPrice.price;
												// return { ...item, basePrice: restaurantPrice.price };
											}
										}
									}
								}

								let toppingPrice = cartItem.itemTotal - cartItem.basePrice;
								let newitemTotal = newPrice + toppingPrice;
								let newMultiItemTotal = cartItem.itemQty * newitemTotal;
								let newTaxes = item.item_tax.map((tax) => {
									return { id: tax.id, name: tax.name, tax: (tax.tax / 100) * newitemTotal };
								});

								return { ...cartItem, basePrice: newPrice, itemTotal: newitemTotal, multiItemTotal: newMultiItemTotal, itemTax: newTaxes };
							}
						}
					}
				});

				dispatch(changePriceOnAreaChange({ newCartItems }));
			}
		}, 500);

		// console.log("time", performance.now() - start);
		return () => clearTimeout(timeOut);
	}, [restaurantPriceId]);

	let showTableNumber = showDetailType === "tableNumber" ? `${styles.show} ${styles.tableNumber}` : `${styles.tableNumber}`;

	return (
		<div className={showTableNumber}>
			<span className="mx-2">please enter Table No.</span>
			<input
			    className="px-2"
				type="number"
				min={0}
				step={1}
				pattern="[0-9]*"
				inputMode="numeric"
				value={tableNumber}
				onChange={(e) => hanndleChange(e)}
			/>
		</div>
	);
}

export default TableNumber;
