// COMPONENT - c-select-box
Coronita.clientflow.cSelectBox = function () {
  var CLASS_IS_DISABLED = 'is-disabled';
  return function (userData) {
    var data = {
      selectedOption: null,
      isDisabled: userData.isDisabled
    };

    function clickOption(ev) {
      selectOption(ev.currentTarget);
    }

    function emptyListbox() {
      if (data.$refs.listbox) {
        removeEvents();
        data.$refs.listbox.parentNode.removeChild(data.$refs.listbox);
        data.$refs.listbox = null;
      }

      data.selectedOption = null;
    }

    function listboxKeyDown(ev) {
      data.$refs.currentActiveOption = uiCoronitaComponentsListbox.getActiveOption(data);
      uiCoronitaComponentsListbox.listboxKeyDown(ev, data, {
        selectOption: selectOption
      });
    }

    function inputDisable() {
      data.$refs.cSelectBox.classList.add(CLASS_IS_DISABLED);
      data.$refs.input.setAttribute('disabled', 'true');
      data.$refs.listbox.setAttribute('aria-disabled', 'true');
      data.$refs.listbox.setAttribute('tabindex', '-1');
      data.isDisabled = true;
      removeEvents();
    }

    function inputEnable() {
      data.$refs.cSelectBox.classList.remove(CLASS_IS_DISABLED);
      data.$refs.input.removeAttribute('disabled');
      data.$refs.listbox.removeAttribute('aria-disabled');
      data.$refs.listbox.setAttribute('tabindex', '0');
      data.isDisabled = false;
      setEvents();
    }

    function inputGetValue() {
      return data.$refs.input.value;
    }

    function inputIsValid() {
      return !Boolean(data.$refs.listbox.getAttribute('aria-invalid')); // eslint-disable-line
    }

    function inputSetValue(value) {
      selectOption(data.$refs.listbox.querySelector("[data-value=\"".concat(value, "\"]")));
    }

    function removeEvents() {
      data.$refs.listbox.removeEventListener('keydown', listboxKeyDown);
      Array.from(data.$refs.listbox.children).forEach(function (option) {
        option.removeEventListener('click', clickOption);
      });
    }

    function selectOption($activeOption) {
      var oldValue = data.$refs.input.value;

      if ($activeOption) {
        var newValue = $activeOption.getAttribute('data-value');
        uiCoronitaComponentsListbox.setAriaSelected($activeOption);

        if (oldValue !== newValue) {
          data.$refs.input.value = newValue;
          data.selectedOption = $activeOption.id;
          uiCoronitaComponentsListbox.triggerInputChange(data.$refs.input);
        }

        uiCoronitaComponentsListbox.checkActiveDescendant(data.$refs.listbox, data.$refs.listbox);
      }
    }

    function setEvents() {
      data.$refs.listbox.addEventListener('keydown', listboxKeyDown);
      Array.from(data.$refs.listbox.children).forEach(function (option) {
        option.addEventListener('click', clickOption);
      });
    }

    function updateListbox(listboxOptions, value) {
      emptyListbox();
      data.$refs.input.value = value || '';
      data.$refs.listbox = document.getElementById("c-listbox-".concat(userData.id));
      uiCoronitaComponentsListbox.checkActiveDescendant(data.$refs.listbox, data.$refs.listbox);
      uiCoronitaModulesValidation.init($(data.$refs.listbox), $(data.$refs.cSelectBox), userData.validation || {}, userData.color);

      if (!data.isDisabled && !userData.isReadonly) {
        setEvents();
      }
    }

    function validateInput() {
      return uiCoronitaModulesValidation.validate(data.$refs.input.value, userData.validation, $(data.$refs.cSelectBox));
    }

    function init() {
      var cSelectBox = document.getElementById("c-select-box-".concat(userData.id));
      data.$refs = {
        cSelectBox: cSelectBox,
        wrapper: cSelectBox.querySelector('[data-coronita-c-select-box-listbox]'),
        listbox: null,
        input: cSelectBox.querySelector('input'),
        currentActiveOption: null
      };

      if (userData.hasValidation) {
        $(data.$refs.cSelectBox).data('validate', validateInput);
      }

      updateListbox(userData.options, userData.value);
    }

    return {
      init: init,
      disable: inputDisable,
      enable: inputEnable,
      getValue: inputGetValue,
      setValue: inputSetValue,
      isValid: inputIsValid,
      validate: validateInput,
      update: updateListbox
    };
  };
}();

Coronita.ui.cSelectBox = function () {
  function init() {
    $('[data-coronita-c-select-box]').each(function () {
      var cSelectBox = Coronita.clientflow.cSelectBox({
        id: $(this).attr('id').split('c-select-box-')[1],
        isDisabled: $(this).is('.is-disabled'),
        isReadonly: $(this).is('.is-readonly'),
        isRequired: $(this).find('[data-coronita-c-listbox]').is('[aria-required="true"]')
      });
      cSelectBox.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-select-box.js.map
