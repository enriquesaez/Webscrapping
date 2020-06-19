// COMPONENT - c-input-box
Coronita.clientflow.cInput = function () {
  var SELECTOR_CORONITA_C_INPUT = '[data-coronita-c-input]:not(.c-input-box--label-over, .c-input-currency--label-over, .c-input-predictive--label-over, .c-textarea--label-over)';
  var SELECTOR_CORONITA_C_INPUT_LABEL = '[data-coronita-c-input-label]';
  var SELECTOR_CORONITA_C_INPUT_CURRENCY = '[data-coronita-c-input-currency]';
  var CLASS_IS_FLOATED = 'is-floated';

  function labelFloated() {
    var $label = $(this).find(SELECTOR_CORONITA_C_INPUT_LABEL);
    var $input = $(this).find('input, textarea');
    var $placeholder = $input.attr('placeholder');
    var $currencySymbol = $(this).find(SELECTOR_CORONITA_C_INPUT_CURRENCY);
    var inputValue = $input.val();
    $input.on('focus', function () {
      $label.addClass(CLASS_IS_FLOATED);
      $currencySymbol.addClass(CLASS_IS_FLOATED);
    }).on('blur', function () {
      inputValue = $input.val();
      var isFloated = inputValue && inputValue.length > 0;

      if (!$placeholder) {
        $label.toggleClass(CLASS_IS_FLOATED, isFloated);
        $currencySymbol.toggleClass(CLASS_IS_FLOATED, isFloated);
      }
    });

    if ($placeholder !== undefined || inputValue && inputValue.length) {
      $label.addClass(CLASS_IS_FLOATED);
      $currencySymbol.addClass(CLASS_IS_FLOATED);
    }
  }

  function init($view) {
    $view.find(SELECTOR_CORONITA_C_INPUT).each(labelFloated);
  }

  return {
    init: init,
    invalid: uiCoronitaModulesValidation
  };
}();

Coronita.ui.cInputbox = function () {
  function init() {
    Coronita.clientflow.cInput.init($('body'));
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-input-box.js.map
