$(document).ready(function () {
  $('.m-sticky-bar .c-link-headline').eq(0).attr('data-layout-dialog-open', 'dialog-change-stage');
  $('[data-layout-graphic]').each(function () {
    var id = $(this).find('[role="dialog"]').attr('id');
    $(this).find('.o-button').attr('data-layout-dialog-open', id);
  });
  $('[data-layout-button-show] [role="button"]').on('click.show', function () {
    var $layer = $('[data-layout-layer-show]');

    if ($layer.attr('aria-hidden') === 'true') {
      $layer.removeClass('hide-content').attr('aria-hidden', 'false');
    } else {
      $layer.addClass('hide-content').attr('aria-hidden', 'true');
    }
  });
});
//# sourceMappingURL=layout-dashboard-planification.js.map
