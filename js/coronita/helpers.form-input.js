Coronita.helpers.formInput = function (options) {
  function inputBox($input, params) {
    var $label = $input.closest(params.cInputBoxSelector).find('.c-input-box__label, .c-input-currency__label, .c-textarea__label'),
        $currencySymbol = $input.closest(params.cInputBoxSelector).find('.c-input-currency__symbol');
    $label.removeClass(params.floatedClass);
    $currencySymbol.removeClass(params.floatedClassSymbol);

    if ($input.val()) {
      $label.addClass(params.floatedClass);
      $currencySymbol.addClass(params.floatedClassSymbol);
    }

    $input.focus(function () {
      $label.addClass(params.floatedClass);
      $currencySymbol.addClass(params.floatedClassSymbol);
    });
    $input.blur(function () {
      if ($input.val()) {
        $label.addClass(params.floatedClass);
        $currencySymbol.addClass(params.floatedClassSymbol);
      } else {
        $label.removeClass(params.floatedClass);
        $currencySymbol.removeClass(params.floatedClassSymbol);
      }
    });
  }

  var defaults = {
    inputSelector: '.c-input-box__input',
    cInputBoxSelector: '.c-input-box, .c-input-box--calendar',
    floatedClass: 'is-floated',
    floatedClassSymbol: 'is-floated'
  },
      inputParams = $.extend({}, defaults, options);
  $(inputParams.inputSelector).each(function () {
    inputBox($(this), inputParams);
  });
};
//# sourceMappingURL=helpers.form-input.js.map
