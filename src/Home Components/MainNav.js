import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import InputGroup from "react-bootstrap/InputGroup";
import styles from "./MainNav.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
   faStore,
   faBowlFood,
   faUsersViewfinder,
   faTruck,
   faCirclePause,
   faBellConcierge,
   faBell,
   faUser,
   faPowerOff,
   faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function MainNav() {
   return (
      <Navbar bg="light" expand="lg" className={`${styles.mainNav} py-1`}>
         <Container fluid className="d-flex flex-nowrap">
            <div className="d-flex justify-content-start flex-nowrap align-items-center">
               <FontAwesomeIcon className={styles.bars} icon={faBars} />
               <Navbar.Brand href="#" className="fw-bolder text-danger fs-4 ps-1">
                  Martino'z
               </Navbar.Brand>

               <Button variant="danger" size="sm" className="mx-2 py-1 px-2 fw-bold text-nowrap">
                  New Order
               </Button>

               <Form className={`d-flex ${styles.billSearchInput}`}>
                  <InputGroup>
                     <Form.Control
                        type="search"
                        placeholder="&#xF002; Search Bill No"
                        className={`me-2 ${styles.searchInput}`}
                        aria-label="Search"
                     />
                  </InputGroup>
               </Form>
            </div>

            <div className="d-flex flex-nowrap align-items-center">
               <Link className={`d-flex align-items-center ${styles.contact} flex-nowrap py-0 px-1 me-3 rounded-1`}>
                  <FontAwesomeIcon className="mx-2" icon={faPhone} />
                  <div className={`d-flex flex-column ${styles.contactText} flex-nowrap`}>
                     <div className="d-flex text-nowrap my-0 py-0 me-1">call for support</div>
                     <div className="d-flex text-nowrap my-0 py-0">8236855222</div>
                  </div>
               </Link>

               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faStore} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faBowlFood} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faUsersViewfinder} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faTruck} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faCirclePause} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faBellConcierge} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faBell} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faUser} />
               </Link>
               <Link>
                  <FontAwesomeIcon className={styles.LinkIcon} icon={faPowerOff} />
               </Link>
            </div>
         </Container>
      </Navbar>
   );
}

export default MainNav;
