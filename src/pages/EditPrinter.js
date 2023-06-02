import React, { useEffect, useState } from "react";
import styles from "./EditPrinter.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../Feature Components/BackButton";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { v4 } from "uuid";

function EditPrinter() {
      const { IPAddress } = useSelector((state) => state.serverConfig);
      const { printerId } = useParams();
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      // const [displayName, setDisplayName] = useState("");
      const [printer, setPrinter] = useState({ id: parseInt(printerId), printer_display_name: "", selectedPrinter: "" });

      const getPrinters = async () => {
            const { data } = await axios.get(`http://${IPAddress}:3001/getPrinters`);
            return data;
      };

      const getConnectedPrinters = async () => {
            const data = await window.apiKey.request("getConnectedPrinters");
            return data;
      };

      const updatePrinter = async (printer) => {
            // console.log("ran");
            const { data } = await axios.put(`http://${IPAddress}:3001/updatePrinter`, printer);
            return data;
      };

      const {
            data: printers,
            isLoading,
            isError,
            error,
      } = useQuery({
            queryKey: "printers",
            queryFn: getPrinters,
            onSuccess: (data) => {
                  const printerDetail = data?.find((printer) => parseInt(printerId) === printer.id);
                  setPrinter((state) => ({ ...state, printer_display_name: printerDetail.printer_display_name, selectedPrinter: printerDetail.printer_name }));
                  // setDisplayName(() => printerDetail.printer_display_name);
            },
            refetchOnWindowFocus: false,
      });

      const { data: connectedPrinters } = useQuery({
            queryFn: getConnectedPrinters,
            queryKey: "connectedPrinters",
            refetchOnWindowFocus: false,
      });

      const printerMutation = useMutation({
            mutationFn: updatePrinter,
            onSuccess: () => queryClient.invalidateQueries("printers"),
      });

      const handleSave = async (printer) => {
            printerMutation.mutate(printer);
            navigate("..");
            // console.log(printer)
      };

      // const printers = useSelector((state) => state.printerSettings);

      // console.log(connectedPrinters);
      // console.log(printer);
      return (
            <motion.div className={styles.editPrinterBody} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1 }}>
                  <header className={styles.editPrinterHeading}>
                        <div>Edit Printer</div>
                        <BackButton onClick={() => navigate("..")} />
                  </header>
                  <main className={styles.editPrinterMain}>
                        <div className={styles.printerBasicInfo}>
                              <div className={styles.printerInfoField}>
                                    <label>Printer Name</label>
                                    <input value={printer.printer_display_name} onChange={(e) => setPrinter((state) => ({ ...state, printer_display_name: e.target.value }))} />
                              </div>
                              <div className={styles.printerInfoField}>
                                    <label>Select Printer</label>
                                    <select
                                          name="connectedPrinters"
                                          onChange={(e) => setPrinter((state) => ({ ...state, selectedPrinter: e.target.value }))}
                                          value={printer.selectedPrinter}>
                                          {connectedPrinters &&
                                                connectedPrinters?.map((printer) => {
                                                      return (
                                                            <option className={styles.printerSelectOption} key={v4()} value={printer.name}>
                                                                  {printer.name}
                                                            </option>
                                                      );
                                                })}
                                    </select>
                              </div>
                        </div>
                        <div className={styles.editPrinterControl}>
                              <button className={styles.saveBtn} onClick={() => handleSave(printer)}>
                                    Save
                              </button>
                              <button className={styles.cancelBtn} onClick={() => navigate("..")}>
                                    Cancel
                              </button>
                        </div>
                  </main>
            </motion.div>
      );
}

export default EditPrinter;
