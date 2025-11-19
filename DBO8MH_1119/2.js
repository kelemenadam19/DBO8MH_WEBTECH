
$(document).ready(function () {

    $("#k1").click(function () {
        $("ul li:lt(2)").hide();
        $("#jqueryLink").hide();
    });


    $("#k2").click(function () {
        $("ul li:lt(2)").hide();
        $("#jqueryLink").hide();
        $(this).hide();
    });


    $("#k3").click(function () {
        $("h1").hide();
        $("ul li:lt(2)").hide();
        $("#jqueryLink").hide();
    });


    $("#k4").click(function () {
        $("ul li:lt(2)").hide();
        $("#jqueryLink").text("").hide();
    });

    $("#k5").click(function () {
        $("ul li:lt(2)").hide();
        $("#jqueryLink").hide();
        $("table tr:even").hide();
    });
});