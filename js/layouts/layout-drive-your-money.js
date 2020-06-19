$(document).ready(function () {
  $('#type-income-monthly-regular-amount').val($('[data-layout-editable-amount-origin] .c-data-amount__integer').eq(0).text());
  $('[data-layout-button-edit-and-close-dialog] [role="button"]').eq(0).on('click.edit', function () {
    $('[data-layout-editable-amount-origin] .c-data-amount__integer').eq(0).text($('#type-income-monthly-regular-amount').attr('value'));
    $(this).closest('.o-dialog').find('[data-layout-dialog-close]').click();
  });
  $('[data-layout-radio-tabs]').find('[type="radio"]').each(function () {
    var $radio = $(this);
    $radio.on('change.radio', function () {
      $('[data-layout-radio-tab]').attr({
        'aria-hidden': 'true'
      }).addClass('hide-content');

      if ($radio.is(':checked')) {
        $('[data-layout-radio-tab="' + $radio.attr('id') + '"]').attr({
          'aria-hidden': 'false'
        }).removeClass('hide-content');
      }
    });
  });
});
//# sourceMappingURL=layout-drive-your-money.js.map
