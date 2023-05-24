const { fork } = require("child_process");
const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");
const { PosPrinter } = require("electron-pos-printer");
const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require("node-thermal-printer");

// Create the native browser window.
async function createWindow() {
     const mainWindow = new BrowserWindow({
          width: 1024,
          height: 768,
          // Set the path of an additional "preload" script that can be used to
          // communicate between node-land and browser-land.
          webPreferences: {
               preload: path.join(__dirname, "preload.js"),
          },
     });

     // In production, set the initial browser path to the local bundle generated
     // by the Create React App build process.
     // In development, set it to localhost to allow live/hot-reloading.
     const appURL = app.isPackaged
          ? url.format({
               pathname: path.join(__dirname, "dist/index.html"),
               protocol: "file:",
               slashes: true,
          })
          : "http://localhost:3006/POS/Home";
     mainWindow.loadURL(appURL);

     // Automatically open Chrome's DevTools in development mode.
     // if (!app.isPackaged) {
     //      mainWindow.webContents.openDevTools();
     // }

     // const printers = await mainWindow.webContents.getPrintersAsync();
     // console.log(printers);
}

// Setup a local proxy to adjust the paths of requested files when loading
// them from the local production bundle (e.g.: local fonts, etc...).
function setupLocalFilesNormalizerProxy() {
     protocol.registerHttpProtocol(
          "file",
          (request, callback) => {
               const url = request.url.substr(8);
               callback({ path: path.normalize(`${__dirname}/${url}`) });
          },
          (error) => {
               if (error) console.error("Failed to register protocol");
          }
     );
}

// const changePermission = () => {
//      try {
//           if (app.isPackaged) {
//                fs.chmodSync("opt", "POS", 0777);
//           }
//      } catch (err) {
//           console.log(err);
//      }
// };

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
     createWindow();
     setupLocalFilesNormalizerProxy();

     app.on("activate", function () {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (BrowserWindow.getAllWindows().length === 0) {
               createWindow();
          }
     });
});

// Quit when all windows are closed, except on macOS.
// There, it's common for applications and their menu bar to stay active until
// the user quits  explicitly with Cmd + Q.
app.on("window-all-closed", function () {
     if (process.platform !== "darwin") {
          app.quit();
     }
});

// If your app has no need to navigate or only needs to navigate to known pages,
// it is a good idea to limit navigation outright to that known scope,
// disallowing any other kinds of navigation.
const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
     contents.on("will-navigate", (event, navigationUrl) => {
          const parsedUrl = new URL(navigationUrl);

          if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
               event.preventDefault();
          }
     });
});

ipcMain.handle("setup", async (event, data) => {
     const posServer = fork("../POS/server/server");
   

     // for final build use path 'resources/server/server.js'
     // path.join("resources", "server","server.js")

     // const serverProcess = spawn('node', [path.join("resources", "server","server.js")]);

     // serverProcess.stdout.on('data', (data) => {
     //   console.log(`Server stdout: ${data}`);
     // });

     // serverProcess.stderr.on('data', (data) => {
     //   console.error(`Server stderr: ${data}`);
     // });

     // serverProcess.on('close', (code) => {
     //   console.log(`Server process exited with code ${code}`);
     // });


});

