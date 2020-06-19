$(document).ready(function(){

  $('.c-chart-donut__circle').mouseover(function(){
    // obtenemos el padre
    var _thisParent = $(this).parent();
    // seleccionamos el slide
    _thisParent.find('.c-chart-donut__circle').attr('data-slice-selected', false);
    $(this).attr('data-slice-selected', true);

    // cambiamos el icono de la info
    var _info = _thisParent.next();
    var icon = $(this).attr('data-slice-icon');
    var iconColor = $(this).attr('data-slice-color');
    var category = $(this).attr('data-slice-category');

    _info.fadeOut('fast', function(){
      _info.find('i').removeClass();
      _info.find('i').addClass('c-icon-' + icon + ' c-icon--small' + ' text-' + iconColor);
      _info.fadeIn(400);
      _info.find('.c-chart-donut__info-category').text(category);
    });

  })

});

// COMPONENT - c-combo-box

//- --> js/coronita/components/c-combo-box.js

$(document).ready(function() {
  var helper = {
    
  };

  $('.c-filter-button').hover(function () {
    $(this).parent().find('.c-filter-button--active').attr('data-layout-active', 'true').removeClass('c-filter-button--active');
    $(this).parent().on('mouseleave.filter', function () {
    	
    	$(this).off('mouseleave.filter').find('[data-layout-active]').removeAttr('data-layout-active').addClass('c-filter-button--active');
    });
  }, function () {
    //$(this).parent().find('[data-layout-active]').removeAttr('data-layout-active').addClass('c-filter-button--active');
  });
});
$(document).ready(function() {
    var data = [
        {
          month : "Enero",
          cat_1: 350,
          cat_2: 230,
          cat_3 : 750,
          cat_4: 750,
        },
    ]
    var total = 0;
    var months = [];
    var percentageValue = 0;
    var cat = '';
    var leyend = [];

    // variable de la suma total de cada bar
    var qt = 2000;

    data.forEach(myFunction);

    function myFunction (item, index) {
        var contadorItems = 0;
        var chartGroup = '<div class="chart-group" id="bar-' + index + '"></div>';
        var barIncremental = '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow data-cat ></div>';

        $(chartGroup).appendTo('.chart');
        // Se calcula el total sumando todos los gastos de un data.
        for( var key in item ) {
          if (!isNaN(item[key])){
            total = total + item[key];
          } else {
            months.push(item[key]);
          }
        }
        // Se calculan los porcentajes de cada valor y se pintan.
        for( var key in item ) {
            if (!isNaN(item[key])){
                percentageValue = (item[key]*100)/qt;
            }
            $(barIncremental).appendTo('#bar-'+index);
            $('#bar-'+index+' .bar').eq(contadorItems).addClass('bar-' + contadorItems);

            $('#bar-'+index+' .bar-'+(contadorItems-1)).css('height',percentageValue +'%').attr('data-cat', key).attr('aria-valuenow',percentageValue).addClass('bg-color-'+key);

            if (leyend.indexOf(key) == -1){
                leyend.push(key);
            }
            contadorItems++;
        }
        total = 0;
    }

    $('.leyend_item input').change(function(){
        var id = $(this).parent('.leyend_item').find('input').val();
        var bar = $('.bar');
            for ( var i = 0; i <= bar.length ; i++){
                if ( ($($('.bar')[i])).hasClass('js-no-show')){
                    var height = $($('.bar')[i]).attr('aria-valuenow') + '%';
                    $($('.bar')[i]).css('max-height', height).removeClass('js-no-show');
                }else{
                    if ( ($($('.bar')[i]).attr('data-cat')) == id){
                        $($('.bar')[i]).css('max-height','0').addClass('js-no-show');
                    }
                }
            }
    });

    $('#all').click(function(){
        var check = $('#all').is(":checked");
        var bar = $('.bar');
        if (check == true){
            for ( var i = 0; i <= bar.length ; i++){
                var height = $($('.bar')[i]).attr('aria-valuenow') + '%';
                $($('.bar')[i]).css('max-height', height).removeClass('js-no-show');
                $('.leyend_item').find('input').attr('checked','checked');
            }
        }else{
            for ( var i = 0; i <= bar.length ; i++){
                $($('.bar')[i]).css('max-height','0').addClass('js-no-show');
                $('.leyend_item').find('input').attr('checked',false);
            }

        }

        //$('.leyend_item').
    });

    var range = $('.tab-carousel_itemlist');
    for ( var i = 0; i < range.length ; i++){
        if ($($('.tab-carousel_itemlist')[i]).hasClass('active')){
            console.log($('.bar')[i]);
            $($('.chart-group')[i]).css('opacity','1');
        }
    }


});
// MODULE - c-input-box

