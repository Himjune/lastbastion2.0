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


var embed = new Twitch.Embed("ytContainer", {
    width: 854,
    height: 480,
    channel: "pavelbratok",
    layout: "video",
    autoplay: true,
    // only needed if your site is also embedded on embed.example.com and othersite.example.com 
    parent: ["himjune.github.io"]
  });

  embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
    var player = embed.getPlayer();
    player.play();
  });