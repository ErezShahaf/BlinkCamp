"use strict";
let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('videoplayer', {
        height: '100%',
        width: '100%',
        videoId: 'VN_zjPYSGjo',
        playerVars: {
            autoplay: 1,
            controls: 0,
            showinfo: 0,
            modestbranding: 1,
            loop: 0,
            fs: 0,
            cc_load_policy: 0,
            iv_load_policy: 3,
            autohide: 1,
            start: 210,
            mute: 1,
            border: 0
        }
    });
}
