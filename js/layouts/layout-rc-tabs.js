$(function () {
  $('.c-nav-tabs--card .o-tabs__tab').on('click', function () {
    var selectedTab = $(this);
    var classes = 'bg-white text-grey_600 padding-top-xsmall padding-bottom-xsmall';
    var selectedClasses = 'bg-brand-tertiary--dark text-white padding-top-medium padding-bottom-medium margin-bottom-negative-medium';
    selectedTab.siblings().each(function () {
      $(this).removeClass(selectedClasses);
      selectedTab.siblings().addClass(classes).find('.js-header').removeClass('text-white').addClass('text-brand-tertiary--white');
    });
    selectedTab.removeClass(classes).addClass(selectedClasses).find('.js-header').removeClass('text-brand-tertiary--white').addClass('text-white');
  });
});
//# sourceMappingURL=layout-rc-tabs.js.map
