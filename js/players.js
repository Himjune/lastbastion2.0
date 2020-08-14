const state = {
    sub: 0,             // 0 - tw and 1 - yt

    playing: false,

    tw_is_ready: false,
    yt_is_ready: false,

    tw_quality: "",
    yt_quality: ""
}

function switchSubPlayer() {
    if (state.sub == 0) state.sub = 1;
    else state.sub = 0;

    handleTwQuality();
}

function tryReadyPlayers() {
    if (state.yt_is_ready && state.tw_is_ready) {
        playersAreReadyNow();

        setInterval(watchDog, 1000);
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
    playerVars: { 'autoplay': 0, 'controls': 0, 'playsinline': 1, 'modestbranding': 1, 'origin': 'himjune.github.io' },
    videoId: 'e1ayB3iFCS8',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onPlaybackQualityChange': onPlaybackQualityChange
    }
}


/*
    INIT FROM PARAMS
*/
const mounth = 8 - 1;
const fday = 14;
const mor = 7, eve = 17;
const playlist = [
    {
        used: true,
        link: 'Z9hsP7aPWW4',
        date: Date.UTC(2020, mounth, fday, mor, 0, 0)
    },
    {
        used: true,
        link: 'B2viLYzyCus',
        date: Date.UTC(2020, mounth, fday, eve, 0, 0)
    },
    {
        used: true,
        link: 'HGD1_-yGlpU',
        date: Date.UTC(2020, mounth, fday + 1, mor, 0, 0)
    },
    {
        used: true,
        link: 'LN7tVZVYKy8',
        date: Date.UTC(2020, mounth, fday + 1, eve, 0, 0)
    },
    {
        used: true,
        link: 'WiZDCYNJg6k',
        date: Date.UTC(2020, mounth, fday + 2, mor, 0, 0)
    },
    {
        used: true,
        link: 'kobNbPXYro0',
        date: Date.UTC(2020, mounth, fday + 2, eve, 0, 0)
    },
]


let param = 'eVcMequS9vE' //util_get_query_param('yt');
if (param === '') {
    let cur = Date.now()
    let idx = 0;

    let actPL = playlist.filter((val) => {
        return (val.used);
    })

    while (idx < actPL.length && cur > actPL[idx].date) {
        idx++;
    }

    idx = idx - 1;
    if (idx < 0) idx = 0;

    param = actPL[idx].link;
}

yt_def_props.videoId = param;
document.querySelector('#goYtMainBtn').href = 'https://www.youtube.com/watch?v=' + yt_def_props.videoId;

param = 'anakq' //util_get_query_param('tw');
if (param !== '') tw_def_props.channel = param;
document.querySelector('#goTwMainBtn').href = 'https://www.twitch.tv/' + tw_def_props.channel;
document.querySelector('#chat_embed').src = 'https://www.twitch.tv/embed/' + param + '/chat?darkpopout&parent=himjune.github.io';

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
    console.log('onPlayerStateChange', event.data, event);

    let state = event.data;

    if (state == 1) {
        if (timingStats.curYtFix == 0)
            timingStats.curYtStart = Date.now();
            timingStats.curYtFix = yt_player.getCurrentTime() * 1000; // try compensate delay between pressing play-btn and starting playing video
    }
}
function onPlaybackQualityChange(event) {
    console.log('onPlaybackQualityChange', event);
}



function twSetVolume(volume) {
    volume = parseFloat(volume) / 100.0;
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

function startPlayers() {
    if (state.playing) {
        tw_player.pause();
        yt_player.pauseVideo();

        state.playing = false;
        timingStats.curYtFix = 0;
    } else {
        tw_player.play();
        yt_player.playVideo();

        state.playing = true;
        timingStats.curRunTime = Date.now();
    }
}

function startSyncing() {
    tw_player.setQuality("480p");
}

function handleTwQuality(isMinimised = false, forced = "") {
    if (forced !== "") {
        tw_player.setQuality(forced);
        return;
    }

    if (state.sub == 0) {
        if (isMinimised) tw_player.setQuality("160p");
        else tw_player.setQuality("480p");
    } else {
        tw_player.setQuality("720p");
    }
}

// Here everything should be in milliseconds
const timingStats = {
    extUTC: 0,
    extUTCts: 0,

    curRunTime: 0,
    
    curTwStart: 0,
    curTwPlaying: 0,
    curTwResult: 0,

    curYtStart: 0,
    curYtPlaying: 0,
    curYtFix: 0,

    curYtDelay: 0,
}

function tsString(ts) {
    let cDate = new Date(ts);
    return ts + ' { '+cDate.toUTCString()+' }'
}

function watchDog() {

    /* time update
    fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('gotUTC', data);
            timingStats.curUTC = data.unixtime;
        });
    */
    //let cdate = new Date(timingStats.curUTC * 1000);
    
    timingStats.extUTC = Date.now();
    timingStats.extUTCts = Date.now();
    timingStats.curYtPlaying = Math.floor(yt_player.getCurrentTime() * 1000);
    
    let curTwPlaying = Math.floor(tw_player.getCurrentTime() * 1000);
    if (curTwPlaying > 0) {
        if (curTwPlaying < timingStats.curTwPlaying || timingStats.curTwPlaying == 0)
            timingStats.curTwStart = Date.now();
        timingStats.curTwPlaying = curTwPlaying;
    }
    
    timingStats.curTwResult = timingStats.curTwStart + timingStats.curTwPlaying;


    document.querySelector('#statsUTC').innerText = tsString(timingStats.extUTC);
    document.querySelector('#statsManRun').innerText = tsString(timingStats.curRunTime);

    document.querySelector('#statsCTwS').innerText = tsString(timingStats.curTwStart);
    document.querySelector('#statsCTwP').innerText = timingStats.curTwPlaying;
    document.querySelector('#statsCTwR').innerText = tsString(timingStats.curTwResult);

    document.querySelector('#statsCYtS').innerText = tsString(timingStats.curYtStart);
    document.querySelector('#statsCYtP').innerText = timingStats.curYtPlaying;
    document.querySelector('#statsCYtF').innerText = timingStats.curYtFix;
    document.querySelector('#statsCYtR').innerText = tsString(timingStats.curYtPlaying-timingStats.curYtFix+timingStats.curYtStart);

}