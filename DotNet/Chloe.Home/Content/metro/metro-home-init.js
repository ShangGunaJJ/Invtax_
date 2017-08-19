(function ($) {
    $(function () {
        var menu_head = $('.side-menu h2.title').height();
        var item_height = $('.side-menu li a').height();
        // Untoggle menu on click outside of it
        $(document).mouseup(function (e) {
            var container = $('.side-menu');
            if ((!container.is(e.target) && container.has(e.target).length === 0) &&
               (!($('.menu-icon').is(e.target)) && $('a.menu-icon').has(e.target).length === 0)) {
                container.removeClass("in");
                $('body, .side-menu').removeClass("open");
                $('.side-menu li').css("top", "100%");
                $('.side-menu h2').css("top", "-60px");
            }
            if (!$('.side-menu, body').hasClass('open') && $(".menu-icon").is(":hidden")) {
                $(".menu-icon").show();
                hiddenScrollBar(true);
            }
        });
        //$('.side-menu').hover(function () {
        //    hiddenScrollBar(true);
        //}, function () {
        //    hiddenScrollBar(false);
        //});
        function hiddenScrollBar(stat) {
            stat = stat ? "auto" : "hidden";
            $('body').css('overflow', stat);
        }
        $(".menu-icon").hover(function (e) {
            $(this).stop(true).animate({ "margin-left": 0 }, 200);
        }, function () {
            $(this).stop(true).animate({ "margin-left": -40 }, 200);
        });
        $(".menu-icon").click(function (e) {
            e.preventDefault();
            if ($('.side-menu, body').hasClass('open')) {
                $('.side-menu,body').removeClass('open');

                // Reset menu on close
                $('.side-menu li').css("top", "100%");
                $('.side-menu h2').css("top", "-60px");
            }
            else {
                $('.side-menu,body').addClass('open');
                hiddenScrollBar(false);

                $('.side-menu h2').css("top", 0);
                $('.side-menu li').each(function () {
                    // Traditional Effect
                    if ($(this).hasClass('link')) {
                        var i = ($(this).index() - 1)
                        var fromTop = menu_head + (i * item_height);
                        var delayTime = 100 * i;
                        $(this).delay(delayTime).queue(function () {
                            $(this).css("top", fromTop);
                            $(this).dequeue();
                        });
                    }
                        // Metro Effect
                    else if ($(this).hasClass('metro')) {
                        var row_i = ($(this).parent().parent().index() - 1); // Vertical Index
                        var col_i = $(this).index(); // Horizontal Index
                        var fromTop = menu_head + (row_i * 125);
                        var fromLeft = col_i * 125;
                        var delayTime = (row_i * 200) + Math.floor((Math.random() * 200) + 1);
                        $(this).css("left", fromLeft);
                        $(this).delay(delayTime).queue(function () {
                            $(this).css("top", fromTop);
                            $(this).dequeue();
                        });
                    }
                });
                $(".menu-icon").hide();
            }
        });
    });
})(jQuery);