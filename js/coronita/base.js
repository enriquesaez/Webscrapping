var Coronita = {
  ui: {},
  clientflow: {}
};
var $B = {
  errorTemplate: function errorTemplate(error, data) {
    console.log(data);
    return '<p style="color: red;">' + error + '</p>';
  },
  prepareErrorTmplMsg: function prepareErrorTmplMsg(data, id, error) {
    console.log(data);
    return '<p style="color: red;">' + error + '</p>';
  },
  utils: {}
};
/* \
* $B.utils.currencyCodeToSymbol
[ method ]
* Returns the currency symbol of the given code
> Arguments
- code (string) string of the currency code
= (string) Returns the string symbol of the currency code
> Usage
| $B_utils.currencyCodeToSymbol('USD')
| // returns $
\ */

$B.utils.currencyCodeToSymbol = function () {
  var currencyMap = {
    ALL: '&#76;&#101;&#107;',
    USD: '&#36;',
    USP: '&#36;',
    AFN: '&#1547;',
    ARS: '&#36;',
    AWG: '&#402;',
    AUD: '&#36;',
    AZN: '&#1084;&#1072;&#1085;',
    BSD: '&#36;',
    BBD: '&#36;',
    BYR: '&#112;&#46;',
    BEF: '&#8355;',
    BZD: '&#66;&#90;&#36;',
    BMD: '&#36;',
    BOB: '&#36;&#98;',
    BAM: '&#75;&#77;',
    BWP: '&#80;',
    BGN: '&#1083;&#1074;',
    BRL: '&#82;&#36;',
    BRC: '&#8354;',
    BND: '&#36;',
    KHR: '&#6107;',
    CAD: '&#36;',
    KYD: '&#36;',
    CLP: '&#36;',
    CNY: '&#20803;',
    COP: '&#36;',
    CRC: '&#8353;',
    HRK: '&#107;&#110;',
    CUP: '&#8369;',
    CYP: '&#163;',
    CZK: '&#75;&#269;',
    DKK: '&#107;&#114;',
    DOP: '&#82;&#68;&#36;',
    XCD: '&#36;',
    EGP: '&#163;',
    SVC: '&#36;',
    EEK: '&#107;&#114;',
    EUR: '&#8364;',
    XEU: '&#8352;',
    FKP: '&#163;',
    FJD: '&#36;',
    FRF: '&#8355;',
    GHC: '&#162;',
    GIP: '&#163;',
    GRD: '&#8367;',
    GTQ: '&#81;',
    GGP: '&#163;',
    GYD: '&#36;',
    HNL: '&#76;',
    HKD: '&#72;&#75;&#36;',
    HUF: '&#70;&#116;',
    ISK: '&#107;&#114;',
    INR: '&#82;&#115;',
    IDR: '&#82;&#112;',
    IRR: '&#65020;',
    IEP: '&#163;',
    IMP: '&#163;',
    ILS: '&#8362;',
    ITL: '&#8356;',
    JMD: '&#74;&#36;',
    JPY: '&#165;',
    JEP: '&#163;',
    KZT: '&#1083;&#1074;',
    KPW: '&#8361;',
    KRW: '&#8361;',
    KGS: '&#1083;&#1074;',
    LAK: '&#8365;',
    LVL: '&#76;&#115;',
    LBP: '&#163;',
    LRD: '&#36;',
    CHF: '&#67;&#72;&#70;',
    LTL: '&#76;&#116;',
    LUF: '&#8355;',
    MAD: '&#1583;.&#1605;.',
    MKD: '&#1076;&#1077;&#1085;',
    MYR: '&#82;&#77;',
    MTL: '&#76;&#109;',
    MUR: '&#8360;',
    MXN: '&#36;',
    MNT: '&#8366;',
    MZN: '&#77;&#84;',
    NAD: '&#36;',
    NPR: '&#8360;',
    ANG: '&#402;',
    NLG: '&#402;',
    NZD: '&#36;',
    NIO: '&#67;&#36;',
    NGN: '&#8358;',
    NOK: '&#107;&#114;',
    OMR: '&#65020;',
    PKR: '&#8360;',
    PAB: '&#66;&#47;&#46;',
    PYG: '&#71;&#115;',
    PEN: '&#83;&#47;&#46;',
    PHP: '&#80;&#104;&#112;',
    PLN: '&#122;&#322;',
    QAR: '&#65020;',
    RON: '&#108;&#101;&#105;',
    RUB: '&#1088;&#1091;&#1073;',
    SHP: '&#163;',
    SAR: '&#65020;',
    RSD: '&#1044;&#1080;&#1085;&#46;',
    SCR: '&#8360;',
    SGD: '&#36;',
    SKK: '&#83;&#73;&#84;',
    SBD: '&#36;',
    SOS: '&#83;',
    ZAR: '&#82;',
    ESP: '&#8359;',
    LKR: '&#8360;',
    SEK: '&#107;&#114;',
    SRD: '&#36;',
    SYP: '&#163;',
    TWD: '&#78;&#84;&#36;',
    THB: '&#3647;',
    TTD: '&#84;&#84;&#36;',
    TRY: '&#89;&#84;&#76;',
    TRL: '&#8356;',
    TVD: '&#36;',
    UAH: '&#8372;',
    GBP: '&#163;',
    UYU: '&#36;&#85;',
    UZS: '&#1083;&#1074;',
    VAL: '&#8356;',
    VEB: '&#66;&#115;',
    VND: '&#8363;',
    YER: '&#65020;',
    ZWD: '&#90;&#3;',
    MXP: '&#36;'
  };
  return function (code) {
    var result = code;

    if (currencyMap[code]) {
      result = currencyMap[code];
    }

    return result;
  };
}();

jQuery.extend(jQuery.expr[':'], {
  focusable: function focusable(el, index, selector) {
    return $(el).is('a, button, :input, [tabindex]');
  }
});
Coronita.helpers = {
  keyboardSupport: function keyboardSupport(ev, callback, data) {
    // pendiente parametrizar, no siempre hay que usar las teclas definidas aqui
    var key = event.which;

    if (key === 32 || key === 13) {
      callback.call(this, ev, data);
    }
  }
};
//# sourceMappingURL=base.js.map