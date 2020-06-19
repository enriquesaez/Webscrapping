function chart(id) {
  var id = id;
  var n = $(id);
  var angle,
      markerAngle,
      lastAngle = 0.1;
  $.each($(id), function () {
    // $(this).attr('transform', 'rotate(' + lastAngle + ' 110 110)');
    $(this).css({
      transform: 'rotate(' + lastAngle + 'deg)'
    });
    angle = 360 / 100 * $(this).attr('aria-valuenow');
    markerAngle = lastAngle + angle / 2;
    lastAngle = lastAngle + angle;

    if (lastAngle >= 360) {
      lastAngle = 0.1;
    }

    $(this).attr('data-marker-angle', markerAngle);
    $(this).click(function () {
      $(this).parents('.c-svg-pie-chart').find('.marker').css({
        transform: 'rotate(' + $(this).attr('data-marker-angle') + 'deg)'
      });
      $(this).parents('.c-svg-pie-chart').find('.data').text($(this).attr('aria-valuenow'));
      $($(this).parents('.c-svg-pie-chart').find('.selected')).removeClass('selected');
      $(this).addClass('selected');
    });
  });
}

$(document).ready(function () {
  setTimeout(function () {
    chart('#chart-id-0 .c-svg-pie-chart__circle');
    $('#chart-id-0 .c-svg-pie-chart__circle').attr('aria-valuenow', '75');
  }, 1000);
});
//# sourceMappingURL=c-svgchart.js.map
