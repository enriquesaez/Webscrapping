// drop down menu script
$(document).ready(function () {
  $('#riesgo').click(function () {
    if ($('#opciones-riesgo').attr('aria-hidden') === 'true') {
      $(this).attr('aria-expanded', 'true'); //$('#opciones-riesgo').removeClass('hide-content');

      $('#opciones-riesgo').attr({
        'aria-hidden': 'false',
        'data-active': 'true'
      });
    } else {
      $(this).attr('aria-expanded', 'false'); //$('#opciones-riesgo').addClass('hide-content');

      $('#opciones-riesgo').attr({
        'aria-hidden': 'true',
        'data-active': 'false'
      });
    }
  }); // $('input[name=opciones-riesgo]').change(function(){
  // 	$('#opciones-riesgo .m-editable-summary__dropdown__item').each(function(){
  // 		$(this).removeClass('is-active');
  // 	});
  // 	$(this).parent().parent().addClass('is-active');
  // })

  $('.m-editable-summary__dropdown__item').click(function () {
    if ($(this).hasClass('is-disabled') == false) {
      $('#opciones-riesgo .m-editable-summary__dropdown__item').each(function () {
        $(this).removeClass('is-active');
      });
      $(this).addClass('is-active');
    }
  });
});
//# sourceMappingURL=m-summary.js.map
