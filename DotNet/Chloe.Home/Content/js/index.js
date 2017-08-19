
/* jQuery Pre loader
 -----------------------------------------------*/
$(window).load(function () {
    $("#github-star").attr("src", "http://ghbtns.com/github-btn.html?user=shuxinqin&repo=Chloe&type=watch&count=true");
    $("#github-fork").attr("src", "http://ghbtns.com/github-btn.html?user=shuxinqin&repo=Chloe&type=fork&count=true");
});


$(document).ready(function () {
    $('.preloader').fadeOut(1000); // set duration in brackets    
    var slides = [];

    var images = $("#slide-images").find("span");
    for (var i = 0; i < images.length; i++) {
        var span = images[i];
        slides.push({ src: $(span).text() });
    }

    if (slides.length > 0) {
        $(function () {
            $('body').vegas({
                slides: slides,
                timer: false,
                transition: ['zoomOut', ]
            });
        });
    }

    new WOW({ mobile: false }).init();
});

