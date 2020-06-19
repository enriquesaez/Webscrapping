$(document).ready(function () {
  Globalize.cultureSelector = 'es-ES';
  Coronita.helpers.uaParse();
  Coronita.helpers.mixins();
  $.each(Coronita.ui, function (ui, uiFn) {
    uiFn.init();
  });
  $('[data-guide-validation]').each(function () {
    $(this).on('click', function () {
      var $component = $(this).siblings().filter('[data-mixins-clientflow], [data-mixins-pug]').children().eq(0);
      var isInvalid = $(this).attr('data-guide-is-invalid') === 'false';
      $(this).attr('data-guide-is-invalid', isInvalid ? 'true' : 'false');
      Coronita.clientflow.cInput.invalid($component, isInvalid, 'This is an error message');
    });
  });
  $('[data-layout-graphics]').each(function () {
    var data = JSON.parse($(this).attr('data-layout-graphics'));
    Coronita.helpers.charts[data.type](data);
  });
});
//# sourceMappingURL=init.js.map
