// OBJECT - o-dialog
Coronita.ui.oDialog = function () {
  function bpDashboardTooltipDialog($dialog, params) {
    var $positioner = $target.closest('[data-layout-dialog-positioner]');
    $dialog.css({
      top: $positioner.outerHeight() + $positioner.position().top + 20,
      left: params.dialog.left
    }).find('.o-dialog__triangle').css({
      left: params.triangle.left
    });
  }

  function tooltipDialog($dialog) {
    if ($dialog.is('#dialog-edit-monthly-income')) {
      var $positioner = $(this).closest('[data-layout-dialog-positioner]');
      $dialog.css({
        top: $positioner.outerHeight() + $positioner.offset().top + 24
      });
    }

    if ($dialog.is('#dialog-bp-edit-income-1')) {
      bpDashboardTooltipDialog($dialog, {
        dialog: {
          left: -434
        },
        triangle: {
          left: 602
        }
      });
    }

    if ($dialog.is('#dialog-bp-edit-income-2')) {
      bpDashboardTooltipDialog($dialog, {
        dialog: {
          left: -302
        },
        triangle: {
          left: 310
        }
      });
    }

    if ($dialog.is('#dialog-bp-edit-income-1a')) {
      bpDashboardTooltipDialog($dialog, {
        dialog: {
          left: -122
        },
        triangle: {
          left: 602
        }
      });
    }

    if ($dialog.is('#dialog-bp-edit-income-2a')) {
      bpDashboardTooltipDialog($dialog, {
        dialog: {
          left: 10
        },
        triangle: {
          left: 310
        }
      });
    }

    if ($dialog.is('#dialog-bp-edit-savings-1')) {
      bpDashboardTooltipDialog($dialog, {
        dialog: {
          left: -242
        },
        triangle: {
          left: 250
        }
      });
    }
  }

  function exitDialog($dialog, $target) {
    $dialog.addClass('hide-content').attr('aria-hidden', 'true');
    $('body').css({
      'overflow-y': ''
    });
    $(document).off('keyup.dialog');
    $target.focus();
  }

  function openDialog(ev, $target) {
    var idDialog = $target.attr('data-layout-dialog-open');
    var $dialog = $('[data-layout-dialog="' + idDialog + '"]');
    var $focusables = $dialog.find(':focusable');
    tooltipDialog($dialog);
    $dialog.removeClass('hide-content').attr('aria-hidden', 'false');
    $('body').css({
      'overflow-y': 'hidden'
    });
    $focusables.eq(0).focus();
    $dialog.find('[data-layout-dialog-close]').on('click.dialog', function () {
      exitDialog($dialog, $target);
    });
    $(document).on('keyup.dialog', function (ev) {
      if (ev.keyCode === 27) {
        exitDialog($dialog, $target);
      }
    });
  }

  function init() {
    $('[data-layout-dialog-open]').on('click.dialog', function (ev) {
      openDialog(ev, $(this));
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=o-dialog.js.map
