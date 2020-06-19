// MODULE - m-check-box
Coronita.clientflow.mCheckBox = function () {
  function isChanged(ev) {
    var SELECTOR_C_CHECK_BOX = ev.currentTarget;
    var ID = SELECTOR_C_CHECK_BOX.id.split('-').pop();
    var SELECTOR_M_CHECK_BOX = document.getElementById('m-check-box-' + ID);
    var SELECTOR_INPUT_CURRENCY = SELECTOR_M_CHECK_BOX.getElementsByClassName('c-input-currency__input')[0];
    SELECTOR_INPUT_CURRENCY.focus();

    if (SELECTOR_M_CHECK_BOX.classList.contains('is-checked')) {
      SELECTOR_M_CHECK_BOX.classList.remove('is-checked');
      SELECTOR_C_CHECK_BOX.removeAttribute('checked', 'checked');
      SELECTOR_INPUT_CURRENCY.setAttribute('readonly', 'readonly');
    } else {
      SELECTOR_M_CHECK_BOX.classList.add('is-checked');
      SELECTOR_C_CHECK_BOX.setAttribute('checked', 'checked');
      SELECTOR_INPUT_CURRENCY.removeAttribute('readonly', 'readonly');
    }
  }
  /**
   * init method
   * uiCoronitaModulesCheckBox
   * @param
   * @public
   */


  function init(data) {
    data.$inputCheckBox.addEventListener('change', isChanged);
  }

  return {
    init: init
  };
}();

Coronita.ui.mCheckBox = function () {
  return {
    init: function init() {
      var SELECTOR_CHECK_BOXES = document.getElementsByClassName('m-check-box');
      Array.from(SELECTOR_CHECK_BOXES).forEach(function (checkBox) {
        var SELECTOR_INPUT_CHECK_BOX = checkBox.getElementsByClassName('c-checkbox__input')[0];
        Coronita.clientflow.mCheckBox.init({
          $checkBox: checkBox,
          $inputCheckBox: SELECTOR_INPUT_CHECK_BOX
        });
      });
    }
  };
}();
//# sourceMappingURL=m-check-box.js.map
