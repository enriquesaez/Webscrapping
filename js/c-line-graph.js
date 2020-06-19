$(document).ready(function () {
  //var linegraph = $('.c-line-graph__svg');
  //var linegraph = document.querySelectorAll('.c-line-graph');
  $(".c-line-graph").each(function () {
    var id = $(this).attr('id'); // Variable global de posicionamiento en el eje X

    var xPos = 0; // Variable global de porcentaje de desplazamiento en el eje x

    var percentDisplace = 0; // Anchura total del SVG

    var graphWidth = $(this).find('.c-line-graph__container').width();
    var investValue = 0;
    var tempValue = 0;
    var aspectRatio = $(this).find('.c-line-graph__container').attr('data-aspect-ratio'); // Función para calcular el mayor número de un array proporcionado como parámetro. Ese valor representará la altura 100% de la gráfica.

    function biggestNumber(numberArray) {
      var bigDaddy = 0;

      for (i = 0; i <= numberArray.length; i++) {
        if (data[i] > bigDaddy) {
          bigDaddy = numberArray[i];
        }
      }

      return bigDaddy;
    } // Función que es llamada cada vez que hay que desplazar el punto en el path del SVG y el manejador inferior
    // function movePoint(element) {
    //     //element.preventDefault();
    //     //var mouse = element.originalEvent.mouse;
    //     // var touch = element.originalEvent.touches[0] || element.originalEvent.changedTouches[0];
    //     xPos = Math.floor(element.pageX);
    //     console.log ('xPos: ' + xPos);
    //     investValue = parseInt(xPos / spacer);
    //     console.log ('investValue: ' + investValue);
    //     console.log ('tempValue: ' + tempValue);
    //     console.log ('data.length' + data.length);
    //     // if(tempValue != investValue && investValue >= 0 && investValue < data.length) {
    //     //     var valueToShow1 = parseInt(data[investValue]);
    //     //     var valueToShow2 = (data[investValue] % 1).toFixed(2).substring(2);
    //     //     $('.graph-data dd:first-of-type .helper-money').html(valueToShow1 + '<span class="helper-money_cents">' +valueToShow2+ ' €</span>');
    //     //     tempValue = investValue;
    //     // }
    //     percentDisplace = xPos*100/graphWidth;
    //     moveObj(percentDisplace);
    // }
    //Función que se llama para mover efectivamente el punto en el path y el manejador en el eje X
    // function moveObj(percent) {
    //     var percent = (percent*pathLength) / 100;
    //     // obtiene los valores x e y de un punto concreto del path
    //     pt = $(this).find('.c-line-graph__path').get(0).getPointAtLength(percent);
    //     pt.x = Math.round(pt.x);
    //     pt.y = Math.round(pt.y);
    //     console.log ('pt.x: ' + pt.x);
    //     if(pt.x > 0) {
    //         $(this).find('.c-line-graph__handler-line').attr('y2', pt.y);
    //         $(this).find('.c-line-graph__trailmarker').css('transform', 'translate(-50%, -50%) translate3d('+pt.x+'px,'+pt.y+'px, 0)');
    //         $(this).find('.c-line-graph__handler-line').css({'transform':'translateX('+ pt.x +'px)'});
    //     }
    // }
    // Datos mock de valores de la gráfica. Itera los valores del select accesible que contiene los valores a utilizar en la gráfica


    var data = [];
    var idSelect = '#' + id + '-select option';
    $(idSelect).each(function () {
      var value = parseFloat($(this).val());
      data.push(value);
    });
    var dataLength = data.length; // Variable que albergará el set de valores del path de la gráfica. Los path SVG siempre empiezan por M para posicionar por primera vez el "lapiz" virtual

    var pathOutputDataValues = "M"; // Variable que albergará el set de valores del polígono que sirve de relleno a la gráfica. La sintáxis es diferente al path de la línea.

    var polygonOutputDataValues = ""; // Valor más alto del array de valores de la gráfica. Utiliza la función biggestNumber para obtener el valor más alto del array que pasamos como parámetro

    var bigNumber = biggestNumber(data); // Cálculo del valor de separación horizontal entre los vértices de la gráfica

    var spacer = graphWidth / (data.length - 1);
    var dataToInsert = 0;
    var incrementX = 0;

    for (j = 0; j < data.length; j++) {
      dataToInsert = parseInt(graphWidth * aspectRatio) * (data[j] * 100 / bigNumber * 0.01);
      polygonOutputDataValues = polygonOutputDataValues + incrementX + ',' + dataToInsert + ' ';
      pathOutputDataValues = pathOutputDataValues + incrementX + ',' + dataToInsert + ' L';
      incrementX = incrementX + spacer;
    } // Se elimina la última L del set de coordenadas del path del SVG porque es innecesaria y provoca errores de render


    pathOutputDataValues = pathOutputDataValues.substr(0, pathOutputDataValues.length - 2); // Agregamos ambos sets de coordenadas al polígono de relleno y al path de la gráfica.

    $(this).find('.c-line-graph__path').attr('d', pathOutputDataValues);
    $(this).find('.c-line-graph__polyline').attr('points', polygonOutputDataValues + graphWidth + ',0 0,0'); // Agregamos el nuevo valor del viewBox en función del tamaño de la gráfica.

    var pathLength = Math.floor($(this).find('.c-line-graph__path').get(0).getTotalLength());
    var idSvg = id + '-svg';
    document.getElementById(idSvg).setAttribute('viewBox', '0 0 ' + graphWidth + ' ' + parseInt(graphWidth * aspectRatio)); // $(this).find('.c-line-graph__container').on('mousemove',function(e) {
    //     movePoint(e);
    //     $(this).find('.c-line-graph__container').addClass('is-active');
    // });
    // $(this).find('.c-line-graph__container').on('mouseup',function(e) {
    //     movePoint(e);
    //     $(this).find('.c-line-graph__container').removeClass('is-active');
    // });

    $(this).find('#invest-select').change(function () {
      var texto = $(id + '-select').find(':selected').text();
      var valor = $(id + '-select').find(':selected').val();
      $(this).find('.invest-message .date').html(' ' + texto);
      $(this).find('.invest-message .invest-money').html('' + valor + ' €');
    }); // Inicializa la función que mueve el punto a lo largo del path del SVG al cargarse la vista
    //moveObj(0);
  });
});
//# sourceMappingURL=c-line-graph.js.map
