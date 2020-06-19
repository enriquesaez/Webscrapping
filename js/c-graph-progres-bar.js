$(document).ready(function () {
  var data = [{
    month: "Enero",
    cat_1: 350,
    cat_2: 230,
    cat_3: 750,
    cat_4: 750
  }];
  var total = 0;
  var months = [];
  var percentageValue = 0;
  var cat = '';
  var leyend = []; // variable de la suma total de cada bar

  var qt = 2000;
  data.forEach(myFunction);

  function myFunction(item, index) {
    var contadorItems = 0;
    var chartGroup = '<div class="chart-group" id="bar-' + index + '"></div>';
    var barIncremental = '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow data-cat ></div>';
    $(chartGroup).appendTo('.chart'); // Se calcula el total sumando todos los gastos de un data.

    for (var key in item) {
      if (!isNaN(item[key])) {
        total = total + item[key];
      } else {
        months.push(item[key]);
      }
    } // Se calculan los porcentajes de cada valor y se pintan.


    for (var key in item) {
      if (!isNaN(item[key])) {
        percentageValue = item[key] * 100 / qt;
      }

      $(barIncremental).appendTo('#bar-' + index);
      $('#bar-' + index + ' .bar').eq(contadorItems).addClass('bar-' + contadorItems);
      $('#bar-' + index + ' .bar-' + (contadorItems - 1)).css('height', percentageValue + '%').attr('data-cat', key).attr('aria-valuenow', percentageValue).addClass('bg-color-' + key);

      if (leyend.indexOf(key) == -1) {
        leyend.push(key);
      }

      contadorItems++;
    }

    total = 0;
  }

  $('.leyend_item input').change(function () {
    var id = $(this).parent('.leyend_item').find('input').val();
    var bar = $('.bar');

    for (var i = 0; i <= bar.length; i++) {
      if ($($('.bar')[i]).hasClass('js-no-show')) {
        var height = $($('.bar')[i]).attr('aria-valuenow') + '%';
        $($('.bar')[i]).css('max-height', height).removeClass('js-no-show');
      } else {
        if ($($('.bar')[i]).attr('data-cat') == id) {
          $($('.bar')[i]).css('max-height', '0').addClass('js-no-show');
        }
      }
    }
  });
  $('#all').click(function () {
    var check = $('#all').is(":checked");
    var bar = $('.bar');

    if (check == true) {
      for (var i = 0; i <= bar.length; i++) {
        var height = $($('.bar')[i]).attr('aria-valuenow') + '%';
        $($('.bar')[i]).css('max-height', height).removeClass('js-no-show');
        $('.leyend_item').find('input').attr('checked', 'checked');
      }
    } else {
      for (var i = 0; i <= bar.length; i++) {
        $($('.bar')[i]).css('max-height', '0').addClass('js-no-show');
        $('.leyend_item').find('input').attr('checked', false);
      }
    } //$('.leyend_item').

  });
  var range = $('.tab-carousel_itemlist');

  for (var i = 0; i < range.length; i++) {
    if ($($('.tab-carousel_itemlist')[i]).hasClass('active')) {
      console.log($('.bar')[i]);
      $($('.chart-group')[i]).css('opacity', '1');
    }
  }
});
//# sourceMappingURL=c-graph-progres-bar.js.map
