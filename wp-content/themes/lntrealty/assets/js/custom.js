if(typeof google != 'undefiend') {
    var map,
        modal,
        currentPopup,
        fitBounds,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        markers = [],
        mapConfig = {
            zoom: 4.25,
            center: { lat: 22.331269, lng: 79.7800149 },
            mapTypeControl: !1,
            scaleControl: !1,
            zoomControl: !0,
            zoomControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM },
            streetViewControl: !1,
            rotateControl: !1,
            overviewMapControl: !1,
            fullscreenControl: !0,
            fullscreenControlOptions: { position: google.maps.ControlPosition.LEFT_TOP },
            styles: [
                { featureType: "administrative", elementType: "labels.text.fill", stylers: [{ color: "#444444" }] },
                { featureType: "landscape", elementType: "all", stylers: [{ color: "#f2f2f2" }] },
                { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "road", elementType: "all", stylers: [{ saturation: -100 }, { lightness: 45 }] },
                { featureType: "road.highway", elementType: "all", stylers: [{ visibility: "simplified" }] },
                { featureType: "road.arterial", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
                { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
                { featureType: "water", elementType: "all", stylers: [{ color: "#acd0f0" }, { visibility: "on" }] },
            ],
        };
}

function setCookie(e, t, n) {
    var i = "";
    if (n) {
        var o = new Date();
        o.setTime(o.getTime() + 36e5 * n), (i = "; expires=" + o.toUTCString());
    }
    document.cookie = e + "=" + (t || "") + i + "; path=/";
}
function getCookie(e) {
    for (var t = e + "=", n = document.cookie.split(";"), i = 0; i < n.length; i++) {
        for (var o = n[i]; " " == o.charAt(0); ) o = o.substring(1, o.length);
        if (0 == o.indexOf(t)) return o.substring(t.length, o.length);
    }
    return null;
}
function eraseCookie(e) {
    document.cookie = e + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
function initPageNavigation() {
    console.log("Initializing Pagination");
    var e = $(window).width(),
        t = $(window).height();
    $(document).height();
    var n = $(".page-navigation.sticky");
    if (n && n.length) {
        var i = n.outerHeight(),
            o = n.data("start-width") ? Number(n.data("start-width")) : 992,
            a = n.data("position") ? n.data("position") : "top",
            s = !!n.data("progressive") && n.data("progressive"),
            r = "bottom" == a,
            l = r ? "fixed-bottom" : "fixed-top",
            c = n.offset().top,
            d = "fixed-bar " + (r ? "bottom" : "top");
        if (e >= o) {
            var p = i + 15,
                u = n.find("a"),
                m = u.map(function () {
                    var e = $($(this).attr("href"));
                    if (e.length) return e;
                });
            $(window).scroll(function () {
                var e = parseInt($(window).scrollTop());
                (r && e > c - i) || (!r && e > t - i) ? (n.addClass(l), $("#site-content").addClass(d)) : (n.removeClass(l), $("#site-content").removeClass(d));
                var o = r ? e + t - c + i : e + p,
                    a = m.map(function () {
                        if ($(this).offset().top < o) return this;
                    });
                if ((u.parent().removeClass("active"), s))
                    a.map(function (e, t) {
                        var n = $(this).attr("id");
                        u.filter("[href='#" + n + "']")
                            .parent()
                            .addClass("active");
                    });
                else {
                    var f = $(a[a.length - 1]).attr("id");
                    u.filter("[href='#" + f + "']")
                        .parent()
                        .addClass("active");
                }
                if (r) {
                    $("#website-footer").height();
                    var h = parseInt($("#website-footer").offset().top) - t;
                    e > h ? n.css("margin-bottom", e - h + "px") : n.css("margin-bottom", "0px");
                }
            });
        }
    }
}
function isHidden(e) {
    return null === e.offsetParent;
}
function toggleMenu() {
    $(".global-menu").toggleClass("active"),
        $(".global-menu").hasClass("active")
            ? ($(".aos-init", ".global-menu").removeClass("aos-animate"),
              setTimeout(function () {
                  $("html,body").css("overflow", "hidden"), $(".aos-init", ".global-menu").addClass("aos-animate");
              }, 500))
            : $("html,body").css("overflow", "auto");
}
function toggleSearch() {
    var e = $("#btnSearch"),
        t = $("#searchPanel");
    $("#navbar"),
        e.hasClass("active")
            ? (t.find(".search-results").animate({ height: "0" }, 200),
              setTimeout(function () {
                  e.removeClass("active"), t.toggleClass("active"), t.removeAttr("style"), t.find("input").blur();
              }, 500))
            : (e.addClass("active"),
              setTimeout(function () {
                  t.toggleClass("active"), t.find(".search-results").css({ height: 0 }).delay(500).animate({ height: "60vh" }, 200), $('input[name="s"]').focus();
              }, 500));
}
function togglePlayPause(e) {
    var t = $(e).data("target");
    $(e).is(".is-playing") ? ($(e).removeClass("is-playing"), $(t).get(0).pause()) : ($(e).addClass("is-playing"), $(t).get(0).play());
}
function initGoogleMap() {
    var e = document.getElementById("gmap");
    null != e && (map = new google.maps.Map(e, mapConfig));
}
function drawMapMarkers(e = "", t = [], n = {}) {
    clearMarkers();
    for (var i = 0; i < t.length; i++) {
        var o = t[i];
        ("" === e || o.type == e) && ((o.icon = o.icon || n[o.type].icon), addMarker(o));
    }
}
function addMarker(e) {
    var t = new google.maps.Marker({ position: new google.maps.LatLng(e.position.lat, e.position.lng), icon: e.icon, map: map, item: e });
    return (
        e.info &&
            google.maps.event.addListener(t, "click", function () {
                currentPopup = getInfoWindow(t);
            }),
        markers.push(t),
        t
    );
}
function smoothZoom(e, t, n, i, o) {
    if (!0 == i) {
        if (!(n >= t)) {
            var a = google.maps.event.addListener(e, "zoom_changed", function (i) {
                google.maps.event.removeListener(a), o && e.setCenter(o.getPosition()), smoothZoom(e, t, n + 1, !0, o);
            });
            setTimeout(function () {
                e.setZoom(n);
            }, 80);
        }
    } else {
        if (n <= t) return;
        var a = google.maps.event.addListener(e, "zoom_changed", function (i) {
            google.maps.event.removeListener(a), o && e.setCenter(o.getPosition()), smoothZoom(e, t, n - 1, !1, o);
        });
        setTimeout(function () {
            e.setZoom(n);
        }, 80);
    }
}
function animateMapZoomTo(e, t, n = null, i = null, o = null) {
    var a = Math.abs(t - (i = null === i ? e.getZoom() : i)),
        s = (a > 1 ? 0.5 : a) * ((o = null == o ? t > i : o) ? 1 : -1);
    i != t &&
        (google.maps.event.addListenerOnce(e, "zoom_changed", function (a) {
            animateMapZoomTo(e, t, n, i + s, o), n && e.setCenter(n.getPosition());
        }),
        setTimeout(function () {
            e.setZoom(i);
        }, 100));
}
function setMapOnAll(e) {
    for (let t = 0; t < markers.length; t++) markers[t].setMap(e);
}
function clearMarkers() {
    hidePopup(), setMapOnAll(null), (markers = []), map.setCenter(mapConfig.center), smoothZoom(map, mapConfig.zoom, map.getZoom(), !1);
}
function showMarkers() {
    setMapOnAll(map);
}
function getInfoWindow(e) {
    var t = lntGlobal.imagesUrl,
        n = e.item,
        i = n.info,
        o = n.info.image,
        a = o && "" !== o ? o : "home" === n.type ? t + "/thumb-home.jpg" : t + "/thumb-office.jpg";
    $("#gmap").removeClass("home office").addClass(n.type);
    var s = $("#gmapInfoWindowContainer");
    s.find(".title").text(i.title), s.find(".desc").text(i.desc), s.find(".image").attr("src", a);
    var r = s.find(".cta").find("a");
    r.text(i.cta).attr("href", i.link), i.link.isEmpty() ? r.hide() : r.show(), s.removeClass("d-none").fadeIn();
    var l = new Popup(new google.maps.LatLng(n.position.lat, n.position.lng), document.getElementById("gmapInfoWindowContainer"));
    return (
        l.setMap(map),
        l.show(),
        smoothZoom(map, 12, map.getZoom(), !0, e),
        s.find(".close").click(function (e) {
            e.preventDefault(), e.stopImmediatePropagation(), hidePopup();
        }),
        l
    );
}
function hidePopup() {
    currentPopup && currentPopup.hide();
}
jQuery(function (e) {
    console.log("custom-js"),
        (window.$ = window.$ || e),
        lntGlobal.templateUrl,
        lntGlobal.assetsUrl,
        lntGlobal.imagesUrl,
        e(window).width(),
        e(window).height(),
        e(window).scroll(function () {
            var t = e(window).scrollTop();
            t >= 50 && !e("#siteHeader").hasClass("background")
                ? (e("#siteHeader").addClass("background"), e(".breadcrumbs").show())
                : t < 50 && e("#siteHeader").hasClass("background") && (e("#siteHeader").removeClass("background"), e(".breadcrumbs").hide());
        }),
        initPageNavigation(),
        initGoogleMap(),
        counterJs(),
        AOS.init({
            disable: function () {
                return window.innerWidth < 992;
            },
        }),
        (modal = ModalDialog()).init();
}),
    (String.prototype.isEmpty = function () {
        return 0 === this.length || !this.trim();
    });
class Popup extends google.maps.OverlayView {
    constructor(e, t) {
        super(), (this.position = e);
        let n = document.createElement("div");
        n.classList.add("popup-bubble"), n.appendChild(t);
        let i = document.createElement("div");
        i.classList.add("popup-bubble-anchor"),
            i.appendChild(n),
            (this.containerDiv = document.createElement("div")),
            this.containerDiv.classList.add("popup-container"),
            this.containerDiv.appendChild(i),
            Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    onAdd() {
        this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    onRemove() {
        this.containerDiv.parentElement && this.containerDiv.parentElement.removeChild(this.containerDiv);
    }
    hide() {
        this.containerDiv && (this.containerDiv.style.visibility = "hidden");
    }
    show() {
        this.containerDiv && (this.containerDiv.style.visibility = "visible");
    }
    draw() {
        let e = this.getProjection().fromLatLngToDivPixel(this.position),
            t = 4e3 > Math.abs(e.x) && 4e3 > Math.abs(e.y) ? "block" : "none";
        "block" === t && ((this.containerDiv.style.left = e.x + "px"), (this.containerDiv.style.top = e.y + "px")), this.containerDiv.style.display !== t && (this.containerDiv.style.display = t);
    }
}
function isFloat(e) {
    return Number(e) === e && e % 1 != 0;
}
function numberWithCommas(e) {
    return e.toLocaleString();
}
function counterJs() {
    $(window).scroll(function () {
        $(".counter")
            .closest(".counters")
            .each(function () {
                var e = $(window).scrollTop(),
                    t = e + $(window).height(),
                    n = $(this).offset().top,
                    i = n + $(this).height(),
                    o = this,
                    a = $(o).hasClass("animated");
                i <= t &&
                    n >= e &&
                    !a &&
                    $(".counter", o).each(function () {
                        var e = $(this).attr("data-value"),
                            t = isFloat(Number(e));
                        $(o).addClass("animated"),
                            $(this)
                                .prop("Counter", 0)
                                .animate(
                                    { Counter: e },
                                    {
                                        duration: 2e3,
                                        easing: "swing",
                                        step: function (e) {
                                            t ? $(this).text(numberWithCommas(Number(e).toFixed(1))) : $(this).text(numberWithCommas(Math.ceil(e)));
                                        },
                                    }
                                );
                    });
            });
    });
}
function counterJsObserver() {
    console.log("Counter JS"),
        addObserver(".counters", function (e) {
            e.forEach(function (e) {
                var t = e.isVisible,
                    n = e.isIntersecting,
                    i = e.target;
                $(i).hasClass("animated"),
                    console.log(i, t, n),
                    n
                        ? $(i).removeClass("animated")
                        : ($(i).addClass("animated"),
                          $(i)
                              .children(".counter")
                              .each(function () {
                                  var e = $(this).text();
                                  $(this).data("value", e),
                                      $(this)
                                          .prop("Counter", 0)
                                          .animate(
                                              { Counter: e },
                                              {
                                                  duration: 1e3,
                                                  easing: "swing",
                                                  step: function (e) {
                                                      $(this).text(Math.ceil(e));
                                                  },
                                              }
                                          );
                              }));
            });
        });
}
function addObserver(e, t) {
    let n = new IntersectionObserver(t);
    document.querySelectorAll(e).forEach(function (e) {
        n.observe(e);
    });
}
function checkInView(e) {
    var t = $(window).scrollTop(),
        n = t + $(window).height(),
        i = $(e).offset().top;
    return i + $(e).height() <= n && i >= t;
}
function animateOnView() {
    let e = new IntersectionObserver(function (e) {
        e.forEach((e) => {});
    });
    document.querySelectorAll(".in-view").forEach(function (t) {
        e.observe(t);
    });
}
function ModalDialog() {
    var e = r(".lnt-modal__trigger"),
        t = r(".lnt-modal"),
        n = r(".lnt-modal__bg"),
        i = r(".lnt-modal__content"),
        o = r(".lnt-modal__close");
    window;
    var a = !1,
        s = e.length;
    function r(e) {
        return document.querySelectorAll(e);
    }
    var l = function (e) {
            if (-1 == this.href.indexOf("tel:") || !isMobile) {
                e.preventDefault();
                var t = this.dataset.modal,
                    n = t.length,
                    i = t.substring(1, n);
                c(this, document.getElementById(i));
            }
        },
        c = function (e, t) {
            if (null === document.getElementById("modal__temp")) {
                var n = document.createElement("div");
                (n.id = "modal__temp"), e.appendChild(n), d(e, t, n);
            }
        },
        d = function (e, t, n) {
            var i = e.getBoundingClientRect(),
                o = t,
                a = o.querySelector(".lnt-modal__content").getBoundingClientRect();
            o.classList.contains("lnt-modal--align-top") && (transY = Math.round(a.height / 2 + a.top - i.top - i.height / 2)),
                window.setTimeout(function () {
                    window.requestAnimationFrame(function () {
                        p(o, n);
                    });
                }, 100);
        },
        p = function (e, t) {
            if (!a) {
                var n = e.querySelector(".lnt-modal__content");
                e.classList.add("lnt-modal--active"), n.classList.add("lnt-modal__content--active"), n.addEventListener("transitionend", i, !1), (a = !0);
            }
            function i() {
                (t.style.opacity = "0"), n.removeEventListener("transitionend", i, !1);
            }
        },
        u = function (e) {
            e.preventDefault(), e.stopImmediatePropagation();
            var n = e.target,
                o = document.getElementById("modal__temp");
            if ((a && n.classList.contains("lnt-modal__bg")) || n.classList.contains("lnt-modal__close")) {
                (o.style.opacity = "1"), o.removeAttribute("style"), jQuery(".lnt-modal.testimonialmodal_wrapper").removeClass("lnt-modal--active");
                for (var r = 0; r < s; r++) t[r].classList.remove("lnt-modal--active"), i[r].classList.remove("lnt-modal__content--active");
                o.addEventListener(
                    "transitionend",
                    function () {
                        setTimeout(function () {
                            window.requestAnimationFrame(function () {
                                o.remove();
                            });
                        }, 50);
                    },
                    !1
                ),
                    (a = !1);
            }
        },
        m = function () {
            for (var t = 0; t < s; t++) e[t].addEventListener("click", l, !1), n[t].addEventListener("click", u, !1);
            for (var t = 0; t < o.length; t++) o[t].addEventListener("click", u, !1);
        };
    return {
        init: function () {
            m();
        },
    };
}



/* Custom Geberal Js */

jQuery(document).ready(function($) {
    if ($('body').hasClass('page-id-11347')) {
      $('.heading[data-aos="fade-down"]').removeAttr('data-aos');
    }
  });