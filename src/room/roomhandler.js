const {ipcRenderer} = require('electron');

// Grab elements
const currentRoomLabel = document.getElementById('currentRoomLabel');
const leaveRoomButton = document.getElementById('leaveRoomButton');

currentRoomLabel.innerHTML = currentRoomId;

socket.emit('joinroom', 
{
    "roomId": currentRoomId
});

leaveRoomButton.addEventListener('click', function ()
{
    socket.emit('leaveroom', {
        "roomId": currentRoomId
    });

    ipcRenderer.send('leave-room');
});
