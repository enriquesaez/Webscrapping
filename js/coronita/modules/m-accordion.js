// MODULE - m-accordion
Coronita.clientflow.mAccordion = function () {
  var SELECTOR_CONTROLLER = '[data-coronita-m-accordion-button]';
  var SELECTOR_CONTENT = '[data-coronita-m-accordion-content]';
  var SELECTOR_ICON_CONTROLLER = '[data-coronita-m-accordion-icon-controller]';
  var SELECTOR_ICON_STATUS = '[data-coronita-m-accordion-icon-status]';
  var CLASS_EXPANDED = 'is-expanded';
  var KEY_ENTER = 13;
  var KEY_SPACE = 32;
  var ARIA_HIDDEN_TRUE = true;
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

    function toggleContent(ev) {
      if (isClick(ev)) {
        data.isHidden = true;

        if (data.$refs.content.getAttribute('aria-hidden').toString() === ARIA_HIDDEN_TRUE.toString()) {
          data.isHidden = false;
        }

        if (data.$refs.iconStatus) {
          toggleIcons(data.$refs.iconStatus, userData.statusIcons);
        }

        if (data.$refs.iconController) {
          toggleIcons(data.$refs.iconController, userData.icons);
        }

        data.$refs.content.setAttribute('aria-hidden', data.isHidden.toString());
        data.$refs.controller.setAttribute('aria-expanded', data.isHidden ? 'false' : 'true');
        data.$refs.mAccordion.classList.toggle(CLASS_EXPANDED, !data.isHidden);
      }
    }

    function toggleIcons(icon, list) {
      var addIcon = data.isHidden ? list[0] : list[1];
      var removeIcon = data.isHidden ? list[1] : list[0];
      icon.classList.add('c-icon-' + addIcon);
      icon.classList.remove('c-icon-' + removeIcon);
    }

    function init() {
      var mAccordion = document.getElementById(userData.id);

      if (mAccordion) {
        var controller = mAccordion.querySelector(SELECTOR_CONTROLLER);
        data.$refs = {
          mAccordion: mAccordion,
          controller: controller,
          content: mAccordion.querySelector(SELECTOR_CONTENT),
          iconController: controller.querySelector(SELECTOR_ICON_CONTROLLER),
          iconStatus: mAccordion.querySelector(SELECTOR_ICON_STATUS)
        };
        ['click', 'keypress'].forEach(function (event) {
          data.$refs.controller.addEventListener(event, toggleContent);
        });
      }
    }

    return {
      init: init,
      toggleContent: externalToggleContent
    };
  };
}();

Coronita.ui.mAccordion = function () {
  function init() {
    $('[data-coronita-m-accordion]').each(function () {
      var mAccordion = Coronita.clientflow.mAccordion({
        id: $(this).attr('id')
      });
      mAccordion.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-accordion.js.map
