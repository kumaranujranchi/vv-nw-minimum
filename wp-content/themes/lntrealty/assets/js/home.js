
jQuery(function ($) {
    console.log('home-js');
    window.$ = window.$ || $;

    // var isCoverVideoSeen = getCookie('cover-video-seen');
    // var expireTime = Number(24*30).toFixed(2);
    // // console.log('Cover Video Sceen:',isCoverVideoSeen,expireTime)
    // if (!isCoverVideoSeen) {
    //     $("#headerCoverVideo").parent().show();
    //     $("html,body").css('overflow', 'hidden');
    //     setCookie('cover-video-seen',true,expireTime);
    // }

    // var coverVideo = document.getElementById("headerCoverVideo");
    // coverVideo.onended = function() {
    //     this.pause();
    //     $("#headerCoverVideo").fadeOut(1000, function() {
    //         var vm = document.getElementById("headerVideoMobile");
    //         var vd = document.getElementById("headerVideoDesktop");
    //         // console.log(vm,vd);
    //         if(vm && !isHidden(vm)){ vm.currentTime = 0; vm.load(); }
    //         if(vd && !isHidden(vd)){ vd.currentTime = 0; vd.load(); }

    //         $(this).parent().remove();
    //         $("html,body").css('overflow', 'auto');
    //         // this will hide the bottom button bar in safari
    //         // $(window).scroll(5);
    //     });
    // };

    // $("#skipCover").on('click', function(){
    //     coverVideo.pause();
    //     $("#headerCoverVideo").fadeOut(100, function() {
    //         var vm = document.getElementById("headerVideoMobile");
    //         var vd = document.getElementById("headerVideoDesktop");
    //         // console.log(vm,vd);
    //         if(vm && !isHidden(vm)){ vm.currentTime = 0; vm.load(); }
    //         if(vd && !isHidden(vd)){ vd.currentTime = 0; vd.load(); }

    //         $(this).parent().remove();
    //         $("html,body").css('overflow', 'auto');
    //         // this will hide the bottom button bar in safari
    //         // $(window).scroll(5);
    //     });
    // });



    addMapMarkersByType(); //show all

    // initialize Custom Designed Dropdown, if page has it, as like homepage has
    initCustomSelect();

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

function initCustomSelect() {

    var x, i, j, l, ll, selElmnt, a, b, c;
    /* Look for any elements with the class "custom-select": */
    x = document.getElementsByClassName("custom-select");
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        ll = selElmnt.length;
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");
        for (j = 1; j < ll; j++) {
            /* For each option in the original select element,
            create a new DIV that will act as an option item: */
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                /* When an item is clicked, update the original select box,
                and the selected item: */
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function (e) {
            /* When the select box is clicked, close any other select boxes,
            and open/close the current select box: */
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, xl, yl, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        xl = x.length;
        yl = y.length;
        for (i = 0; i < yl; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < xl; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }

    /* If the user clicks anywhere outside the select box,
    then close all select boxes: */
    document.addEventListener("click", closeAllSelect);
}


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".custom-video-container").forEach(function (container) {
    const videoId = container.getAttribute("data-video-id");
    const start = parseInt(container.getAttribute("data-start")) || 0;

    const playBtn = container.querySelector(".play-btn");

    playBtn.addEventListener("click", function () {
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube.com/embed/${videoId}?start=${start}&autoplay=1&rel=0`;
      iframe.frameBorder = "0";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.width = "794";
      iframe.height = "445";

      container.innerHTML = "";
      container.appendChild(iframe);
    });
  });
});