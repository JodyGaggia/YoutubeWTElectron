const path = require('path');
const http = require('http');
const fs = require('fs');
const {app, BrowserWindow, Menu, ipcMain, session} = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

var mainWindow;

// Creates the window displayed to the user
function createMainWindow(){
    mainWindow = new BrowserWindow({
        title: 'YouTube Watch Together',
        width: isDev ? 1500 : 1000,
        height: 1000,
        webPreferences: { // This is okay since we are only moving to trusted locations
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Open dev tools automatically if in dev environment
    if(isDev){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.loadFile(__dirname + "/../app/home.html");
    //mainWindow.loadFile(__dirname + "/resources/app/renderer/index.html");
    //mainWindow.loadURL('http://localhost:7100/renderer/index.html');
}

// Load the UI once the app has loaded
app.whenReady().then(async () => {
    createMainWindow();

    app.on('activate', () => {
        if(BrowserWindow.getAllWindows().length === 0){
            createMainWindow();
        }
    });

    // Remove top menu
    Menu.setApplicationMenu(null);
});

// App doesn't close on Mac when pressing X
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

ipcMain.on('create-new-room', (event) => {
    mainWindow.webContents.loadFile(__dirname + "/../app/room.html");

    session.defaultSession.cookies.get({ url: 'http://www.gaggia.homedns.org' })
    .then((cookies) => {
        console.log(cookies)
    }).catch((error) => {
        console.log(error)
    });
});

ipcMain.on('leave-room', (event) => {
    mainWindow.webContents.loadFile(__dirname + "/../app/home.html");
});