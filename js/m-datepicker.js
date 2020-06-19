$(document).ready(function () {
  var floatedClass = 'is-floated',
      calendarHelper = {
    exit: function exit(params) {
      $(document).off('click.calendar');
      $(document).off('keyup.calendar');
      params.$calendar.find('[data-layout-calendar-close]').off('click.calendar');
      params.$calendar.addClass('hide-content').attr('aria-hidden', 'true');
    },
    active: function active(params) {
      params.$el.closest('.c-calendar__days').find('[aria-selected]').each(function () {
        $(this).attr('aria-selected', 'false');
      });
      params.$el.closest('[role="grid"]').attr('aria-activedescendant', params.$el.closest('[aria-selected]').attr('id'));
      params.$el.closest('[aria-selected]').attr('aria-selected', 'true');
    }
  };
  $('.m-datepicker').each(function () {
    var $cInputBox = $(this),
        $label = $cInputBox.find('.c-input-box__label'),
        $input = $cInputBox.find('[type="text"]'),
        $calendar = $cInputBox.find('[data-layout-calendar]'),
        $closeCalendar = $calendar.find('[data-layout-calendar-close]');
    $input.on('focus.calendar', function () {
      $closeCalendar.on('click.calendar', function () {
        calendarHelper.exit({
          $calendar: $calendar
        });
      });
      $(document).on('click.calendar', function (ev) {
        var $target = $(ev.target);

        if (!$target.is('.c-calendar') && $target.closest('.c-calendar').length === 0) {
          calendarHelper.exit({
            $calendar: $calendar
          });
        }
      });
      $(document).on('keyup.calendar', function (ev) {
        if (ev.keyCode === 27) {
          calendarHelper.exit({
            $calendar: $calendar
          });
        }
        /*if (ev.keyCode === 9) { // tabulador
         }*/

        /*if (ev.keyCode === 38) { // flecha arriba
         }*/

        /*if (ev.keyCode === 40) { // flecha abajo
         }*/

        /*if (ev.keyCode === 37) { // flecha izquierda
         }*/

        /*if (ev.keyCode === 39) { // flecha dereca
         }*/

        /*if (ev.keyCode ===) {
         }*/

      });
      $calendar.removeClass('hide-content').attr('aria-hidden', 'false').focus();
    });
    $calendar.find('[data-layout-calendar-select]').on('click.calendar, keyup.calendar', function (ev) {
      if (ev.type === 'click' || ev.keyCode === 32 || ev.keyCode === 13) {
        $label.addClass(floatedClass);
        calendarHelper.active({
          $el: $(this)
        });
        calendarHelper.exit({
          $calendar: $calendar
        });
        $input.val($(this).attr('data-layout-calendar-select')).trigger('keyup');
      }
    });
  });
});
//# sourceMappingURL=m-datepicker.js.map
