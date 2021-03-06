const TW_CODE = 0;
const YT_CODE = 1;

const playerState = {
    playing: false,

    tw_is_ready: false,
    yt_is_ready: false,

    tw_is_online: true,

    watchDogInt: 0,
}
const WDOG_INT = 500;

function tryReadyPlayers() {
    if (playerState.yt_is_ready && playerState.tw_is_ready) {
        playersAreReadyNow();
        playerState.watchDogInt = setInterval(watchDog, WDOG_INT);
    }
}

const tw_def_props = {
    width: 400,
    height: 300,
    channel: "",
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
    videoId: '',
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

// get YT link
let param = '';
if (param === '') param = util_get_query_param('yt');
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

// get TW link
param = '';
if (param === '') param = util_get_query_param('tw');
if (param === '') param = 'outbreak';
tw_def_props.channel = param;
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

    playerState.tw_is_ready = true;
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
tw_player.addEventListener(Twitch.Player.ONLINE, () => {
    console.log('ONLINE');
    playerState.tw_is_online = true;
    tw_player.pause();
    tw_player.play();
    maxTwOnline();
});
tw_player.addEventListener(Twitch.Player.OFFLINE, () => {
    playerState.tw_is_online = false;
    console.log('OFFLINE', playerState.tw_is_online);
    minTwOffline();
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

    playerState.yt_is_ready = true;
    tryReadyPlayers();
}
function onPlayerStateChange(event) {
    console.log('onPlayerStateChange', event.data, event);

    let ytPlayerState = event.data;

    if (ytPlayerState == 1) {
        if (timingStats.ytPlayerTimeFixed == 0)
            timingStats.ytStartTS = Date.now();
        timingStats.ytPlayerTimeFixed = Math.floor(yt_player.getCurrentTime() * 1000);
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
    if (playerState.playing) {
        tw_player.pause();
        yt_player.pauseVideo();

        playerState.playing = false;
        timingStats.ytPlayerTimeFixed = 0;
        timingStats.twStartTS = 0
    } else {
        tw_player.play();
        yt_player.playVideo();

        playerState.playing = true;
        timingStats.pressPlayTS = Date.now();
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

    if (uiState.curSubPosition.sub == 0) {
        if (isMinimised) tw_player.setQuality("160p");
        else tw_player.setQuality("480p");
    } else {
        tw_player.setQuality("720p");
    }
}

// Here everything should be in milliseconds
const timingStats = {
    locUTC: 0,
    locUTCts: 0,
    locUTCdiff: 0,

    netUTC: 0,
    netUTCts: 0,
    netUTCreq: 0,
    netUTCdiff: 0,
    corUTC: 0,

    pressPlayTS: 0,

    twStartTS: 0,
    twPlayingDuration: 0,
    twPlayTimeTS: 0,

    ytStartTS: 0,
    ytPlayerTime: 0,
    ytPlayerTimeFixed: 0,

    ytDelay: 0,
    ytTarget: 0,

    isStable: false,
    tarTW: 0,
    tarYT: 0,
}

function updateYtDelay(diff) {
    timingStats.ytDelay += diff * 1000;
    return timingStats.ytDelay / 1000;
}

function tsString(ts) {
    let cDate = new Date(ts);
    return ts + ' { ' + cDate.toUTCString() + ' }'
}

function handleSync() {
    //let cdate = new Date(timingStats.curUTC * 1000);

    timingStats.locUTC = Date.now();
    timingStats.locUTCts = Date.now();
    timingStats.ytPlayerTime = Math.floor(yt_player.getCurrentTime() * 1000);
    if (timingStats.ytTarget == 0) timingStats.ytTarget = timingStats.ytPlayerTime;

    let twPlayingDuration = Math.floor(tw_player.getCurrentTime() * 1000);
    if (twPlayingDuration > 0) {
        if (timingStats.twStartTS == 0)
            timingStats.twStartTS = timingStats.netUTC - twPlayingDuration;
        timingStats.twPlayingDuration = twPlayingDuration;
    }

    timingStats.twPlayTimeTS = timingStats.twStartTS + timingStats.twPlayingDuration;

    // initialYtPlayerTime + (diff between curTwTime and ytStart = how much tw played) + delay
    timingStats.ytTarget = timingStats.ytPlayerTimeFixed + timingStats.twPlayTimeTS - timingStats.ytStartTS + timingStats.ytDelay;


    /*
        Managing YouTube Playback
    */

    const DELAY_THRESHOLD = 750; // ms
    const HUGE_DIFF = 60000;
    const BIG_DIFF = 2000;

    let targetDiff = timingStats.ytPlayerTime - timingStats.ytTarget;
    let targetDiffAbs = Math.abs(targetDiff);

    if (targetDiffAbs < DELAY_THRESHOLD || !playerState.tw_is_online) {
        yt_player.setPlaybackRate(1);
        if (!timingStats.isStable) {
            timingStats.isStable = true;
            timingStats.tarTW = timingStats.twPlayTimeTS;
            timingStats.tarYT = timingStats.ytPlayerTime;
        }
    } else {
        timingStats.isStable = false;
        // need to speed up
        if (timingStats.ytPlayerTime < timingStats.ytTarget) {
            //console.log('speedUp');
            if (targetDiffAbs > HUGE_DIFF) {
                //console.log('seekToFast');
                yt_player.seekTo(Math.floor(timingStats.ytTarget / 1000), true);
            } else if (targetDiffAbs > BIG_DIFF) {
                //console.log('veryToFast');
                yt_player.setPlaybackRate(2);
            } else {
                //console.log('slowToFast');
                yt_player.setPlaybackRate(1.5);
            }
        } else {    // need to slow down
            //console.log('slowDown');
            if (targetDiffAbs > HUGE_DIFF) {
                //console.log('seekToBack');
                yt_player.seekTo(Math.floor(timingStats.ytTarget / 1000), true);
            } else if (targetDiffAbs > BIG_DIFF) {
                //console.log('fastToBack');
                yt_player.setPlaybackRate(0.25);
            } else {
                //console.log('slowToBack');
                yt_player.setPlaybackRate(0.5);
            }
        }
    }
}

var extTimings = {
    "is_valid": false,
    "tw_timing": 0,
    "yt_timing": 0
}

function watchDog() {

    /* time update
    */
    let reqHeaders = new Headers();
    reqHeaders.append('pragma', 'no-cache');
    reqHeaders.append('cache-control', 'no-store');

    let reqCfg = {
        method: 'GET',
        headers: reqHeaders,
    };

    let reqURL = new Request('https://himjune.github.io/lastbastion2.0/api/timings.json');

    timingStats.netUTCreq = Date.now();
    fetch(reqURL, reqCfg)
        .then((response) => {
            return { date: response.headers.get('date'), body: response.json() };
        })
        .then((resp) => {
            extTimings = resp.body;
                                                       // Tue, 25 Aug 2020 16:03:35 GMT
            timingStats.netUTC = Date.parse(resp.date.split(', ')[1]);
            timingStats.netUTCts = Date.now();

            timingStats.netUTCdiff = timingStats.netUTCts - timingStats.netUTCreq;
            timingStats.locUTCdiff = timingStats.locUTC - timingStats.netUTC;

            timingStats.corUTC = timingStats.netUTC - Math.floor(timingStats.netUTCdiff / 2);
            if (playerState.playing) handleSync();
        });

    setTimeout(updateTimeStats, 50);
}

function updateTimeStats() {
    let targetDiff = timingStats.ytPlayerTime - timingStats.ytTarget;

    document.querySelector('#statsNetUTC').innerText = tsString(timingStats.netUTC);
    document.querySelector('#statsNetUTCts').innerText = tsString(timingStats.netUTCts);
    document.querySelector('#statsNetUTCreq').innerText = tsString(timingStats.netUTCreq) + ' | diff: ' + timingStats.netUTCdiff;

    document.querySelector('#statsUTC').innerText = tsString(timingStats.locUTC) + ' | diff: ' + timingStats.locUTCdiff;;
    document.querySelector('#statsManRun').innerText = tsString(timingStats.pressPlayTS);

    document.querySelector('#statsCTwS').innerText = tsString(timingStats.twStartTS);
    document.querySelector('#statsCTwP').innerText = timingStats.twPlayingDuration + '{' + Math.floor(timingStats.twPlayingDuration / 60000) + 'm' + Math.floor(timingStats.twPlayingDuration / 1000) + 's' + '}';
    document.querySelector('#statsCTwR').innerText = tsString(timingStats.twPlayTimeTS);

    document.querySelector('#statsCYtS').innerText = tsString(timingStats.ytStartTS);
    document.querySelector('#statsCYtP').innerText = timingStats.ytPlayerTime;
    document.querySelector('#statsCYtF').innerText = timingStats.ytPlayerTimeFixed;
    document.querySelector('#statsCYtR').innerText = tsString(timingStats.ytPlayerTime - timingStats.ytPlayerTimeFixed + timingStats.ytStartTS);

    document.querySelector('#statsCYtTR').innerText = tsString(timingStats.ytTarget - timingStats.ytPlayerTimeFixed + timingStats.ytStartTS);
    document.querySelector('#statsCYtT').innerText = yt_player.getPlaybackRate() + ' | yPlay:' + timingStats.ytPlayerTime + ' / yTar:' + timingStats.ytTarget + '{' + targetDiff + '}';

    document.querySelector('#statsTargets').innerText = ' | tw: ' + tsString(timingStats.tarTW) + ' | yt: ' + timingStats.tarYT;
}