// OBJECT - o-dropdown
Coronita.ui.oDropdown = function () {
  function closeAll() {
    var $menuBarItem = $('.o-menubar__item');
    $menuBarItem.find('.o-dropdown__controller').removeClass('is-active').attr('aria-expanded', 'false');
    $menuBarItem.find(".o-dropdown__content").removeClass("show-content").attr('aria-hidden', 'true');
  }

  function exitDropdown() {
    $(document).on('keypress click', function (event) {
      if (event.which === 13 || event.type === 'click') {
        var $trigger = $('.o-menubar__item');

        if (!$trigger.has(event.target).length) {
          closeAll();
        }
      }
    });
  }

  function dropdown(event) {
    if (event.which === 13 || event.type === 'click') {
      if ($(this).find('[data-layout-dropdown]').length) {
        var $dropdownController = $(this).find('[data-layout-dropdown]');
        dropdownControllerData = JSON.parse($dropdownController.attr('data-layout-dropdown'));

        if ($(this).is('.is-active')) {
          $dropdownController.contents().last()[0].textContent = dropdownControllerData.text;
          $dropdownController.find('[class^="c-icon-"]').removeClass('c-icon-' + dropdownControllerData.altIcon).addClass('c-icon-' + dropdownControllerData.icon);
        } else {
          $dropdownController.contents().last()[0].textContent = dropdownControllerData.altText;
          $dropdownController.find('[class^="c-icon-"]').removeClass('c-icon-' + dropdownControllerData.icon).addClass('c-icon-' + dropdownControllerData.altIcon);
        }
      }

      var $content = $(this).closest('.o-dropdown').children('.o-dropdown__content');

      if ($(this).closest('.o-menubar__item').length) {
        closeAll();
        $(this).addClass('is-active').attr('aria-expanded', 'true').closest('.o-menubar__item').find('.o-dropdown__content').toggleClass('show-content').attr('aria-hidden', 'false');
      }

      if ($(this).hasClass('is-active') && !$(this).closest('.o-menubar__item').length) {
        $content.removeClass('m-product-operations__content--visible');
        var $this = $(this);
        setTimeout(function () {
          $this.removeClass('is-active').attr('aria-expanded', 'false').closest('.o-dropdown').children('.o-dropdown__content').removeClass('show-content').attr('aria-hidden', 'true');
        }, 0);
      } else {
        $(this).addClass('is-active').attr('aria-expanded', 'true').closest('.o-dropdown').children('.o-dropdown__content').addClass('show-content').attr('aria-hidden', 'false');
        $content.addClass('m-product-operations__content--visible');
      }
    }

    if ($(this).attr('data-layout-controller-hidden')) {
      $(this).addClass('hide-content');
    }

    return false;
  }

  function init() {
    $('.o-dropdown').on('keypress click', '.o-dropdown__controller', dropdown);
    exitDropdown();
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=o-dropdown.js.map
