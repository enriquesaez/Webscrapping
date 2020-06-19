$(document).ready(function () {
  var helper = {
    nextStep: function nextStep(url) {
      $('.js-next').click(function () {
        $(location).attr('href', url);
      });
      $('.js-next').keypress(function (e) {
        if (e.which == 13) {
          $(location).attr('href', url);
        }
      });
    },
    entailmentSelected: function entailmentSelected() {
      $('[data-entailment]').on('keypress click', function (event) {
        var element = $(this),
            rowProduct = '[column-' + element.attr('data-entailment') + ']';

        if (event.which === 13 || event.type === 'click') {
          helper.resetStyleEntailment();
          helper.styleEntailment(element, rowProduct);
        }
      });
    },
    styleEntailment: function styleEntailment(element, rowProduct) {
      element.prev().attr('checked', 'checked');
      element.removeClass('c-button--secondary').addClass('c-button--primary text-medium-italic text-grey_100 bg-brand-secundary');
      element.find('.c-button__text').text('Ipsum');
      element.closest('li').find('[data-layout-info-entailment] span').addClass('text-grey_100');
      element.closest('li').addClass('bg-brand-secundary');
      $(rowProduct).addClass('bg-brand-secundary').removeClass('text-brand-tertiary');
      $(rowProduct).find('span').addClass('text-grey_100');
    },
    resetStyleEntailment: function resetStyleEntailment() {
      var elements = $('[name="entailment"][checked="checked"]');
      rowProduct = '[column-' + elements.next().attr('data-entailment') + ']';
      elements.removeAttr('checked');
      elements.next().addClass('c-button--primary').removeClass('c-button--secondary text-medium-italic text-grey_100 bg-brand-secundary');
      elements.next().find('.c-button__text').text('Lorem');
      elements.closest('li').find('[data-layout-info-entailment] span').removeClass('text-grey_100');
      elements.closest('li').removeClass('bg-brand-secundary');
      $(rowProduct).removeClass('bg-brand-secundary');
      $(rowProduct).find('span').removeClass('text-grey_100');
    }
  };
  helper.nextStep(url);
  helper.entailmentSelected();
});
//# sourceMappingURL=layout-simulacion-hipoteca.js.map
