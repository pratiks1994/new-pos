import React from "react";
import styles from "./LiveViewNav.module.css";
import { Link, NavLink, useLocation, useNavigate, useResolvedPath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActive } from "../Redux/UIActiveSlice";
import BackButton from "../Feature Components/BackButton";

function LiveViewNav() {
      const { liveViewOrderStatus } = useSelector((state) => state.UIActive);
      const dispatch = useDispatch();
      const location = useLocation();
      const path = useResolvedPath();
      const navigate = useNavigate()

      const handleClick = (name) => {
            const key = "liveViewOrderStatus";

            dispatch(setActive({ key, name }));
      };

      const fitlers = [
            { name: "FoodReady", number: 0 },
            { name: "Dispatch", number: 0 },
            { name: "Deliver", number: 0 },
      ];

      const isKOT = path.pathname === "/Home/LiveView/KOTView";

      return (
            <nav className={styles.liveViewNav}>
                  <NavLink to="OrderView" end className={({ isActive }) => (isActive ? `${styles.active} ${styles.navLink}` : styles.navLink)}>
                        Order View
                  </NavLink>
                  <NavLink to="KOTView" end className={({ isActive }) => (isActive ? `${styles.active} ${styles.navLink}` : styles.navLink)}>
                        KOT View
                  </NavLink>
                  <div className={styles.OrderStatusFilter}>
                        {!isKOT &&
                              fitlers.map((filter) => {
                                    return (
                                          <div
                                                key={filter.name}
                                                className={liveViewOrderStatus === filter.name ? `${styles.filter} ${styles.active}` : `${styles.filter}`}
                                                onClick={() => handleClick(filter.name)}>
                                                <span>{filter.name}</span> <div className={styles.badge}>{filter.number}</div>
                                          </div>
                                    );
                              })}

                        <Link to="../" className={styles.backBtn}>
                              {" "}
                              &#x2190; Back
                        </Link>
                      
                  </div>
            </nav>
      );
}

export default React.memo(LiveViewNav);
