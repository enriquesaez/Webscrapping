// MODULE - h-expenses-card
Coronita.clientflow.hExpensesCard = function () {
  var CLASS_MEDIA_MODE_HORIZONTAL = 'height-medium';
  var CLASS_MEDIA_MODE_VERTICAL = 'width-medium';

  function setMediaMode(media) {
    var mediaMode = Coronita.helpers.isHorizontal(media) ? CLASS_MEDIA_MODE_HORIZONTAL : CLASS_MEDIA_MODE_VERTICAL;
    return mediaMode;
  }

  function init(userData) {
    if (userData.$expensesCardMedia) {
      userData.$expensesCardMedia.classList.add(setMediaMode(userData.$expensesCardMedia));
    }
  }

  return {
    init: init
  };
}();

Coronita.ui.hExpensesCard = function () {
  return {
    init: function init() {
      var SELECTOR_EXPENSES_CARD = document.querySelectorAll('[data-coronita-h-expenses-card]');
      Array.from(SELECTOR_EXPENSES_CARD).forEach(function (hExpensesCard) {
        var SELECTOR_EXPENSES_CARD_MEDIA = hExpensesCard.querySelector('[data-coronita-h-expenses-card-media]');
        Coronita.clientflow.hExpensesCard.init({
          $expensesCard: hExpensesCard,
          $expensesCardMedia: SELECTOR_EXPENSES_CARD_MEDIA
        });
      });
    }
  };
}();
//# sourceMappingURL=h-expenses-card.js.map
