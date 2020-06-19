'use strict'; // container: el id del componente gráfica que pinta
// properties: objeto con las propiedades que va a pintar

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BbvaInfographic =
/*#__PURE__*/
function () {
  function BbvaInfographic(container, properties) {
    _classCallCheck(this, BbvaInfographic);

    this.container = container;
    this.properties = properties;
    this.items = this.container.querySelectorAll(this.properties.selectors.class);
    this.limits = {
      min: this.properties.chart.min,
      max: this.properties.chart.max
    };

    if (window.navigator.vendor === 'Apple Computer, Inc.') {
      this.browser = 'apple';
    } // if (this.properties.selectors.tooltip) {
    //   this.tooltip = true
    // }


    if (this.properties.chart.legend) {
      this.legend = this.container.querySelectorAll(this.properties.chart.legend.class)[0];

      if (this.properties.chart.legend.singleValue) {
        this.legendSimple = true;
      }
    }
  } // addTooltipValue (element, value) {
  //   let thisValue = this.formatValue(value)
  //   element.querySelectorAll(this.properties.selectors.tooltip)[0].appendChild(thisValue)
  // }


  _createClass(BbvaInfographic, [{
    key: "getSliceValue",
    value: function getSliceValue(factor, amount, limit) {
      return factor * amount / limit;
    }
  }, {
    key: "getCssProperty",
    value: function getCssProperty(item, pseudo, prop) {
      var scope = window.getComputedStyle(item, pseudo);
      var value = scope.getPropertyValue(prop);
      return value;
    }
  }, {
    key: "sliceDecimals",
    value: function sliceDecimals(value) {
      var amount;

      if (this.properties.chart.format.decimalsLength !== undefined) {
        amount = this.properties.chart.format.decimalsLength;
      } else {
        amount = 2;
      }

      var decimals = value - Math.floor(value) + '';
      var string = decimals.slice(2, 2 + amount);
      return string;
    }
  }, {
    key: "formatValue",
    value: function formatValue(value) {
      var container = document.createElement('span');
      var decimals = document.createElement('sup');
      var decimalsContent;
      container.setAttribute('class', this.properties.chart.legend.valueClass);

      if (value % 1 === 0) {
        decimalsContent = this.properties.chart.units;
      } else {
        decimalsContent = this.sliceDecimals(value) + this.properties.chart.units;
      }

      decimals.innerHTML = decimalsContent;
      container.innerHTML = parseInt(value).toLocaleString(this.properties.chart.format.code);
      container.appendChild(decimals);
      return container;
    }
  }, {
    key: "setValues",
    value: function setValues(item, index) {
      var cssPropertyValue;
      var thisValue;
      var result;
      var unit;

      switch (this.properties.chart.type) {
        case 'bar':
          thisValue = item.getAttribute(this.properties.selectors.attrVal);
          result = this.getSliceValue(100, thisValue, this.limits.max);
          console.log(result);
          item.setAttribute('style', 'width: ' + result + '%; transition-delay: ' + index * this.properties.chart.barsDelay + 's;'); // if (this.tooltip === true) {
          //   this.addTooltipValue(item, thisValue)
          // }

          break;

        case 'radial':
          cssPropertyValue = this.getCssProperty(item, null, 'stroke-dasharray');

          if (this.browser === undefined) {
            cssPropertyValue = cssPropertyValue.split('px')[0];
            unit = 'px';
          } else {
            cssPropertyValue = cssPropertyValue.split('em')[0];
            unit = 'em';
          }

          thisValue = item.getAttribute(this.properties.selectors.attrVal);
          result = cssPropertyValue - this.getSliceValue(cssPropertyValue, thisValue, this.limits.max);
          item.setAttribute('style', 'stroke-dashoffset: ' + result + unit + '; transition-delay: ' + index * this.properties.chart.barsDelay * 2 + 's;');

          if (this.legend !== undefined) {
            this.buildRadialInfo(thisValue, item);
          }

          break;
      }
    }
  }, {
    key: "buildRadialInfo",
    value: function buildRadialInfo(value, item) {
      var blankLayer = document.createElement('div');
      var thisTarget = item.parentNode.parentNode.querySelectorAll(this.properties.chart.legend.class)[0];
      var valueElement = this.formatValue(value);
      blankLayer.appendChild(valueElement);

      if (this.properties.chart.legend.showTotal) {
        var valueTotal = this.formatValue(this.properties.chart.max);
        blankLayer.appendChild(valueTotal);
      }

      thisTarget.appendChild(blankLayer);
    }
  }, {
    key: "start",
    value: function start() {
      var _this = this;

      this.items.forEach(function (item, index) {
        _this.setValues(item, index);
      });
    }
  }]);

  return BbvaInfographic;
}();

