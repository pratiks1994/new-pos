const { spawn } = require("child_process");
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
                 pathname: path.join(__dirname, "index.html"),
                 protocol: "file:",
                 slashes: true,
            })
          : "http://localhost:3006/POS/Home";
     mainWindow.loadURL(appURL);

     // Automatically open Chrome's DevTools in development mode.
     if (!app.isPackaged) {
          mainWindow.webContents.openDevTools();
     }

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

const changePermission = () => {
     try {
          if (app.isPackaged) {
               fs.chmodSync("opt", "POS", 0777);
          }
     } catch (err) {
          console.log(err);
     }
};

// This method will be called when Electron has finished its initialization and
// is ready to create the browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
     changePermission();
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
     const posServer = require("../server/server");

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

     // const printData = [
     //      {
     //           type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
     //           value: "SAMPLE HEADING",
     //           style: { fontWeight: "700", textAlign: "center", fontSize: "5mm" },
     //      },
     // ];

     // const options = {
     //      preview: "false",
     //      margin: "0 0 0 0",
     //      silent: "false",
     //      copies: 1,
     //      printerName: "ec-usb",
     //      timeOutPerLine: 400,
     //      pageSize: "72mm", // page size
     // };

     // PosPrinter.print(printData, options)
     //      .then(console.log)
     //      .catch((error) => {
     //           console.error(error);
     //      });
});

ipcMain.handle("print", async (event, data) => {
     console.log("print");

     const printData = [
          {
               type: 'text',                                       // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
               value: 'SAMPLE HEADING',
               style: {fontWeight: "700", textAlign: 'center', fontSize: "24px"}
           }
     ];

     const options = {
          preview: true,
          margin: "0 0 0 0",
          silent: true,
          copies: 1,
          printerName: "ex-usb",
          timeOutPerLine: 400,
          pageSize: "72mm", // page size
     };

     PosPrinter.print(printData, options)
          .then(console.log)
          .catch((error) => {
               console.error(error);
          });




     let printer = new ThermalPrinter({
          type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
          interface: "printer:ex-usb", // Printer interface
          characterSet: CharacterSet.PC437_USA, // Printer character set - default: SLOVENIA
          removeSpecialCharacters: true, // Removes special characters - default: false                                       // Set character for lines - default: "-"
          breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
          driver:"raw",
          options: {
               // Additional options
               timeout: 5000, // Connection timeout (ms) [applicable only for network printers] - default: 3000
          },
     });

     let isConnected = await printer.isPrinterConnected();
     console.log(isConnected);

     printer.println("customerName");
     printer.drawLine();

     printer.cut();

     try {
          console.log("entered");
          await printer.execute();
          console.log("Print success.");
     } catch (error) {
          console.error("Print error:", error);
     }
});
