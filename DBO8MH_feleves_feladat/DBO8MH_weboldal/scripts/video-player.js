

class VideoPlayer {
    constructor(videoId) {
        this.video = document.getElementById(videoId);
        this.setupControls();
    }
   //metódus eseménykezelőket rendel a különböző gombokhoz
    setupControls() {
        $('#playBtn').click(() => {
            if (this.video.paused) {
                this.video.play();
                $('#playBtn').html('<i class="fas fa-pause"></i> Szünet');
            } else {
                this.video.pause();
                $('#playBtn').html('<i class="fas fa-play"></i> Lejátszás');
            }
        });
        $('#stopBtn').click(() => {
            this.video.pause();
            this.video.currentTime = 0;
            $('#playBtn').html('<i class="fas fa-play"></i> Lejátszás');
        });

        $('#volumeUp').click(() => {
            if (this.video.volume < 1) {
                this.video.volume = Math.min(1, this.video.volume + 0.1);
            }
        });

        $('#volumeDown').click(() => {
            if (this.video.volume > 0) {
                this.video.volume = Math.max(0, this.video.volume - 0.1);
            }
        });

        $('#fullscreenBtn').click(() => {
            if (this.video.requestFullscreen) {
                this.video.requestFullscreen();
            } else if (this.video.webkitRequestFullscreen) {
                this.video.webkitRequestFullscreen();
            } else if (this.video.mozRequestFullScreen) {
                this.video.mozRequestFullScreen();
            }
        });
        this.video.addEventListener('timeupdate', () => {
            const progress = (this.video.currentTime / this.video.duration) * 100;
            $('#progressBar').css('width', progress + '%');
        });
        this.video.addEventListener('ended', () => {
            $('#playBtn').html('<i class="fas fa-play"></i> Lejátszás');
        });
    }
}
$(document).ready(function() {
    const player = new VideoPlayer('carVideo');
    $('#rewindBtn').click(function() {
        const video = document.getElementById('carVideo');
        video.currentTime = Math.max(0, video.currentTime - 10);
    });

    $('#forwardBtn').click(function() {
        const video = document.getElementById('carVideo');
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
    });

    $('#carVideo').on('loadeddata', function() {
        $('#videoLoading').fadeOut(300, function() {
            $('#videoControls').fadeIn(300);
        });
    });
});