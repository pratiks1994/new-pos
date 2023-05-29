import React from "react";
import styles from "./PrintersList.module.css";
import BackButton from "../Feature Components/BackButton";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function PrintersList() {
      const navigate = useNavigate();

      return (
            <motion.div className={styles.printersListBody} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1 }}>
                  <header>
                        <div className={styles.headerText}> Printer Listing </div>
                        <div>
                        <button className={styles.addprinterButton}>+ Add Printer</button>
                        <BackButton onClick={() => navigate("..")} />
                        </div>

                  </header>
                  <main className={styles.printersList}></main>
            </motion.div>   
      );
}

export default PrintersList;
