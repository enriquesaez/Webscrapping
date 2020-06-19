// MODULE - m-calculator
Coronita.ui.mCalculator = function () {
  var helper = {
    operations: {
      addition: function addition(val1, val2) {
        return val1 + val2;
      },
      substraction: function substraction(val1, val2) {
        return val1 - val2;
      },
      multiplication: function multiplication(val1, val2) {
        return val1 * val2;
      },
      division: function division(val1, val2) {
        return Math.round(val1 / val2 * 100) / 100;
      }
    }
  };

  function setOperation(operator, val1Text, val2Text) {
    var val1 = !_.isNull(val1Text) ? parseFloat(val1Text) : 0,
        val2 = !_.isNull(val2Text) ? parseFloat(val2Text) : null,
        result;

    if (operator === '+') {
      val2 = !_.isNull(val2) ? val2 : 0;
      result = helper.operations.addition(val1, val2);
    } else if (operator === '-') {
      val2 = !_.isNull(val2) ? val2 : 0;
      result = helper.operations.substraction(val1, val2);
    } else if (operator === '/') {
      val2 = !_.isNull(val2) ? val2 : 1;
      result = helper.operations.division(val1, val2);
    } else {
      val2 = !_.isNull(val2) ? val2 : 1;
      result = helper.operations.multiplication(val1, val2);
    }

    return _.isNaN(result) ? '0,00' : result.toFixed(2).toString().replace('.', ',');
  }

  function calcTotalPage() {
    var total = 0;
    $('[data-layout-result-group]').each(function (groupResult) {
      total += parseFloat($(this).text().replace(',', '.'));
    });
    $('#panel-2 header').eq(0).find('.inblock').text(total.toFixed(2).toString().replace('.', ',') + '€');
  }

  function calcTotalRow(groupRow) {
    var total = 0,
        $groupRow = $(groupRow).closest('section');
    $groupRow.find('.m-calculator').each(function (index, row) {
      total += parseFloat($(row).next().find('span').eq(1).text().replace(',', '.'));
    });
    $groupRow.find('[data-layout-result-group]').text(total.toFixed(2).toString().replace('.', ','));
    setTimeout(function () {
      calcTotalPage();
    }, 10);
  }

  function calc(row, $texts) {
    var operator = $.trim($(row).find('.m-calculator__operator').text()),
        result,
        input1 = $texts.eq(0).filter(':enabled'),
        input2 = $texts.eq(1).filter(':enabled'),
        val1 = input1.val() || null,
        val2 = input2.val() || null;
    result = setOperation(operator, val1, val2);
    $(row).next().find('[data-layout-result-item]').text(result);
    calcTotalRow(row);
  }

  function checks($checkEnable, $texts, $row) {
    var enabled = $checkEnable.is(':checked');
    $row.next().find('[data-layout-result-container]').toggleClass('text-grey_300', !enabled);
    $row.find('[data-layout-operator]').toggleClass('text-grey_300', !enabled);
    $row.find('.c-input-box').toggleClass('is-disabled', !enabled);

    if (!enabled) {
      $texts.attr('disabled', true);
    } else {
      $texts.removeAttr('disabled');
    }
  }

  function init() {
    $('.m-calculator').each(function (index, row) {
      var $texts = $(row).find('[type="text"]'),
          $checkEnable = $(row).siblings().find('[type="checkbox"]'),
          enabled = $checkEnable.is(':checked');
      checks($checkEnable, $texts, $(row));
      calc(row, $texts);
      $texts.on('keyup.operation', function () {
        calc(row, $texts);
      });
      $checkEnable.on('change.operation', function () {
        checks($checkEnable, $texts, $(row));
        calc(row, $texts);
      });
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-calculator.js.map
