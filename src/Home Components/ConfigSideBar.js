import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./ConfigSidebar.module.css";
import billingIcon from "../icons/order.png";
import settingsIcon from "../icons/settings.png";
import liveIcon from "../icons/live_1.png";
import updateIcon from "../icons/update.png";
import logoutIcon from "../icons/left_nav_logout.svg";
import { Link } from "react-router-dom";

function ConfigSideBar({ showConfigSideBar, setShowConfigSideBar }) {
	const handleClose = () => {
		setShowConfigSideBar(false);
	};

	return (
		<Offcanvas className={styles.ConfigSideBarMain} show={showConfigSideBar} onHide={handleClose} placement="start">
			<Offcanvas.Header closeButton className={styles.ConfigSideBarHeader}>
				Settings
			</Offcanvas.Header>
			<Offcanvas.Body className={styles.ConfigSideBarBody}>
				<Link to="." className={styles.items} onClick={handleClose}>
					<img src={billingIcon} className={styles.itemIcon} />
					<div className={styles.itemName}>Billing</div>
				</Link>
				<Link to="configuration" className={styles.items} onClick={handleClose}>
					<img src={settingsIcon} className={styles.itemIcon} />
					<div className={styles.itemName}>Configurations</div>
				</Link>
				<Link to="liveView/OrderView" className={styles.items} onClick={handleClose}>
					<img src={liveIcon} className={styles.itemIcon} />
					<div className={styles.itemName}>Live View</div>
				</Link>
				<Link className={styles.items} onClick={handleClose}>
					<img src={updateIcon} className={styles.itemIcon} />
					<div className={styles.itemName}>Check update</div>
				</Link>
				<Link className={styles.items} onClick={handleClose}>
					<img src={logoutIcon} className={styles.itemIcon} />
					<div className={styles.itemName}>Log Out</div>
				</Link>
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default ConfigSideBar;
