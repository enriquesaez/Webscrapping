// COMPONENT - c-input-box
Coronita.clientflow.cDropdown = function () {
  var KEY_INTRO = 13;
  var KEY_SPACE = 32;
  var KEY_UP = 38;
  var KEY_DOWN = 40;
  var KEY_TAB = 9;
  var KEY_ESC = 27;
  var KEY_HOME = 36;
  var KEY_END = 35;
  var CLASS_EXPANDED = 'is-expanded';
  var ATTRIBUTE_EXPANDED = 'data-coronita-c-dropdown-expanded';
  var SELECTOR_C_DROPDOWN_CONTROLLER = '[data-coronita-c-dropdown-expanded]';
  var SELECTOR_C_DROPDOWN_CONTENT_ITEMS = '[role="menuitem"]';
  var EVENTS_POINTER = ['mouseover', 'mouseout', 'focus'];
  var EVENTS_CONTENT_EXPANDED = ['keydown'];
  var EVENTS_BUTTON = ['click', 'keydown'];
  var CLICK_KEYS = [KEY_INTRO, KEY_SPACE, KEY_DOWN, KEY_UP];
  var BOOLEAN_ADD_LISTENER = true;
  var BOOLEAN_REMOVE_LISTENER = false;
  return function (userData) {
    var data = {};

    function closeList() {
      data.$refs.cDropdown.classList.remove(CLASS_EXPANDED);
      data.$refs.controller.setAttribute(ATTRIBUTE_EXPANDED, 'false');
      data.$refs.controller.removeAttribute('aria-expanded');
      EVENTS_CONTENT_EXPANDED.forEach(function (event) {
        data.$refs.content.removeEventListener(event, operateList);
      });
      mouseEventsListener(BOOLEAN_REMOVE_LISTENER);
    }

    function focusFirst() {
      data.$refs.contentItems[0].focus();
    }

    function focusLast() {
      data.$refs.contentItems[data.$refs.contentItems.length - 1].focus();
    }

    function isClick(ev) {
      return ev.type === 'click' || CLICK_KEYS.indexOf(ev.keyCode) !== -1;
    }

    function mouseEventsListener(addListener) {
      function addFocusoutEvent() {
        data.$refs.content.addEventListener('focusout', closeList);
      }

      function removeFocusoutEvent() {
        data.$refs.content.removeEventListener('focusout', closeList);
      }

      function mouseEvents(ev) {
        if (ev.type === 'mouseover' || ev.type === 'focus') {
          removeFocusoutEvent();
        } else {
          addFocusoutEvent();
        }
      }

      if (addListener) {
        addFocusoutEvent();
      }

      EVENTS_POINTER.forEach(function (event) {
        if (addListener) {
          data.$refs.content.addEventListener(event, mouseEvents);
        } else {
          removeFocusoutEvent();
          data.$refs.content.removeEventListener(event, mouseEvents);
        }
      });
    }

    function operateList(ev) {
      mouseEventsListener(BOOLEAN_REMOVE_LISTENER);

      if (ev.keyCode === KEY_UP || ev.keyCode === KEY_TAB && ev.shiftKey) {
        ev.preventDefault();

        if (ev.currentTarget.previousElementSibling) {
          ev.currentTarget.previousElementSibling.focus();
        } else {
          focusLast();
        }
      } else if (ev.keyCode === KEY_DOWN || ev.keyCode === KEY_TAB) {
        ev.preventDefault();

        if (ev.currentTarget.nextElementSibling) {
          ev.currentTarget.nextElementSibling.focus();
        } else {
          focusFirst();
        }
      } else if (ev.keyCode === KEY_ESC) {
        ev.preventDefault();
        closeList();
        data.$refs.controller.focus();
      } else if (ev.keyCode === KEY_HOME) {
        ev.preventDefault();
        focusFirst();
      } else if (ev.keyCode === KEY_END) {
        ev.preventDefault();
        focusLast();
      } else if (ev.keyCode === KEY_INTRO || ev.keyCode === KEY_SPACE) {
        ev.preventDefault();
        ev.currentTarget.click();
      }

      mouseEventsListener(BOOLEAN_ADD_LISTENER);
    }

    function toggleList(ev) {
      if (isClick(ev)) {
        ev.preventDefault();
        var isExpanded = data.$refs.controller.getAttribute(ATTRIBUTE_EXPANDED) === 'true';

        if (!isExpanded) {
          data.$refs.controller.setAttribute(ATTRIBUTE_EXPANDED, 'true');
          data.$refs.controller.setAttribute('aria-expanded', 'true');
          data.$refs.cDropdown.classList.add(CLASS_EXPANDED);

          if (ev.keyCode === KEY_UP) {
            focusLast();
          } else {
            focusFirst();
          }

          EVENTS_CONTENT_EXPANDED.forEach(function (event) {
            data.$refs.contentItems.forEach(function (item) {
              item.addEventListener(event, operateList);
            });
          });
          mouseEventsListener(BOOLEAN_ADD_LISTENER);
        } else {
          closeList();
        }
      }
    }
    /**
     * init method
     * Call template mixin '_.c_coronita_c_dropdown()' (c_coronita_c_dropdown.tmpl.html) in the html file
     * Call init in *.mvc.js, for example in 'afterRender' method:
     * uiCoronitaComponentsDropdown.init(this.$el);
     * @param $idViewContainer - jquery object container element selector
     * @public
     */


    function init() {
      var cDropdown = document.getElementById('c-dropdown-' + userData.id);
      var cDropdownController = cDropdown.querySelector(SELECTOR_C_DROPDOWN_CONTROLLER);
      data.$refs = {
        cDropdown: cDropdown,
        controller: cDropdownController,
        content: document.getElementById(cDropdownController.getAttribute('aria-controls')),
        contentItems: Array.prototype.slice.call(cDropdown.querySelectorAll(SELECTOR_C_DROPDOWN_CONTENT_ITEMS))
      };
      EVENTS_BUTTON.forEach(function (event) {
        data.$refs.controller.addEventListener(event, toggleList);
      });
    }

    return {
      init: init
    };
  };
}();

Coronita.ui.cDropdown = function () {
  function init() {
    $('[data-coronita-c-dropdown]').each(function () {
      var cDropdown = new Coronita.clientflow.cDropdown({
        id: $(this).attr('id').split('c-dropdown-')[1]
      });
      cDropdown.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-dropdown.js.map
