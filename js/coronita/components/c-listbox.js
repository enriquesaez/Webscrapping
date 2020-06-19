// COMPONENT - c-listbox
uiCoronitaModulesValidation = {
  init: function init() {
    return true;
  }
};

Coronita.clientflow.cListbox = function () {
  var LISTBOX_MOUSE_EVENTS = ['mouseover', 'mouseout', 'focus'];
  var LISTBOX_ID_PREFIX = 'c-listbox-';
  var SELECTOR_LISTBOX_WRAPPER = '[data-coronita-listbox-wrapper]';
  var KEY_ARROW_DOWN = 40;
  var KEY_ARROW_UP = 38;
  var KEY_ESC = 27;
  var KEY_TAB = 9;
  var KEY_ENTER = 13;
  var KEY_SPACE = 32;
  var KEYS_LISTBOX_LOCK_TAB_NAVIGATION = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_TAB, KEY_ESC, KEY_ENTER, KEY_SPACE];
  var KEYS_LISTBOX = [KEY_ARROW_UP, KEY_ARROW_DOWN];

  function appendResults(templateId, results, id, target) {
    (target || document.body).insertAdjacentHTML('beforeend', _.tmpl(templateId, {
      options: results,
      id: id
    }));
    return document.getElementById("".concat(LISTBOX_ID_PREFIX).concat(id));
  }

  function checkActiveDescendant($parent, $listbox) {
    var $selected = $listbox.querySelector('[aria-selected="true"]');

    if ($selected) {
      $parent.setAttribute('aria-activedescendant', $selected.getAttribute('id'));
    }
  }

  function getActiveOption(data) {
    if (data.selectedOption) {
      uiCoronitaComponentsListbox.setAriaSelected(document.getElementById(data.selectedOption));
    }

    return data.$refs.listbox.querySelector('[aria-selected="true"]') || null;
  }

  function getListboxKeys(data) {
    return data.$refs.cSelect ? KEYS_LISTBOX_LOCK_TAB_NAVIGATION : KEYS_LISTBOX;
  }

  function listboxKeyDown(ev, data, callback) {
    if (getListboxKeys(data).includes(ev.keyCode)) {
      ev.preventDefault();
    }

    if (ev.keyCode === KEY_ARROW_UP) {
      listboxKeyDownArrowUp(data, callback);
    } else if (ev.keyCode === KEY_ARROW_DOWN) {
      listboxKeyDownArrowDown(data, callback);
    } else if (typeof callback.closeListbox === 'function' && [KEY_ESC, KEY_ENTER, KEY_SPACE].includes(ev.keyCode)) {
      callback.closeListbox();
    }
  }

  function listboxKeyDownArrowDown(data, callback) {
    var $activeOptionNext = data.$refs.currentActiveOption ? data.$refs.currentActiveOption.nextElementSibling : data.$refs.listbox.children[0];

    if ($activeOptionNext) {
      if ($activeOptionNext.offsetTop >= data.$refs.listbox.offsetHeight - $activeOptionNext.offsetHeight) {
        data.$refs.listbox.scrollTop = data.$refs.listbox.scrollTop + $activeOptionNext.offsetHeight;
      }

      callback.selectOption($activeOptionNext);
    }
  }

  function listboxKeyDownArrowUp(data, callback) {
    var $activeOptionPrev = data.$refs.currentActiveOption ? data.$refs.currentActiveOption.previousElementSibling : null;

    if ($activeOptionPrev) {
      if ($activeOptionPrev.offsetTop - data.$refs.listbox.offsetHeight <= 0 && data.$refs.listbox.scrollTop > 0) {
        data.$refs.listbox.scrollTop = data.$refs.listbox.scrollTop - $activeOptionPrev.offsetHeight;
      }

      callback.selectOption($activeOptionPrev);
    }
  }

  function mouseEventsListener(addListener, $secondary, $focusable, closeListbox) {
    function addFocusoutEvent() {
      $focusable.addEventListener('focusout', closeListbox);
    }

    function removeFocusoutEvent() {
      $focusable.removeEventListener('focusout', closeListbox);
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

    LISTBOX_MOUSE_EVENTS.forEach(function (event) {
      if (addListener) {
        $focusable.addEventListener(event, mouseEvents);
        $secondary.addEventListener(event, mouseEvents);
      } else {
        $focusable.removeEventListener(event, mouseEvents);
        $secondary.removeEventListener(event, mouseEvents);
      }
    });
  }

  function moveResults(id, target) {
    var LISTBOX_ID = LISTBOX_ID_PREFIX + id;
    (target || document.querySelector('body')).appendChild(document.getElementById(LISTBOX_ID));
    return document.getElementById(LISTBOX_ID);
  }

  function removeResults(id) {
    var listbox = document.getElementById(LISTBOX_ID_PREFIX + id);

    if (listbox) {
      listbox.parentNode.removeChild(listbox);
    }

    return null;
  }

  function setAriaSelected($activeOption) {
    var $previousSelectedOption = $activeOption.parentNode.querySelector('[aria-selected="true"]');

    if ($previousSelectedOption) {
      $previousSelectedOption.setAttribute('aria-selected', 'false');
    }

    $activeOption.setAttribute('aria-selected', 'true');
  }

  function setPosition($listbox, $listboxOwner) {
    var $listboxOwnerWrapper = $listboxOwner.querySelector(SELECTOR_LISTBOX_WRAPPER);
    $listbox.style.position = 'absolute';
    $listbox.style.zIndex = 9995;
    $listbox.style.width = $listboxOwnerWrapper.offsetWidth + 'px';
    $listbox.style.left = "".concat($listboxOwnerWrapper.getBoundingClientRect().left + window.pageXOffset, "px");
    $listbox.style.top = "".concat($listboxOwnerWrapper.getBoundingClientRect().top + window.pageYOffset + $listboxOwnerWrapper.offsetHeight, "px");
  }

  function triggerInputChange(input) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('change', true, false);
    input.dispatchEvent(event);
  }

  return {
    appendResults: appendResults,
    checkActiveDescendant: checkActiveDescendant,
    moveResults: moveResults,
    mouseEventsListener: mouseEventsListener,
    removeResults: removeResults,
    setPosition: setPosition,
    triggerInputChange: triggerInputChange,
    listboxKeyDown: listboxKeyDown,
    setAriaSelected: setAriaSelected,
    getActiveOption: getActiveOption
  };
};

uiCoronitaComponentsListbox = Coronita.clientflow.cListbox();
//# sourceMappingURL=c-listbox.js.map
