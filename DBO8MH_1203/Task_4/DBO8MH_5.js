$(document).ready(function () {
    $("#btn-add-text").click(function () {
        $("#doboz5").append("<br>Programtervező informatikus");
    });

    $("#btn-add-pti").click(function () {
        $("#doboz5").append("<br><button>PTI MI Gomb</button>");
    });

    $("#btn-new-btn").click(function () {
        $("<button>ME GEIK-PTI</button>").insertAfter("#forras");
    });

    $("#btn-header").click(function () {
        $("body").prepend("<h1>jQuery feladat</h1>");
    });

    $("#btn-subheader").click(function () {
        $("h1").after("<h3>HTML Add elements</h3>");
    });

    $("#btn-form-header").click(function () {
        $("form").before("<h2>ŰRLAP-DBO8MH</h2>");
    });

    $("#btn-remove-box").click(function () {
        $("#doboz5").remove();
    });

    $("#btn-empty-box").click(function () {
        $("#doboz5").empty();
    });
});