//- --> js/coronita/components/c-input-box.js
//- --> js/coronita/components/c-input-currency.js
//- --> js/coronita/components/c-textarea.js

// COMPONENT - c-input-file

//- --> js/coronita/components/c-input-file.js
// COMPONENT - c-input-predictive

//- --> js/coronita/components/c-input-predictive.js

$(document).ready(function() {
    //var linegraph = $('.c-line-graph__svg');
    //var linegraph = document.querySelectorAll('.c-line-graph');
    $(".c-line-graph").each(function(){
        var id = $(this).attr('id');
        // Variable global de posicionamiento en el eje X
        var xPos = 0;

        // Variable global de porcentaje de desplazamiento en el eje x
        var percentDisplace = 0;

        // Anchura total del SVG
        var graphWidth = $(this).find('.c-line-graph__container').width();

        var investValue = 0;
        var tempValue = 0;

        var aspectRatio = $(this).find('.c-line-graph__container').attr('data-aspect-ratio');

        // Función para calcular el mayor número de un array proporcionado como parámetro. Ese valor representará la altura 100% de la gráfica.
        function biggestNumber(numberArray) {
            var bigDaddy = 0;
            for(i=0; i<= numberArray.length; i++) {
                if(data[i] > bigDaddy) {
                    bigDaddy = numberArray[i];
                }
            }
            return bigDaddy;
        }
        // Función que es llamada cada vez que hay que desplazar el punto en el path del SVG y el manejador inferior
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
        var data=[];
        var idSelect = '#' + id + '-select option';
        $(idSelect).each(function() {
            var value = parseFloat($(this).val());
            data.push(value);
        });
        var dataLength = data.length;

        // Variable que albergará el set de valores del path de la gráfica. Los path SVG siempre empiezan por M para posicionar por primera vez el "lapiz" virtual
        var pathOutputDataValues = "M";

        // Variable que albergará el set de valores del polígono que sirve de relleno a la gráfica. La sintáxis es diferente al path de la línea.
        var polygonOutputDataValues = "";

        // Valor más alto del array de valores de la gráfica. Utiliza la función biggestNumber para obtener el valor más alto del array que pasamos como parámetro
        var bigNumber = biggestNumber(data);

        // Cálculo del valor de separación horizontal entre los vértices de la gráfica
        var spacer = graphWidth/(data.length-1);

        var dataToInsert = 0;
        var incrementX = 0;

        for(j=0; j< data.length; j++) {
            dataToInsert = (parseInt(graphWidth*aspectRatio))*(((data[j]*100)/bigNumber)*0.01);
            polygonOutputDataValues = polygonOutputDataValues + incrementX + ',' + dataToInsert + ' ';
            pathOutputDataValues = pathOutputDataValues + incrementX + ',' + dataToInsert + ' L';
            incrementX = incrementX + spacer;
        }
        // Se elimina la última L del set de coordenadas del path del SVG porque es innecesaria y provoca errores de render
        pathOutputDataValues = pathOutputDataValues.substr(0,pathOutputDataValues.length-2);

        // Agregamos ambos sets de coordenadas al polígono de relleno y al path de la gráfica.
        $(this).find('.c-line-graph__path').attr('d', pathOutputDataValues);
        $(this).find('.c-line-graph__polyline').attr('points', polygonOutputDataValues + graphWidth + ',0 0,0');

        // Agregamos el nuevo valor del viewBox en función del tamaño de la gráfica.
        var pathLength = Math.floor( $(this).find('.c-line-graph__path').get(0).getTotalLength() );
        var idSvg = id + '-svg';
        document.getElementById(idSvg).setAttribute('viewBox', '0 0 '+ graphWidth + ' '+(parseInt(graphWidth*aspectRatio)));

        // $(this).find('.c-line-graph__container').on('mousemove',function(e) {
        //     movePoint(e);
        //     $(this).find('.c-line-graph__container').addClass('is-active');
        // });
        // $(this).find('.c-line-graph__container').on('mouseup',function(e) {
        //     movePoint(e);
        //     $(this).find('.c-line-graph__container').removeClass('is-active');
        // });

        $(this).find('#invest-select').change(function() {
            var texto = $(id + '-select').find(':selected').text();
            var valor = $(id + '-select').find(':selected').val();
            $(this).find('.invest-message .date').html(' ' + texto);
            $(this).find('.invest-message .invest-money').html('' + valor + ' €');
        });
        // Inicializa la función que mueve el punto a lo largo del path del SVG al cargarse la vista
        //moveObj(0);
    });
});

