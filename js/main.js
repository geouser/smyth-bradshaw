// Global parameters
window.params = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent)
};


/**
     *
     * Check if element exist on page
     *
     * @param el {string} jQuery object (#popup)
     *
     * @return {bool}
     *
*/
function exist(el){
    if ( $(el).length > 0 ) {
        return true;
    } else {
        return false;
    }
}


jQuery(document).ready(function($) {

    /*---------------------------
                                  ADD CLASS ON SCROLL
    ---------------------------*/
    $(function() { 
        var $document = $(document),
            $element = $('.menu-button'),
            $element2 = $('header'),
            className = 'hasScrolled';

        $document.scroll(function() {
            $element.toggleClass(className, $document.scrollTop() >= 1);
            $element2.toggleClass(className, $document.scrollTop() >= 1);
        });
    });
    
    /*---------------------------
                                PAGE ANCHORS
    ---------------------------*/
    $('.mainNav a, .anchor').click(function() {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top - 50
        }, 800);
        return false;
    });

    /*---------------------------
                                ACTIVATE MENU ITEM OVER CURRENT SECTION
    ---------------------------*/
    var $sections = $('section');
    $(window).scroll(function(){
        var currentScroll = $(this).scrollTop();
        var $currentSection;
        var windowHalf = $(window).height() / 2;
        
        $sections.each(function(){
          var divPosition = $(this).offset().top - windowHalf;
          
          if( divPosition - 1 < currentScroll ){
            $currentSection = $(this);
          }
        var id = $currentSection.attr('id');
          $('a').removeClass('active');
          $("[href=#"+id+"]").addClass('active');
        })
    });




    /*---------------------------
                                  MENU TOGGLE
    ---------------------------*/
    $('.site-menu-open').on('click', function(event) {
        event.preventDefault();
        $('.site-menu').addClass('active');
    });

    $('.site-menu-close').on('click', function(event) {
        event.preventDefault();
        $('.site-menu').removeClass('active');
    });

    $( '.site-menu' ).on( 'mousewheel DOMMouseScroll', function ( e ) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;

        this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
        e.preventDefault();
    });



    /*---------------------------
                                  Fullpage
    ---------------------------*/
    if ( exist('.fullpage') ) {
        $('.fullpage').fullpage({
            sectionSelector: '.fp-section',
            verticalCentered: false,
            lockAnchors: false,
            anchors:['main-screen', 'industries', 'job-offers', 'blog', 'navigation'],
            normalScrollElements: '.site-menu'
        })
    }


    /*---------------------------
                                  Custom input
    ---------------------------*/
    $('input[type=file]').each(function(index, el) {
        $(this).wrap('<div class="custom-file"></div>');
        var wrapper = $(this).parent('.custom-file');
        wrapper.append('<span class="file-name">Attach CV<span>');
        var file_name = $(this).siblings('.file-name');
        wrapper.append('<span class="file-button">+</span>');
        var file_button = $(this).siblings('.file-button');

        $(this).on('change', function(event) {
            event.preventDefault();
            var filename = $(this).val().split('/').pop().split('\\').pop();
            if ( filename == '' ) {
                filename = 'Attach CV';
            }
            file_name.text(filename);
        });
    });


    /*---------------------------
                                  Custom popup tabs
    ---------------------------*/
    $('.tab-button').on('click', function(event) {
        event.preventDefault();
        $(this).addClass('state-active').siblings().removeClass('state-active');
        var tab = $(this).attr('href');
        if ( exist(tab) ) {
            $(tab).addClass('state-active').siblings('.tab').removeClass('state-active');
        }
    });

    /* activate tab in popup based on button attribute */
    $('.user-area-control').on('click', function(event) {
        event.preventDefault();
        var tab = $(this).attr('data-tab');
        $('button[href='+tab+']').click();
    });





    /*---------------------------
                                  Magnific popup
    ---------------------------*/
    $('.magnific').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',
        modal: false,

        closeBtnInside: true,
        preloader: false,
        
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-slide-bottom'
    });


    $('.team--slider').slick({
        slidesToShow: 2,
        arrows: true,
        dots: false,
        responsive: [
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 1
              }
            }
        ]
    });
    /*----------------------------
                              SEND FORM
    -------------------------*/
    /**
     *
     * Open popup
     *
     * @param popup {String} jQuery object (#popup)
     *
     * @return n/a
     *
    */
    function openPopup(popup){
        $.magnificPopup.open({
            items: {
              src: popup
            },
            type: 'inline',
            fixedContentPos: false,
            fixedBgPos: true,
            overflowY: 'auto',
            modal: false,
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 300,
            mainClass: 'my-mfp-slide-bottom'
        }, 0);
    }

    $('.form').on('submit', function(event) {
        event.preventDefault();
        var data = new FormData(this);
        $(this).find('button').prop('disabled', true);
        $.ajax({
            url: theme.url + '/forms.php',
            type: 'POST',
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(result) {
                if (result.status == 'ok') {
                    openPopup('#modal-popup-ok')
                } else {
                    openPopup('#modal-popup-error')
                }
            },
            error: function(result) {
                openPopup('#modal-popup-error');
            }
        }).always(function() {
            $('form').each(function(index, el) {
                $(this)[0].reset();
                $(this).find('button').prop('disabled', false);
            });
        });
    });



    /*Google map init*/
    var map;
    function googleMap_initialize() {
        var lat = $('#map_canvas').data('lat');
        var long = $('#map_canvas').data('lng');

        var mapCenterCoord = new google.maps.LatLng(lat, long);
        var mapMarkerCoord = new google.maps.LatLng(lat, long);

        var mapOptions = {
            center: mapCenterCoord,
            zoom: 14,
            //draggable: false,
            disableDefaultUI: true,
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
        var markerImage = new google.maps.MarkerImage('images/location.png');
        var marker = new google.maps.Marker({
            icon: markerImage,
            position: mapMarkerCoord, 
            map: map,
            title:"Smyth & Bradshaw"
        });
        
        $(window).resize(function (){
            map.setCenter(mapCenterCoord);
        });
    }

    if ( exist( '#map_canvas' ) ) {
        googleMap_initialize();
    }

}); // end file