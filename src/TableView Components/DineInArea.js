import React from "react";
import styles from "./DineInArea.module.css";
import ActiveTableCard from "./ActiveTableCard";
import InactiveTableCard from "./InactiveTableCard";

function DineInArea({ area ,restaurantPriceId}) {
	return (
		<div className={styles.areaSection}>
			<div className={styles.areaTitle}>{area.area}</div>
			<div className={styles.tableList}>
				{area.tables.map((table) => {

					if (table.orders.length) {
						return table.orders.map((order) => {
							return (
								<ActiveTableCard
									key={order.id}
									order={order}
								/>
							);
						});
					} else {
						return (
							<InactiveTableCard
								key={table.id}
								table={table}
								restaurantPriceId={restaurantPriceId}
							/>
						);
					}
				})}
			</div>
		</div>
	);
}

export default DineInArea;
