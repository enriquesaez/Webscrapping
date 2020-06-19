$(document).ready(function () {
  $('.c-chart-donut__circle').mouseover(function () {
    // obtenemos el padre
    var _thisParent = $(this).parent(); // seleccionamos el slide


    _thisParent.find('.c-chart-donut__circle').attr('data-slice-selected', false);

    $(this).attr('data-slice-selected', true); // cambiamos el icono de la info

    var _info = _thisParent.next();

    var icon = $(this).attr('data-slice-icon');
    var iconColor = $(this).attr('data-slice-color');
    var category = $(this).attr('data-slice-category');

    _info.fadeOut('fast', function () {
      _info.find('i').removeClass();

      _info.find('i').addClass('c-icon-' + icon + ' c-icon--small' + ' text-' + iconColor);

      _info.fadeIn(400);

      _info.find('.c-chart-donut__info-category').text(category);
    });
  });
});
//# sourceMappingURL=c-chart-donut.js.map