// COMPONENT - c-slider

//- --> js/coronita/components/c-slider.js

function chart(id){
    var id = id;
    var n = $(id);

        var angle,
            markerAngle,
            lastAngle = 0.1;

        $.each($(id), function() {

            // $(this).attr('transform', 'rotate(' + lastAngle + ' 110 110)');
            $(this).css({
                transform: 'rotate(' + lastAngle + 'deg)'
            });

            angle = (360 / 100) * $(this).attr('aria-valuenow');
            markerAngle = lastAngle + (angle / 2);
            lastAngle = lastAngle + angle;
            if(lastAngle >= 360) {
                lastAngle = 0.1;
            }

            $(this).attr('data-marker-angle', markerAngle);

            $(this).click(function() {
                $(this).parents('.c-svg-pie-chart').find('.marker').css({
                    transform: 'rotate(' + $(this).attr('data-marker-angle') + 'deg)'
                });
                $(this).parents('.c-svg-pie-chart').find('.data').text($(this).attr('aria-valuenow'));
                $($(this).parents('.c-svg-pie-chart').find('.selected')).removeClass('selected');
                $(this).addClass('selected');
            });
        });
}
$(document).ready(function(){
  setTimeout(function () {
    chart('#chart-id-0 .c-svg-pie-chart__circle');
    $('#chart-id-0 .c-svg-pie-chart__circle').attr('aria-valuenow', '75');
  }, 1000)
});

$(document).ready(function () {
  function rowDetail ($target) {
    var $rowContent = $target.next(),
      isHidden = $rowContent.attr('aria-hidden') === 'true';
    $rowContent.toggleClass('hide-content').attr('aria-hidden', isHidden ? 'false' : 'true')
  }

  $('[data-layout-o-table-row-link]').each(function () {
    $(this).on('keyup.row', function (ev) {
      if (ev.keyCode === 13) {
        rowDetail($(ev.currentTarget).closest('tr'));
      }
    });
    $(this).on('click.row', function (ev) {
      rowDetail($(ev.currentTarget));
    });
  });
});

// MODULE - m-accordion

//- --> js/coronita/modules/m-accordion.js

// MODULE - m-calculator

//- --> js/coronita/modules/m-calculator.js

$(document).ready(function() {
  var floatedClass = 'is-floated',
    calendarHelper = {
      exit: function (params) {
        $(document).off('click.calendar');
        $(document).off('keyup.calendar');
        params.$calendar.find('[data-layout-calendar-close]').off('click.calendar');
        params.$calendar.addClass('hide-content').attr('aria-hidden', 'true');
      },
      active: function (params) {
        params.$el
          .closest('.c-calendar__days')
          .find('[aria-selected]')
          .each(function () {
            $(this).attr('aria-selected', 'false');
          });
        params.$el
          .closest('[role="grid"]')
          .attr('aria-activedescendant', params.$el.closest('[aria-selected]').attr('id'))
        params.$el
          .closest('[aria-selected]')
          .attr('aria-selected', 'true');
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
      if (ev.type === 'click' || (ev.keyCode === 32 || ev.keyCode === 13)) {
        $label.addClass(floatedClass);
        calendarHelper.active({
          $el: $(this)
        })
        calendarHelper.exit({
          $calendar: $calendar
        });
        $input.val($(this).attr('data-layout-calendar-select')).trigger('keyup');
      }
    });
  });
});
// MODULE - m-helper

//- --> js/coronita/modules/m-helper.js

// input predictive script

