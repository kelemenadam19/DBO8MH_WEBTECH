
$(document).ready(function() {
    $('a[href^="#"]').on('click', function(event) {
        event.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });

    $('[data-bs-toggle="tooltip"]').tooltip();

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.navbar').addClass('navbar-shadow');
        } else {
            $('.navbar').removeClass('navbar-shadow');
        }
    });

    $('.fade-in').each(function(i) {
        $(this).delay(i * 200).animate({opacity: 1}, 800);
    });
});
//AJAX kérés
function makeAjaxCall(url, method, data, successCallback, errorCallback) {
    $.ajax({
        url: url,
        method: method,
        data: method === 'GET' ? data : JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        success: successCallback,
        error: errorCallback || function(xhr, status, error) {
            console.error('AJAX Error:', error);
            alert('Hiba történt: ' + error);
        }
    });
}