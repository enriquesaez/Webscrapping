var selectMortgage = function () {
  var TEXT_SELECTED = 'Seleccionada';
  var TEXT_SELECT = 'Seleccionar';
  var SELECTOR_MORTGAGE_ITEM = '[data-coronita-layout="mortgage"]';
  var SELECTOR_RADIOBUTTON_CHECK_INPUT = '[data-coronita-c-radiobutton-check] input';
  var SELECTOR_TOGGLE_TEXT_WHITE = '[data-coronita-c-data-amount], [data-coronita-c-link], h4, h5, .flex-order-first>*:not(.m-dialog)';
  var SELECTOR_CONTENT_SKEW = '.mo-stackview__content-skew, .mo-stackview__content-skew--dark';
  var CLASS_TEXT_WHITE = 'text-white';
  var CLASS_C_RADIOBUTTON_DARK = 'c-radiobutton--dark';
  var CLASS_BRAND_PRIMARY = 'bg-brand-primary';
  var CLASS_BRAND_SECUNDARY = 'bg-brand-secundary';
  return function (userData) {
    var data = {};

    function changeRadiobuttonCheck() {
      data.$refs.inputs.forEach(function (input, index) {
        parentStyle(index);
      });
    }

    function parentStyle(index) {
      var item = data.$refs.items[index];
      var checked = data.$refs.inputs[index].checked;
      var skewNegativeSmall = item.querySelector('.skew-negative-xsmall');
      item.querySelector('.c-button__text').innerHTML = checked ? TEXT_SELECTED : TEXT_SELECT;
      item.classList.toggle(CLASS_BRAND_SECUNDARY, checked);
      Array.from(item.querySelectorAll(SELECTOR_TOGGLE_TEXT_WHITE)).forEach(function (itemTextWhite) {
        itemTextWhite.classList.toggle(CLASS_TEXT_WHITE, checked);
      });
      Array.from(item.querySelectorAll('[data-coronita-c-radiobutton]')).forEach(function (radiobutton) {
        radiobutton.classList.toggle(CLASS_C_RADIOBUTTON_DARK, checked);
      });

      if (skewNegativeSmall) {
        skewNegativeSmall.classList.toggle('hide-content', checked);
      }

      item.querySelector('.flex-order_3').classList.toggle('bg-grey_100', !checked);
      item.querySelector('.flex-order_3').classList.toggle(CLASS_BRAND_PRIMARY, checked);
      var skew = item.querySelector(SELECTOR_CONTENT_SKEW);
      skew.classList.toggle('bg-grey_100', !checked);
      skew.classList.toggle(CLASS_BRAND_PRIMARY, checked);
      skew.classList.toggle('mo-stackview__content-skew', !checked);
      skew.classList.toggle('mo-stackview__content-skew--dark', checked);
    }

    function init() {
      var parent = userData.parent;
      data.$refs = {
        parent: userData.parent,
        items: Array.from(parent.querySelectorAll(SELECTOR_MORTGAGE_ITEM)),
        inputs: Array.from(parent.querySelectorAll(SELECTOR_RADIOBUTTON_CHECK_INPUT))
      };
      changeRadiobuttonCheck();
      data.$refs.inputs.forEach(function (input) {
        input.addEventListener('change', changeRadiobuttonCheck);
      });
    }

    return {
      init: init
    };
  };
}();

document.addEventListener('DOMContentLoaded', function () {
  Array.from(document.querySelectorAll('[data-coronita-layout="mortgage-list"]')).forEach(function (item) {
    var radiobuttonCheck = selectMortgage({
      parent: item
    });
    radiobuttonCheck.init();
  });
});
//# sourceMappingURL=layout-hipotecario.js.map