$(document).ready(function() {

  var listOptions;

  function closeCombo() {
    $(".m-search__button").attr("aria-expanded", "false");
    $(".m-search__wrapper-list").removeClass("show-content");
  }

  function options() {
    var optionId;
    var optionText;
    $.each(listOptions, function() {
      $(this).on("keypress click", function(event) {
        if (event.which === 13 || event.type === 'click') {
          optionId = $(this).attr("id");
          optionText = $(this).text();
          $(this).closest('.m-search__wrapper-list').prev().val($.trim(optionText));
          $(this).attr("aria-selected", "true");
          $(this).siblings().removeAttr("aria-selected");
          $(this).closest('.m-search__box').find('label').addClass('is-floated');
          closeCombo();
        };
      });
    });
  }

  $(".m-search__input").each(function(){
    var childSelected= $("[aria-selected]",$(this).siblings("ul"));
    var combo = $(this).closest(".m-search");
    var comboValue = $(this).val();
    if ($(this).attr("aria-disabled")) {
      $(this).attr("tabindex", "-1");
    }
    if (childSelected.length > 0) {
      $(this).val(childSelected.text());
    }
    if (comboValue.length > 0 && combo.length) {
      if(!$(this).parent().parent().hasClass('m-search__box--label-over')) {
        $(this).parent().prev().addClass("is-floated");
      }
    }
  })

  $(".m-search__button").on("keypress click", function(event) {
    var input = $(this).prev().find('.m-search__input');
    if(input.val().length!=0) {
      if (!input.is("[disabled]") && !input.is("[readonly]")) {
        if (event.which === 13 || event.type === 'click') {
          listOptions = input.next().find(".m-search__listbox").children();
          if ($(this).is("[aria-expanded=true]")) {
            closeCombo();
          } else {
            closeCombo();
            $(this).attr("aria-expanded", "true");
            input.next().addClass("show-content");
            input.next().find(".m-search__listbox").focus();
            options(listOptions);
          }
        };
      };
    }
  });

  $('.m-search__message').on("keypress click", function(event) {
    var defaultText = $(this).html();
    $(this).closest('.m-search__wrapper-list').prev().val(defaultText);
    $(this).prev().children().siblings().removeAttr("aria-selected");
    $(this).closest('.m-search__box').find('label').addClass('is-floated');
    closeCombo();
  });

});

// drop down menu script
$(document).ready(function() {
	$('#riesgo').click(function(){
		if ($('#opciones-riesgo').attr('aria-hidden')==='true'){
			$(this).attr('aria-expanded', 'true');
			//$('#opciones-riesgo').removeClass('hide-content');
			$('#opciones-riesgo').attr({'aria-hidden': 'false', 'data-active': 'true'});
		} else {
			$(this).attr('aria-expanded', 'false');
			//$('#opciones-riesgo').addClass('hide-content');
			$('#opciones-riesgo').attr({'aria-hidden': 'true', 'data-active': 'false'});
		}
	})
	// $('input[name=opciones-riesgo]').change(function(){
	// 	$('#opciones-riesgo .m-editable-summary__dropdown__item').each(function(){
	// 		$(this).removeClass('is-active');
	// 	});
	// 	$(this).parent().parent().addClass('is-active');
	// })
	$('.m-editable-summary__dropdown__item').click(function(){
		if($(this).hasClass('is-disabled') == false) {
			$('#opciones-riesgo .m-editable-summary__dropdown__item').each(function(){
				$(this).removeClass('is-active');
			});
			$(this).addClass('is-active');
		}
	})
});
// OBJECT - o-carousel

//- --> js/coronita/modules/o-carousel.js

// OBJECT - o-dialog

//- --> js/coronita/objects/o-dialog.js

