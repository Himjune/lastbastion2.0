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
const playlist = [
    {
      link: 'Xz7fnyN-7fw',
      date: Date.UTC(2020, 6, 3, 18, 30, 0)
    },
    {
      link: 'LkJgdJG_i8M',
      date: Date.UTC(2020, 6, 4, 1, 30, 0)
    },
    {
      link: 'JbLMRpS66YU',
      date: Date.UTC(2020, 6, 4, 18, 0, 0)
    },
    {
      link: 'OTDHDrhBP1w',
      date: Date.UTC(2020, 6, 5, 7, 30, 0)
    },
    {
      link: 'oh92uvQ7DZI',
      date: Date.UTC(2020, 6, 5, 18, 0, 0)
    }
]
let param = util_get_query_param('yt');
if (param === '') {
    let cur = Date.now()
    let idx = 0;
    while (idx < playlist.length && cur > playlist[idx].date) {
      idx++;
    }
    idx = idx-1;
  
    videoId = playlist[idx].link;
    console.log('YtFound:', cur, idx, playlist[idx].date, playlist[idx].link);
}
yt_def_props.videoId = param;
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


function twSetVolume(volume) {
    volume = parseFloat(volume)/100.0;
    tw_player.setVolume(volume);
}
function ytSetVolume(volume) {
    volume = parseInt(volume);
    yt_player.setVolume(volume);
}
function twMute() {
    tw_player.setMuted(!tw_player.getMuted());
}
function ytMute() {
    if (yt_player.isMuted()) yt_player.unMute();
    else yt_player.mute();
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