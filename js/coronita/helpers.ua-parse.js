"use strict";

Coronita.helpers.uaParse = function () {
  var uaParser = new UAParser(),
      browser = uaParser.getBrowser(),
      name = browser.name.toLowerCase();
  $('html').addClass(name === 'ie' ? 'msie' : name).addClass('v' + browser.major).addClass(uaParser.getOS().name.split(' ')[0].toLowerCase());
};
//# sourceMappingURL=helpers.ua-parse.js.map
