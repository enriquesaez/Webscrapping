// input predictive script
$(document).ready(function () {
  var listOptions;

  function closeCombo() {
    $(".m-search__button").attr("aria-expanded", "false");
    $(".m-search__wrapper-list").removeClass("show-content");
  }

  function options() {
    var optionId;
    var optionText;
    $.each(listOptions, function () {
      $(this).on("keypress click", function (event) {
        if (event.which === 13 || event.type === 'click') {
          optionId = $(this).attr("id");
          optionText = $(this).text();
          $(this).closest('.m-search__wrapper-list').prev().val($.trim(optionText));
          $(this).attr("aria-selected", "true");
          $(this).siblings().removeAttr("aria-selected");
          $(this).closest('.m-search__box').find('label').addClass('is-floated');
          closeCombo();
        }

        ;
      });
    });
  }

  $(".m-search__input").each(function () {
    var childSelected = $("[aria-selected]", $(this).siblings("ul"));
    var combo = $(this).closest(".m-search");
    var comboValue = $(this).val();

    if ($(this).attr("aria-disabled")) {
      $(this).attr("tabindex", "-1");
    }

    if (childSelected.length > 0) {
      $(this).val(childSelected.text());
    }

    if (comboValue.length > 0 && combo.length) {
      if (!$(this).parent().parent().hasClass('m-search__box--label-over')) {
        $(this).parent().prev().addClass("is-floated");
      }
    }
  });
  $(".m-search__button").on("keypress click", function (event) {
    var input = $(this).prev().find('.m-search__input');

    if (input.val().length != 0) {
      if (!input.is("[disabled]") && !input.is("[readonly]")) {
        if (event.which === 13 || event.type === 'click') {
          listOptions = input.next().find(".m-search__listbox").children();

          if ($(this).is("[aria-expanded=true]")) {
            closeCombo();
          } else {
            closeCombo();
            $(this).attr("aria-expanded", "true");
            input.next().addClass("show-content");
            input.next().find(".m-search__listbox").focus();
            options(listOptions);
          }
        }

        ;
      }

      ;
    }
  });
  $('.m-search__message').on("keypress click", function (event) {
    var defaultText = $(this).html();
    $(this).closest('.m-search__wrapper-list').prev().val(defaultText);
    $(this).prev().children().siblings().removeAttr("aria-selected");
    $(this).closest('.m-search__box').find('label').addClass('is-floated');
    closeCombo();
  });
});
//# sourceMappingURL=m-search.js.map
