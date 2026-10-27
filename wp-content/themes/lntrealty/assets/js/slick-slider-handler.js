(function( $ ) {
    'use strict';
    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    window.initSlickSlider = function (e, t = { rows: 1, slidesToShow: 3, slidesToScroll: 3, slidesPerRow: 1 }) {
        $(window).width(), $(window).height();
        console.log(e, t);
        var n = Object.assign(
            {
                dots: !1,
                infinite: !0,
                speed: 500,
                autoplay: !1,
                autoplaySpeed: 2e3,
                rows: 1,
                slidesPerRow: 1,
                slidesToShow: 3,
                slidesToScroll: 3,
                centerMode: !1,
                prevArrow:
                    '<button type="button" data-role="none" class="slick-prev gallery-prev slick-arrow" aria-label="Previous" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="24.102" height="36" viewBox="0 0 24.102 36"><defs><style>.a{fill:#f4c633;}</style></defs><g transform="translate(1577.558 372.198) rotate(180)"><path class="a" d="M0,0,24.1,17.826,0,36Z" transform="translate(1553.456 336.198)"/></g></svg></button>',
                nextArrow:
                    '<button type="button" data-role="none" class="slick-next gallery-next slick-arrow" aria-label="Next" role="button"><svg xmlns="http://www.w3.org/2000/svg" width="24.102" height="36" viewBox="0 0 24.102 36"><defs><style>.a{fill:#f4c633;}</style></defs><g transform="translate(-1553.456 -336.198)"><path class="a" d="M0,0,24.1,17.826,0,36Z" transform="translate(1553.456 336.198)"/></g></svg></button>',
            },
            t
        );
        t.onInit &&
            $(e).on("init", function (e) {
                setTimeout(function () {
                    t.onInit.call(this, e, i && i.length ? i[0] : i);
                }, 500);
            });
        let i = $(".gallery-responsive", e).slick(n);
        return (
            t.onClick &&
                jQuery(".slick-slide", e).on("click", function (e) {
                    t.onClick.call(this, e, i && i.length ? i[0] : null);
                }),
            t.onBeforeChange && i.on("beforeChange", t.onBeforeChange),
            t.onAfterChange && i.on("afterChange", t.onAfterChange),
            i
        );
    }

    window.onYouTubeIframeAPIReady = function() {
        if($("#splayer").length) {
            var player;
            player = new YT.Player('splayer', {
                width: '100%',
                videoId: $("#splayer").data("video_id") + '?start='+$("#splayer").data("start")+'&loop=1&playlist=hGSqk5Gnk0w&end=0?HD=1;rel=0',
                playerVars: { 'autoplay': 1, 'playsinline': 1 },
                events: {
                    'onReady': onPlayerReady
                }
            });
        }
        if($("#projects-player").length) {
            var player;
            player = new YT.Player('projects-player', {
                width: '100%',
                videoId: $("#projects-player").data("video_id") + '?start='+$("#projects-player").data("start")+'&end=0',
                playerVars: {
                    'autoplay': 1,
                    'rel': 0,
                    'loop': 1,
                    'playsinline': 1
                },
                events: {
                    'onReady': onPlayerReady
                }
            });
        }
    }

    // 4. The API will call this function when the video player is ready.
    window.onPlayerReady = function(event) {
        event.target.mute();
        setTimeout(function() {
            event.target.playVideo();
        }, 9000)
    }

    $(document).ready(function() {
        if($("#experience-corner").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;

            var w = $(window).width();
        	var h = $(window).height();
        	// initialize Slider Gallery, if page has it
        	var options = {
                slidesToShow: w <= 992 ? 2 : w<= 1200 ? 3 : 3,
                slidesToScroll: w <= 992 ? 2 : w<= 1200 ? 3 : 4,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
        	};
            // $("#experience-corner .gallery-responsive").slick(options);
            initSlickSlider("#experience-corner", options);
        }
        if($("#project-awards").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                slidesToShow: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                slidesToScroll: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
            };
            initSlickSlider("#project-awards", options);
        }
        if($("#lineage").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                lazyLoad: 'ondemand',
                slidesToShow: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                slidesToScroll: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
            };
            initSlickSlider("#lineage", options);
        }
        if($("#commercial-benefits").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;

            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                slidesToShow: w <= 600 ? 1 : w <= 1200 ? 2 : 4,
                slidesToScroll: w <= 600 ? 1 : w <= 1200 ? 2 : 4,
                rows: 1,
                slidesPerRow: 1,
                dots: true,
            };
            initSlickSlider("#commercial-benefits", options);
        }

        if($("#sliderHeroBanner").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            // initialize all the pages which has slider-hero banner
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
                autoplay: true,
                autoplaySpeed: 3000,
                prevArrow: "",
                nextArrow: "",
                // arrows:false
            };
            initSlickSlider("#sliderHeroBanner", options);
        }

        if($("#titledHeroBanner").length > 0) {
            var options = {
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
                autoplay: true,
                autoplaySpeed: 3000,
                prevArrow: "",
                nextArrow: "",
            };

            initSlickSlider("#titledHeroBanner", options);
        }
        if($("#overview").length > 0) {
            var options = {
                slidesToShow: 1,
                slidesToScroll: 1,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
                autoplay: true,
                autoplaySpeed: 3000,
                prevArrow: "",
                nextArrow: "",
            };
            initSlickSlider("#overview", options);
        }
        if($("#feature-gallery").length > 0) {
            var options = {
                slidesToShow: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                slidesToScroll: w <= 600 ? 1 : w<= 1200 ? 2 : 3,
                rows: 2,
                slidesPerRow: 1,
                dots:true,
            };
            initSlickSlider('#feature-gallery',options);
        }
        if($("#testimonials").length > 0) {
            var options = {
                slidesToShow: w <= 600 ? 1 : w<= 992 ? 1 : 2,
                slidesToScroll: w <= 600 ? 1 : w<= 992 ? 1 : 2,
                rows: 1,
                slidesPerRow: 1,
                dots:true,
            };
            initSlickSlider("#testimonials",options);
        }
        if($("#residential-portfolio-slider").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                lazyLoad: 'ondemand',
                infinite: true,
                slidesToShow: w <= 600 ? 1 : w<= 992 ? 1 : 3,
                slidesToScroll: w <= 600 ? 1 : w<= 992 ? 1 : 3,
                dots: false,
                autoplay: false,
                infinite: true,
            };
            initSlickSlider("#residential-portfolio-slider", options);
        }
        if($("#discover-projects-slider").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                lazyLoad: 'ondemand',
                infinite: true,
                slidesToShow: w <= 600 ? 1 : w<= 992 ? 1 : 3,
                slidesToScroll: w <= 600 ? 1 : w<= 992 ? 1 : 3,
                dots: false,
                autoplay: false,
                infinite: true,
            };
            initSlickSlider("#discover-projects-slider", options);
        }
        if($(".overview_img_slider").length > 0) {
            var templateUrl = lntGlobal.templateUrl;
            var assetsUrl = lntGlobal.assetsUrl;
            var imagesUrl = lntGlobal.imagesUrl;
            var w = $(window).width();
            var h = $(window).height();
            // initialize Slider Gallery, if page has it
            var options = {
                lazyLoad: 'ondemand',
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: false,
                autoplay: true,
                infinite: true,
            };
            initSlickSlider(".overview_img_slider", options);
        }
        $(".multi-pdf-btn").click(function(e) {
            var pdfUrl = $(this).data("pdf");
            $("#myDownloadModal #retURL").val(pdfUrl);
            console.log(pdfUrl);
            $("#myDownloadModal").css("display", "block");
        });
        if($("#myDownloadModal").length > 0) {
            var modal = document.getElementById("myDownloadModal");
            $("#myDownloadBtn").click(function(e) {
                $("#myDownloadModal").css("display", "block");
            });
            $("#myDownloadModal .close").click(function() {
                $("#myDownloadModal").css("display", "none");
            })
            $(window).click(function(e) {
                if (e.target == modal) {
                    modal.style.display = "none";
                }
            });
        }
        window.is_popup_display = true;
        $("#campaign_form").show();
        window.is_popup_display = false;

        var menu = new MmenuLight(
            document.querySelector('#mMenu'),
            'all'
        );
        if(window.location.pathname.indexOf("residences/luxury-2-3-4-bhk-flats-in-elixir-reserve-powai-mumbai") > -1) {
            var tmpHTML = $($(".slider-gallery-item")[1]).html();
            tmpHTML = "<a href='https://amnaikschool.in/' target='_blank'>" + tmpHTML + "</a>";
            $($(".slider-gallery-item")[1]).html(tmpHTML);
        }
        if(window.location.pathname.indexOf("residences/luxury-2-3-4-bhk-flats-in-powai-emerald-isle-powai-mumbai") > -1) {
            var tmpHTML = $($(".slider-gallery-item")[1]).html();
            tmpHTML = "<a href='https://amnaikschool.in/' target='_blank'>" + tmpHTML + "</a>";
            $($(".slider-gallery-item")[1]).html(tmpHTML);
        }
        var navigator = menu.navigation({});
        var drawer = menu.offcanvas({});
        document.querySelector('a[href="#mMenu"]').addEventListener('click', evnt => {
            evnt.preventDefault();
            drawer.open();
        });

        jQuery('.dropdown-menu').mouseenter(function() {
            jQuery(this).parent('li').addClass('open');
        });
        jQuery('.dropdown-menu').mouseleave(function() {
            jQuery(this).parent('li').removeClass('open');
        });
        jQuery('.dropdown a.dropdown-toggle').click(
            function() {
                var ahref = this.href;
                console.log(ahref);
                location.href = ahref;
            }
        );

        if( jQuery("#events-owl-demo").length > 0) {
            var owl = jQuery("#events-owl-demo");
            owl.owlCarousel({
                itemsCustom : [[0, 1], [400, 1], [1023, 2], [1024, 3], [1600, 3] ],
                navigation : false, pagination : false, autoPlay :true,
            });

            var owl = jQuery("#events-owl-demo");
            owl.owlCarousel();
            jQuery(".next").click(function(){owl.trigger('owl.next'); })
            jQuery(".prev").click(function(){owl.trigger('owl.prev'); })

            var owl = jQuery("#testimonials-owl-demo");
            owl.owlCarousel({
                itemsCustom : [[0, 1], [400, 1], [1023, 2], [1024, 3], [1600, 2] ],
                navigation : false, pagination : false, autoPlay :true,
            });

            var owl = jQuery("#testimonials-owl-demo");
            owl.owlCarousel();
            jQuery(".next").click(function(){owl.trigger('owl.next'); })
            jQuery(".prev").click(function(){owl.trigger('owl.prev'); })
        }
     });
})( jQuery );