// drop down menu script
$(document).ready(function() {
  var helper = {
    closeAll: function () {
      var $menuBarItem = $('.o-menubar__item');
      $menuBarItem
        .find('.o-dropdown__controller')
        .removeClass('is-active bg-brand-primary--white-light')
        .attr('aria-expanded', 'false');

      $menuBarItem
        .find(".o-dropdown__content")
        .removeClass("show-content")
        .attr('aria-hidden', 'true');
      }
  }

  $('.o-dropdown').on('click', '.o-dropdown__controller', function() {

    if ($(this).find('[data-layout-dropdown]').length) {
      var $dropdownController = $(this).find('[data-layout-dropdown]');
        dropdownControllerData = JSON.parse($dropdownController.attr('data-layout-dropdown'));
      if ($(this).is('.is-active')) {
        $dropdownController.contents().last()[0].textContent = dropdownControllerData.text;
        $dropdownController.find('[class^="c-icon-"]').removeClass('c-icon-' + dropdownControllerData.altIcon).addClass('c-icon-' + dropdownControllerData.icon);
      } else {
        $dropdownController.contents().last()[0].textContent = dropdownControllerData.altText;
        $dropdownController.find('[class^="c-icon-"]').removeClass('c-icon-' + dropdownControllerData.icon).addClass('c-icon-' + dropdownControllerData.altIcon);
      }
    }

    if ($(this).closest('.o-menubar__item').length) {
      helper.closeAll();
      $(this)
        .addClass('is-active')
        .attr('aria-expanded', 'true')
        .closest('.o-menubar__item')
        .find('.o-dropdown__content')
        .toggleClass('show-content')
        .attr('aria-hidden', 'false');

    };
    if ($(this).hasClass('is-active') && !($(this).closest('.o-menubar__item').length) ) {
      $(this)
        .removeClass('is-active')
        .attr('aria-expanded', 'false')
        .closest('.o-dropdown')
        .children('.o-dropdown__content')
        .removeClass('show-content')
        .attr('aria-hidden', 'true');
        $(this).find('.c-icon-unfold').removeClass('rotate_180');

        var parent = $(this).parents('article').attr('id');
        if (parent === 'movimientos-calendario' || parent === 'movements'){
          $(this).addClass('bg-brand-primary--white-light border-bottom-grey-200')
          $(this).find('dl').addClass('text-brand-medium')
          if (parent === 'movimientos-calendario'){
            $(this).find('.icon').addClass('text-brand-medium').removeClass('text-aqua');
          }
        }

    } else {
      $(this)
        .addClass('is-active')
        .attr('aria-expanded', 'true')
        .closest('.o-dropdown')
        .children('.o-dropdown__content')
        .addClass('show-content')
        .attr('aria-hidden', 'false');
        $(this).find('.c-icon-unfold').addClass('rotate_180');

        var parent = $(this).parents('article').attr('id');
        console.log(parent);
        if (parent === 'movimientos-calendario' || parent === 'movements'){
          $(this).removeClass('bg-brand-primary--white-light border-bottom-grey-200')
          $(this).find('dl').removeClass('text-brand-medium')

          if (parent === 'movimientos-calendario'){
            $(this).find('.icon').removeClass('text-brand-medium').addClass('text-aqua');
          }
        }

    };
  });

  $(document).on('click', function(event) {
      var $trigger = $('.o-menubar__item');
      if(!$trigger.has(event.target).length) {
        helper.closeAll();
      }
  });
});

// OBJECT - o-dropdown

//- --> js/coronita/objects/o-dropdown.js

var KEYCODE = {
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    UP: 38
}

// Al cargar la página se buscan todos los elementos con 'role=radio' y se guardan en un array
// Se escuchan los eventos: click, keydown, focus y blur de cada elemento, llamando a la correspondiente función.
$(document).ready(function(){

  var radiobuttons = document.querySelectorAll('[role=radio]');

  for(var i = 0; i < radiobuttons.length; i++ ) {
    var rb = radiobuttons[i];

    rb.addEventListener('click', clickRadioGroup);
    rb.addEventListener('keydown', keyDownRadioGroup);
    rb.addEventListener('focus', focusRadioButton);
    rb.addEventListener('blur', blurRadioButton);
  }

});


/*
* @function firstRadioButton
*
* @desc Returns the first radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function firstRadioButton(node) {

  var first = node.parentNode.firstChild;

  while(first) {
    if (first.nodeType === Node.ELEMENT_NODE) {
      if (first.getAttribute("role") === 'radio') return first;
    }
    first = first.nextSibling;
  }

  return null;
}

/*
* @function lastRadioButton
*
* @desc Returns the last radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function lastRadioButton(node) {

  var last = node.parentNode.lastChild;

  while(last) {
    if (last.nodeType === Node.ELEMENT_NODE) {
      if (last.getAttribute("role") === 'radio') return last;
    }
    last = last.previousSibling;
  }

  return last;
}

/*
* @function nextRadioButton
*
* @desc Returns the next radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function nextRadioButton(node) {

  var next = node.nextSibling;

  while(next) {
    if (next.nodeType === Node.ELEMENT_NODE) {
      if (next.getAttribute("role") === 'radio') return next;
    }
    next = next.nextSibling;
  }

  return null;
}

/*
* @function previousRadioButton
*
* @desc Returns the previous radio button
*
* @param   {Object}  event  =  Standard W3C event object
*/

