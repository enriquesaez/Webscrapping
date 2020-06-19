// COMPONENT - c-select
Coronita.clientflow.cSelect = function () {
  var CLASS_SHOW_CONTENT = 'show-content';
  var CLASS_IS_FLOATED = 'is-floated';
  var CLASS_IS_DISABLED = 'is-disabled';
  var SELECTOR_CORONITA_C_SELECT_OPTION_SELECTED = '[data-coronita-c-select-option-selected]';
  var SELECTOR_CORONITA_C_SELECT_COMBOBOX = '[data-coronita-c-select-combobox]';
  var SELECTOR_CORONITA_C_SELECT_LABEL = '[data-coronita-c-select-label]';
  var SELECTOR_LISTBOX_OPTION_CONTENT = '[data-coronita-c-listbox-option-content]';
  var KEY_ENTER = 13;
  var KEY_SPACE = 32;
  var BOOLEAN_FORCE_FLOATED_TRUE = true;
  var BOOLEAN_FORCE_FLOATED_FALSE = false;
  var MOUSE_EVENTS_LISTENER_ADD = true;
  var MOUSE_EVENTS_LISTENER_REMOVE = false;
  var IS_EXPANDED = 'true';
  var IS_NOT_EXPANDED = 'false';
  return function (userData) {
    var data = {
      selectedOption: null
    };

    function clickOption(ev) {
      selectOption(ev.currentTarget);

      if (userData.closeOnClickOption) {
        closeListbox();
      }

      data.$refs.combobox.focus();
    }

    function closeListbox() {
      if (data.$refs.combobox.getAttribute('aria-expanded') === IS_EXPANDED) {
        data.$refs.currentActiveOption = null;
        data.$refs.combobox.setAttribute('aria-expanded', IS_NOT_EXPANDED);
        data.$refs.listbox.classList.remove(CLASS_SHOW_CONTENT);
        data.$refs.listbox = uiCoronitaComponentsListbox.moveResults(userData.id, data.$refs.cSelect);
        uiCoronitaComponentsListbox.mouseEventsListener(MOUSE_EVENTS_LISTENER_REMOVE, data.$refs.combobox, data.$refs.listbox, closeListbox);
        labelFloated(BOOLEAN_FORCE_FLOATED_FALSE);
      }
    }

    function exitListbox() {
      closeListbox();
      data.$refs.combobox.focus();
    }

    function generateListbox() {
      data.$refs.listbox = uiCoronitaComponentsListbox.moveResults(userData.id);
      uiCoronitaComponentsListbox.setPosition(data.$refs.listbox, data.$refs.cSelect);
      Array.from(data.$refs.listbox.children).forEach(function (option) {
        option.addEventListener('click', clickOption);
      });
      uiCoronitaComponentsListbox.mouseEventsListener(MOUSE_EVENTS_LISTENER_ADD, data.$refs.combobox, data.$refs.listbox, closeListbox);
    }

    function labelFloated(forceFloated) {
      var comboValue = data.$refs.input.value;
      var isFloated = (forceFloated || comboValue) && !userData.isLabelOver;

      if (isFloated) {
        data.$refs.label.classList.add(CLASS_IS_FLOATED);
      } else {
        data.$refs.label.classList.remove(CLASS_IS_FLOATED);
      }
    }

    function listboxKeyDown(ev) {
      data.$refs.currentActiveOption = uiCoronitaComponentsListbox.getActiveOption(data);
      uiCoronitaComponentsListbox.listboxKeyDown(ev, data, {
        selectOption: selectOption,
        closeListbox: exitListbox
      });
    }

    function selectDisable() {
      data.$refs.cSelect.classList.add(CLASS_IS_DISABLED);
      data.$refs.input.setAttribute('disabled', 'true');
      data.$refs.label.setAttribute('aria-disabled', 'true');
      data.$refs.label.setAttribute('tabindex', '-1');
    }

    function selectEnable() {
      data.$refs.cSelect.classList.remove(CLASS_IS_DISABLED);
      data.$refs.input.removeAttribute('disabled');
      data.$refs.label.removeAttribute('aria-disabled');
      data.$refs.label.setAttribute('tabindex', '0');
    }

    function selectGetValue() {
      return data.$refs.input.value;
    }

    function selectIsValid() {
      return !Boolean(data.$refs.combobox.getAttribute('aria-invalid')); // eslint-disable-line
    }

    function selectSetValue(value) {
      selectOption(data.$refs.listbox.querySelector("[data-value=\"".concat(value, "\"]")));
      labelFloated(BOOLEAN_FORCE_FLOATED_FALSE);
    }

    function selectOption($activeOption) {
      var oldValue = data.$refs.input.value;

      if ($activeOption) {
        var newValue = $activeOption.getAttribute('data-value');
        uiCoronitaComponentsListbox.setAriaSelected($activeOption);
        setOptionLabel($activeOption);
        var optionSelectedHtml = $activeOption.getAttribute('data-content') ? $activeOption.getAttribute('data-content').trim() : $activeOption.querySelector(SELECTOR_LISTBOX_OPTION_CONTENT).innerHTML.trim();
        data.$refs.optionVisible.innerHTML = optionSelectedHtml;

        if (oldValue !== newValue) {
          data.$refs.input.value = newValue;
          data.selectedOption = $activeOption.id;
          uiCoronitaComponentsListbox.triggerInputChange(data.$refs.input);
        }

        uiCoronitaComponentsListbox.checkActiveDescendant(data.$refs.listbox, data.$refs.listbox);
      }
    }

    function setOptionLabel($activeOption) {
      var selectedText = $activeOption.textContent.trim();
      var labelText = data.$refs.combobox.getAttribute('data-label').trim();
      data.$refs.combobox.setAttribute('aria-label', labelText + (selectedText ? " ".concat(selectedText) : ''));
    }

    function toggleListbox(ev) {
      if (data.$refs.combobox.getAttribute('aria-disabled') !== 'true' && data.$refs.combobox.getAttribute('aria-readonly') !== 'true') {
        var isExpanded = data.$refs.combobox.getAttribute('aria-expanded') === IS_EXPANDED;
        var evIsClick = ev.type === 'click' || ev.keyCode === KEY_ENTER || ev.keyCode === KEY_SPACE;

        if (!isExpanded && evIsClick) {
          ev.preventDefault();
          generateListbox();
          data.$refs.combobox.setAttribute('aria-expanded', IS_EXPANDED);
          data.$refs.listbox.classList.add(CLASS_SHOW_CONTENT);
          data.$refs.listbox.focus();
          data.$refs.listbox.addEventListener('keydown', listboxKeyDown);
          labelFloated(BOOLEAN_FORCE_FLOATED_TRUE);
        } else if (isExpanded && ev.type === 'click') {
          data.$refs.combobox.focus();
          data.$refs.listbox.removeEventListener('keydown', listboxKeyDown);
          closeListbox();
        }
      }
    }

    function validate() {
      return uiCoronitaModulesValidation.validate(data.$refs.input.value, userData.validation, $(data.$refs.cSelect));
    }
    /**
     * init method
     * Call template mixin '_.c_coronita_c_select()' (c_coronita_c_select.tmpl.html)
     * @public
     */


    function init() {
      var cSelect = document.getElementById("c-select-".concat(userData.id));
      data.$refs = {
        cSelect: cSelect,
        combobox: cSelect.querySelector(SELECTOR_CORONITA_C_SELECT_COMBOBOX),
        listbox: document.getElementById("c-listbox-".concat(userData.id)),
        optionVisible: cSelect.querySelector(SELECTOR_CORONITA_C_SELECT_OPTION_SELECTED),
        input: cSelect.querySelector('input'),
        label: cSelect.querySelector(SELECTOR_CORONITA_C_SELECT_LABEL),
        currentActiveOption: null
      };
      var $activeOption = uiCoronitaComponentsListbox.getActiveOption(data);

      if ($activeOption) {
        setOptionLabel($activeOption);
      }

      uiCoronitaComponentsListbox.checkActiveDescendant(data.$refs.listbox, data.$refs.listbox);
      data.$refs.combobox.addEventListener('click', toggleListbox);
      data.$refs.combobox.addEventListener('keydown', toggleListbox);

      if (userData.hasValidation) {
        $(data.$refs.cSelect).data('validate', validate);
      }

      uiCoronitaModulesValidation.init($(data.$refs.listbox), $(cSelect), userData.validation || {}, userData.color);
    }

    return {
      init: init,
      disable: selectDisable,
      enable: selectEnable,
      getValue: selectGetValue,
      setValue: selectSetValue,
      isValid: selectIsValid,
      validate: validate
    };
  };
}();

Coronita.ui.cSelect = function () {
  function init() {
    $('[data-coronita-c-select]').each(function () {
      var cSelect = Coronita.clientflow.cSelect({
        id: $(this).attr('id').split('c-select-')[1],
        closeOnClickOption: true,
        isLabelOver: $(this).hasClass('c-select--label-over')
      });
      cSelect.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-select.js.map
