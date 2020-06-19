// COMPONENT - m-radiogroup-toggle
Coronita.clientflow.mRadiogroupToggle = function () {
  var SELECTOR_CONTENTS = '[data-coronita-m-radiogroup-toggle-contents]';
  return function (userData) {
    var data = {};

    function changeRadio(ev) {
      var target = ev.currentTarget;

      if (target.checked) {
        var contentId = target.getAttribute('aria-controls');
        var currentVisibleContent = data.$refs.contents.querySelector(':scope > [aria-hidden="false"]');

        if (currentVisibleContent) {
          currentVisibleContent.setAttribute('aria-hidden', 'true');
        }

        if (contentId) {
          document.getElementById(contentId).setAttribute('aria-hidden', 'false');
        }
      }
    }
    /**
     * init method
     * @public
     */


    function init() {
      var mRadiogroupToggle = document.getElementById('m-radiogroup-toggle-' + userData.id);
      var controller = mRadiogroupToggle.querySelector('[role="radiogroup"]');
      data.$refs = {
        mRadiogroupToggle: mRadiogroupToggle,
        contents: mRadiogroupToggle.querySelector(SELECTOR_CONTENTS),
        radios: Array.prototype.slice.call(controller.querySelectorAll('input'))
      };
      data.$refs.radios.forEach(function (radio) {
        radio.addEventListener('change', changeRadio);
      });
    }

    return {
      init: init
    };
  };
}();

Coronita.ui.mRadiogroupToggle = function () {
  function init() {
    $('[data-coronita-m-radiogroup-toggle]').each(function () {
      var mRadiogroupToggle = Coronita.clientflow.mRadiogroupToggle({
        id: $(this).attr('id').split('m-radiogroup-toggle-')[1]
      });
      mRadiogroupToggle.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-radiogroup-toggle.js.map
