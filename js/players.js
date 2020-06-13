const state = {
    sub: 0,             // 0 - tw and 1 - yt
    tw_quality: "",
    yt_quality: ""
}

const tw_def_props = {
    width: 400,
    height: 300,
    channel: "himukee",
    //channel: "himukee",
    layout: "video",
    theme: "dark",
    autoplay: true,
    parent: ["himjune.github.io"]
}

const yt_def_props = {
    height: '360',
    width: '640',
    playerVars: { 'autoplay': 1, 'controls': 0, 'playsinline': 1 },
    videoId: 'Qpdd6OrPFAM',
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
    }
}

var yt_player;
var tw_player = new Twitch.Player('twContainer', tw_def_props);

tw_player.addEventListener(Twitch.Player.READY, () => {
    tw_player.setVolume(1.0);
    tw_player.setMuted(false);
    tw_player.play();
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
    yt_player.setVolume(10);
    yt_player.playVideo();
    console.log('GOgoGo');
}
function onPlayerStateChange(event) {
}