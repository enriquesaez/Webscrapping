// home-baby-planner.jade
$(document).ready(function () {
  var classIsDisabled = 'is-disabled',
      classHideContent = 'hide-content',
      selectorDatePicker = '.m-datepicker';
  helper = {}; //$boxRadios = 

  $('[data-layout-radios]').each(function () {
    var $areaRadio = $(this),
        $radios = $areaRadio.find('[data-layout-radios-selection] [type="radio"]');
    $radios.on('change.radio', function () {
      var $active = $radios.filter(':checked').attr('data-layout-radio-active'),
          $form = $areaRadio.find('[data-layout-radios-form]'),
          $button = $form.find('.c-button--secondary');
      $form.find(selectorDatePicker).addClass(classHideContent);

      if ($active === 'all') {
        $button.removeClass(classIsDisabled);
      } else {
        $button.addClass(classIsDisabled);
        $('#' + $active).closest(selectorDatePicker).removeClass(classHideContent);
      }
    });
  });
  $('#fecha-estimada-parto, #fecha-nacimiento-bebe').on('keyup.calendar', function () {
    var $button = $(this).closest(selectorDatePicker).parent().find('[role="button"]');

    if ($(this).val() === '') {
      $button.addClass(classIsDisabled);
    } else {
      $button.removeClass(classIsDisabled);
    }
  });
  $('#access-section-stage').on('click.button', function () {
    $('[href="#section-stage"]').eq(0).click();
  });
});
//# sourceMappingURL=home-baby-planner.js.map
