// MODULE - m-helper
Coronita.ui.mHelper = function () {
  function tooltip($helper) {
    var $icon = $helper.find('.m-helper__icon'),
        $tooltip = $helper.find('.m-helper__tooltip--top-left, .m-helper__tooltip--top-right, .m-helper__tooltip--bottom-right, .m-helper__tooltip--bottom-left');
    $icon.hover(function () {
      $tooltip.attr('aria-hidden', 'false');
    }, function () {
      $tooltip.attr('aria-hidden', 'true');
    });
    $icon.on('focus.tooltip', function () {
      $tooltip.attr('aria-hidden', 'false');
    });
    $icon.on('blur.tooltip', function () {
      $tooltip.attr('aria-hidden', 'true');
    });
  }

  function init() {
    $('[data-layout-helper], [data-coronita-m-helper]').each(function () {
      tooltip($(this));
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-helper.js.map
