// TEMPLATE - t-parallax
Coronita.ui.tParallax = function () {
  var animationTime = 500,
      activeClass = 'is-active';

  function activateNavigationLink($parallaxNavigationLinks, index) {
    var $currentLink = $parallaxNavigationLinks.eq(index),
        isReversed = $currentLink.is('[data-layout-parallax-nav-reversed]');
    $parallaxNavigationLinks.removeClass(activeClass);
    $currentLink.addClass(activeClass).closest('[data-layout-parallax-nav]').toggleClass('is-color-reversed', isReversed);
  }

  function animateNavigation($parallaxNavigation, $parallaxSection) {
    $parallaxNavigation.animate({
      top: $parallaxSection.position().top + Math.floor(($parallaxSection.outerHeight() - $parallaxNavigation.outerHeight()) / 2)
    }, animationTime);
  }

  function navigate($parallax, $parallaxNavigation, $parallaxLinks, $link) {
    var $parallaxSection = $($link.attr('href')),
        $parallaxNavigationLinks = $parallaxNavigation.find('[data-layout-parallax-nav-item]');
    parallaxSectionIndex = $parallaxSection.index('.t-parallax__section');
    activateNavigationLink($parallaxNavigationLinks, parallaxSectionIndex);
    animateNavigation($parallaxNavigation, $parallaxSection);
    $('html, body').animate({
      scrollTop: $parallaxSection.offset().top - 110
    }, animationTime, function () {
      $parallaxSection.focus();
    });
  }

  function parallax($parallax) {
    var $parallaxNavigation = $parallax.find('[data-layout-parallax-nav]'),
        $parallaxLinks = $parallax.find('[data-layout-parallax-nav-item]');
    $parallaxLinks.on('click.parallax', function (ev) {
      ev.preventDefault();
      navigate($parallax, $parallaxNavigation, $parallaxLinks, $(this));
    });
    scroll($parallax);
    $(document).trigger('scroll');
  }

  function milestones($parallaxNavigationLinks) {
    var sectionMilestones = [],
        previousSectionTop = 0;
    $parallaxNavigationLinks.each(function (index) {
      var currentSectionTop = $($(this).attr('href')).offset().top;
      sectionMilestones.push({
        index: index,
        top: previousSectionTop,
        bottom: currentSectionTop
      });
      previousSectionTop = currentSectionTop;
    });
    return sectionMilestones;
  }

  function scrollHandler(sectionMilestones, $parallaxNavigationLinks, $parallaxNavigation) {
    var scrollTop = $(document).scrollTop();
    $.each(sectionMilestones, function (index, item) {
      if (scrollTop >= item.top && scrollTop < item.bottom) {
        var $parallaxSection = $($parallaxNavigationLinks.eq(item.index).attr('href'));
        activateNavigationLink($parallaxNavigationLinks, item.index);
        animateNavigation($parallaxNavigation, $parallaxSection);
      }
    });
  }

  function scroll($parallax) {
    var $parallaxNavigation = $parallax.find('[data-layout-parallax-nav]'),
        $parallaxNavigationLinks = $parallaxNavigation.find('[data-layout-parallax-nav-item]'),
        sectionMilestones = milestones($parallaxNavigationLinks),
        scrollTimeout;
    $(document).scroll(function () {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }

      scrollTimeout = setTimeout(function () {
        scrollHandler(sectionMilestones, $parallaxNavigationLinks, $parallaxNavigation);
      }, 100);
    });
  }

  function init() {
    $('[data-layout-parallax]').each(function (ev) {
      parallax($(this));
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=t-parallax.js.map
