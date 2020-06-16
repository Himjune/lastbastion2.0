const state = {
    sub: 0,             // 0 - tw and 1 - yt

    playing: false,

    tw_is_ready: false,
    yt_is_ready: false,

    tw_quality: "",
    yt_quality: ""
}

function switchSubPlayer () {
    if (state.sub) state.sub = 1;
    else state.sub = 0;
}

function tryReadyPlayers () {
    if (state.yt_is_ready && state.tw_is_ready) {
        playersAreReadyNow();
    }
}

const tw_def_props = {
    width: 400,
    height: 300,
    channel: "outbreak",
    layout: "video",
    theme: "dark",
    autoplay: false,
    parent: ["himjune.github.io"],
    controls: false
}

const yt_def_props = {
    height: '360',
    width: '640',
    playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1 },
    videoId: 'e1ayB3iFCS8',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
}

/*
    INIT FROM PARAMS
*/
let param = util_get_query_param('yt');
if (param !== '') yt_def_props.videoId = param;
document.querySelector('#goYtMainBtn').href = 'https://www.youtube.com/watch?v='+yt_def_props.videoId;

param = util_get_query_param('tw');
if (param !== '') tw_def_props.channel = param;
document.querySelector('#goTwMainBtn').href = 'https://www.twitch.tv/'+tw_def_props.channel;
document.querySelector('#chat_embed').src = 'https://www.twitch.tv/embed/'+param+'/chat?darkpopout&parent=himjune.github.io';

/*
    END INIT FROM PARAMS
*/

var yt_player;
var tw_player = new Twitch.Player('twContainer', tw_def_props);

tw_player.addEventListener(Twitch.Player.READY, () => {
    tw_player.setVolume(1.0);
    tw_player.setMuted(false);

    state.tw_is_ready = true;
    tryReadyPlayers();

    console.log('readyEvent');
});
tw_player.addEventListener(Twitch.Player.PLAYING, () => {
    console.log('playingEvent');
});
tw_player.addEventListener(Twitch.Player.PLAYBACK_BLOCKED, () => {
    console.log('PLAYBACK_BLOCKED');
});
tw_player.addEventListener(Twitch.Player.PAUSE, () => {
    console.log('PAUSE');
});

function startYt() {
    yt_player = new YT.Player('ytPlayer', yt_def_props);
}

function onYouTubeIframeAPIReady() {
    clearTimeout(timer);
    startYt();
}
let timer = setTimeout(startYt, 500);

function onPlayerReady(event) {
    yt_player.setVolume(5);
    state.yt_is_ready = true;
    tryReadyPlayers();
}
function onPlayerStateChange(event) {
}



function startPlayers () {
    if (state.playing) {
        tw_player.pause();
        yt_player.pauseVideo();

        state.playing = false;
    } else {
        tw_player.play();
        yt_player.playVideo();
        
        state.playing = true;
    }
}