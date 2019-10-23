const electron = require('electron');
const { session } = require('electron')
var macaddress = require('macaddress');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
process.env.GOOGLE_API_KEY = 'AIzaSyBjtRUvjcEnZpsmS4xtRF1f5HZ1RRV8qWI'

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900, height: 680, x: 0,
        y: 0,
        darkTheme: true,
        backgroundColor: "#000000",
        webPreferences:{
            nodeIntegration:true,
            devTools:true,
            enableBlinkFeatures:"CSSVariables",
        }
    });



    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    
    mainWindow.webContents.session.setPermissionRequestHandler((webContents, permission, callback)=>{
        if(permission === 'geolocation'){
            return callback(true); 
        }
        callback(true);
    })

    if (isDev) {
        // Open the DevTools.
        //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
        mainWindow.webContents.openDevTools();
    }


    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('mac:get',()=>{
    macaddress.one(function (err, mac) {
        console.log("Mac address for this host: %s", mac);  
        mainWindow.webContents.send('mac:send', mac)
      });
})