var progressRadial0 = {
  selectors: {
    attrVal: 'aria-valuenow',
    attrMax: 'aria-valuemax',
    class: '.infographic-progress__item'
  },
  chart: {
    legend: {
      class: '.infographic-progress__legend',
      valueClass: 'infographic-progress__value',
      showTotal: true
    },
    units: '€',
    type: 'radial',
    barsDelay: 0.05,
    min: 0,
    max: 1000,
    format: {
      code: 'en',
      // false value for locale auto-detection
      decimalsLength: 2
    }
  }
};
var progressRadial1 = {
  selectors: {
    attrVal: 'aria-valuenow',
    attrMax: 'aria-valuemax',
    class: '.infographic-progress__item'
  },
  chart: {
    legend: {
      class: '.infographic-progress__legend',
      valueClass: 'infographic-progress__value',
      showTotal: true
    },
    units: '€',
    type: 'radial',
    barsDelay: 0.05,
    min: 0,
    max: 2800,
    format: {
      code: 'en',
      // false value for locale auto-detection
      decimalsLength: 1
    }
  }
};
var progressRadial2 = {
  selectors: {
    attrVal: 'aria-valuenow',
    attrMax: 'aria-valuemax',
    class: '.infographic-progress__item'
  },
  chart: {
    legend: {
      class: '.infographic-progress__legend',
      valueClass: 'infographic-progress__value'
    },
    units: '%',
    type: 'radial',
    barsDelay: 0.05,
    min: 0,
    max: 100,
    format: {
      code: 'en',
      // false value for locale auto-detection
      decimalsLength: 0
    }
  }
};
var progressRadial3 = {
  selectors: {
    attrVal: 'aria-valuenow',
    attrMax: 'aria-valuemax',
    class: '.infographic-progress__item'
  },
  chart: {
    type: 'radial',
    barsDelay: 0.05,
    min: 0,
    max: 100
  } //const container0 = document.getElementById('progress-bars')
  //const container1 = document.getElementById('progress-bars-1')
  // const container1 = document.getElementById('progress-bars-1')
  // const container1 = document.getElementById('progress-radial_0')
  // const container2 = document.getElementById('progress-radial_1')
  // const container3 = document.getElementById('progress-radial_2')
  // const container4 = document.getElementById('progress-radial_3')
  //let ProgressBars = new BbvaInfographic(container0, progressBars)
  //let ProgressBars1 = new BbvaInfographic(container1, progressBars)
  // let ProgressBars1 = new BbvaInfographic(container1, progressBars1)
  // let ProgressRadial0 = new BbvaInfographic(container1, progressRadial0)
  // let ProgressRadial1 = new BbvaInfographic(container2, progressRadial1)
  // let ProgressRadial2 = new BbvaInfographic(container3, progressRadial2)
  // let ProgressRadial3 = new BbvaInfographic(container4, progressRadial3)
  //ProgressBars.start()
  //ProgressBars1.start()
  // ProgressBars1.start()
  // ProgressRadial0.start()
  // ProgressRadial1.start()
  // ProgressRadial2.start()
  // ProgressRadial3.start()

};
//# sourceMappingURL=c-progress-bar.js.map