ipcMain.handle("print", async (event, data) => {

     const fullDate = new Date()
     const date = `${fullDate.getDate()}/${fullDate.getMonth()}/${fullDate.getFullYear()}`
     const time = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`




     const printDataHeader = [
          {
               type: 'text',
               value: "Martino'z Pizza (Rajkot)",
               style: { fontWeight: "700", textAlign: 'center', fontSize: "15px", fontFamily: "Roboto" }
          },
          {
               type: 'text',
               value: "Plot no. 1&2, Royal Avenue Gate-1,nr, nana mauva circle, 150ft ringroad, opp.silver height,nana mauva main road,<br> Rajkot -360004",
               style: { fontWeight: "700", textAlign: 'center', fontSize: "15px", fontFamily: "Roboto" }
          },
          {
               type: 'text',
               value: "Mob. No. 9978964000",
               style: { fontWeight: "700", textAlign: 'center', fontSize: "15px", fontFamily: "Roboto" }
          },
          {
               type: 'text',
               value: "GST NO :24AABCY 4639H1ZB ",
               style: { fontWeight: "700", textAlign: 'center', fontSize: "15px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" }
          },

     ];

     const printDataCustomer = [
          {
               type: 'text',
               value: `Name : ${data.customerName} <br> M: ${data.customerContact}`,
               style: {  textAlign: 'left', fontSize: "13px", margin: "5px 0 0 5px", fontFamily: "Roboto" }
          }, {
               type: 'text',
               value: `Add : ${data.customerAdd} ${data.customerLocality}`,
               style: { textAlign: 'left', fontSize: "13px", margin: "0 0 0 5px", borderBottom: "1px solid", paddingBottom: "3px", fontFamily: "Roboto" }
          },
          {
               type: "text",
               value: `<div> Date : ${date} </div> <div>  ${data.orderType} <div>`,
               style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", fontFamily: "Roboto" }

          },
          {
               type: "text",
               value: `<div>  ${time} </div> <div>  Order No :120 <div>`,
               style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "2px 8px 0 8px", fontFamily: "Roboto" }

          },
          {
               type: "text",
               value: `<div> Cashier : biller </div> <div style="font-weight : bold ">  Token No :120 <div>`,
               style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "2px 8px 0 8px", borderBottom: "1px solid black", paddingBottom: "3px", fontFamily: "Roboto" }
          }

     ]


     const printOrderHeader = [{
          type: "text",
          value: `<div style="flex : 8" > Item </div>
                  <div style="flex : 3; text-align:center" > QTY </div> 
                  <div style="flex : 3; text-align:center "> Price </div>
                  <div style="flex : 3; text-align:center"> Amount </div>`,
          style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", borderBottom: "1px solid black", paddingBottom: "3px", fontWeight: "bold", fontFamily: "Roboto" }
     }
     ]

     let printOrderDetail = [];

     data.orderCart.forEach(item => {
          const orderitem = {
               type: "text",
               value: `<div style="flex : 8" > ${item.itemName} ${item.variantName} </div>
                  <div style="flex : 3 ; text-align:center"> x${item.itemQty} </div> 
                  <div style="flex : 3 ; text-align:center" > ${item.itemTotal} </div>
                  <div style="flex : 3 ; text-align:center"> ${item.multiItemTotal}</div>`,
               style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", fontFamily: "Roboto" }
          }
          printOrderDetail.push(orderitem)

          if (item.toppings) {
               item.toppings.forEach(topping => {
                    const orderTopping = {
                         type: "text",
                         value: `<div> ${topping.type}[topping] : ${topping.qty} x ${topping.price} = ${topping.price * topping.qty}  </div>`,
                         style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "start", margin: "0px 8px 0 20px", fontFamily: "Roboto" }
                    }

                    printOrderDetail.push(orderTopping)
               })
          }
     })

     const printTotal = [{
          type: "text",
          value: `<div style="padding-left:65px" > Item Qty : ${data.orderCart.length}  </div>
                  <div style="" > Sub Total :</div> 
                  <div style="padding-right : 10px" > ${data.subTotal} </div>`,
          style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "5px 8px 0 8px", borderTop: "1px solid black", padding: "5px 0", fontFamily: "Roboto" }
     },
     {
          type: "text",
          value: `<div style="padding-left:65px" > CGST </div>
                  <div style="" > 2.5% :</div> 
                  <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
          style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", fontFamily: "Roboto" }
     },
     {
          type: "text",
          value: `<div style="padding-left:65px" > SGST </div>
                  <div style="" > 2.5% :</div> 
                  <div style="padding-right : 10px" > ${(data.subTotal * 0.025).toFixed(2)} </div>`,
          style: { textAlign: "left", fontSize: "13px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", borderBottom: "1px solid black",  padding: "5px 0", fontFamily: "Roboto" }
     },
     {
          type: "text",
          value: `<div style="padding-left:65px" > Grand Total </div>
                  <div style="padding-right : 10px" > ₹ ${data.cartTotal} </div>`,
          style: { textAlign: "left", fontSize: "14px", display: "flex", justifyContent: "space-between", margin: "0px 8px 0 8px", fontWeight: "bold", padding: "5px 0", fontFamily: "Roboto" }
     },
     {
          type: "text",
          value: `<div > ${data.paymentMethod} </div>`,
          style: { textAlign: "left", fontSize: "12px", display: "flex", justifyContent: "flex-start", margin: "0px 8px 0 8px", borderBottom: "1px solid black", padding: "5px 10px", fontFamily: "Roboto" }
     },
     {
          type: "text",
          value: `<div > FSSAI Lic NO. 10722030000046 </div>
                  <div > Thanks...Visit...Again.. </div>`
          ,
          style: { textAlign: "center", fontSize: "12px", margin: "5px 8px 0 8px", fontFamily: "Roboto",fontWeight:"bold" }
     }

     ]


     // const printData = [...printDataHeader, ...printDataCustomer, ...printOrderHeader, ...printOrderDetail, ...printTotal]
     const printData = [...printDataHeader, ...printDataCustomer]


     const options = {
          preview: false,
          margin: "0 10px 0 0",
          silent: true,
          copies: 1,
          printerName: "POS-lan",
          timeOutPerLine: 400,
          pageSize: "76mm", // page size,
          color: false,
          printBackground: false,
          dpi: 300,
     };



     // PosPrinter.print(printData, options)
     //      .catch((error) => {
     //           console.error(error);
     //      });


});
