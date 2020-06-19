// OBJECT - o-carousel
Coronita.clientflow.oCarousel = function () {
  var SELECTOR_CURRENT_SLIDE = '[aria-hidden="false"]';
  var ATTR_CAROUSEL_SLIDE = 'data-coronita-o-carousel-slide';
  var SELECTOR_CAROUSEL_CONTROLS_PREVIOUS = '[data-coronita-o-carousel-controls-arrow-previous]';
  var SELECTOR_CAROUSEL_CONTROLS_NEXT = '[data-coronita-o-carousel-controls-arrow-next]';
  var SELECTOR_CAROUSEL_CONTROLS_BULLET = '[data-coronita-o-carousel-controls-bullet]';
  var SELECTOR_CAROUSEL_SLIDE = '[data-coronita-o-carousel-slide]';
  var CLASS_BULLET_ACTIVE = 'o-carousel__bullet--active';
  var SELECTOR_CAROUSEL_STATUS = '[data-coronita-o-carousel-status]';

  function carouselEvent($carousel, selector, callback) {
    $carousel.find(selector).on('click keydown', function (ev) {
      if (isClick(ev)) {
        callback(ev);
      }
    });
  }

  function getCurrentSlideIndex($carousel) {
    return parseInt($carousel.find(SELECTOR_CURRENT_SLIDE).attr(ATTR_CAROUSEL_SLIDE), 10) + 1 || 1;
  }

  function isClick(ev) {
    return ev.type === 'click' || ev.keyCode === 13 || ev.keyCode === 32;
  }

  function whichAnimationEvent() {
    var t;
    var el = document.createElement('fakeelement');
    var animations = {
      'animation': 'animationend',
      'OAnimation': 'oAnimationEnd',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd'
    };

    for (t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  }
  /**
   * init method
   * Call template mixin '_.c_coronita_o_carousel()' (c_coronita_o_carousel.tmpl.html) in the html file
   * Call init in *.mvc.js, for example in 'afterRender' method:
   * uiCoronitaObjectsCarousel.init($oCarouselElement);
   * @param $idElementContainer - jquery object element selector
   * @public
   */


  function init($carousel) {
    var $activeSlide = $carousel.find('[aria-hidden="false"]');
    var slideIndex = getCurrentSlideIndex($carousel);

    function plusSlides(n, direction) {
      showSlides(slideIndex += n, direction);
    }

    function currentSlide(n, direction) {
      showSlides(slideIndex = n, direction);
    }

    function showSlides(n, direction) {
      var $slides = $carousel.find(SELECTOR_CAROUSEL_SLIDE);
      var $bullets = $carousel.find(SELECTOR_CAROUSEL_CONTROLS_BULLET);
      var index = slideIndex - 1;
      var transform;
      var flag = false;

      if (n > $slides.length) {
        slideIndex = 1;
        index = 0;
      }

      if (n < 1) {
        slideIndex = $slides.length;
        index = $slides.length - 1;
      }

      transform = index === 0 ? 'translateX(0%)' : 'translateX'.concat('(-', 100 * index, '%)');
      $slides.attr('aria-hidden', 'true').removeClass('invisible');
      $activeSlide.focus();
      $slides.css('transform', transform);
      $activeSlide = $slides.eq(index);
      $activeSlide.attr('aria-hidden', 'false');
      $bullets.eq(index).addClass(CLASS_BULLET_ACTIVE).siblings().removeClass(CLASS_BULLET_ACTIVE);
      $carousel.find(SELECTOR_CAROUSEL_STATUS).text(slideIndex);
      $carousel.on(whichAnimationEvent(), function (e) {
        if (e.originalEvent.propertyName === 'transform' && !flag) {
          flag = true;
          $.publish('carousel:changeSlide', {
            id: $carousel.attr('id'),
            slideIndex: index
          });
          $activeSlide.siblings().addClass('invisible');
          $activeSlide.focus();
        }
      });
    }

    carouselEvent($carousel, SELECTOR_CAROUSEL_CONTROLS_PREVIOUS, function () {
      plusSlides(-1, 'left');
    });
    carouselEvent($carousel, SELECTOR_CAROUSEL_CONTROLS_NEXT, function () {
      plusSlides(1, 'right');
    });
    carouselEvent($carousel, SELECTOR_CAROUSEL_CONTROLS_BULLET, function (ev) {
      var index = $carousel.find(SELECTOR_CAROUSEL_CONTROLS_BULLET).index(ev.currentTarget) + 1;
      var direction = slideIndex < index ? 'right' : 'left';
      currentSlide(index, direction);
    });
  }

  return {
    init: init
  };
}();

Coronita.ui.oCarousel = function ($carousel) {
  function init() {
    $('[data-coronita-o-carousel]').each(function () {
      Coronita.clientflow.oCarousel.init($(this));
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=o-carousel.js.map
