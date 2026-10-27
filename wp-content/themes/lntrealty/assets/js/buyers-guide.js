
jQuery(function ($) {
    // console.log('projects-js');
    window.$ = window.$ || $;

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
        prevArrow: true,
        nextArrow: true,
        // arrows:false        
	};
    initSlickSlider("#sliderHeroBanner",options)
});


