$(document).ready(function () {
    $("#btn-anim").click(function () {
        let box = $("#doboz");
        box.animate({ left: '+=300px', width: '+=100px', fontSize: '30pt' }, 1000)
            .animate({ top: '+=200px', width: '-=100px', height: '+=10%' }, 1000)
            .animate({ left: '-=300px', opacity: '0.4' }, 1000)
            .animate({ top: '-=200px', opacity: '1', fontSize: '12pt' }, 1000, function () {
                alert("VÉGE");
            });
    });

    $("#btn-hide").click(function () {
        $("p").hide();
        $("#doboz").insertBefore("p:first");
        alert("Bekezdések elrejtése");
    });

    $("#btn-toggle").click(function () {
        $("#doboz").slideToggle("slow");
    });
});