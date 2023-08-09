const {session, ipcRenderer} = require('electron');

async function GetSessionID() {
    // Grab session ID from server
    let sessionId = await fetch("http://gaggia.homedns.org:8800/session", {
        method: "GET",
    })
    .then(response => response.json())
    .then(body => session.defaultSession.cookies.set("http://gaggia.homedns.org"));
}

GetSessionID();

document.getElementById("createRoomButton").addEventListener('click', () => {
    sessionStorage.setItem('roomId', "mybrandnewroom");
    console.log("hello");
    ipcRenderer.send('create-new-room');
});

document.querySelector(".inputForm")?.addEventListener('submit', e => {
    e.preventDefault();
    sessionStorage.setItem('roomId', e.currentTarget.roomInput.value);
    ipcRenderer.send('create-new-room');
});