function previousRadioButton(node) {

  var prev = node.previousSibling;

  while(prev) {
    if (prev.nodeType === Node.ELEMENT_NODE) {
      if (prev.getAttribute("role") === 'radio') return prev;
    }
    prev = prev.previousSibling;
  }

  return null;
}

/*
* @function getImage
*
* @desc Gets the image for radio box
*
* @param   {Object}  event  =  Standard W3C event object
*/

function getImage(node) {

  var child = node.firstChild;

  while(child) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      if (child.tagName === 'IMG') return child;
    }
    child = child.nextSibling;
  }

  return null;
}

/*
* @function setRadioButton
*
* @desc Toogles the state of a radio button
*
* @param   {Object}  event  -  Standard W3C event object
*
*/

function setRadioButton(node, state) {
  var image = getImage(node);

  if (state == 'true') {
    node.setAttribute('aria-checked', 'true')
    node.tabIndex = 0;
    node.focus()
  }
  else {
    node.setAttribute('aria-checked', 'false') 
    node.tabIndex = -1;
  }
}

/*
* @function clickRadioGroup
*
* @desc
*
* @param   {Object}  node  -  DOM node of updated group radio buttons
*/

function clickRadioGroup(event) {
  var type = event.type;

  if (type === 'click') {
    // If either enter or space is pressed, execute the funtion

    var node = event.currentTarget;

    var radioButton = firstRadioButton(node);

    while (radioButton) {
      setRadioButton(radioButton, "false");
      radioButton = nextRadioButton(radioButton);
    }

    setRadioButton(node, "true");

    event.preventDefault();
    event.stopPropagation();
  }
}

/*
* @function keyDownRadioGroup
*
* @desc
*
* @param   {Object}   node  -  DOM node of updated group radio buttons
*/

function keyDownRadioGroup(event) {
  var type = event.type;
  var next = false;

  if(type === "keydown"){
    var node = event.currentTarget;

    switch (event.keyCode) {
      case KEYCODE.DOWN:
      case KEYCODE.RIGHT:
        var next = nextRadioButton(node);
        if (!next) next = firstRadioButton(node); //if node is the last node, node cycles to first.
        break;

      case KEYCODE.UP:
      case KEYCODE.LEFT:
        next = previousRadioButton(node);
        if (!next) next = lastRadioButton(node); //if node is the last node, node cycles to first.
        break;

      case KEYCODE.SPACE:
        next = node;
        break;
    }

    if (next) {
      var radioButton = firstRadioButton(node);

      while (radioButton) {
        setRadioButton(radioButton, "false");
        radioButton = nextRadioButton(radioButton);
      }

      setRadioButton(next, "true");

      event.preventDefault();
      event.stopPropagation();
    }
  }
}

/*
* @function focusRadioButton
*
* @desc Adds focus styling to label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/

function focusRadioButton(event) {
  event.currentTarget.className += ' is-checked';
}

/*
* @function blurRadioButton
*
* @desc Adds focus styling to the label element encapsulating standard radio button
*
* @param   {Object}  event  -  Standard W3C event object
*/

function blurRadioButton(event) {
   event.currentTarget.className = event.currentTarget.className.replace(' is-checked','');
}
$(document).ready(function() {
	$('.o-menubar').setup_navigation();
}); 

