$(document).ready(function () {
  var helper = {};
  $('.c-filter-button').hover(function () {
    $(this).parent().find('.c-filter-button--active').attr('data-layout-active', 'true').removeClass('c-filter-button--active');
    $(this).parent().on('mouseleave.filter', function () {
      $(this).off('mouseleave.filter').find('[data-layout-active]').removeAttr('data-layout-active').addClass('c-filter-button--active');
    });
  }, function () {//$(this).parent().find('[data-layout-active]').removeAttr('data-layout-active').addClass('c-filter-button--active');
  });
});
//# sourceMappingURL=c-filter-button.js.map
