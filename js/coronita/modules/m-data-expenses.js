// MODULE - m-data-expenses
Coronita.clientflow.mDataExpenses = function () {
  var CLASS_MEDIA_MODE_LANDSCAPE = 'm-data-expenses__media-landscape';
  var CLASS_MEDIA_MODE_PORTRAIT = 'm-data-expenses__media-portrait';

  function setMediaMode(media) {
    var mediaMode = Coronita.helpers.isHorizontal(media) ? CLASS_MEDIA_MODE_LANDSCAPE : CLASS_MEDIA_MODE_PORTRAIT;
    return mediaMode;
  }

  function init(userData) {
    if (userData.$dataExpensesMedia) {
      userData.$dataExpensesMedia.classList.add(setMediaMode(userData.$dataExpensesMedia));
    }
  }

  return {
    init: init
  };
}();

Coronita.ui.mDataExpenses = function () {
  return {
    init: function init() {
      var SELECTOR_DATA_EXPENSES = document.querySelectorAll('[data-coronita-m-data-expenses]');
      Array.from(SELECTOR_DATA_EXPENSES).forEach(function (mDataExpenses) {
        var SELECTOR_DATA_EXPENSES_MEDIA = mDataExpenses.querySelector('[data-coronita-m-data-expenses-media]');
        Coronita.clientflow.mDataExpenses.init({
          $dataExpenses: mDataExpenses,
          $dataExpensesMedia: SELECTOR_DATA_EXPENSES_MEDIA
        });
      });
    }
  };
}();
//# sourceMappingURL=m-data-expenses.js.map
