const tw_def_props = {
    width: 320,
    height: 180,
    channel: "wes_and_flynn",
    //channel: "himukee",
    layout: "video",
    theme: "dark",
    autoplay: true,
    controls: false
}

var tw_player = new Twitch.Player("twPlayer", tw_def_props);

tw_player.addEventListener(Twitch.Player.READY, () => {
    tw_player.setVolume(1.0);
    tw_player.setMuted(false);
    tw_player.play();
});