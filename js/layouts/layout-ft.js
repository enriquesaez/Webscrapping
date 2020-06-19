$(document).ready(function () {
  var tabsBaseClasses = 'text-brand-tertiary bg-grey_100',
      tabsActiveClasses = 'bg-brand-secundary text-white';
  $('[role="tablist"]:not(.c-nav-tabs__tablist)').each(function () {
    $(this).find('[role="tab"]').on('click.fund-tabs', function () {
      $(this).addClass(tabsActiveClasses).removeClass(tabsBaseClasses).siblings().addClass(tabsBaseClasses).removeClass(tabsActiveClasses);
    });
  });
  $('#layout-open-advanced-filter').on('click.filter', function () {
    $focusables = $('[data-layout-filter-area]').find(':focusable');
    $('[data-layout-filter-area]').removeClass('hide-content').attr('aria-hidden', 'false');
    $focusables.eq(0).focus();
  });
  $('[data-layout-filter-close]').on('click.filter', function () {
    $('[data-layout-filter-area]').addClass('hide-content').attr('aria-hidden', 'true');
  });
  /*$('[data-layout-results-area]').find('tr[role="link"]').on('click.row', function (ev) {
    var $target = $(ev.currentTarget),
    $rowContent = $target.next(),
    isHidden = $rowContent.attr('aria-hidden') === 'true';
    $target.next().toggleClass('hide-content').attr('aria-hidden', isHidden ? 'false' : 'true');
  });*/

  $('[data-layout-compare-button] [role="button"]').attr('data-layout-dialog-open', 'o-dialog-compare');
  var $radios = $('[data-layout-table-fund-classes]').find('table tbody input[type="radio"]');
  $radios.on('change', function (ev) {
    var $row = $(ev.currentTarget).closest('tr');
    var $label = $row.find('.c-radiobutton__text');
    $('[data-layout-table-fund-classes]').find('.m-accordion__heading-text').text($label.text());
    $row.find('td, th').each(function () {
      $(this).addClass('bg-brand-primary--white-light text-medium').find('.c-radiobutton__text').addClass('text-medium');
    });
    $row.siblings().each(function () {
      $(this).find('td, th').each(function () {
        $(this).removeClass('bg-brand-primary--white-light text-medium').find('.c-radiobutton__text').removeClass('text-medium');
      });
    });
  });
  $radios.eq(0).change();
  $('[data-coronita-ft-accept-class]').on('click', function (ev) {
    var $accordion = $(ev.currentTarget).closest('[data-layout-m-accordion]');
    var $controller = $accordion.find('[data-layout-accordion-button]');
    $controller.click();
    $('html, body').animate({
      scrollTop: $accordion.offset().top
    }, 0);
  });
  $('[data-layout-ft-fund-type="removed"]').each(function () {
    var $target = $(this).children().eq(0);
    $target.on('click', function (ev) {
      var $box = $target.closest('.o-carousel__content');
      var height = $box.outerHeight() * -1;
      $box.css({
        position: 'relative'
      }).animate({
        top: height,
        opacity: 0
      }, 450, function () {
        var $parent = $box.parent();
        $parent.find('article').last().addClass('margin-right-small');
        var $next = $box.closest('.o-carousel__slide').next().find('article').eq(0).removeClass('margin-right-small');
        $box.remove();
        $next.appendTo($parent);
      });
    });
  });
  $('[data-layout-ft-favorites-check]').find('[type="checkbox"]').on('click', function () {
    var button = $(this).closest('[role="dialog"]').find('.m-dialog__footer [role="button"]');
    var notCheckedItems = $(this).closest('[role="dialog"]').find('[type="checkbox"]:not(:checked)');
    var checkedNum = $(this).closest('[data-layout-ft-favorites-check]').find('[type="checkbox"]:checked').length;

    if (checkedNum > 0) {
      button.attr('tabindex', '0').removeAttr('aria-disabled').removeAttr('disabled').removeClass('is-disabled');
    } else {
      button.attr('tabindex', '-1').attr('aria-disabled', 'true').attr('disabled', true).addClass('is-disabled');
    }

    if (checkedNum > 2) {
      notCheckedItems.attr('disabled', true).closest('.c-checkbox').addClass('is-disabled');
    } else {
      notCheckedItems.removeAttr('disabled').closest('.c-checkbox').removeClass('is-disabled');
    }
  });
});
//# sourceMappingURL=layout-ft.js.map
