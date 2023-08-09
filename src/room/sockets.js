const serverIp = "http://gaggia.homedns.org:8800";
const currentRoomId = sessionStorage.getItem('roomId').toString(); 

const socket = io(serverIp, {
    reconnect: true
});

socket.on('connect', function (socket) {
    console.log('Connected to the server!');    
});