const state = {
    sub: 0,             // 0 - tw and 1 - yt

    tw_is_ready: false,
    yt_is_ready: false,

    tw_quality: "",
    yt_quality: ""
}

function switchSubPlayer () {
    if (state.sub) state.sub = 1;
    else state.sub = 0;
}

function try_ready_players () {
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
    parent: ["himjune.github.io"]
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

param = util_get_query_param('tw');
if (param !== '') {
    tw_def_props.channel = param;

    document.querySelector('#chat_embed').src = 'https://www.twitch.tv/embed/'+param+'/chat?darkpopout&parent=himjune.github.io';
}
/*
    END INIT FROM PARAMS
*/

var yt_player;
var tw_player = new Twitch.Player('twContainer', tw_def_props);

tw_player.addEventListener(Twitch.Player.READY, () => {
    tw_player.setVolume(1.0);
    tw_player.setMuted(false);

    state.tw_is_ready = true;
    try_ready_players();

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

function onYouTubeIframeAPIReady() {
    yt_player = new YT.Player('ytPlayer', yt_def_props);
}
function onPlayerReady(event) {
    yt_player.setVolume(5);
    state.yt_is_ready = true;
    try_ready_players();
}
function onPlayerStateChange(event) {
}



function startPlayers () {
    tw_player.play();
    yt_player.playVideo();
}