$.fn.setup_navigation = function(settings) {

	settings = jQuery.extend({
		menuHoverClass: 'show-content',
	}, settings);
	
	// Add ARIA role to menubar and menu items
	// $(this).attr('role', 'menubar').find('li').attr('role', 'menuitem');
	
	var top_level_links = $(this).find('.o-menubar__link');

	// Added by Terrill: (removed temporarily: doesn't fix the JAWS problem after all)
	// Add tabindex="0" to all top-level links 
	// Without at least one of these, JAWS doesn't read widget as a menu, despite all the other ARIA
	//$(top_level_links).attr('tabindex','0');

	
	$(top_level_links).hover(
		function(){
			if ($(this).is('[aria-haspopup]')) {
				$(this).attr('aria-expanded', 'true');
			};
			$(this).closest('.o-menubar')
				.find('.'+settings.menuHoverClass)
					.attr('aria-hidden', 'true')
					.removeClass(settings.menuHoverClass);
			$(this).next('.o-menubar__menu')
				.attr('aria-hidden', 'false')
				.addClass(settings.menuHoverClass);
		},
		function(){
			if ($(this).is('[aria-haspopup]')) {
				$(this).attr('aria-expanded', 'false');
			};
		}
	);
	$(top_level_links).focus(function(){
		if ($(this).is('[aria-haspopup]')) {
			$(this).attr('aria-expanded', 'true');
		};
		$(this).closest('.o-menubar')
			.find('.'+settings.menuHoverClass)
				.attr('aria-hidden', 'true')
				.removeClass(settings.menuHoverClass);
		$(this).next('.o-menubar__menu')
			.attr('aria-hidden', 'false')
			.addClass(settings.menuHoverClass);
	});

	$(document).click(function(){ $('.'+settings.menuHoverClass).attr('aria-hidden', 'true').removeClass(settings.menuHoverClass).find('.o-menubar__link').attr('tabIndex',-1); });
	
	$(this).click(function(e){
		e.stopPropagation();
	});
}

window.onload = function() {
  window.parent.document.getElementsByClassName('o-public__iframe')[0].style.height = (document.documentElement.scrollHeight + 16) + 'px';
};

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
$(document).ready(function() {
  function buttonTabOff(idUl){
    $('#'+idUl+' .o-tablist__tab').each(function(){
      $(this).attr("aria-selected", "false").removeClass('checked');
    });
  }
  $('li[role="tab"]').click(function(){
    var controlValue = $(this).attr('aria-controls');
    var idUl = $(this).parent().attr('id');
    var hijosSection = $(this).parent().parent().children('section');
    // var hijosSection = $(this).closest('o-content-box__content').children('section');
    // console.log (hijosSection);
    if($(this).attr('aria-selected')!='true'){
      // Desactiva todos los botones de la tab pulsada
      buttonTabOff(idUl);
      // Activa el botón pulsado
      $(this).addClass('checked');
    }
    // Desactiva todos los paneles de la tab pulsada
    hijosSection.each(function() {
      $(this).attr('aria-hidden', 'true');
    });
    // Activa el panel del botón pulsado
    $('#' + controlValue).attr('aria-hidden', 'false');
  })
});

// MODULE - o-tabs

//- --> js/coronita/objects/o-tabs.js

// product box script
$(document).ready(function() {

  $( ".mo-product-box" ).on( "keypress click", ".mo-product-box__controller", function(event) {
    if (event.which === 13 || event.type === 'click') {
      if ($(this).hasClass("is-active")) {
        $(this)
          .removeClass("is-active").attr("aria-expanded", "false");
        $(this)
          .closest(".mo-product-box").children(".mo-product-box__content").attr("aria-hidden", "true");
      } else {
        $(this)
          .addClass("is-active").attr("aria-expanded", "true");
        $(this)
          .closest(".mo-product-box").children(".mo-product-box__content").attr("aria-hidden", "false");
      };
    };
  });

  $( ".mo-product-box" ).on( "keypress click", ".mo-product-box__content-controller", function(event) {
    if (event.which === 13 || event.type === 'click') {
      if ($(this).parent(".mo-product-box__content").find("table[aria-hidden=false],tr[aria-hidden=false]").length) {
        $(this)
          .parent(".mo-product-box__content").find("table[aria-hidden=false],tr[aria-hidden=false]")
          .addClass("hide-content").attr("aria-hidden", "true");
        $(this)
          .find(".c-link__icon").removeClass("c-icon-substract").addClass("c-icon-add");
        $(this)
          .find(".c-link__text").text("Mostrar productos");
      } else {
        $(this)
          .parent(".mo-product-box__content").find("table[aria-hidden=true],tr[aria-hidden=true]")
          .removeClass("hide-content").attr("aria-hidden", "false");
        $(this)
          .find(".c-link__icon").removeClass("c-icon-add").addClass("c-icon-substract");
        $(this)
          .find(".c-link__text").text("Ocultar productos");
      };
    };
  });

});