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

var yt_player;
function onYouTubeIframeAPIReady() {
  let videoId = 'Qpdd6OrPFAM';

  yt_player = new YT.Player('ytContainer', {
    height: '360',
    width: '640',
    playerVars: { 'autoplay': 1, 'controls': 0, 'playsinline': 1 },
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
    yt_player.setVolume(10);
    yt_player.playVideo();
    console.log('GOgoGo');
}
function onPlayerStateChange(event) {
    // OnPlay
    if (event.data == 1) {
      play_spd_def = 3;
      if (yt_player.getPlaybackRate() !== 1) yt_player.setPlaybackRate(1);
      console.log('onP f_ts:', fixed_end_time_ts, 'f:', fixed_end_time, 'ce:', cur_end_time, 'yt:', yt_player.getCurrentTime());
      if (!is_replay && 
          (fixed_end_time_ts === null || 
            (yt_player.getCurrentTime() > ((fixed_end_time - fixed_end_time_ts) + Date.now() / 1000))
          )
        ) {
        save_fix_end_time();
      }
    }
  }