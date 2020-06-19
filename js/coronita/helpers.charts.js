Coronita.helpers.charts = function () {
  var _seed = Date.now();

  var axisData = {
    months: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    year: 2018,
    week: 1
  };
  /*var COLORS = [
    '#4dc9f6',
    '#f67019',
    '#f53794',
    '#537bc4',
    '#acc236',
    '#166a8f',
    '#00a950',
    '#58595b',
    '#8549ba'
  ];*/

  var inputs = {
    min: -100,
    max: 100,
    count: 8,
    decimals: 2,
    continuity: 1
  };

  function getAxisData(params) {
    var axisValues = [],
        i = 0;

    if (params.value === 'years') {
      for (i = 0; i < params.amount; i++) {
        axisValues.push(axisData.year - i);
      }
    }

    if (params.value === 'months') {
      for (i = 0; i < params.amount; i++) {
        axisValues.push(axisData.months[i]);
      }
    }

    if (params.value === 'weeks') {
      for (i = 0; i < params.amount; i++) {
        axisValues.push(axisData.week + i + 'S');
      }
    }

    return axisValues;
  }

  function generateData(config) {
    return numbers(Chart.helpers.merge(inputs, config || {}));
  }

  function line(importParams) {
    var options = {
      maintainAspectRatio: false,
      spanGaps: false,
      elements: {
        line: {
          tension: 0.000001
        }
      },
      plugins: {
        filler: {
          propagate: false
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
            maxRotation: 0
          }
        }]
      }
    };
    var defaults = {
      boundary: 'start',
      backgroundColor: '#D4EDFC',
      borderColor: '#49A5E6'
    };
    var params = $.extend(true, {}, defaults, importParams);
    new Chart(params.id, {
      type: 'line',
      data: {
        labels: getAxisData(params.xAxis),
        datasets: [{
          backgroundColor: params.backgroundColor,
          borderColor: params.borderColor,
          data: generateData({
            count: params.xAxis.amount
          }),
          label: 'Dataset',
          //pointRadius: 0,
          fill: params.boundary
        }]
      },
      options: Chart.helpers.merge(options, {
        legend: {
          display: false
        },
        title: {
          text: null,
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: false
            }
          }],
          yAxes: [{
            display: false
          }]
        },
        tooltips: {
          enabled: false,
          custom: function custom(tooltipModel) {
            var tooltipEl = document.getElementById(params.tooltipId);
            tooltipEl.classList.remove('above', 'below', 'no-transform', 'hide-content');

            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }

            var position = this._chart.canvas.getBoundingClientRect();

            tooltipEl.style.left = tooltipModel.caretX + 24 + 32 + 'px';
            tooltipEl.style.top = tooltipModel.caretY + -40 + 32 + 'px';
          }
        }
      })
    });
  }

  function numbers(config) {
    var cfg = config || {};
    var min = cfg.min || 0;
    var max = cfg.max || 1;
    var from = cfg.from || [];
    var count = cfg.count || 8;
    var decimals = cfg.decimals || 8;
    var continuity = cfg.continuity || 1;
    var dfactor = Math.pow(10, decimals) || 0;
    var data = [];
    var i, value;
    _seed = Date.now();

    for (i = 0; i < count; ++i) {
      value = (from[i] || 0) + rand(min, max);

      if (rand() <= continuity) {
        data.push(Math.round(dfactor * value) / dfactor);
      } else {
        data.push(null);
      }
    }

    return data;
  }

  function rand(min, max) {
    var seed = _seed;
    min = min === undefined ? 0 : min;
    max = max === undefined ? 1 : max;
    _seed = (seed * 9301 + 49297) % 233280;
    return min + _seed / 233280 * (max - min);
  }

  return {
    line: line
  };
}();
//# sourceMappingURL=helpers.charts.js.map
