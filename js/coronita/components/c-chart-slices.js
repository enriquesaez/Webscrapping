// COMPONENT - c-input-box
Coronita.clientflow.cChartSlices = function () {
  return function () {
    var SELECTOR_SVG_CIRCLES = '.c-chart-slices__svg-circle';
    var SELECTOR_MARKER = '[data-coronita-c-chart-slices-marker]';
    var SELECTOR_SLICE_TEXT = '[data-coronita-c-chart-slices-text]';
    var SELECTOR_SLICE_AMOUNT = '[data-coronita-c-chart-slices-percentage]';
    var SELECTOR_SELECTED = '.is-selected';
    var CLASS_SELECTED = 'is-selected';
    var SELECTOR_EXPAND_LEGEND = '[aria-expanded]';
    var SELECTOR_ICON = '[data-coronita-c-chart-slices-icon]';
    var data = {};

    function isClick(ev) {
      return ev.type === 'click' || ev.keyCode === 13 || ev.keyCode === 32;
    }

    function toggleHiddenLegendItems(ev) {
      if (isClick(ev)) {
        var target = ev.currentTarget;
        var isExpanded = target.getAttribute('aria-expanded') === 'true';
        var hiddenItems = document.getElementById(target.getAttribute('aria-controls')).querySelectorAll('[aria-hidden]');
        Array.prototype.slice.call(hiddenItems).forEach(function (item) {
          item.setAttribute('aria-hidden', isExpanded.toString());
        });
        target.setAttribute('aria-expanded', (!isExpanded).toString());
      }
    }

    function selectedSlice(circle) {
      var selected = data.$refs.cChartSlices.querySelector(SELECTOR_SELECTED);
      var icon = data.$refs.cChartSlices.querySelector(SELECTOR_ICON);
      data.$refs.marker.style.transform = 'rotate(' + circle.getAttribute('data-marker-angle') + 'deg)';
      data.$refs.sliceText.textContent = circle.getAttribute('data-value-text');
      data.$refs.sliceAmount.textContent = circle.getAttribute('aria-valuenow');

      if (selected) {
        selected.setAttribute('class', selected.getAttribute('class').replace(CLASS_SELECTED, ''));
      }

      circle.setAttribute('class', circle.getAttribute('class') + ' ' + CLASS_SELECTED);

      if (icon) {
        icon.innerHTML = _.tmpl('#c-coronita-c-chart-slices-icon', {
          icon: circle.getAttribute('data-icon'),
          color: circle.getAttribute('data-color')
        });
      }
    }

    function renderChart() {
      var angle;
      var markerAngle;
      var lastAngle = 0;
      Array.prototype.slice.call(data.$refs.svgCircles).forEach(function (circle) {
        var valueNow = parseFloat(circle.getAttribute('aria-valuenow'));
        circle.setAttribute('transform', 'rotate(' + lastAngle + ', 110, 110)');
        circle.style.strokeDashoffset = 25.12 - 25.12 * valueNow / 100 + 'em';
        angle = 360 / 100 * valueNow;
        markerAngle = lastAngle + angle / 2;
        lastAngle = lastAngle + angle;

        if (lastAngle >= 360) {
          lastAngle = 0.1;
        }

        circle.setAttribute('data-marker-angle', markerAngle);
        circle.addEventListener('click', function (ev) {
          selectedSlice(circle);
        });
      });
      selectedSlice(data.$refs.svgCircles[0]);
    }
    /**
    * init method
    * @param userData - object with component params
    * @public
    */


    function init(userData) {
      var cChartSlices = document.getElementById(userData.id);
      data.$refs = {
        cChartSlices: cChartSlices,
        svgCircles: cChartSlices.querySelectorAll(SELECTOR_SVG_CIRCLES),
        marker: cChartSlices.querySelector(SELECTOR_MARKER),
        sliceText: cChartSlices.querySelector(SELECTOR_SLICE_TEXT),
        sliceAmount: cChartSlices.querySelector(SELECTOR_SLICE_AMOUNT),
        legend: cChartSlices.querySelector(SELECTOR_EXPAND_LEGEND)
      };
      setTimeout(function () {
        renderChart();
      }, 50);

      if (data.$refs.legend) {
        data.$refs.legend.addEventListener('click', toggleHiddenLegendItems);
        data.$refs.legend.addEventListener('keyup', toggleHiddenLegendItems);
      }
    }

    return {
      init: init
    };
  };
}();

Coronita.ui.cChartSlices = function () {
  function init() {
    $('[data-coronita-c-chart-slices]').each(function () {
      var idCChartSlices = $(this).attr('id') || 'c-chart-slices-' + Math.floor(Math.random() * Date.now());
      $(this).attr('id', idCChartSlices);
      var chart = new Coronita.clientflow.cChartSlices();
      chart.init({
        id: idCChartSlices
      });
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-chart-slices.js.map
