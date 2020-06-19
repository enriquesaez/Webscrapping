Coronita.helpers.mixins = function (listboxOptions) {
  var mixins = {
    c_coronita_c_listbox: function c_coronita_c_listbox() {
      return true;
    },
    getCurrencySymbol: function getCurrencySymbol(currencyCode) {
      var currencySymbols = {
        'EUR': '€',
        'USD': '$',
        'GBP': '£',
        'JPY': '¥'
      };
      return _.isUndefined(currencySymbols[currencyCode]) ? currencyCode : currencySymbols[currencyCode];
    },
    formatNumber: function formatNumber(value, format, dontPrintZeroDecimals) {
      format = format || 'n';

      if (value === null) {
        return '-';
      }

      if (dontPrintZeroDecimals && !_.numberHasDecimals(value)) {
        format = 'd';
      }

      value = typeof value === 'string' ? Globalize.parseFloat(value) : value;

      if (isNaN(value)) {
        return '';
      }

      return Globalize.format(value, format);
    },
    numberHasDecimals: function numberHasDecimals(number) {
      return parseInt(number, 10) !== number;
    },
    tmpl: function tmpl(id, data, setTmplData) {
      var tmpl = $(id),
          template = '',
          tmpl_index = 0,
          contents = tmpl.html(),
          resultErrorMsg,
          getErrorStr = function getErrorStr(error) {
        if (_.isFunction($B.checkInitialStaticLoad)) {
          $B.checkInitialStaticLoad();
        }

        return $B.prepareErrorTmplMsg(data, id, error);
      },
          tryGetTemplate = function tryGetTemplate(data) {
        try {
          data.tmpl_index = tmpl_index;
          template += _.template(contents, data);
          tmpl_index += 1;
        } catch (e) {
          resultErrorMsg = getErrorStr(e);
          template = $B.errorTemplate('Error de templating', [resultErrorMsg]);
        }
      };

      data = data || {};

      if (!tmpl[0]) {
        console.log('No existe el tmpl: ' + id);

        if (_.isFunction($B.checkInitialStaticLoad)) {
          $B.checkInitialStaticLoad();
        }

        return;
      }

      if (!_.isArray(data) && setTmplData === true) {
        data = _.extend(data, {
          tmpl_data: $.extend(true, {}, data)
        });
      }

      if (!data.length) {
        tryGetTemplate(data);
      } else {
        _.each(data, function (d) {
          tryGetTemplate(d);
        });
      }

      return template;
    }
  };

  _.mixin(mixins);

  _.templateSettings = {
    interpolate: /\{\{(.+?)\}\}/g,
    evaluate: /\[\[(.+?)\]\]/g
  };
  $('[data-mixins-clientflow]').each(function () {
    var $container = $(this),
        name = $container.attr('data-mixins-clientflow'),
        params = JSON.parse($container.attr('data-mixins-clientflow-params'));

    if (_.isFunction(_[name])) {
      $container.html(_[name](params));
    } else {
      console.log(name + ' is not a mixin!!!');
    }
  });
};
//# sourceMappingURL=helpers.mixins.js.map
