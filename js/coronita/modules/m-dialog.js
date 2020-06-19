// MODULE - m-dialog
Coronita.clientflow.mDialog = function () {
  var SELECTOR_BUTTON_CLOSE = '[data-coronita-m-dialog-close]';
  var ATTR_FOCUS_LIMIT = 'data-coronita-m-dialog-focus-limit';
  var SELECTOR_FOCUS_LIMIT = '[' + ATTR_FOCUS_LIMIT + ']';

  function overflowY(overflowHidden) {
    $('body').css({
      'overflow-y': overflowHidden ? 'hidden' : ''
    });
  }

  function isClick(ev, isButton) {
    return ev.key === 'Enter' || ev.type === 'click' || isButton && ev.keyCode === 32;
  }

  function getFocusables($dialog) {
    return $dialog.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"], ' + SELECTOR_FOCUS_LIMIT + ')');
  }

  function retainFocus($dialog) {
    $dialog.find(SELECTOR_FOCUS_LIMIT).on('focus', function () {
      var $focusables = getFocusables($dialog);
      var position = $(this).attr(ATTR_FOCUS_LIMIT);
      $focusables.eq(position === 'end' ? 0 : $focusables.length - 1).focus();
    });
  }

  function closeDialog(data) {
    $(document).off('keyup.dialog');
    data.$dialog.attr('aria-hidden', 'true');
    overflowY(false);
    data.$link.focus();
  }

  function openDialog(data) {
    var $dialog = data.$dialog;
    $dialog.attr('aria-hidden', 'false');
    overflowY(true);
    $(document).on('keyup.dialog', function (ev) {
      if (ev.keyCode === 27) {
        closeDialog(data);
      }
    });
    retainFocus($dialog);

    if (_.isFunction(data.callback)) {
      data.callback();
    }

    $('#' + $dialog.attr('id') + '-title').focus();
  }
  /**
   * init method
   * uiCoronitaModulesDialog.init(this.$el);
   * @param $idViewContainer - jquery object container element selector
   * @public
   */


  function init(data) {
    data.$link.on('click keydown', function (ev) {
      if (isClick(ev, $(ev.currentTarget).is('button, [role="button"]'))) {
        openDialog(data);
      }
    });
    data.$dialog.find(SELECTOR_BUTTON_CLOSE).on('click keydown', function (ev) {
      if (isClick(ev, true)) {
        closeDialog(data);
      }
    });
  }

  return {
    init: init
  };
}();

Coronita.ui.mDialog = function () {
  return {
    init: function init() {
      $('body').find('[data-coronita-m-dialog-link]').each(function () {
        var $link = $(this);
        Coronita.clientflow.mDialog.init({
          $link: $link,
          $dialog: $('#' + $link.attr('data-coronita-m-dialog-link'))
        });
      });
    }
  };
}();
//# sourceMappingURL=m-dialog.js.map
