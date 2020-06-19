$(document).ready(function () {
  function rowDetail($target) {
    var $rowContent = $target.next(),
        isHidden = $rowContent.attr('aria-hidden') === 'true';
    $rowContent.toggleClass('hide-content').attr('aria-hidden', isHidden ? 'false' : 'true');
  }

  $('[data-layout-o-table-row-link]').each(function () {
    $(this).on('keyup.row', function (ev) {
      if (ev.keyCode === 13) {
        rowDetail($(ev.currentTarget).closest('tr'));
      }
    });
    $(this).on('click.row', function (ev) {
      rowDetail($(ev.currentTarget));
    });
  });
});
//# sourceMappingURL=c-table-private.js.map
