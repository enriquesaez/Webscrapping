// MODULE - m-accordion
Coronita.clientflow.mAccordionOperations = function () {
  var SELECTOR_CONTROLLER = '[data-coronita-m-accordion-operations-controller]';
  var CLASS_EXPANDED = 'is-expanded';
  var KEY_ENTER = 13;
  var KEY_SPACE = 32;
  var ARIA_HIDDEN_TRUE = 'true';
  return function (userData) {
    var data = {
      isHidden: true
    };

    function externalToggleContent() {
      data.$refs.controller.click();
    }

    function isClick(ev) {
      return ev.type === 'keypress' && [KEY_ENTER, KEY_SPACE].indexOf(ev.keyCode) !== -1 || ev.type === 'click';
    }

    function selectOperation() {
      data.$refs.mAccordionOperations.classList.toggle('is-selected', data.$refs.checkbox.checked);
      setDark();
    }

    function setDark() {
      var isDark = data.$refs.checkbox && data.$refs.checkbox.checked || !data.isHidden;

      if (data.$refs.cDropdown) {
        data.$refs.cDropdown.classList.toggle('c-dropdown--dark', isDark);
      }
    }

    function toggleContent(ev) {
      if (isClick(ev)) {
        ev.preventDefault();
        data.isHidden = true;

        if (data.$refs.content.getAttribute('aria-hidden').toString() === ARIA_HIDDEN_TRUE.toString()) {
          data.isHidden = false;
        }

        data.$refs.content.setAttribute('aria-hidden', data.isHidden.toString());
        data.$refs.controller.setAttribute('aria-expanded', data.isHidden ? 'false' : 'true');
        data.$refs.mAccordionOperations.classList.toggle(CLASS_EXPANDED, !data.isHidden);
        setDark();
      }
    }

    function init() {
      var mAccordionOperations = document.getElementById('m-accordion-operations-' + userData.id);
      var controller = mAccordionOperations.querySelector(SELECTOR_CONTROLLER);
      data.$refs = {
        mAccordionOperations: mAccordionOperations,
        controller: controller,
        content: document.getElementById(controller.getAttribute('aria-controls')),
        checkbox: mAccordionOperations.querySelector('[type="checkbox"]'),
        cDropdown: mAccordionOperations.querySelector('[data-coronita-c-dropdown]')
      };
      ['click', 'keypress'].forEach(function (event) {
        data.$refs.controller.addEventListener(event, toggleContent);
      });

      if (data.$refs.checkbox) {
        data.$refs.checkbox.addEventListener('change', selectOperation);
      }
    }

    return {
      init: init,
      toggleContent: externalToggleContent
    };
  };
}();

Coronita.ui.mAccordionOperations = function () {
  function init() {
    $('[data-coronita-m-accordion-operations]').each(function () {
      var mAccordionOperations = Coronita.clientflow.mAccordionOperations({
        id: $(this).attr('id').split('operations-')[1]
      });
      mAccordionOperations.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-accordion-operations.js.map
