Coronita.helpers.listbox = function (listboxOptions) {
  var defaults = {
    mainSelector: '.c-combo-box',
    comboboxSelector: '.c-combo-box__combobox',
    listboxSelector: '.c-combo-box__listbox',
    inputSelector: '.c-combo-box__input',
    disabledSelector: '[aria-disabled]',
    type: 'cComboBox'
  },
      listboxParams = $.extend({}, defaults, listboxOptions);

  function closeCombo() {
    $(listboxParams.comboboxSelector).attr("aria-expanded", "false");
    $(listboxParams.listboxSelector).removeClass("show-content");
  }

  function options(listOptions) {
    var optionId, optionText, optionHtml;
    $.each(listOptions, function () {
      $(this).on("keypress click", function (event) {
        if (event.which === 13 || event.type === 'click') {
          optionId = $(this).attr("id");
          optionText = $(this).text();
          optionHtml = $(this).html();
          $(this).parent().prev().attr("aria-activedescendant", optionId);

          if (listboxParams.type === 'cInputPredictive') {
            $(this).parent().prev().attr("value", $.trim(optionText));
          } else if (listboxParams.type === 'cSelect') {
            $(this).parent().prev().find('.c-select__option-selected').html(optionHtml);
          } else {
            $(this).parent().prev().find("input").attr("value", $.trim(optionText));
          }

          $(this).attr("aria-selected", "true");
          $(this).siblings().removeAttr("aria-selected");
          closeCombo();
        }

        ;
      });
    });
  }

  function labelFloated(target) {
    var combo = target.closest(listboxParams.mainSelector);
    var comboValue = target.find("input").val();

    if (combo.length) {
      target.parent().prev().addClass("is-floated");
    }
  }

  $(listboxParams.comboboxSelector).each(function () {
    var childSelected = $("[aria-selected]", $(this).siblings("ul")),
        combo = $(this).closest(listboxParams.mainSelector),
        comboValue = null;

    if (listboxParams.type === 'cInputPredictive') {
      comboValue = $(this).val();
    } else if (listboxParams.type === 'cSelect') {
      comboValue = $(this).find('.c-select__option-selected').text();
    } else {
      comboValue = $(this).find("input").val();
    }

    if ($(this).attr("aria-disabled") === "true") {
      $(this).attr("tabindex", "-1");
    }

    if (childSelected.length > 0) {
      $(this).attr('aria-activedescendant', childSelected.attr('id'));

      if (listboxParams.type === 'cInputPredictive') {
        $(this).val(childSelected.text());
      } else {
        $(listboxParams.inputSelector, this).val(childSelected.text());
      }
    } else {
      $(this).removeAttr("aria-activedescendant");
    }

    if (comboValue.length > 0 && combo.length) {
      $(this).parent().prev().addClass("is-floated");
    }
  });
  $(listboxParams.comboboxSelector).on("keypress click", function (event) {
    if (!$(this).is(listboxParams.disabledSelector) && !$(this).is('[readonly], [aria-readonly="true"]')) {
      if (event.which === 13 || event.type === 'click') {
        var listOptions = $(this).next().children();

        if ($(this).is("[aria-expanded=true]")) {
          closeCombo();
        } else {
          closeCombo();
          $(this).attr("aria-expanded", "true");
          $(this).next().addClass("show-content");
          options(listOptions);
        }

        labelFloated($(this).parent());
      }
    }
  });
};
//# sourceMappingURL=helpers.listbox.js.map
