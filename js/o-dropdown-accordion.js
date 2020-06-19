// drop down menu script
$(document).ready(function () {
  var helper = {
    closeAll: function closeAll() {
      var $menuBarItem = $('.o-menubar__item');
      $menuBarItem.find('.o-dropdown__controller').removeClass('is-active bg-brand-primary--white-light').attr('aria-expanded', 'false');
      $menuBarItem.find(".o-dropdown__content").removeClass("show-content").attr('aria-hidden', 'true');
    }
  };
  $('.o-dropdown').on('click', '.o-dropdown__controller', function () {
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

    if ($(this).closest('.o-menubar__item').length) {
      helper.closeAll();
      $(this).addClass('is-active').attr('aria-expanded', 'true').closest('.o-menubar__item').find('.o-dropdown__content').toggleClass('show-content').attr('aria-hidden', 'false');
    }

    ;

    if ($(this).hasClass('is-active') && !$(this).closest('.o-menubar__item').length) {
      $(this).removeClass('is-active').attr('aria-expanded', 'false').closest('.o-dropdown').children('.o-dropdown__content').removeClass('show-content').attr('aria-hidden', 'true');
      $(this).find('.c-icon-unfold').removeClass('rotate_180');
      var parent = $(this).parents('article').attr('id');

      if (parent === 'movimientos-calendario' || parent === 'movements') {
        $(this).addClass('bg-brand-primary--white-light border-bottom-grey-200');
        $(this).find('dl').addClass('text-brand-medium');

        if (parent === 'movimientos-calendario') {
          $(this).find('.icon').addClass('text-brand-medium').removeClass('text-aqua');
        }
      }
    } else {
      $(this).addClass('is-active').attr('aria-expanded', 'true').closest('.o-dropdown').children('.o-dropdown__content').addClass('show-content').attr('aria-hidden', 'false');
      $(this).find('.c-icon-unfold').addClass('rotate_180');
      var parent = $(this).parents('article').attr('id');
      console.log(parent);

      if (parent === 'movimientos-calendario' || parent === 'movements') {
        $(this).removeClass('bg-brand-primary--white-light border-bottom-grey-200');
        $(this).find('dl').removeClass('text-brand-medium');

        if (parent === 'movimientos-calendario') {
          $(this).find('.icon').removeClass('text-brand-medium').addClass('text-aqua');
        }
      }
    }

    ;
  });
  $(document).on('click', function (event) {
    var $trigger = $('.o-menubar__item');

    if (!$trigger.has(event.target).length) {
      helper.closeAll();
    }
  });
});
//# sourceMappingURL=o-dropdown-accordion.js.map
