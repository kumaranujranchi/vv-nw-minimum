
jQuery(function ($) {
    // console.log('projects-js');
    window.$ = window.$ || $;

    var templateUrl = lntGlobal.templateUrl;
    var assetsUrl = lntGlobal.assetsUrl;
    var imagesUrl = lntGlobal.imagesUrl;
    
    addMapMarkersByType(); //show all


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



function  addMapMarkersByType(type="") {
    
    var templateUrl = lntGlobal.templateUrl;
    var assetsUrl = lntGlobal.assetsUrl;
    var imagesUrl = lntGlobal.imagesUrl;

    var iconBase = imagesUrl;
    var icons = {
        office: {
            icon: iconBase + '/marker-blue.png'
        },
        home: {
            icon: iconBase + '/marker-yellow.png'
        },
    };

    var data = getMapLocations();
    drawMapMarkers(type,data,icons);
}

function getMapLocations() {

    var data = [{
            name: 'L&T Realty REJUVE 360',
            info: {
                title: 'REJUVE 360, Mulund West',
                desc: 'L&T Realty Rejuve 360, Sales Gallery, 706-B, L.B.S. Road, Opp. PVR Cinemas, Mulund West, Mumbai – 400080, India.',
                link: 'https://www.lntrealty.com/residences/flats-in-mulund-mumbai-rejuve360/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-rejuve360.webp"
            },
            type: 'home',
            position: {
                lat: 19.16516,
                lng: 72.93917
            },
        },
        {
            name: '77 Crossroads, on EEH, Mumbai',
            info: {
                title: '77 Crossroads, on EEH, Mumbai',
                desc: 'L&amp;T Realty 77 CROSSROADS, Eastern Express Highway, Near Ghatkopar Jeejaabai Flyover, Ghatkopar East, Mumbai - 400 077, India.',
                link: 'https://www.lntrealty.com/residences/77-crossroads-flats-in-mumbai/',
                cta: 'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-77-crossroads.webp"
            },
            type: 'home',
            position: {
                lat: 19.072720088291014,
                lng: 72.91212500510926
            },
        },
        {
            name: 'Avinya Enclave, Chennai, Tamil Nadu',
            info: {
                title: 'Avinya Enclave, Chennai, Tamil Nadu',
                desc: 'L&amp;T Realty Avinya Enclave Sales Office, Opp. L&amp;T Construction Campus, Mount Poonamallee Road, Manapakkam, Chennai, Tamil Nadu - 600089, India.',
                link: 'https://www.lntrealty.com/residences/avinya-enclave-2-3-4-bhk-flats-in-manapakkam-chennai/',
                cta: 'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-avinya-enclave.webp"
            },
            type: 'home',
            position: {
                lat: 13.024,
                lng: 80.18
            },
        },
        {
            name: 'Seawoods Residences',
            info: {
                title: 'Seawoods Residences, Navi Mumbai',
                desc: 'Seawoods Residences Sales Office, Plot No. R-1, Sector 40, Seawoods Railway Station, Nerul, Navi Mumbai – 400706, India.',
                link: 'https://www.lntrealty.com/residences/2-3-bhk-flats-in-seawoods-navi-mumbai/',
                cta: 'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-seawoods-residences.webp"
            },
            type: 'home',
            position: {
                lat: 19.0213686,
                lng: 73.0161659
            },
        },
        {
            name: 'Emerald Isle',
            info: {
                title: 'Emerald Isle, Powai',
                desc: 'Emerald Isle Sales Center, L&T Business Park, Tower A, Gate No. 5, Off JVLR, Saki Vihar Road, Powai, Mumbai, India.',
                link: 'https://www.lntrealty.com/residences/luxury-2-3-4-bhk-flats-in-powai-emerald-isle-powai-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-emerald-isle.webp"
            },
            type: 'home',
            position: {
                lat: 19.1244732,
                lng: 72.8913391
            },
        },
        {
            name: 'Elixir Reserve, Powai, Mumbai',
            info: {
                title: 'Elixir Reserve, Powai, Mumbai',
                desc: 'L&amp;T Realty Elixir Reserve Sales Gallery, Ground Floor, A.M.Naik Tower, L&amp;T Campus, Gate No. 3, Jogeshwari - Vikhroli Link Rd, Powai, Mumbai - 400072, India.',
                link: 'https://www.lntrealty.com/residences/luxury-2-3-4-bhk-flats-in-elixir-reserve-powai-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-elixir-reserve.webp"
            },
            type: 'home',
            position: {
                lat: 19.126116550836223,
                lng: 72.89270841072945
            },
        },
        {
            name: 'Crescent Bay',
            info: {
                title: 'Crescent Bay, Parel, Mumbai',
                desc: 'Crescent Bay Sales Office, Jerbai Wadia Road, Near Mahatma Phule Education Society, Bhoiwada Parel, Mumbai, India.',
                link: 'https://www.lntrealty.com/residences/luxury-2-3-4-bhk-flats-in-parel-crescent-bay-parel-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-crescentbay.webp"
            },
            type: 'home',
            position: {
                lat: 19.0046048,
                lng: 72.8471799
            },
        },
        {
            name: 'Vihaan, Vadodara, Gujarat',
            info: {
                title: 'Vihaan, Vadodara, Gujarat',
                desc: 'L&amp;T Realty Vihaan F. P. NO. 131/P, Plot No. 1 &amp; 2, T.P.S NO. 13, Phulwadi, Chhani Jakatnaka, Vadodara - 391740, India.',
                link: 'https://www.lntrealty.com/residences/luxury-2-3-4-bhk-flats-in-parel-crescent-bay-parel-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-vihaan.webp"
            },
            type: 'home',
            position: {
                lat: 22.343301763465977,
                lng: 73.17527110160643
            },
        },
        {
            name: 'Raintree Boulevard',
            info: {
                title: 'Raintree Boulevard, Hebbal, Bengaluru',
                desc: 'Raintree Boulevard Sales Office, Bellary Road, Byatarayanapura, Bengaluru, Karnataka – 560092, India.',
                link: 'https://www.lntrealty.com/residences/flats-in-hebbal-raintree-boulevard-bengaluru/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-home-raintree-boulevard-bengaluru.webp"
            },
            type: 'home',
            position: {
                lat: 13.080841,
                lng: 77.598233
            },

        },
        {
            name: 'L&T Technology Center IV',
            info: {
                title: 'L&T Technology Center IV, Powai, Mumbai',
                desc: 'L&T Technology Center, Next to L&T Business Park, Off JVLR, Saki Vihar Road, Powai, Mumbai, India.',
                link: 'https://www.lntrealty.com/offices/lt-technology-center-iv-powai-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-technology-iv-powai.webp"
            },
            type: 'office',
            position: {
                lat: 19.125284,
                lng: 72.891972
            },

        },
        {
            name: 'L&amp;T Business Towers - Powai (W), Mumbai',
            info: {
                title: 'L&amp;T Business Towers - Powai (W), Mumbai',
                desc: 'L&amp;T Business Towers, Gate No. 3, L&amp;T Powai Campus, Saki Vihar Road, Powai, Mumbai, India.',
                link: 'https://www.lntrealty.com/offices/lt-business-towers-powai-w/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-business-towers-powai.webp"
            },
            type: 'office',
            position: {
                lat: 19.124080299292288,
                lng: 72.89045364464297
            },

        },
        {
            name: 'L&T Innovation Campus',
            info: {
                title: 'L&T Innovation Campus, Chennai',
                desc: 'L&T Innovation Campus, Mount Poonamallee Road, Manapakkam, Chennai – 600089, Tamil Nadu, India.',
                link: 'https://www.lntrealty.com/offices/lt-innovation-campus-chennai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-innovation-campus-chennai.webp"
            },
            type: 'office',
            position: {
                lat: 13.0185608,
                lng: 80.1777947
            },

        },
        {
            name: 'L&amp;T Tech Park - Hebbal, Bengaluru',
            info: {
                title: 'L&amp;T Tech Park - Hebbal, Bengaluru',
                desc: 'Raintree Boulevard, Bellary Road, Byatarayanapura, Bengaluru, Karnataka – 560092, India.',
                link: 'https://www.lntrealty.com/offices/lt-tech-park-hebbal-bengaluru/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-tech-park-hebbal.webp"
            },
            type: 'office',
            position: {
                lat: 13.071537180974373,
                lng: 77.59194512529625
            },

        },
        {
            name: 'L&T Commercial Towers (Upcoming)',
            info: {
                title: 'L&T Commercial Towers, Powai (W), Mumbai',
                desc: 'L&T Commercial Towers, Gate No. 2, L&T Powai Campus, Saki Vihar Road, Powai, Mumbai, India.',
                link: 'https://www.lntrealty.com/offices/lt-commercial-towers-powai-w-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-commercial-tower-powai.webp"
            },
            type: 'office',
            position: {
                lat: 19.124443,
                lng: 72.893705
            },

        },
        {
            name: 'L&T Business Park – Mathura Road, Delhi',
            info: {
                title: 'L&T Business Park – Mathura Road, Delhi',
                desc: 'L&T Business Park, 12/4, Delhi-Mathura Road, Near Sarai Khawaja Metro station – 121003, India.',
                link: 'https://www.lntrealty.com/offices/lt-business-park-mathura-road-delhi/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-business-park-mathura-road.webp"
            },
            type: 'office',
            position: {
                lat: 28.640860,
                lng: 77.083702
            },

        },
        {
            name: 'Seawoods Grand Central',
            info: {
                title: 'Seawoods Grand Central, Navi Mumbai',
                desc: 'L&T Seawoods Ltd.,Plot No. R-1, Sector 40, Seawoods Railway Station, Navi Mumbai, India.',
                link: 'https://www.lntrealty.com/offices/commercial-property-in-navi-mumbai-seawoods-grand-central-navi-mumbai/',
                cta:'VIEW PROJECT',
                image: lntGlobal.imagesUrl + "/maps/map-thumb-office-seawoods-grand-central.webp"
            },
            type: 'office',
            position: {
                lat: 19.033400,
                lng: 73.019000
            },

        },
        
    ];

    return data;
}
