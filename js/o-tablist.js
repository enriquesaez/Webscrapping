// tabs script

/*
  La estructura del tab debe ser similar a la siguiente:

  <div id="valorRentabilidad" class="o-tablist">
    <ul id="valorRentabilidad-control" role="tablist" class="o-tablist__list c-controls-list flex-justify-center margin-bottom_30">
      <li role="tab" aria-controls="valorRentabilidad-pannel-1" aria-selected="true" class="o-tablist__tab checked">
      ...
      </li>
      ...
    </ul>
    <section id="valorRentabilidad-pannel-1" aria-hidden="false" class="o-tablist__tabpannel">
    ...
    </section>
    <section id="valorRentabilidad-pannel-2" aria-hidden="false" class="o-tablist__tabpannel">
    ...
    </section>
    ...
  </div>

  los ID son de ejemplo, pero es importante que el ID de la capa que envuelve todo el tab, forme parte del ID del resto de elementos (botones, paneles, etc), por si hay varios Tabs en la misma página o dentro de un tab hay otro.
*/
$(document).ready(function () {
  function buttonTabOff(idUl) {
    $('#' + idUl + ' .o-tablist__tab').each(function () {
      $(this).attr("aria-selected", "false").removeClass('checked');
    });
  }

  $('li[role="tab"]').click(function () {
    var controlValue = $(this).attr('aria-controls');
    var idUl = $(this).parent().attr('id');
    var hijosSection = $(this).parent().parent().children('section'); // var hijosSection = $(this).closest('o-content-box__content').children('section');
    // console.log (hijosSection);

    if ($(this).attr('aria-selected') != 'true') {
      // Desactiva todos los botones de la tab pulsada
      buttonTabOff(idUl); // Activa el botón pulsado

      $(this).addClass('checked');
    } // Desactiva todos los paneles de la tab pulsada


    hijosSection.each(function () {
      $(this).attr('aria-hidden', 'true');
    }); // Activa el panel del botón pulsado

    $('#' + controlValue).attr('aria-hidden', 'false');
  });
});
//# sourceMappingURL=o-tablist.js.map
