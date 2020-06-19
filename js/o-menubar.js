$(document).ready(function () {
  $('.o-menubar').setup_navigation();
});

$.fn.setup_navigation = function (settings) {
  settings = jQuery.extend({
    menuHoverClass: 'show-content'
  }, settings); // Add ARIA role to menubar and menu items
  // $(this).attr('role', 'menubar').find('li').attr('role', 'menuitem');

  var top_level_links = $(this).find('.o-menubar__link'); // Added by Terrill: (removed temporarily: doesn't fix the JAWS problem after all)
  // Add tabindex="0" to all top-level links 
  // Without at least one of these, JAWS doesn't read widget as a menu, despite all the other ARIA
  //$(top_level_links).attr('tabindex','0');

  $(top_level_links).hover(function () {
    if ($(this).is('[aria-haspopup]')) {
      $(this).attr('aria-expanded', 'true');
    }

    ;
    $(this).closest('.o-menubar').find('.' + settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass);
    $(this).next('.o-menubar__menu').attr('aria-hidden', 'false').addClass(settings.menuHoverClass);
  }, function () {
    if ($(this).is('[aria-haspopup]')) {
      $(this).attr('aria-expanded', 'false');
    }

    ;
  });
  $(top_level_links).focus(function () {
    if ($(this).is('[aria-haspopup]')) {
      $(this).attr('aria-expanded', 'true');
    }

    ;
    $(this).closest('.o-menubar').find('.' + settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass);
    $(this).next('.o-menubar__menu').attr('aria-hidden', 'false').addClass(settings.menuHoverClass);
  });
  $(document).click(function () {
    $('.' + settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('.o-menubar__link').attr('tabIndex', -1);
  });
  $(this).click(function (e) {
    e.stopPropagation();
  });
};
//# sourceMappingURL=o-menubar.js.map
