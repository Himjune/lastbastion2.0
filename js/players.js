const tw_def_props = {
    width: 400,
    height: 300,
    channel: "fitzyhere",
    //channel: "himukee",
    layout: "video",
    theme: "dark",
    autoplay: true,
    parent: ["himjune.github.io"]
}

var tw_player = new Twitch.Player("twPlayer", tw_def_props);

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
