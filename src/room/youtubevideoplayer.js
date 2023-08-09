// Grab UI elements
const userInput = document.getElementById('youtubeInput');
const submitButton = document.getElementById('updateButton');
const windowBody = document.getElementById('windowBody');

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playerIframe;

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    playerVars: {
      'playsinline': 1,
      'autoplay': 1
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function SendTimeDataToServer(emitmessage) {
    socket.emit(emitmessage, {
        "playbackTime": player.getCurrentTime(),
        "roomId": currentRoomId
    });
}

function IsPlayerUnsynced(serverTime){
    maxDifferenceInSeconds = 5;

    if(Math.abs(player.getCurrentTime() - serverTime) > maxDifferenceInSeconds) return true;
    else return false;
}

async function SendVideoIDToServer(){
    // Grab user input
    inputText = userInput.value;
    userInput.value = "";

    // Isolate video ID from link
    videoId = GrabVideoIDFromLink(inputText);
    if(videoId == '') return; // No ID present or invalid format = do nothing

    // Send ID to server and parse response
    let url = new URL(serverIp + "/validate");

    let videoJSON = JSON.stringify({
        "videoId": videoId
    });

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    let response = await SendHTTPRequest(url, "POST", videoJSON, headers);

    // Tell the server to update all clients with the new video if
    // ID is valid
    if(response.status == 200){
        socket.emit('updatevideo', 
            {
                "videoId": videoId, 
                "roomId":currentRoomId
            });
    }  
}

function onPlayerReady(event) {
    playerIframe = document.getElementById('player');
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        SendTimeDataToServer('clientplayrequest');
        playerIframe.style.boxShadow = "0px 0px 0px 4000px rgba(0,0,0,0.5)";
    } else if (event.data == YT.PlayerState.PAUSED){
        SendTimeDataToServer('clientpauserequest');
        playerIframe.style.boxShadow = "0px 0px 0px 4000px rgba(0,0,0,0)";
    }
  }

submitButton.addEventListener('click', SendVideoIDToServer);

socket.on('updatevideoresponse', function (data) {
    player.loadVideoById(data);
});

socket.on('playvideo', function () {
    player.playVideo();
    playerIframe.style.boxShadow = "0px 0px 0px 4000px rgba(0,0,0,0.5)";
});

socket.on('pausevideo', function () {
    player.pauseVideo();
    playerIframe.style.boxShadow = "none";
});

socket.on('updatecurrentvideotime', function (data) {
    if(IsPlayerUnsynced(data))
        player.seekTo(data);
});
