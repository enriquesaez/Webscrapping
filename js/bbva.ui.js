/**
 * @class $B_ui
 * @singleton
 */
(function ($B, $, _) {
  var timeStampArray,
      customInputClasses,
      $body = $(document.body),
      $B_ui = $B.provide($B, 'ui');
  $body.on('keyup', '.c-form-importeMoneda input:text, [data-importe-i18n] input:text, .c-form-desdeHasta input:text', function (ev) {
    var keyCodes = {
      comma: 188,
      decimalPoint: 110,
      point: 190
    };

    if (!$(this).hasClass('no_keyup') && (ev.keyCode === keyCodes.comma || ev.keyCode === keyCodes.decimalPoint || ev.keyCode === keyCodes.point)) {
      $(this).val(_.prepareValidationFloat($(this).val()));
    }
  });
  /** PLUGINS DE VISIBILIDAD *******************************************/

  /*
   * @name $B.ui.changevisibility
   * TODO: Documentar su uso
   * De momento se puede ver aplicado en posicion global (desplegables quiero)
   */

  (function ($B_ui, $) {
    var activeClass = 'checked';

    function toggleActiveClass(el, parentActive, radioBehavior) {
      if (radioBehavior) {
        if (!el.is('.' + activeClass)) {
          if (parentActive) {
            el.closest(parentActive).toggleClass(activeClass, el.is(':checked'));
          }

          el.toggleClass(activeClass, el.is(':checked'));
        }
      } else {
        if (parentActive) {
          el.closest(parentActive).toggleClass(activeClass);
        }

        el.toggleClass(activeClass);
      }
    }

    function isActiveItem(item, groupName) {
      return item.data('change-visibility').groupName === groupName;
    }

    function hideActiveElements(el, groupName) {
      if (groupName !== undefined) {
        $(el[0].tagName + '[data-change-visibility].' + activeClass).each(function (i) {
          var item = $(this),
              visibility;

          if (isActiveItem(item, groupName) && el[0] !== item[0]) {
            visibility = item.data('change-visibility');

            if (visibility.parentActive !== undefined) {
              item.closest(visibility.parentActive).removeClass(activeClass);
            }

            item.removeClass(activeClass);
            $(visibility.toggle, visibility.show).hide(visibility.transition);
            $B.utils.aria.visibility(item, 'hide');
            return;
          }
        });
      }
    }

    function applyVisibility(visibility, ev) {
      var visibilityShow = $(visibility.show),
          //visibilityHide = $(visibility.show).siblings(visibility.hide);
      //visibilityHide = $(visibility.hide); // original
      //visibilityHide = ($(visibility.show).closest('.c-widget-conmutador')) ? $(visibility.show).siblings(visibility.hide) : $(visibility.hide); // plan B
      $context = $(ev.currentTarget).closest('.c-widget-conmutador'),
          visibilityHide;

      if ($(visibility.show).length) {
        visibilityHide = $(visibility.show).siblings(visibility.hide);
      } else if ($context.length > 0) {
        visibilityHide = $context.find(visibility.hide);
      } else {
        visibilityHide = $(visibility.hide);
      } //$(visibility.hide).hide(visibility.transition);


      visibilityHide.hide(visibility.transition);
      $B.utils.aria.visibility(visibilityHide, 'hide'); //$(visibility.show).show(visibility.transition);

      $(visibility.show).show(visibility.transition);
      $B.utils.aria.visibility(visibilityShow, 'show'); //$(visibility.toggle).toggle(visibility.transition);

      /*$(visibility.toggle).toggle(visibility.transition, function () {
        $B.utils.aria.visibility($(this), 'toggle');
      });*/

      $(visibility.toggle).toggle(visibility.transition);
      $B.utils.aria.visibility($(visibility.toggle), 'toggle');

      if ($('.c-botones-seleccion:not([data-switcher])').length) {
        $B.utils.aria.switcher({
          element: $('.c-botones-seleccion:not([data-switcher])'),
          tabs: 'li',
          tabsChildren: 'label',
          selected: 'label.checked',
          id: 'switcher-botones-seleccion'
        });
      }
    }

    function addClassAndDisable(container) {
      container.find('[name]').each(function () {
        //$(container + ' [name]').each(function () {
        // If an input has been disabled before we shouldn't change it's state
        // so I add a class that will be taken away on show
        if ($(this).is(':disabled')) {
          $(this).addClass('js-dontChangeState');
        }

        $(this).attr('disabled', 'disabled');
      });
      $B_ui.updateCustomElementsStatus(container);
    } //TODO: revisar comportamiento de la clase js-dontChangeState en casos en que los inputs esten disabled


    function removeClassAndEnable(container) {
      container.find('[name]').filter(':not([data-no-enabling])').each(function () {
        //$(container + ' [name]').each(function () {
        if ($(this).hasClass('js-dontChangeState')) {
          $(this).removeClass('js-dontChangeState');
        } //clase js-dontChangeStateFix solucion para disabled


        if (!$(this).hasClass('js-dontChangeStateFix')) {
          $(this).removeAttr('disabled');
        }
      });
      $B_ui.updateCustomElementsStatus(container);
    }

    function toggleBasedOnVisibility(container) {
      container.find('[name]').each(function () {
        //$(container + ' [name]').each(function () {
        if ($(this).is(':visible')) {
          $(this).removeAttr('disabled');
        } else {
          $(this).attr('disabled', true);
        }
      });
      $B_ui.updateCustomElementsStatus(container);
    }
    /*function changeInputStates(visibility) {
      var containers,
        i;
        if (visibility.hide) {
        containers = visibility.hide.split(',');
        for (i = 0; i < containers.length; i += 1) {
          addClassAndDisable(containers[i]);
        }
      }
        if (visibility.show) {
        containers = visibility.show.split(',');
        for (i = 0; i < containers.length; i += 1) {
          removeClassAndEnable(containers[i]);
        }
      }
        if (visibility.toggle) {
        containers = visibility.toggle.split(',');
        for (i = 0; i < containers.length; i += 1) {
          toggleBasedOnVisibility(containers[i]);
        }
      }
    }*/


    function changeInputStates(visibility, ev) {
      var containers,
          i,
          $context = $(ev.currentTarget).closest('.c-widget-conmutador'),
          visibilityHide;

      if ($(visibility.show).length) {
        visibilityHide = $(visibility.show).siblings(visibility.hide);
      } else if ($context.length > 0) {
        visibilityHide = $context.find(visibility.hide);
      } else {
        visibilityHide = $(visibility.hide);
      }

      if (visibility.hide) {
        /*containers = visibility.hide.split(',');
        for (i = 0; i < containers.length; i += 1) {
          addClassAndDisable(containers[i]);
        }*/
        addClassAndDisable(visibilityHide);
      }

      if (visibility.show) {
        /*containers = visibility.show.split(',');
        for (i = 0; i < containers.length; i += 1) {
          removeClassAndEnable(containers[i]);
        }*/
        removeClassAndEnable($(visibility.show));
      }

      if (visibility.toggle) {
        /*containers = visibility.toggle.split(',');
        for (i = 0; i < containers.length; i += 1) {
          toggleBasedOnVisibility(containers[i]);
        }*/
        toggleBasedOnVisibility($(visibility.toggle));
      }
    }

    function listenClickOutside(el, visibility) {
      $(document).bind('click', function (ev) {
        el.removeClass(activeClass).closest('.' + activeClass).removeClass(activeClass);
        $(visibility.show + ',' + visibility.toggle).hide(visibility.transition);
        $B.utils.aria.visibility($(visibility.show + ',' + visibility.toggle), 'hide');
        $(this).unbind(ev);
      });
    }

    $B_ui.changevisibility = function (ev) {
      var el = $(ev.currentTarget),
          visibility = el.data('change-visibility') || {},
          radioBehavior = visibility.radioBehavior || false;
      hideActiveElements(el, visibility.groupName, radioBehavior);
      toggleActiveClass(el, visibility.parentActive, radioBehavior);
      applyVisibility(visibility, ev);
      changeInputStates(visibility, ev);

      if (visibility.hideWhenClickOutside !== 'false') {
        listenClickOutside(el, visibility);
      }
    };
  })($B_ui, $);
  /*
   * @name $B.ui.closeElement
   * TODO: Documentar su uso
   */


  $B_ui.closeElement = function () {
    // now using object instead of switch is faster
    var closableElement,
        speed = 400,
        // jQuery's default animation speed
    closeElem = {
      hide: function hide() {
        return closableElement.hide();
      },
      slideUp: function slideUp() {
        return closableElement.slideUp(speed);
      },
      fadeOut: function fadeOut() {
        return closableElement.fadeOut(speed);
      },
      slideUpFadeOut: function slideUpFadeOut() {
        return closableElement.animate({
          height: 0,
          opacity: 0
        }, 200, 'linear').slideUp(function () {
          $(this).removeAttr('style').hide();
        });
      }
    },
        effect = 'hide'; // defualt effect

    return function (ev) {
      closableElement = $(ev.currentTarget).closest('[data-closable]');

      if (!closableElement.length) {
        return; // return, can't chain anyway
      }

      var options = closableElement.data('closable'),
          _options;

      if (options) {
        _options = options.split(' ');

        if (_options) {
          options = _options;
          effect = options[0];
          speed = parseInt(options[1], 0);
        } else {
          effect = options;
        }
      }

      return closeElem[effect]();
    };
  }();
  /**
   * c_buscadores_predictivoLiquido
   */


  $B_ui.c_buscadores_predictivoLiquido = function (objects) {
    objects.each(function (i, object) {
      //comprobamos si ha sido procesado ya
      if ($(object).attr('c_buscadores_predictivoLiquidoProcesado') === 'true' || $(object).hasClass('c-buscadores-predictivo-liquido-filter')) {
        return;
      }

      $(object).attr('c_buscadores_predictivoLiquidoProcesado', true);

      var obj = $(object),
          itemsmax = obj.data('itemsmax'),
          camposBuscar = obj.data('campos-buscar').split(','),
          listObj,
          capaJslist = obj.find('.js-list'),
          listAllBtns = function ($obj) {
        var selectorCSSButtons = 'span.buscarBtn input[type="image"], .infoProductos span.js-showAll',
            $buttons = obj.find(selectorCSSButtons);

        if (!$buttons[0]) {
          $buttons = $(selectorCSSButtons);
        }

        return $buttons;
      }(obj),
          classesOptions = function classesOptions(jsListClass, itemsmax, keyUp, ev) {
        var listFather = jsListClass.closest('.js-listFather'),
            listTable = listFather.find('table'),
            listTableLength = listTable.length,
            theadEstatico = listFather.closest('.theadEstatico'),
            theadEstaticoThead = theadEstatico.find('thead'),
            theadEstaticoTipoLabel = theadEstatico.find('.tipoLabel'),
            mixinClass = jsListClass.closest('.c-buscadores-predictivo-liquido'),
            mensaje = mixinClass.find('.c-mensajes-informativoRefuerzo'),
            inputText = mixinClass.find('.js-buscador'),
            listLabel = listFather.find('label'),
            rowsItems = jsListClass.find('li, tr'),
            rowVisible = jsListClass.find('li:visible, tr:visible'),
            inputShowAll = obj.find('input[data-action="listAll"]'),
            searchListObj;
        rowsItems.removeClass('last');
        mensaje.addClass('hidden'); //used this to prevent mvc's from adding disabled states to this input

        if (!_.isUndefined($(inputShowAll).attr('disabled'))) {
          $(inputShowAll).removeAttr('disabled');
        } //show search list


        if (!_.isUndefined(ev) && $(ev.currentTarget).data('action') === 'listAll') {
          if ($(ev.currentTarget).is('input') && inputText.val() !== $(inputText).attr('placeholder')) {
            searchListObj = new List(obj[0], {
              valueNames: camposBuscar,
              listClass: 'js-list',
              searchClass: 'js-buscador'
            });
            searchListObj.search(inputText.val());
            $(rowsItems).last().addClass('last');
            return;
          }

          listFather.addClass('resultados');
          jsListClass.addClass('conResultados');

          if (!listTable.hasClass('columnas6')) {
            listFather.addClass('separador3').attr({
              'aria-expanded': true
            });
          }

          $(rowsItems).removeClass('hidden');
          $(rowsItems).last().addClass('last');
          return;
        }

        if (rowsItems.length > itemsmax) {
          theadEstatico.addClass('conScroll');
        } else {
          theadEstatico.find('.separador3').removeClass('separador3');
          theadEstatico.find('.resultados').removeClass('resultados');
        }

        if (rowsItems.last()) {
          rowsItems.last().addClass('last');
        } else {
          rowsItems.removeClass('last');
        }

        if (rowVisible.length === 0) {
          theadEstaticoThead.addClass('hidden');
          theadEstaticoTipoLabel.addClass('hidden');
          listFather.removeClass('resultados separador3').attr({
            'aria-expanded': false
          });
          jsListClass.removeClass('conResultados');

          if (keyUp === true && inputText.val() !== '') {
            mensaje.removeClass('hidden');
          }
        } else {
          theadEstaticoThead.removeClass('hidden');
          theadEstaticoTipoLabel.removeClass('hidden');
          jsListClass.addClass('conResultados');

          if (!listTable.hasClass('columnas6')) {
            listFather.addClass('separador3').attr({
              'aria-expanded': true
            });
          }
        }

        if (rowVisible.length > itemsmax) {
          listFather.addClass('resultados');

          if (listTableLength === 0) {
            listLabel.addClass('menor');
          }
        } else {
          listFather.removeClass('resultados');
          theadEstatico.find('.js-listFather').removeClass('resultados');

          if (mixinClass.closest('.c-desplegable-consultas').length !== 0 || mixinClass.closest('.c-form-predictivo-liquido').length !== 0) {
            if (listTableLength === 0) {
              listLabel.addClass('menor');
            }
          } else {
            if (listTableLength === 0) {
              if (!listLabel.hasClass('labelProductosFicha')) {
                listLabel.removeClass('menor');
              } else {
                listLabel.addClass('menor');
              }
            }
          }
        } //placeholder


        inputText.watermark(inputText.attr('placeholder'));
      };

      if (capaJslist.find('li, tr').length > itemsmax) {
        listObj = new List(obj[0], {
          valueNames: camposBuscar,
          listClass: 'js-list',
          searchClass: 'js-buscador'
        });
        capaJslist = obj.find('.js-list');
        capaJslist.find('input:not(:checked)').closest('li, tr').addClass('hidden');
        classesOptions(capaJslist, itemsmax);
        obj.off('keyup', '.js-buscador'); //Listar todas las cuentas

        listAllBtns.on('click', function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          classesOptions(capaJslist, itemsmax, false, ev); //scroll

          if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
            $B.ui.scrollElement(capaJslist);
          } else {
            capaJslist.customScroll2({
              scrollType: 'predictivo'
            });
            capaJslist.customScroll2('setPosition');
          }
        });
        obj.on({
          keyup: function keyup() {
            if (this.value === '') {
              capaJslist.find('li, tr').addClass('hidden');
            }

            classesOptions(capaJslist, itemsmax, true); //scroll

            if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
              $B.ui.scrollElement(capaJslist);
            } else {
              capaJslist.customScroll2({
                scrollType: 'predictivo'
              });
              capaJslist.customScroll2('setPosition');
            }

            $B_ui.dialogCenter();
          },
          focus: function focus() {
            capaJslist.find('input:not([type=checkbox]):checked').removeAttr('checked').trigger('change');
          }
        }, '.js-buscador');
      } else {
        classesOptions(capaJslist, itemsmax);
      }
    });
    return objects;
  };
  /*\
   * c_widget_autocompletar
   [ method ]
   > Parametros
   - selector (string u objeto de jQuery) Selector del input que al que aplicar el autocomplete
   - options (string) Opciones que recibe el plugin, como minimo hay que pasar source que es el array de opciones (ver http://jqueryui.com/demos/autocomplete/)
   - options.selectorClass es la clase del span superior para coger bien la medida
   - ulClass (string) #optional Clase CSS a aplicar al <ul> generado
   > Uso en el MVC
   | $B_ui.c_widget_autocompletar('#ingresosAnuales', { source: ["Menos de 10.000&euro;", "Entre 10.000 y 25.000&euro;"] }, 'miClase' );
   | $B_ui.c_widget_autocompletar(this.$('#ingresosAnuales'), { source: ["Menos de 10.000&euro;", "Entre 10.000 y 25.000&euro;"] }, 'miClase' );
  \*/


  $B_ui.c_widget_autocompletar = function (selector, options, ulClass) {
    var selectorClass = options.selectorClass || 'c-widget-autocompletar',
        activeClass = 'activo',
        selectedClass = 'seleccionado',
        jQSelector = typeof selector === 'string' ? $(selector) : selector,
        jQSelectorParent = jQSelector.closest('span.' + selectorClass),
        ancho = jQSelectorParent.width(),
        jQSelectorParentLeftPosition = false,
        jQSelectorParentViewport = $body.width(),
        //anchoCompleto = jQSelectorParent.outerWidth(),
    jQSelectorId = jQSelector.attr('id');
    jQSelector.autocomplete({
      source: options.source,
      minLength: options.minLength,
      position: {
        my: 'left top',
        at: 'left bottom',
        of: jQSelector.closest('span.' + selectorClass)
      },
      create: function create(ev, ui) {
        var $target = $(ev.target);
        $target.closest(selectorClass).on('click', function (ev) {
          $(ev.currentTarget).addClass(activeClass).removeClass(selectedClass);
        });
        $target.focusout(function (ev) {
          $target.closest(selectorClass).removeClass(activeClass);

          if (!_.isArray(options.source) && options.source.indexOf($target.val()) >= 0) {
            $target.closest(selectorClass).addClass(selectedClass);
          }
        });

        if (!_.isArray(options.source) && options.source.indexOf($target.val()) >= 0) {
          $target.closest(selectorClass).addClass(selectedClass);
        }
      },
      change: function change() {
        $B_ui.dialogCenter();
      }
    }); //set custom class

    if (ulClass) {
      jQSelector.autocomplete('widget').addClass(ulClass);
    } //set input.id in ul.class


    if (jQSelectorId) {
      jQSelector.autocomplete('widget').addClass('ui-autocomplete-id-' + jQSelectorId);
    }

    jQSelector.autocomplete({
      open: function open(event, ui) {
        var ul = $B_ui.c_widget_autocompletarGetUl(event.target),
            ulStyle = ul.attr('style'),
            ulWidth = ul.width(),
            ulHeight,
            anchoCompleto = $(this).closest('span.c-widget-autocompletar').outerWidth() || $(this).closest('span.js-c-widget-autocompletar').outerWidth(); //get max-height ul

        if (!ul.data('max-height')) {
          ul.data('max-height', parseInt(ul.css('max-height'), 10));
        }

        ulHeight = Math.min(ul.data('max-height'), ul.outerHeight()); //remove previous scroll

        $B_ui.c_widget_autocompletarRemoveScroll(ul); //necesita un refactor importante junto a maquetacion

        ul.wrap('<div style="' + ulStyle + ' overflow:hidden; height: ' + ulHeight + 'px; position: absolute; padding-bottom: 2px" data-autocomplete-scroll class="ui-autocomplete-scroll" />');
        ul.removeAttr('style').css({
          'height': 'auto',
          'max-height': 'none'
        });
        ul.css({
          'max-width': anchoCompleto - 2,
          'min-width': anchoCompleto - 2,
          'width': anchoCompleto - 2
        });
        ul.parents('[data-autocomplete-scroll]').css({
          'max-width': anchoCompleto,
          'min-width': anchoCompleto,
          'width': anchoCompleto
        }); //init scroll

        $B_ui.scrollElement(ul);

        if (jQSelectorParentViewport !== $body.width()) {
          jQSelectorParentViewport = $body.width();
          jQSelectorParentLeftPosition = jQSelectorParent.offset().left;
        }

        jQSelectorParentLeftPosition = jQSelectorParentLeftPosition || jQSelectorParent.offset().left;
        ul.closest('[data-autocomplete-scroll]').css({
          left: jQSelectorParentLeftPosition
        });
      },
      close: function close(event, ui) {
        var ul = $B_ui.c_widget_autocompletarGetUl(event.target);
        ul.css({
          'max-width': '',
          'min-width': '',
          'width': ''
        });
        ul.parents('[data-autocomplete-scroll]').css({
          'max-width': '',
          'min-width': '',
          'width': ''
        });
      }
    });
    jQSelector.autocomplete({
      search: function search(event, ui) {
        $B_ui.c_widget_autocompletarRemoveScroll($B_ui.c_widget_autocompletarGetUl(event.target));
      }
    });
    jQSelector.bind('autocompleteclose', function (event, ui) {
      $B_ui.c_widget_autocompletarRemoveScroll($B_ui.c_widget_autocompletarGetUl(event.target));
    });
  };

  $B_ui.c_widget_autocompletarGetUl = function (currentTarget) {
    return $('.ui-autocomplete-id-' + $(currentTarget).attr('id') + '.ui-autocomplete');
  };

  $B_ui.c_widget_autocompletarRemoveScroll = function (ul) {
    //remove previous scroll
    ul.closest('[data-autocomplete-scroll]').find('.scrollbar').remove();

    if (ul.closest('[data-autocomplete-scroll] .overview > ul').length) {
      ul.unwrap();
    }

    if (ul.closest('[data-autocomplete-scroll] .viewport > ul').length) {
      ul.unwrap();
    }

    if (ul.closest('[data-autocomplete-scroll] > ul').length) {
      ul.unwrap();
    }
  };
  /**
   * c_menu_pestanasOperativasConsultas
   */


  timeStampArray = [];

  $B_ui.c_menu_pestanasOperativasConsultas = function (ev) {
    var i,
        el = $(ev.currentTarget),
        contenedorMenu = null,
        pestanaActual = null,
        cerrando = false,
        valueDataPestana = el.data('pestana'),
        contenedorContenido = el.closest('div.c-menu-pestanasOperativasConsultas').find('div.js-contenido-OperativasConsultas'),
        cerrarSilentWrapper = function cerrarSilentWrapper() {
      var silentWrapper = contenedorContenido.find('[data-silent-wrapper]');

      if (silentWrapper.length === 0) {
        return;
      }

      silentWrapper.removeClass('active-silent-view-wrapper').end().find('[data-silent-container]')[0].innerHTML = '';
      $.publish('closeMenuPestanasOperativasConsultas');
    },
        togglePestanas = function togglePestanas() {
      //cerramos todos los activos
      contenedorMenu.find('.activo').removeClass('activo'); //cerramos las pestanas, excepto la actual

      contenedorMenu.find('[data-pestana]').each(function (index, value) {
        var pestanaAux = $(value).data('pestana'),
            $pestana = $('div' + pestanaAux);

        if (pestanaActual !== pestanaAux) {
          $pestana.slideUp();
        } else {
          if (contenedorContenido.is(':visible')) {
            $pestana.slideDown();
          } else {
            $pestana.show();
          }

          el.parent().addClass('activo');
        }
      });
    },
        checkShowPersonalizarAndLoadProductData = function checkShowPersonalizarAndLoadProductData() {
      var autoloads = $('.pestanasOperativasConsultaspersonalizar [data-autoload-personalizacion]'),
          autoload,
          i;

      for (i = 0; i < autoloads.length; i += 1) {
        autoload = $(autoloads[i]).empty();
        $B.app.AppView.prototype.prepareAutoload(autoload);
      }

      $('[data-remove-onload]').empty();
    };

    ev.preventDefault(); //los contenidos de condiciones, iban... se cargan bajo demanda con data-silent-link, y no se debe ejecutar ev.stopPropagation(); la primera vez

    if ($(valueDataPestana).children().length > 0) {
      ev.stopPropagation();
    } else {
      $(valueDataPestana).html('<div class="loading-silent-view" />');
    }

    if ($B.utils.isDuplicateEvent(ev)) {
      return {
        'cerrando': null
      };
    }

    if (valueDataPestana === 'cerrar') {
      $.publish('handlePestanasCloseCliked', [el.closest('div.c-menu-pestanasOperativasConsultas').find('.js-pestanasOperativasConsultas').find('li.activo').data('pestana')]);
    }

    if (valueDataPestana !== '.pestanasOperativasConsultasoperaciones' && valueDataPestana !== 'cerrar') {
      cerrarSilentWrapper();
    }

    if (valueDataPestana === 'cerrar') {
      contenedorMenu = el.closest('div.c-menu-pestanasOperativasConsultas').find('.js-pestanasOperativasConsultas').removeClass('pestanaActiva');
      togglePestanas();
      contenedorContenido.slideUp(function () {
        cerrarSilentWrapper();
      });
      pestanaActual = null;
      cerrando = true;
    } else if (valueDataPestana !== 'quiero') {
      contenedorMenu = el.closest('div').addClass('pestanaActiva');
      pestanaActual = el.data('pestana');

      if ($('div' + pestanaActual).is(':visible')) {
        pestanaActual = null;
        contenedorMenu.removeClass('pestanaActiva');
        togglePestanas();
        contenedorContenido.slideUp();
        cerrando = true;
      } else {
        togglePestanas();
        contenedorContenido.slideDown();

        if (valueDataPestana === '.pestanasOperativasConsultaspersonalizar') {
          checkShowPersonalizarAndLoadProductData();
        }

        cerrando = false;
      }
    } //retornamos si se cierran o se abren las pestanas


    return {
      'cerrando': cerrando
    };
  };
  /**
   * toggleDisabled
   *
   * Habilita/Deshabilita el input de texto en base al estado del checkbox correspondiente.
   */


  $B_ui.toggleDisabled = function (ev, wrapper) {
    var isChecked = ev.currentTarget.checked,
        $checkbox = $(ev.currentTarget),
        input = $checkbox.data('toggle-disabled').targetElement,
        $inputs;

    if (wrapper) {
      $inputs = $(wrapper).find(input);
    } else {
      $inputs = $checkbox.closest('.c-form-enviarNotificacion').find(input);
    }

    if (!isChecked) {
      $inputs.val('');
    }

    $inputs.attr({
      'disabled': !isChecked,
      'aria-disabled': !isChecked
    });
  };
  /**
   *
   */


  $B_ui.scrollElement = function (element, options) {
    var $table,
        $tableParent,
        contentPre = '<div class="scrollbar"><div class="boxScroll"><div class="track"><div class="thumb"><div class="end"></div></div></div><span class="jspArrow jspArrowUp jspDisabled"></span><span class="jspArrow jspArrowDown"></span></div></div>',
        wrapper = '<div class="viewport"><div class="overview"></div></div>';

    _.each(element, function (el) {
      $table = $(el).get(0).tagName === 'TBODY' ? $(el).closest('table') : $(el);
      $tableParent = $table.parent();

      if ($tableParent.hasClass('overview')) {
        $tableParent = $tableParent.closest('.scrollableParent');
      }

      $table.addClass('scrollable');
      $tableParent.addClass('scrollableParent');

      if ($table.height()
      /*+ 10*/
      > $tableParent.height() && $table.height() !== 0) {
        if (!$table.parent().hasClass('overview')) {
          $table.wrap(wrapper);
          $tableParent.prepend(contentPre);

          if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
            $('.cuerpoModal  .c-tablas-scroll_R3 .viewport').css('overflow-y', 'scroll');
            $('.cuerpoModal  .c-tablas-scroll_R3 .scrollbar').hide();
          }
        }

        $table.addClass('scrollVisible');
        $tableParent.customScrollbar(options);
      } else if ($table.parent().hasClass('overview')) {
        $table.children('caption, tbody').css('padding-top', 0);
        $tableParent.customScrollbar('destroy');
        $table.removeClass('scrollVisible');
        $table.unwrap().unwrap();
        $tableParent.find('.scrollbar').remove();
      }
    });
  };
  /**
   * initCropImage: Funcion para inicializar el crop de imagenes.
   * Uso: $B_ui.initCropImage({cropContainer:'.otroContainer'}). Si no se especifica cropContainer por defecto
   * buscara un contenedor con la clase "crop-container"
   */


  $B_ui.initCropImage = function (data) {
    var defaults = {
      cropContainer: '.crop-container',
      context: data.context || $body
    },
        options = $.extend(defaults, data),
        $cropContent = options.context.$el.find(options.cropContainer),
        foto = data.context.model.get('foto'),
        inputs = [{
      name: 'foto.coordX',
      coord: 'x',
      value: -1
    }, {
      name: 'foto.coordY',
      coord: 'y',
      value: -1
    }, {
      name: 'foto.ancho',
      coord: 'w',
      value: -1
    }, {
      name: 'foto.alto',
      coord: 'h',
      value: -1
    }],
        $img;

    function initCrop() {
      var i;

      for (i = 0; i < inputs.length; i += 1) {
        $cropContent.append('<input type="hidden" id="coordenada' + i + '" name="' + inputs[i].name + '" value="' + inputs[i].value + '"/>');
      }
    }

    function cropFn() {}

    function cropSelectionEnd(coords) {
      var i;

      for (i = 0; i < inputs.length; i += 1) {
        $('#coordenada' + i).val(coords[inputs[i].coord]);
      }
    }

    if (!$cropContent) {
      return;
    }

    initCrop();
    $img = $cropContent.find('img');
    $img.Jcrop({
      onChange: cropFn,
      onSelect: cropSelectionEnd
    });
  };
  /**
   * clickToCall
   *
   * Al llamar a $B_ui.clickToCall se comprueba si el clicktocall es por capa o por popup y se inicializa
   *
   */


  $B_ui.clickToCall = function (context, captchaActivated) {
    var ClickToCall = {},
        viewContext = context || window,
        enableCaptcha = true,
        $widgetContenedor = $('.c-widget-contenedor'),
        $cajaAyuda = viewContext.$('.c-desplegable-ayuda .caja-ayuda'),
        $asistenteSpan = viewContext.$('.c-desplegable-ayuda .asistenteAyuda span:first');
    $botonEnviarDatos = viewContext.$('.c-desplegable-ayuda .enviarDatos');

    if (!_.isUndefined(captchaActivated)) {
      enableCaptcha = captchaActivated;
    }

    ClickToCall.show = function () {
      $widgetContenedor.css('overflow', 'visible');
      $asistenteSpan.addClass('desplegado');
      $cajaAyuda.show();
      $(document).on('focusin.clicktocall click.clicktocall', ClickToCall.onFocusOut);
    };

    ClickToCall.hide = function () {
      $widgetContenedor.css('overflow', 'hidden');
      $asistenteSpan.removeClass('desplegado');
      $cajaAyuda.hide();
      $(document).off('.clicktocall', ClickToCall.onFocusOut);
    };

    ClickToCall.toggle = function () {
      return $cajaAyuda.is(':visible') ? ClickToCall.hide() : ClickToCall.show();
    };

    ClickToCall.onFocusOut = function (ev) {
      if (!$(ev.target).closest('.caja-ayuda').length) {
        ClickToCall.hide();
      }
    };

    function mostrarError(msg) {
      viewContext.$('.mensaje').css('display', 'none');
      viewContext.$('.c-mensajes-errorAplicacion').css('display', 'none');
      viewContext.$('.c-desplegable-ayuda .error-telefono span').html(msg);
      viewContext.$('.c-desplegable-ayuda .error-telefono').css('display', '');
      $botonEnviarDatos.removeClass('hidden');
    }

    function recargarImagen() {
      var timestamp = Number(new Date());
      viewContext.$('#imgCaptcha').attr('src', 'https://www.bbva.es/TLRS/tlrs/publi?op=captcha&recPerfil=S&time=' + timestamp);
    }

    function llamarTelefono() {
      var telefono = '',
          tipo = '';
      $botonEnviarDatos.addClass('hidden');
      viewContext.$('.error-telefono').css('display', 'none');
      viewContext.$('.mensaje').css('display', 'none');
      viewContext.$('.c-mensajes-errorAplicacion').css('display', 'none');

      if ($('#numeroInternacional').is(':checked') || /^([6,8,9][0-9]{8})$/.test(this.$('#documento').val())) {
        if (viewContext.$('.c-desplegable-ayuda #documento').length > 0 && viewContext.$('.c-desplegable-ayuda #documento').val() !== '') {
          telefono = viewContext.$('.c-desplegable-ayuda #documento').val();
        } else {
          telefono = viewContext.$('.c-desplegable-ayuda #documento').val();

          if (telefono.indexOf('+') === 0) {
            telefono = telefono.replace('+', '00');
          }
        }

        if (viewContext.$('#tipoLlamada').length > 0 && viewContext.$('#tipoLlamada').val() !== '') {
          tipo = viewContext.$('#tipoLlamada').val();
        } else {
          tipo = 4;
        }

        $.getJSON('https://www.bbva.es/TLRS/tlrs/publi?callback=?', {
          'tlf': telefono,
          'op': 'llamar',
          'tipo': tipo
        }, function (datos) {
          if (datos.msg === '200') {
            viewContext.$('.mensaje').css('display', '');

            if (typeof SeguimientoClickToCallAyudaSC === 'function') {
              SeguimientoClickToCallAyudaSC();
            }
          } else {
            viewContext.$('.c-mensajes-errorAplicacion').css('display', '');
          }
        });
      } else {
        mostrarError($B.app.literals.areapersonal.telefono_invalido);
      }
    }

    function validarCaptcha(codigo) {
      var sCaptcha = viewContext.$('.c-desplegable-ayuda #captcha').val();

      if (sCaptcha !== '') {
        $.getJSON('https://www.bbva.es/TLRS/tlrs/publi?callback=?', {
          'captcha': sCaptcha,
          'op': 'compCaptcha'
        }, function (datos) {
          recargarImagen();

          if (datos.msg === 'OK') {
            llamarTelefono();
          } else {
            mostrarError('Introduzca el codigo');
          }
        });
      } else {
        mostrarError('Introduzca el codigo');
      }
    }

    function enviarTelefono() {
      viewContext.$('#divConfirmacion').hide();

      if (viewContext.$('.c-desplegable-ayuda .checkNumero label').hasClass('checked')) {
        if (viewContext.$('.c-desplegable-ayuda #documento2').val() === '') {
          mostrarError('Se requiere un telefono internacional');
        } else {
          if (!_.isMobile() && enableCaptcha) {
            validarCaptcha(viewContext.$('.c-desplegable-ayuda #documento2').val());
          } else {
            llamarTelefono();
          }
        }
      } else {
        if (viewContext.$('.c-desplegable-ayuda #documento').val() === '') {
          mostrarError('Se requiere un telefono');
        } else {
          if (!_.isMobile() && enableCaptcha) {
            validarCaptcha(viewContext.$('.c-desplegable-ayuda #documento').val());
          } else {
            llamarTelefono();
          }
        }
      }
    }

    function initModal(ev) {
      $B_ui.dialog.create({
        id: 'modalClickTocall',
        content: _.tmpl('#modal_ClickToCall'),
        button: '.tellamamos',
        dialogOptions: {
          width: 300
        }
      });
      $(viewContext.$('.c-desplegable-ayuda')[1]).css('z-index', 1000003);
      viewContext.$('.c-desplegable-ayuda #acceder').on('click', function () {
        enviarTelefono();
      });
      viewContext.$('.c-desplegable-ayuda .caja-ayuda').css('position', 'static');
      viewContext.$('.c-desplegable-ayuda .caja-ayuda').css('margin-left', '120px');

      if (enableCaptcha) {
        viewContext.$('.c-desplegable-ayuda #recCaptchaCTC').on('click', function (ev) {
          recargarImagen();
        });
      }
    }

    function openModal() {
      if ($B_ui.dialog.exists('modalClickTocall')) {
        $B_ui.dialog.open('modalClickTocall');
      } else {
        initModal();
        $B_ui.dialog.open('modalClickTocall');
      }
    }

    function validarTelefono(tlf) {
      var bValidado = false,
          nTlfno = '';

      if (tlf.indexOf('+') === 0) {
        nTlfno = tlf.substring(1);
        bValidado = !isNaN(nTlfno);
      } else {
        if (tlf.indexOf('00') === 0) {
          nTlfno = tlf.substring(2);
          bValidado = !isNaN(nTlfno);
        }
      }

      return bValidado;
    }

    function habilitarInput(tlf1, tlf2) {
      $(tlf1).removeAttr('readonly').focus();
      $(tlf2).attr('readonly', 'readonly').val('');
    }

    function habilitarTlfInternacional() {
      var check = $('#numeroInternacional').attr('checked');

      if (check === 'checked') {
        habilitarInput('#documento2', '#documento');
      } else {
        habilitarInput('#documento', '#documento2');
      }
    }

    function initClickToCall() {
      viewContext.$('#numeroInternacional').on('click', function () {
        habilitarTlfInternacional();
      });

      if (viewContext.$('#soloCuerpo').length > 0) {
        viewContext.$('.c-desplegable-ayuda #acceder').on('click', function () {
          enviarTelefono();
        });

        if (enableCaptcha) {
          viewContext.$('.c-desplegable-ayuda #recCaptchaCTC').on('click', function (ev) {
            recargarImagen();
          });
        }

        ClickToCall.toggle();
      } else {
        if (viewContext.$('.c-desplegable-ayuda .caja-ayuda').length > 0) {
          $(viewContext.$('.c-desplegable-ayuda').children()[0]).on('click', function (ev) {
            ev.stopPropagation();
            ClickToCall.toggle();
          });
          viewContext.$('.c-desplegable-ayuda #acceder').on('click', function () {
            enviarTelefono();
          });

          if (enableCaptcha) {
            viewContext.$('.c-desplegable-ayuda #recCaptchaCTC').on('click', function (ev) {
              recargarImagen();
            });
          }
        } else {
          viewContext.$('.c-desplegable-ayuda').children(0).on('click', function (ev) {
            openModal();
          });
        }
      }

      return ClickToCall;
    }

    initClickToCall();
  };
  /**
   * insertTabIndex
   *
   * Al llamar a $B_ui.insertTabIndex() se recorre el contexto seleccionado buscando elementos clickables o de formulario
   * para anadirles un tabindex="0".
   *
   * Los atributos que se buscan son:
   * role = "link"
   * role = "button"
   * role = "tab"
   *
   */


  $B_ui.insertTabIndex = function (context) {
    context = context || $body;
    var elements = context.find('*[role="link"]').add('*[role="button"]').add('*[role="tab"]').each(function () {
      var $this = $(this);

      if (!$this.attr('tabindex')) {
        $this.attr({
          'tabindex': '0',
          'data-added-tabindex-by-js': true
        });
      }

      $(this).off('keydown.focusable').on('keydown.focusable', function (e) {
        var key = window.event ? e.keyCode : e.which;

        if (key === 13) {
          $this.trigger('click');
        }
      });
    });
  };
  /**
   * autoCCCInputJump
   *
   * Al llamar a $B_ui.autoCCCInputJump() se debe permitir pegar los 20 digitos de la cuenta en los inputs
   * destinados a tal efecto, ademas de saltar entre inputs
   *
   */


  $B_ui.autoCCCInputJump = function (context) {
    var inputs = context.find('input.text'),
        inputsCCC = context.find('input.text:not(#iban)'),
        inputIBAN = context.find('input#iban'),
        inputIndex,
        currentLength;

    function text_diff(index, clipboardData) {
      if (index === 0 || index === 1) {
        return clipboardData.substr(0, 4);
      } else if (index === 2) {
        return clipboardData.substr(0, 2);
      } else if (index === 3) {
        return clipboardData.substr(0, 10);
      }
    }

    function delete_already_in(index, clipboardData) {
      if (index === 0 || index === 1) {
        return clipboardData.substr(4);
      } else if (index === 2) {
        return clipboardData.substr(2);
      } else if (index === 3) {
        return clipboardData.substr(10);
      }
    }

    function checkCCCInput20digits(ev) {
      var key = window.event ? ev.keyCode : ev.which,
          $this = $(ev.target),
          self,
          current,
          introValue,
          previous,
          i;

      if (key === 16 || key === 9) {
        return false;
      }

      $('#iban').attr('disabled', 'disabled').attr('data-no-enabling', true);

      if ($this.parent().next().find('input.text').not('#iban').length !== 0) {
        inputIndex = $this.parent().index();
      } else {
        inputIndex = $this.index();
      }

      previous = $this.val();
      currentLength = previous.length;
      self = $(this);
      setTimeout(function () {
        introValue = $(self).val();
        current = introValue.replace(/-/g, '').replace(/ /g, '');

        if (current.length - currentLength === 20 || current.length === 20) {
          if (current.length - currentLength === 20) {
            current = current.substr(currentLength);
          }

          inputIndex = 0;
          self = $(self).parent().find('input.text')[0];
          $(self).val('');
          $.publish('calcularIban', {
            cccNumber: current
          });
          $(self).val(text_diff(inputIndex, current));

          for (i = inputIndex; i < 4; i += 1) {
            $(self).val(text_diff(i, current));
            current = delete_already_in(i, current);

            if (i === 3) {
              $(self).focus();
            } else {
              self = $(self).next();
            }
          }
        } else {
          $('#iban').val('');
        }
      });
    }

    function prepareIBANNumber(ev) {
      var introValue,
          $this = $(ev.target),
          self = $this;
      setTimeout(function () {
        introValue = $(self).val();
        $(self).val(_.formatIbanNumber(introValue.replace(/\s/g, '')));

        if (introValue.length !== 0) {
          $this.closest('.c-form-CCC').find('input.text').not('#iban').attr('disabled', 'disabled').attr('data-no-enabling', true);
        }
      }, 100);
    }

    function checkCCCInput(ev) {
      var key = window.event ? ev.keyCode : ev.which,
          $this = $(ev.target),
          typeFirst = 4,
          typeSecond = 2,
          typeThird = 10,
          calculoIBANstopper = false,
          cccFull = false,
          todosWaterMark = 0,
          todosEmpty = 0,
          cccNumber = '',
          $currentInput,
          currentInputValue,
          $inputsCCC,
          i;

      if (key === 16 || key === 9 || key === 37 || key === 39) {
        return false;
      }

      if ($this.attr('id') === 'iban') {
        $inputsCCC = $this.closest('fieldset').find('#camposCuentaCliente').find('input');

        if ($this.val().length !== 0) {
          $inputsCCC.attr('disabled', 'disabled').attr('data-no-enabling', true);
        } else {
          $inputsCCC.removeAttr('disabled').removeAttr('data-no-enabling');
        }
      } else {
        if ($this.parent().next().find('input.text').not('#iban').length !== 0) {
          inputIndex = $this.parent().index();
        } else {
          inputIndex = $this.index();
        } // Se podria comprobar la longitud con el maxLength, pero parece
        // mas fiable hacerlo a mano.


        if ((inputIndex === 0 || inputIndex === 1) && $this.val().length > typeFirst) {
          $this.val($this.val().substr(0, typeFirst));
          calculoIBANstopper = true;
        } else if (inputIndex === 2 && $this.val().length > typeSecond) {
          $this.val($this.val().substr(0, typeSecond));
          calculoIBANstopper = true;
        } else if (inputIndex === 3 && $this.val().length > typeThird) {
          $this.val($this.val().substr(0, typeThird));
          calculoIBANstopper = true;
        }

        currentLength = $this.val().length;

        if ((inputIndex === 0 || inputIndex === 1) && currentLength === 4 || inputIndex === 2 && currentLength === 2) {
          // diferente marcado, puede haber inputs envueltos en un span o no, se cambia el selector dependiendo de ello
          if ($this.parent().next().find('input.text').not('#iban').length !== 0) {
            $this.parent().next().find('input.text').select().focus();
          } else {
            $this.next().select().focus();
          }
        }

        for (i = 0; i < 4; i += 1) {
          $currentInput = $($this.parent('p').find('input:not("#cuenta_alias")'))[i];
          currentInputValue = $($currentInput).attr('value');

          if (!isNaN(currentInputValue)) {
            if (i === 0 && currentInputValue.length >= typeFirst) {
              cccFull = true;
            } else {
              cccFull = false;
            }

            if (i === 1 && currentInputValue.length >= typeFirst) {
              cccFull = true;
            } else {
              cccFull = false;
            }

            if (i === 2 && currentInputValue.length >= typeSecond) {
              cccFull = true;
            } else {
              cccFull = false;
            }

            if (i === 3 && currentInputValue.length >= typeThird) {
              cccFull = true;
            } else {
              cccFull = false;
            }
          }

          if ($($currentInput).hasClass('watermark') && isNaN(currentInputValue)) {
            todosWaterMark = todosWaterMark + 1;
          }

          if ($($currentInput).val().length === 0) {
            todosEmpty = todosEmpty + 1;
          }

          cccNumber = cccNumber + currentInputValue;
        }

        if (cccFull && cccNumber.length === 20) {
          if (!calculoIBANstopper) {
            $.publish('calcularIban', {
              cccNumber: cccNumber
            });
          }
        } else {
          $('#iban').val('');
        }

        if ($this.val().length === 0 && todosWaterMark >= 3 || todosEmpty === 4) {
          $('#iban:not([data-always-disabled])').removeAttr('disabled').removeAttr('data-no-enabling');
        } else {
          $('#iban').attr('disabled', 'disabled').attr('data-no-enabling', true);
        }
      }
    }

    context = context || $body;
    inputsCCC.off('paste').on('paste', checkCCCInput20digits);
    inputIBAN.off('paste').on('paste', prepareIBANNumber);
    inputs.off('keyup').on('keyup', checkCCCInput);
  };
  /**
   * autoInputJump
   *
   * Al llamar a $B_ui.autoInputJump() se permite saltar automaticamente entre los inputs pasado en el contexto
   *
   *
   */


  $B_ui.listItemNavigation = function (options) {
    var defaults = {
      selector: '[nav-list-item]:not(.hidden)',
      context: $('#resultsPane')
    },
        params = $.extend(true, {}, defaults, options),
        $items = params.context.find(params.selector),
        itemsNumber = $items.length,
        currentItem = 0,
        nextItem;

    function getNextItem(direction) {
      var item;

      if (direction === 40 || direction === 39) {
        if (currentItem === itemsNumber - 1) {
          item = 0;
        } else {
          item = currentItem + 1;
        }
      } else if (direction === 38 || direction === 37) {
        if (currentItem === 0) {
          item = itemsNumber - 1;
        } else {
          item = currentItem - 1;
        }
      }

      return item;
    }

    function goNext(direction) {
      nextItem = getNextItem(direction);
      $items[nextItem].focus();
      currentItem = nextItem;
    }

    function jumpToNext(ev) {
      ev.preventDefault();
      var key = ev.keyCode,
          $target = $(ev.currentTarget);

      if (key === 37 || key === 38 || key === 39 || key === 40) {
        goNext(key);
      } else if (key === 13) {
        $target.click();
      } else {
        return false;
      }
    }

    $items.off('keydown.jump').on('keydown.jump', jumpToNext);
  };

  $B_ui.autoInputJump = function (context) {
    var inputs = context.find('input.text'),
        currentLength,
        inputSize;

    function checkInput(ev) {
      var key = window.event ? ev.keyCode : ev.which,
          $this = $(ev.target);

      if (key === 16 || key === 9 || key === 36 || key === 35) {
        return false;
      }

      currentLength = $this.val().length;
      inputSize = parseInt($this.attr('maxlength'), 10);

      if (currentLength === inputSize) {
        // diferente marcado, puede haber inputs envueltos en un span o no, se cambia el selector dependiendo de ello
        if ($this.parent().next().find('input.text').length !== 0) {
          $this.parent().next().find('input.text').select().focus();
        } else if ($this.next('input.text').length !== 0) {
          $this.next().select().focus();
        }
      }
    }

    context = context || $body;
    inputs.on('keyup', checkInput);
  };
  /**
   * printReady
   *
   * Al llamar a $B_ui.printReady() se permite imprimir pantallas mediante los botones habilitados a tal efecto el
   * frontal
   *
   */


  $B_ui.printReady = function (context) {
    var printButton;

    function makePrintable() {
      window.print();
    }

    context = context || $body;
    printButton = context.find('.c-listas-acciones').find('li:last img').filter(':not("[data-eventid]")').filter(':not("[data-print]")').off('click').on('click', makePrintable);
  };
  /**
   * updateCustomInputImage
   *
   * Al llamar a $B_ui.updateCustomInputImage() se actualiza la imagen del custom radio/check
   */


  customInputClasses = {
    classChecked: 'checked',
    classDisabled: 'inactivo',
    classInactivoChecked: 'inactivoChecked'
  };

  $B_ui.updateCustomInputImage = function (elemento) {
    var $this = elemento instanceof jQuery ? elemento : $(elemento),
        $parentLabel = $this.closest('label');

    if ($this.is(':checked') && $this.attr('disabled')) {
      $parentLabel.addClass(customInputClasses.classInactivoChecked);
    } else {
      $parentLabel.removeClass(customInputClasses.classInactivoChecked);

      if ($this.is(':checked')) {
        $parentLabel.addClass(customInputClasses.classChecked);
      } else {
        $parentLabel.removeClass(customInputClasses.classChecked);
      }

      if ($this.attr('disabled')) {
        $parentLabel.addClass(customInputClasses.classDisabled);
      } else {
        $parentLabel.removeClass(customInputClasses.classDisabled);
      }
    }
  };
  /**
   * initFormComponents
   *
   * Al llamar a $B_ui.initFormComponents() se buscan todos los label que tengan el attributo data-tipoRadio o data-tipoCheck
   * y los customiza, por lo que antes de llamar a esta funcion hay que asegurarse de haber etiquetado todos los label.
   * Opciones:
   *   - Si se quiere un radio/check normal, anadir al LABEL data-tipoRadio o data-tipoCheck
   *   - Si se quiere un radio/check pequeno, anadir al LABEL data-tipoRadio="menor" o data-tipoCheck="menor"
   */


  $B_ui.initFormComponents = function (context) {
    context = context || $body;
    var elRadios = context.find('.tipoInput > input[type=radio]').closest('label'),
        elCopyButtons = context.find('[data-clipboard-target]'),
        elChecks = context.find('.tipoInput > input[type=checkbox]').closest('label'),
        classPredictivoLiquido = context.find('.c-buscadores-predictivo-liquido');

    function initStatus(item, tipo) {
      var $item = $(item),
          tipoInput = tipo === 'radio' ? tipo : 'checkbox',
          $itemInput = $item.find('input[type=' + tipoInput + ']');
      $B_ui.updateCustomInputImage($itemInput);

      if (!$item.find('.' + tipo).length) {
        $itemInput.after('<span class="' + tipo + '"></span>');
      }
    }

    function addZeroClipboardSWFLayer(element) {
      var zcClient, target;

      if (($B.ie_version === undefined || $B.ie_version >= 9) && _.isFunction(ZeroClipboard)) {
        zcClient = new ZeroClipboard(element);
        zcClient.on('ready', function (readyEvent) {
          zcClient.on('copy', function (event) {
            target = event.target;
            target.innerHTML = $B.app.literals.copiedToClipboard;
            $(target).addClass('inactivo');
          });
        });
      } else {
        $(element).remove();
      }
    }

    $.each(elCopyButtons, function (i, el) {
      addZeroClipboardSWFLayer(el);
    });
    $.each(elRadios, function (i, el) {
      initStatus(el, 'radio');
    });
    $.each(elChecks, function (i, el) {
      initStatus(el, 'check');
    });
    elRadios.off('change.customize', 'input');
    elChecks.off('change.customize', 'input');
    elRadios.on('change.customize', 'input', function (element, isMvc) {
      var $this = $(this),
          thisGroupName = $this.attr('name'); //No eliminar la clase checked si es una llamada de inicializacion desde mvc

      if (!isMvc) {
        $('[name="' + thisGroupName + '"]').closest('label').removeClass(customInputClasses.classChecked);
      }

      $B_ui.updateCustomInputImage(this);
    });
    elChecks.on('change.customize', 'input', function (element, isMvc) {
      var $this = $(this),
          $parentLabel = $this.closest('label');

      if (!isMvc) {
        //$parentLabel.toggleClass(classChecked);
        if ($this.is(':checked')) {
          $parentLabel.addClass(customInputClasses.classChecked);
        } else {
          $parentLabel.removeClass(customInputClasses.classChecked);
        }
      }

      $B_ui.updateCustomInputImage(this);
    });

    if (classPredictivoLiquido.length) {
      $B_ui.c_buscadores_predictivoLiquido(classPredictivoLiquido);
    } //set css class unaLinea to conmutador legend to vertical align


    context.find('.c-widget-conmutador fieldset legend').first().find('span').each(function (index, item) {
      var $item = $(item);

      if ($item.height() < 30) {
        $item.addClass('unaLinea');
      }
    });
    $B.ui.avoidPaste({
      context: context
    });
  };
  /**
   * disableFormElements
   *
   * Al llamar a $B_ui.disableFormElements(context) se buscan todos los elementos de formulario del contexto y
   * se les anade el atributo "disabled".
   *
   */


  $B_ui.disableFormElements = function (context) {
    // Si no se pasa contexto no se hace nada.
    if (!context) {
      return;
    }

    var formElements = context.find(':input');
    formElements.attr('disabled', 'disabled').trigger('change.customize', true);
    $B_ui.updateCustomElementsStatus(context);
  };
  /**
   * enableFormElements
   *
   * Al llamar a $B_ui.enableFormElements(context) se buscan todos los elementos de formulario del contexto y
   * se les elimina el atributo "disabled".
   *
   */


  $B_ui.enableFormElements = function (context) {
    // Si no se pasa contexto no se hace nada.
    if (!context) {
      return;
    }

    var formElements = context.find(':input');
    formElements.removeAttr('disabled');
    $B_ui.updateCustomElementsStatus(context);
  };
  /**
   * updateCustomElementsStatus
   *
   * Al llamar a $B_ui.updateCustomElementsStatus(context) se lanzan los eventos necesarios para
   * actualizar el estado de los elementos customizados (checks, radios, combos...) despues de cambiarles
   * algun atributo (disabled, checked...) desde los mvc
   *
   */


  $B_ui.updateCustomElementsStatus = function (context) {
    //Si no se pasa contexto se supone que el contexto es body
    context = context || $body; //Si el contexto no es un objeto jQuery se transforma

    context = context instanceof jQuery ? context : $(context); //Lanzamos el evento change.customize de todos los elementos de formulario

    context.find(':input').trigger('change.customize', true); //iniciamos los tooltips

    $('.js-tooltip').tooltip();
  };
  /**
   * initConmutador
   *
   * Al llamar a $B_ui.initConmutador() se buscan todos los elementos que tengan la clase c-widget-conmutador
   * y hace que se calcule automaticamente la posicion del puntero cada vez que se seleccione una opcion
   *
   */


  $B_ui.initConmutador = function (context) {
    context = context || $body;

    function posicionarPuntero(elemento) {
      var boton = $(elemento).closest('li'),
          botonLeft = boton.position().left,
          botonSize = boton.width(),
          contenedor = boton.closest('.c-widget-conmutador'),
          puntero = contenedor.find('.puntero:visible'),
          punteroSize = puntero.width();
      puntero.css('left', botonLeft + botonSize / 2 + punteroSize / 2 + 'px');
    }

    function iniciarPuntero(elemento) {
      elemento.find('ul:first input:checked').change();
    }

    $('.c-widget-conmutador').each(function () {
      var $conmutador = $(this);
      $conmutador.find('ul:first').off();
      $conmutador.find('ul:first').on('change', 'input', function () {
        posicionarPuntero(this);
      });
      iniciarPuntero($conmutador);
    });
  };

  $B_ui.getRSS = function (url) {
    var googleURL = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=',
        entries = [];
    $.getJSON(googleURL + url, function (data) {
      var contenido = _.tmpl('#tmpl_RSS', {
        data: data.responseData.feed.entries
      });
    });
  };
  /**
   * tooltip: para usar el tooltip hay que incluir en el mvc: $(selector).tooltip(); donde el selector puede ser un p, label... Y deben tener dentro un <span class='comentario'>mi comentario</span>
   *   las clases que haya en <span class='comentario miclase'>mi comentario</span> se incluiran en el div del tooltip creado
   */


  $B_ui.tooltip = function () {
    // cacheamos el html del tooltip porque sino se hacen casi infinitas peticiones a la imagen
    var cachedTooltip;
    $('<div class="tooltip" id="tooltipWrapper" style="display:none;"><span class="comentario"></span><img class="flecha" src="' + $B.staticPath + '/img/bg-mensajes-tooltip.png" alt="" /></div>').appendTo('body');
    return function (ev, accion) {
      //if (!_.isMobile()) {
      var el = $(ev.currentTarget),
          comentario = el.find('.comentario'),
          tooltipDiv = $('div.tooltip'),
          elPosition,
          desplazamientoX = 0,
          tooltipClose = function tooltipClose() {
        //borramos el tooltip
        tooltipDiv.hide();
        cachedTooltip = null;
        $B.utils.aria.tooltip(el);
        $body.unbind('mousemove');
      },
          onMouseMoveFunction = function onMouseMoveFunction() {
        if ($body.find(el).length === 0) {
          tooltipClose();
        }
      },
          tooltipOpen = function tooltipOpen() {
        var cssTooltipWarper, cssTooltipPointerArrow;
        cachedTooltip = $('#tooltipWrapper').show();
        $body.bind('mousemove', onMouseMoveFunction); //creamos el div y copiamos el contenido

        if (!tooltipDiv.length) {
          tooltipDiv = cachedTooltip.appendTo('body');
        }

        tooltipDiv.on('touchstart', function (event) {
          event.stopPropagation();
          event.preventDefault();
          tooltipClose();
          tooltipDiv.off('touchstart');
        });
        $B.utils.aria.tooltip(el, tooltipDiv);
        tooltipDiv.find('.comentario').html(comentario.html()).end().attr('class', 'tooltip ' + comentario.attr('class')).removeClass('comentario');
        tooltipDiv.attr('style', '');
        cssTooltipWarper = el.attr('data-cssTooltipWarper');

        if (cssTooltipWarper) {
          tooltipDiv.css(JSON.parse(cssTooltipWarper));
        }

        if (el.attr('data-desplazamientoX')) {
          desplazamientoX = Number(el.attr('data-desplazamientoX'));
        }

        tooltipDiv.find('img').attr('style', '');
        cssTooltipPointerArrow = el.attr('data-cssTooltipPointerArrow');

        if (cssTooltipPointerArrow) {
          tooltipDiv.find('img').css(JSON.parse(cssTooltipPointerArrow));
        } //posicionamos


        elPosition = el.offset();
        tooltipDiv.offset({
          top: elPosition.top - tooltipDiv.outerHeight(),
          left: elPosition.left + el.outerWidth() / 2 - tooltipDiv.outerWidth() / 2 + desplazamientoX
        });
      }; //Si es un dispositivo tactil...


      if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
        //Comprobamos si hemos pulsado ( 'click' ) sobre una imagen de ayuda ( '?' ) y evitamos el comportamiento por defecto, mostrando unicamente el tooltip
        if (ev.type === 'click' && ev.target.tagName.toUpperCase() === 'IMG') {
          if (ev.target.parentNode.className.indexOf('js-tooltip') !== -1 && (ev.target.src.indexOf('ico-ayuda') !== -1 || ev.target.src.indexOf('ico-info') !== -1)) {
            ev.stopPropagation();
            ev.preventDefault(); // Si el elemento que hemos pulsado no tiene activo el tooltip, se muestra.

            if ($(ev.target.parentNode).attr('aria-describedby') === undefined) {
              tooltipOpen();
            } else {
              //El tooltip ya esta visible, lo ocultamos.
              tooltipClose();
            }
          }
        } else {
          // Al no haber hecho click o no ser una imagen de ayuda, cerramos el tooltip y sigue el proceso por defecto
          tooltipClose();
        }
      } else {
        //abrimos el tooltip
        if (ev.type === 'mouseenter' || ev.type === 'focus' || ev.type === 'opentooltip' || accion === 'open') {
          tooltipOpen();
        } else {
          tooltipClose();
        }
      } //} 

    };
  }();

  $.widget('B.tooltip', {
    _create: function _create() {
      this.element.hover($B_ui.tooltip, $B_ui.tooltip).click($B_ui.tooltip).focus($B_ui.tooltip).blur($B_ui.tooltip).on('opentooltip', $B_ui.tooltip).on('closetooltip', $B_ui.tooltip);
    }
  });
  /**
   * tooltip: para usar el tooltip hay que incluir en el mvc: $(selector).tooltipBottom(); donde el selector puede ser un p, label... Y deben tener dentro un <span class='comentario'>mi comentario</span>
   *   las clases que haya en <span class='comentario miclase'>mi comentario</span> se incluiran en el div del tooltip creado.
   * se recomienda que el selector del tooltip sea diferente al que ya estamos utilizando (js-tooltip), lo ideal es que sea $('js-tooltipBottom').tooltipBottom();
   */

  $B_ui.tooltipBottom = function (ev, accion) {
    var el = $(ev.currentTarget),
        comentario = el.find('.comentario'),
        tooltipDiv = $('div.tooltip.bottom'),
        elPosition; //abrimos el tooltip

    if (ev.type === 'mouseenter' || accion === 'open') {
      //creamos el div y copiamos el contenido
      if (!tooltipDiv.length) {
        tooltipDiv = $('<div class="tooltip bottom ' + comentario.attr('class') + '"><img class="flechaBottom" src="' + $B.staticPath + '/img/bg-mensajes-tooltip.png" alt="" /><span class="comentario"></span></div>').appendTo('body');
      }

      $B.utils.aria.tooltip(el, tooltipDiv);
      tooltipDiv.find('.comentario').html(comentario.html()).end().addClass(comentario.attr('class')).removeClass('comentario'); //posicionamos

      elPosition = el.offset();
      tooltipDiv.offset({
        top: elPosition.top + el.outerHeight(),
        left: elPosition.left + el.outerWidth() / 2 - tooltipDiv.outerWidth() / 2
      }).on('mouseover', function () {
        tooltipDiv.remove();
        $B.utils.aria.tooltip(el);
      });
    } else {
      //borramos el tooltip
      tooltipDiv.remove();
      $B.utils.aria.tooltip(el);
    }
  };

  $.widget('B.tooltipBottom', {
    _create: function _create() {
      this.element.hover($B_ui.tooltipBottom, $B_ui.tooltipBottom).click($B_ui.tooltipBottom);
    }
  });
  /**
   * tooltipRightBottom: para usar el tooltip hay que incluir en el mvc: $(selector).tooltipBottom(); donde el selector puede ser un p, label... Y deben tener dentro un <span class='comentario'>mi comentario</span>
   *   las clases que haya en <span class='comentario miclase'>mi comentario</span> se incluiran en el div del tooltip creado.
   * se recomienda que el selector del tooltip sea diferente al que ya estamos utilizando (js-tooltip), lo ideal es que sea $('js-tooltipRightBottom').tooltipRightBottom();
   */

  $B_ui.tooltipRightBottom = function (ev, accion) {
    var el = $(ev.currentTarget),
        comentario = el.find('.comentario'),
        tooltipDiv = $('div.tooltip.right'),
        tooltipFlecha,
        elPosition; //abrimos el tooltip

    if (ev.type === 'mouseenter' || accion === 'open') {
      //creamos el div y copiamos el contenido
      if (!tooltipDiv.length) {
        tooltipDiv = $('<div class="tooltip right bottom ' + comentario.attr('class') + '"><img class="flechaLeft" src="' + $B.staticPath + '/img/bg-mensajes-tooltip.png" alt="" /><span class="comentario"></span></div>').appendTo('body');
      }

      $B.utils.aria.tooltip(el, tooltipDiv);
      tooltipDiv.find('.comentario').html(comentario.html()).end().addClass(comentario.attr('class')).removeClass('comentario'); //Posicionamos la flecha

      tooltipFlecha = tooltipDiv.find('.flechaLeft');
      tooltipFlecha.css({
        top: el.outerHeight() / 2 + 16 - tooltipFlecha.outerWidth() / 2
      }); //posicionamos

      elPosition = el.offset();
      tooltipDiv.offset({
        top: elPosition.top - 16,
        left: elPosition.left + el.outerWidth() + 16
      }).on('mouseover', function () {
        tooltipDiv.remove();
        $B.utils.aria.tooltip(el);
      });
    } else {
      //borramos el tooltip
      tooltipDiv.remove();
      $B.utils.aria.tooltip(el);
    }
  };

  $.widget('B.tooltipRightBottom', {
    _create: function _create() {
      this.element.hover($B_ui.tooltipRightBottom, $B_ui.tooltipRightBottom).click($B_ui.tooltipRightBottom);
    }
  });
  /**
   * tooltipVertical: para usar el tooltip vertical hay que incluir en el mvc: $(selector).tooltipVertical(); donde el selector puede ser un p, label... Y deben tener dentro un <ul class='comentario'><li>mi comentario</li></ul>
   */

  $B_ui.tooltipVertical = function (ev) {
    var el = $(ev.currentTarget),
        tooltipDiv = $('div.tooltip.vertical'),
        index = el.parent().prevAll().length,
        altura = el.parent().outerHeight(),
        minHeight = el.parents('ul').outerHeight() - 42; //abrimos el tooltip

    if (ev.type === 'mouseenter') {
      //creamos el div y copiamos el contenido
      if (!tooltipDiv.length) {
        tooltipDiv = $('<div class="tooltip vertical"><div class="comentario"></div><img class="flecha" src="' + $B.staticPath + '/img/bg-mensajes-tooltip-vertical.png" alt="" /></div>').appendTo(el.parents('fieldset'));
      }

      tooltipDiv.find('.comentario').html(el.next('.comentario').html()).css({
        'min-height': minHeight
      }); //Posicionamos la flecha

      tooltipDiv.find('.flecha').css({
        top: index * altura + 16
      }); //posicionamos

      tooltipDiv.css({
        top: tooltipDiv.closest('legend').outerHeight(),
        left: el.parents('ul').outerWidth(),
        'min-height': minHeight
      });
      tooltipDiv.on('hover', function () {
        tooltipDiv.remove();
      });
    } else {
      //borramos el tooltip
      tooltipDiv.remove();
    }
  };

  $.widget('B.tooltipVertical', {
    _create: function _create() {
      this.element.hover(function (ev) {
        $B_ui.tooltipVertical(ev);
      }, function (ev) {
        $B_ui.tooltipVertical(ev);
      });
    }
  });
  /**
   * c_widget_scroll
   * @param {string} selector del elemento a aplicar el scroll
   * @example _.c_widget_scroll('#miDivScrollable');
   * Para aplicar el scroll a un elemento insertar esta llamada en el mvc despues de renderizar
   */

  $B_ui.c_widget_scroll = function (selector) {
    $B_ui.scrollElement($(selector));
  };
  /*   sustituido el codigo del jscrollpane para que use custom scroll, refactor de solo un tipo de scroll
    $B_ui.c_widget_scroll = function (selector) {
      $(selector).jScrollPane({
        showArrows: true,
        verticalArrowPositions: 'after',
        mouseWheelSpeed : 10
      });
    };
  */

  /*\
   * c_desplegable_carrusel
   [ method ]
   * Aplica la funcionalidad de un carrusel horizontal. Mirar el componente c_desplegable_carrusel para ver como generar el codigo html
   > Parametros opcionales
   - elementosPorPagina (number)
   - animatioDuration (number) en milisegundos
   - autoPlayTime (number) si autoPlay = true, el carrusel se reproduce automaticamente. Este es tiempo en milisegundos entre cada movimiento
   - autoPlay (boolean) false
   > Uso en los *.mvc.js
   | En afterRender: this.$('#miCarrusel').c_desplegable_carrusel({ elementosPorPagina: 3 });
   | En afterDisplayStep: $('#miCarrusel').c_desplegable_carrusel({ elementosPorPagina: 3 });
  \*/


  $.widget('B.c_desplegable_carrusel', {
    options: {
      elementosPorPagina: 1,
      numeroDePaginas: 0,
      animatioDuration: 500,
      indice: 0,
      autoPlay: false,
      autoPlayTime: 2000,
      _autoPlayResource: null
    },
    _create: function _create() {
      var self = this;
      this.element.find('ol.js-pager').on('click', 'li', function (ev) {
        self.getPagerItemClicked(ev);
      });
      this.initialize();
    },
    initialize: function initialize() {
      var self = this,
          liItems = this.getDomContentLis(),
          elementosPorPagina = this.options.elementosPorPagina,
          numeroDePaginas = this.options.numeroDePaginas,
          getDivContentWidth = this.getDivContentWidth(),
          widthSobrante = 0; //obtenemos el numero de paginas

      this.options.numeroDePaginas = numeroDePaginas = Math.ceil(liItems.length / elementosPorPagina); //ampliamos el tamano del ul para que sea multiplo del tamano del div

      this.getDomContentUl().eq(0).width(getDivContentWidth * numeroDePaginas); //para que los li de la ultima pagina esten siempre centrados, metemos margen a la izquierda de uno de ellos

      widthSobrante = (numeroDePaginas * elementosPorPagina - liItems.length) * liItems.eq(0).outerWidth(true) / 2;
      liItems.eq((numeroDePaginas - 1) * elementosPorPagina).css('margin-left', widthSobrante + 'px'); //play periodico

      if (this.options.autoPlay) {
        this.options._autoPlayResource = setInterval(function () {
          self.play();
        }, this.options.autoPlayTime);
      }
    },
    getPagerItemClicked: function getPagerItemClicked(ev) {
      var $currentTarget = $(ev.currentTarget),
          currentClicked = $currentTarget.index(); //obtenemos el li pulsado en funcion de si existe flechas o no

      if (this.existenFlechas()) {
        if (currentClicked === 0) {
          this.options.indice -= 1;
        } else if (currentClicked === this.options.numeroDePaginas + 1) {
          this.options.indice += 1;
        } else {
          this.options.indice = currentClicked - 1;
        }
      } else {
        this.options.indice = currentClicked;
      } //actualizamos


      this.set(); //paramos la reproduccion

      clearInterval(this.options._autoPlayResource);
    },
    set: function set(indice) {
      this.checkIndice(indice);
      this.updatePager();
      this.updateItems();
    },
    updatePager: function updatePager() {
      this.getDomPagerLi().removeClass('activo').eq(this.existenFlechas() ? this.options.indice + 1 : this.options.indice).addClass('activo');
    },
    updateItems: function updateItems() {
      this.getDomContentUl().eq(0).animate({
        right: this.options.indice * this.getDomContentLis().eq(0).outerWidth(true) * this.options.elementosPorPagina + 'px'
      }, this.options.animatioDuration);
    },
    play: function play() {
      this.options.indice = this.options.indice >= this.options.numeroDePaginas - 1 ? 0 : this.options.indice += 1;
      this.set();
    },
    existenFlechas: function existenFlechas() {
      return this.element.find('ol.js-pager .js-flechaAnterior, ol.js-pager .js-flechaSiguiente').length !== 0;
    },
    checkIndice: function checkIndice(indice) {
      this.options.indice = Math.max(0, Math.min(indice || this.options.indice, this.options.numeroDePaginas - 1));
    },
    getDivContentWidth: function getDivContentWidth() {
      return this.element.find('div.js-content').eq(0).outerWidth(true);
    },
    getDomPagerLi: function getDomPagerLi() {
      return this.element.find('ol.js-pager li');
    },
    getDomContentUl: function getDomContentUl() {
      return this.element.find('div.js-content ul');
    },
    getDomContentLis: function getDomContentLis() {
      return this.element.find('div.js-content ul li');
    }
  });
  /*\
   * c_mensaje_carrusel
   [ method ]
   * Aplica la funcionalidad de un carrusel horizontal. Mirar el componente c_desplegable_carrusel para ver como generar el codigo html
   > Parametros opcionales
   - elementosPorPagina (number)
   - numeroElementosPintar (number) Numero de diapos que se pintan independientemente de las que lleguen.
   - numeroElementosPorPaginacion (number) Numero de paginas por cada bloque de paginacion.
   - animatioDuration (number) en milisegundos
   - autoPlayTime (number) si autoPlay = true, el carrusel se reproduce automaticamente. Este es tiempo en milisegundos entre cada movimiento
   - autoPlay (boolean) false
   > Uso en los *.mvc.js
   | En afterRender: this.$('#miCarrusel').c_mensajes_carrusel({ elementosPorPagina: 3 });
   | En afterDisplayStep: $('#miCarrusel').c_mensajes_carrusel({ elementosPorPagina: 3 });
  \*/

  $.widget('B.c_mensajes_carrusel', {
    options: {
      elementosPorPagina: 1,
      numeroDePaginas: 0,
      animatioDuration: 500,
      numeroElementosPintar: 0,
      numeroElementosPorPaginacion: 0,
      indice: 0,
      reverse: false,
      autoPlay: false,
      autoPlayTime: 2000,
      _autoPlayResource: null,
      flagStop: false
    },
    stopInterval: function stopInterval() {
      clearInterval(this.options._autoPlayResource);
    },
    startInterval: function startInterval() {
      return $B.setLinkedInterval(this.element, this.options.autoPlayTime, {
        fn: 'play',
        context: this
      });
    },
    _create: function _create() {
      var self = this;

      if (!self.options.autoPlay) {
        self.options.flagStop = true;
      }

      this.element.find('ol.js-pager').on('click', 'li', function (ev) {
        self.getPagerItemClicked(ev);
      });
      this.element.find('ul').on('mouseenter', function () {
        self.stopInterval();
      }).on('mouseleave', function () {
        if (!self.options.flagStop) {
          self.options._autoPlayResource = self.startInterval();
        }
      });
      this.element.find('[data-registro-cierre-campania-individual]').on('click.carrusel', function (ev) {
        var url = $(ev.currentTarget).attr('data-registro-cierre-campania-individual'),
            indexCampania = $(ev.currentTarget).attr('data-index-campania');
        self.sendClosedCampaign(url);
        self.getDomPagerLi().filter(':not(.flecha)').eq(indexCampania).remove();
        self.getDomCloserLi().eq(indexCampania).remove();
        self.getDomContentLis().eq(indexCampania).remove();
        self.options.numeroDePaginas += -1;

        if (self.options.numeroDePaginas === 1) {
          self.element.find('.c-widget-paginador').hide();
        } else if (self.options.numeroDePaginas === 0) {
          self.element.remove();
          return;
        }

        self.set();
      });
      this.reorganizeSlides();
      this.reorganizePagination();
      this.initialize();
    },
    sendClosedCampaign: function sendClosedCampaign(url) {
      $.ajax({
        type: 'GET',
        url: url,
        success: function success() {}
      });
    },
    reorganizePagination: function reorganizePagination() {
      var paginas = this.getDomContentLis().length,
          paginasPorPaginacion = this.options.numeroElementosPorPaginacion,
          currentSlide = this.getActiveIndex();

      if (paginasPorPaginacion === 0 || paginas <= paginasPorPaginacion) {
        return;
      }

      this.hidePagination(currentSlide);
    },
    hidePagination: function hidePagination(currentIndex) {
      var paginasPorPaginacion = this.options.numeroElementosPorPaginacion,
          $pags;

      if (!currentIndex) {
        currentIndex = 1;
      }

      if (currentIndex === 1) {
        $pags = this.element.find('ol.js-pager li').not('.flecha').slice(paginasPorPaginacion);
        $pags.hide().eq(0).prevUntil('.flecha').show();
      } else {
        if (!this.options.reverse) {
          if ((currentIndex - 1) % paginasPorPaginacion === 0) {
            this.element.find('ol.js-pager li:not(.flecha):lt(' + currentIndex + ')').hide();
            this.element.find('ol.js-pager li:not(.flecha):gt(' + (currentIndex - 2) + ')').slice(0, paginasPorPaginacion).show();
          }
        } else {
          if (currentIndex % paginasPorPaginacion === 0) {
            this.element.find('ol.js-pager li:not(.flecha):gt(' + (currentIndex - 1) + ')').hide();
            this.element.find('ol.js-pager li:not(.flecha):lt(' + currentIndex + ')').slice(-paginasPorPaginacion).show();
          }
        }
      }
    },
    reorganizeSlides: function reorganizeSlides() {
      if (this.options.numeroElementosPintar > 0) {
        this.element.find('div.js-content ul li').slice(-this.options.numeroElementosPintar).remove();
        this.element.find('ol.js-pager li:not(.js-flechaSiguiente)').slice(-this.options.numeroElementosPintar).remove();
      }
    },
    initialize: function initialize() {
      var self = this,
          liItems = this.getDomContentLis(self.options.numeroElementosPintar),
          elementosPorPagina = this.options.elementosPorPagina,
          numeroDePaginas = this.options.numeroDePaginas,
          getDivContentWidth = this.getDivContentWidth(),
          widthSobrante = 0; //obtenemos el numero de paginas

      this.options.numeroDePaginas = numeroDePaginas = Math.ceil(liItems.length / elementosPorPagina); //ampliamos el tamano del ul para que sea multiplo del tamano del div

      this.getDomContentUl().eq(0).width(getDivContentWidth * numeroDePaginas); //para que los li de la ultima pagina esten siempre centrados, metemos margen a la izquierda de uno de ellos

      widthSobrante = (numeroDePaginas * elementosPorPagina - liItems.length) * liItems.eq(0).outerWidth(true) / 2;
      liItems.eq((numeroDePaginas - 1) * elementosPorPagina).css('margin-left', widthSobrante + 'px'); //play periodico

      if (this.options.autoPlay) {
        this.options._autoPlayResource = self.startInterval();
      }

      this.checkArrows();
      this.updateCloser();
      $B.utils.aria.carousel({
        element: $(this.element)
      });
    },
    getPagerItemClicked: function getPagerItemClicked(ev) {
      var $currentTarget = $(ev.currentTarget),
          currentClicked = $currentTarget.index(); //obtenemos el li pulsado en funcion de si existe flechas o no

      if (this.existenFlechas()) {
        if ($currentTarget.hasClass('js-flechaAnterior')) {
          this.options.indice -= 1;
          this.options.reverse = true;
        } else if ($currentTarget.hasClass('js-flechaSiguiente')) {
          this.options.indice += 1;
          this.options.reverse = false;
        } else {
          this.options.indice = currentClicked - 1;
        }
      } else {
        //this.options.indice += 1;
        this.options.indice = currentClicked;
      } //actualizamos


      this.set(); //paramos la reproduccion

      this.stopInterval();
      this.options.flagStop = true;
      this.checkArrows();
    },
    set: function set(indice) {
      this.checkIndice(indice);
      this.updatePager();
      this.updateCloser();
      this.reorganizePagination();
      this.updateItems();
      this.checkArrows();
    },
    updatePager: function updatePager() {
      this.getDomPagerLi().removeClass('activo').eq(this.existenFlechas() ? this.options.indice + 1 : this.options.indice).addClass('activo');
      this.element.trigger('update.aria');
    },
    updateCloser: function updateCloser() {
      this.getDomCloserLi().each(function (index, item) {
        $(item).attr('data-index-campania', index);
      });
      this.getDomCloserLi().hide().eq(this.options.indice).show();
    },
    updateItems: function updateItems() {
      var indice = this.options.indice;
      this.getDomContentUl().eq(0).animate({
        right: indice * this.getDomContentLis().eq(0).outerWidth(true) * this.options.elementosPorPagina + 'px' //}, (indice === 0) ? 0 : this.options.animatioDuration);

      }, this.options.animatioDuration);
    },
    play: function play() {
      this.options.indice = this.options.indice >= this.options.numeroDePaginas - 1 ? 0 : this.options.indice += 1;
      this.set();
    },
    existenFlechas: function existenFlechas() {
      return this.element.find('ol.js-pager .js-flechaAnterior, ol.js-pager .js-flechaSiguiente').length !== 0;
    },
    checkIndice: function checkIndice(indice) {
      this.options.indice = Math.max(0, Math.min(indice || this.options.indice, this.options.numeroDePaginas - 1));
    },
    getDivContentWidth: function getDivContentWidth() {
      return this.element.find('div.js-content').eq(0).outerWidth(true);
    },
    getDomPagerLi: function getDomPagerLi() {
      return this.element.find('ol.js-pager li');
    },
    getDomCloserLi: function getDomCloserLi() {
      return this.element.find('ul.boton-cerrar li');
    },
    getDomContentUl: function getDomContentUl() {
      return this.element.find('div.js-content ul');
    },
    getDomContentLis: function getDomContentLis() {
      return this.element.find('div.js-content ul li');
    },
    getActiveIndex: function getActiveIndex() {
      return this.element.find('ol.js-pager li.activo').index();
    },
    checkArrows: function checkArrows() {
      if (this.existenFlechas()) {
        // Si estamos en la primera diapo, quitamos la flecha de la izquierda
        if (this.getActiveIndex() === 1) {
          this.element.find('.js-flechaAnterior').addClass('hiddenCarruselArrow');
        } else {
          this.element.find('.js-flechaAnterior').removeClass('hiddenCarruselArrow');
        } // Si estamos en la ultima diapo, quitamos la flecha de la izquierda


        if (this.getActiveIndex() === this.getDomPagerLi().length - 2) {
          // El 2 se corresponde con los elementos de las flechas.
          this.element.find('.js-flechaSiguiente').addClass('hiddenCarruselArrow');
        } else {
          this.element.find('.js-flechaSiguiente').removeClass('hiddenCarruselArrow');
        }
      }
    }
  });
  /**
   * indicadorProgresoOperativa
   */

  $.widget('B.indicadorProgresoOperativa', {
    options: {
      currentStep: 0,
      stepsLength: 0
    },
    _create: function _create() {
      this.element.find('.pasos').delegate('li.clicable', 'click', function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        $(this).trigger('handleStepsEventIds', $(ev.currentTarget).index());
      });
    },
    set: function set(currentStep, eventIds, literalesSelector) {
      this.setLiterales(literalesSelector);
      this.setOptions(currentStep);
      this.setClasesWidget();
      this.setClasesLi();
      this.setEventIds(eventIds);
    },
    setOptions: function setOptions(currentStep) {
      var stepsLength = this.options.stepsLength = this.element.find('ol.pasos li').length;
      this.options.currentStep = Math.max(0, Math.min(currentStep, stepsLength - 1));
    },
    setClasesWidget: function setClasesWidget() {
      var i,
          thisElement = this.element;

      for (i = 0; i < 10; i += 1) {
        thisElement.removeClass('pasos_' + i).removeClass('actual_' + i);
      }

      thisElement.addClass('c-widget-indicadorProgresoOperativa').addClass('pasos_' + this.options.stepsLength).addClass('actual_' + this.options.currentStep);
    },
    setClasesLi: function setClasesLi() {
      var currentStep = this.options.currentStep,
          stepStatusText = '';
      $.each(this.element.find('li'), function (i, step) {
        if (i < currentStep) {
          $(step).removeClass('activo').addClass('respondido');

          if ($(step).hasClass('clicable')) {
            $(step).attr('tabindex', '0');
          }

          stepStatusText = $B.app.literals.indicadorProgresoOperativa.pasoCompletado;
        } else if (i === currentStep) {
          $(step).addClass('activo').removeClass('respondido').attr('tabindex', '0');
          stepStatusText = $B.app.literals.indicadorProgresoOperativa.pasoEnProgreso;
        } else {
          $(step).removeClass('activo').removeClass('respondido').removeAttr('tabindex');
          stepStatusText = $B.app.literals.indicadorProgresoOperativa.pasoNoIniciado;
        }

        $(step).find('.textoEstadoPaso').html(stepStatusText);
      });
    },
    setLiterales: function setLiterales(literalesSelector) {
      var literales;

      if (_.isString(literalesSelector)) {
        literales = $(literalesSelector).data('indicador-progreso-operativa-literales');

        if (!literales) {
          return;
        }

        literales = literales.split(',');
      }

      if (!literales || !literales.length) {
        return;
      }

      this.element.find('ol.pasos').html(_.tmpl('#c-v07-widget-indicadorProgresoOperativaOl', {
        pasos: literales,
        verNums: true
      }));
    },
    setEventIds: function setEventIds(eventIds) {
      var liItems = this.element.find('li'),
          liItemsLength = liItems.length,
          i;

      for (i = 0; i < liItemsLength; i += 1) {
        if (eventIds && eventIds[i]) {
          liItems.eq(i).addClass('clicable');
        } else {
          liItems.eq(i).removeClass('clicable');
        }
      }
    },
    delEventIds: function delEventIds() {
      this.element.find('li.clicable').removeClass('clicable');
    },
    destroy: function destroy() {
      this.element.html('').removeClass('c-widget-indicadorProgresoOperativa');
      $.Widget.prototype.destroy.call(this);
    }
  });
  /*
   * c_tablas_scroll
   *
   * Este plugin sustituye una tabla normal por dos tablas, la primera para la cabecera y la segunda para el cuerpo, poniendo el cuerpo
   *  en un div que es sobre el que se aplica el scroll. No se modifican clases ni atributos de la tabla.
   * IMPORTANTE: Actualmente el scroll es el normal, en breve se anadira la opcion de activar el scroll personalizado
   * @param: trMax si el numero de filas (tbody > tr) de la tabla supera trMax se aplica el scroll, si es menor no se hace nada. Por defecto 5
   * @param: newDivClass clase del div generado en el que se aplica el scroll, por defecto scrollTabla
   * @example: incluir en el mvc $('.js-mi-table-scroll').c_tablas_scroll( { trMax: 3 } );
   */

  $.widget('B.c_tablas_scroll', {
    options: {
      trMax: 5,
      newDivClass: 'scrollTabla'
    },
    _create: function _create() {
      //comprobamos el numero de filas
      if (this.options.trMax >= this.element.find('tbody tr').length) {
        return;
      }

      var table = this.element.clone(),
          attributesLength = this.element.context.attributes.length,
          tableAttrs = '',
          thead,
          tbody,
          caption,
          colgroup,
          i; //obtenemos los atributos de table

      for (i = 0; i < attributesLength; i += 1) {
        tableAttrs += ' ' + this.element.context.attributes[i].name + '="' + this.element.context.attributes[i].value + '"';
      } //obtenemos los hijos de la tabla y su html


      table.find('thead').wrap('<div class="thead" />');
      table.find('tbody').wrap('<div class="tbody" />');
      table.find('caption').wrap('<div class="caption" />');
      table.find('colgroup').wrap('<div class="colgroup" />');
      thead = table.find('div.thead').html();
      tbody = table.find('div.tbody').html();
      caption = table.find('div.caption').html();
      colgroup = table.find('div.colgroup').html(); //reemplazamos el codigo

      this.element.replaceWith('<table' + tableAttrs + '>' + caption + colgroup + thead.replace('thead', 'tbody').replace('thead', 'tbody') + '</table>' + '<div class="' + this.options.newDivClass + '"><table' + tableAttrs + '>' + caption + colgroup + tbody + '</table></div>');
    }
  });
  /* B.cWidgetSlider
   *
   * parametros:
   *  explicados en la descripcion de inicializar
   * metodos:
   *
   * inicializar:
   *  $('.selector').cWidgetSlider({
        minSlider : 50, //valor minimo del Slider
        maxSlider : 3000, //valor maximo del Slider
        stepSlider : 5, //valor saltos del Slider
        initialValueSlider : -1, //por defecto, -1 calcula la mitad del min y el max
        wrapperValuePosition: 'top', //posicion del cuadro del value ('top' (por defecto) OR 'bottom')
        wrapperValueUnit: '&euro;', //unidad del valor
        wrapperValueSufix: '', //sufijo para el cuadro del value
        wrapperValueFormat: 'd', //formato del numero, por defecto sin decimales
        wrapperCalculation: false, //true para dibujar un segundo cuadro con factor de multiplicacion
        wrapperCalculationUnit: '', //unidad del segundo cuadro
        wrapperCalculationSufix: '', //sufijo del segundo cuadro
        wrapperCalculationFormat: 'n', //formato del numero, por defecto con decimales
        calculationFactor: 0.632, //factor de multiplicacion del segundo cuadro
        applyFactor: true, //Si es falso, el tooltip de abajo sera informativo
        wrapper : '#js-slider', //div donde genera el slider (NO TOCAR)
        inputValue : '#cantidadSolicitada', //input donde guarda el valor
        inputCalculation : '#cantidadCalculada', //input donde guarda el valor calculado
        slide: function (value) {} //callback en el slide
      })
   */

  $.widget('B.cWidgetSlider', {
    options: {
      minSlider: 50,
      maxSlider: 3000,
      stepSlider: 5,
      initialValueSlider: -1,
      wrapperValuePosition: 'top',
      wrapperValueUnit: '&euro;',
      wrapperValueSufix: '',
      wrapperValueFormat: 'd',
      wrapperCalculation: false,
      wrapperCalculationUnit: '',
      wrapperCalculationSufix: '',
      wrapperCalculationFormat: 'n',
      calculationFactor: 1,
      applyFactor: true,
      wrapper: '#js-slider',
      inputValue: '#cantidadSolicitada',
      inputCalculation: '#cantidadCalculada',
      slide: null,
      stop: null,
      customIntervals: null,
      customSelect: null,
      customInput: null,
      valMap: null
    },
    _create: function _create() {
      var self = this,
          options = self.options,
          $element = self.element,
          $sliderElement = $element.find(options.wrapper),
          saldo = self._getSalary(),
          valMapLength = 0,
          middleIndex,
          halfRange,
          min,
          removeRest = function removeRest(amount) {
        return amount - amount % options.stepSlider;
      }; // comprobamos si ha sido inicializado


      if ($sliderElement.hasClass('ui-slider')) {
        return self.element;
      }

      if (options.valMap) {
        valMapLength = options.valMap.length - 1;
        options.stepSlider = 1;
      }

      if (options.initialValueSlider === -1) {
        if (options.valMap) {
          min = options.valMap[0];
          halfRange = valMapLength / 2;

          if (saldo !== false) {
            middleIndex = removeRest(halfRange);

            if (saldo > min && saldo < options.valMap[middleIndex]) {
              $.each(options.valMap, function (i, val) {
                if (val < saldo && i <= middleIndex) {
                  halfRange = i;
                }
              });
            } else if (saldo < options.valMap[0]) {
              halfRange = 0;
            }
          }
        } else {
          min = self._getRange('min');
          halfRange = (self._getRange('max') + min) / 2;

          if (saldo !== false) {
            if (saldo > min && saldo < removeRest(halfRange)) {
              halfRange = saldo - halfRange % options.stepSlider;
            } else if (saldo < min) {
              halfRange = min;
            }
          }
        }

        options.initialValueSlider = removeRest(halfRange);
      } else if (options.valMap) {
        options.initialValueSlider = jQuery.inArray(options.initialValueSlider, options.valMap);
      } // save inputs dom objects in options for reference


      options.inputValue = $element.find(options.inputValue);
      /*.hide();*/

      options.inputCalculation = $element.find(options.inputCalculation);
      /*.hide();*/

      $sliderElement.slider({
        range: 'min',
        value: options.initialValueSlider,
        min: options.valMap ? 0 : self._getRange('min'),
        max: options.valMap ? valMapLength : self._getRange('max'),
        step: options.stepSlider,
        create: function create() {
          var customLimits, limitsContainer;

          if (!$element.hasClass('c-widget-slider-sin-botones')) {
            $element.prepend('<span role="button" class="botonMenos btn" tabindex="0">-</span>').append('<span role="button" class="botonMas btn" tabindex="0">+</span>').on({
              click: function click(ev) {
                if (!_.isEmpty(self.options.customIntervals)) {
                  self._handleSliderPosition(ev);
                } else {
                  self._slide(ev);
                }
              },
              keypress: function keypress(ev) {
                if (ev.which === $.ui.keyCode.ENTER || ev.which === $.ui.keyCode.SPACE) {
                  ev.preventDefault();

                  self._slide(ev);
                }
              }
            }, '.btn');
          }

          $element.find('.limites').css('display', 'block'); // class component 1 tooltip top or bottom

          if (!options.wrapperCalculation) {
            if (options.wrapperValuePosition === 'top') {
              $element.addClass('onlyTopTooltip');
            } else {
              $element.addClass('onlyBottomTooltip');
            }
          } // append tooltips


          if (!$element.hasClass('c-widget-slider-sin-tooltip')) {
            self._appendTooltips();
          }

          if (!$element.hasClass('c-widget-slider-sin-limites-personalizados')) {
            customLimits = $element.find('.limite');
            limitsContainer = $element.find('.limites');
            customLimits.css({
              width: 100 / customLimits.length + '%'
            });
          } // set slider initvalues


          self._setSliderValue(options.initialValueSlider); // set slider range


          self._updateRangeView();

          $B.utils.aria.slider({
            element: $element,
            sliderControl: '.ui-slider-handle',
            secondaryControls: '.btn',
            minValue: self._getRange('min'),
            maxValue: self._getRange('max')
          });
        },
        slide: function slide(event, ui) {
          self._setSliderValue(ui.value);
        },
        stop: function stop(event, ui) {
          if (!_.isEmpty(self.options.customIntervals)) {
            self._setSliderPosition(ui.value);
          } else if (!_.isEmpty(self.options.customInput)) {
            self._setCustomInputValue(ui.value);
          }

          self._stopDropFn(ui.value);
        }
      });
    },
    _slide: function _slide(ev) {
      // get actual slider value
      var value = this.element.find(this.options.wrapper).slider('value');

      if ($(ev.currentTarget).hasClass('botonMenos')) {
        if (this._preventSlideLess(value)) {
          return false;
        }

        value -= this.options.stepSlider;
      } else {
        if (this._preventSlideMore(value)) {
          return false;
        }

        value += this.options.stepSlider;
      }

      this._setSliderValue(value);

      if (!_.isEmpty(this.options.customInput)) {
        this._setCustomInputValue(value);
      }
    },
    _stop: function _stop() {
      var value = this.element.find(this.options.wrapper).slider('value');

      this._setSliderValue(value);
    },
    _stopDropFn: function _stopDropFn(value) {
      // call slide fn callback if any
      if (this.options.stop && $.isFunction(this.options.stop)) {
        this.options.stop.call(this, value);
      }
    },
    _getValueToCalculate: function _getValueToCalculate(value) {
      return this.options.applyFactor ? value / this.options.calculationFactor : value;
    },
    _getStepSize: function _getStepSize() {
      return this.options.applyFactor ? this.options.stepSlider / this.options.calculationFactor : this.options.stepSlider;
    },
    _preventSlideLess: function _preventSlideLess(value) {
      var prevent = false,
          valueToCalculate,
          stepSize;

      if (this.options.valMap) {
        prevent = value - this.options.stepSlider < 0;
      } else {
        valueToCalculate = this._getValueToCalculate(value);
        stepSize = this._getStepSize();
        prevent = valueToCalculate - stepSize < this.options.minSlider;
      }

      return prevent;
    },
    _preventSlideMore: function _preventSlideMore(value) {
      var prevent = false,
          valueToCalculate,
          stepSize;

      if (this.options.valMap) {
        prevent = value + this.options.stepSlider > this.options.valMap.length - 1;
      } else {
        valueToCalculate = this._getValueToCalculate(value);
        stepSize = this._getStepSize();
        prevent = valueToCalculate + stepSize > this.options.maxSlider;
      }

      return prevent;
    },
    _appendTooltips: function _appendTooltips() {
      // add calculated value tooltip if needed
      var html_wrapperCalculation = '',
          tooltips;

      if (this.options.wrapperCalculation) {
        html_wrapperCalculation = '<span class="' + this._getTooltipWrapper('calculation') + '"></span>';
      }

      tooltips = '<span class="' + this._getTooltipWrapper('value') + '"></span>' + html_wrapperCalculation;
      this.element.find(this.options.wrapper).find('.ui-slider-handle').append(tooltips);
    },
    _getTooltipWrapper: function _getTooltipWrapper(what) {
      var wrapperPos = this.options.wrapperValuePosition,
          topWrapper = 'cantidadSuperior',
          bottomWrapper = 'cantidadInferior',
          tooltip_wrapper = {
        top: {
          value: topWrapper,
          calculation: bottomWrapper
        },
        bottom: {
          value: bottomWrapper,
          calculation: topWrapper
        }
      };

      if (tooltip_wrapper[wrapperPos][what]) {
        return tooltip_wrapper[wrapperPos][what];
      } else {
        throw new Error('No existe ese tooltip');
      }
    },
    _setSliderValue: function _setSliderValue(value) {
      // set slider value
      this.element.find(this.options.wrapper).slider({
        value: value
      }); // normal value

      this._setNormalValue(value); // calculated value if any


      if (this.options.wrapperCalculation) {
        this._setCalculatedValue(value);
      } // call slide fn callback if any


      if (this.options.slide && $.isFunction(this.options.slide)) {
        this.options.slide.call(this, value);
      }
    },
    _handleSliderPosition: function _handleSliderPosition(ev) {
      var currentIndex = _.indexOf(_.pluck(this.options.customIntervals, 'value'), parseFloat(this.options.inputValue.val())),
          isNextButton = $(ev.currentTarget).hasClass('botonMas'),
          selectedIndex,
          variation = isNextButton ? 1 : -1;

      if (isNextButton && currentIndex + 1 === this.options.customIntervals.length || !isNextButton && currentIndex === 0) {
        selectedIndex = currentIndex;
      } else {
        selectedIndex = currentIndex + variation;
      }

      this._setSliderValue(this.options.customIntervals[selectedIndex].value);

      if (!_.isNull(this.options.customSelect)) {
        this.options.customSelect.selectmenu('index', selectedIndex);
      }

      if (!_.isNull(this.options.customInput)) {
        this.options.customInput.val(this.options.customIntervals[selectedIndex].value);
      }
    },
    _setSliderPosition: function _setSliderPosition(value) {
      var result = _.last(this.options.customIntervals).value,
          newValue = value,
          currentIndex;

      _.each(this.options.customIntervals, function (interval, index) {
        var newResult = Math.abs(interval.value - value);

        if (newResult < result) {
          result = newResult;
          newValue = interval.value;
          currentIndex = index;
        }
      });

      if (!_.isNull(this.options.customSelect)) {
        this.options.customSelect.selectmenu('index', currentIndex);
      }

      this._setSliderValue(newValue);
    },
    _setCustomInputValue: function _setCustomInputValue(value) {
      this.options.customInput.val(value);
    },
    _setNormalValue: function _setNormalValue(value) {
      // tooltip value
      var tooltipFormattedValue = this._formatTooltipValue(value); // update tooltip


      this._addValueAndCenterTooltip(this._getTooltipWrapper('value'), tooltipFormattedValue); // set input value


      this.options.inputValue.val(_.formatNumber(this._getValue(value), 'd')).trigger('change');
    },
    _setCalculatedValue: function _setCalculatedValue(value) {
      var valueCalculated = value / this.options.calculationFactor,
          tooltipFormattedValue = this._formatTooltipValueCalculated(valueCalculated); // update tooltip


      this._addValueAndCenterTooltip(this._getTooltipWrapper('calculation'), tooltipFormattedValue); // set input value


      this.options.inputCalculation.val(valueCalculated).trigger('change');
    },
    _getValue: function _getValue(value) {
      if (this.options.valMap) {
        return this.options.valMap[value];
      } else {
        return value;
      }
    },
    _formatTooltipValue: function _formatTooltipValue(value) {
      return _.formatNumber(this._getValue(value), this.options.wrapperValueFormat) + ' ' + this.options.wrapperValueUnit + this.options.wrapperValueSufix;
    },
    _formatTooltipValueCalculated: function _formatTooltipValueCalculated(value) {
      return _.formatNumber(value, this.options.wrapperCalculationFormat) + ' ' + this.options.wrapperCalculationUnit + this.options.wrapperCalculationSufix;
    },
    _positionTooltips: function _positionTooltips(tooltip) {
      var calculatedWidth = parseInt(tooltip.css('width'), 10) - parseInt(tooltip.css('padding-left'), 10) + parseInt(tooltip.css('padding-right'), 10) || 70,
          cssLeft = 6 - Math.floor(calculatedWidth / 2);
      tooltip.css('left', cssLeft);
    },
    _addValueAndCenterTooltip: function _addValueAndCenterTooltip(tooltip_wrapper, value) {
      var tooltip = this.element.find(this.options.wrapper).find('.' + tooltip_wrapper).html(value);

      this._positionTooltips(tooltip);
    },
    _updateRangeView: function _updateRangeView() {
      var self = this,
          content = function content(value) {
        var formatParam, wrapperValue;
        formatParam = self.options.wrapperValueFormat;
        wrapperValue = self.options.wrapperCalculationUnit || self.options.wrapperValueUnit;
        value = value - value % self.options.stepSlider;
        return _.formatNumber(value, formatParam) + ' ' + wrapperValue;
      };

      self.element.find('.limites .cantidad').map(function (i, el) {
        var value;

        if (i === 0) {
          value = self.options.minSlider;
        } else {
          value = self.options.maxSlider;
        }

        $(el).html(content(value));
      });
    },
    _getSalary: function _getSalary() {
      //get salary of the dom
      var saldoDisponible = this.element.find('[data-saldo-disponible]').data('saldo-disponible'),
          salary = saldoDisponible ? Globalize.parseFloat(saldoDisponible.saldo) : this.options.maxSlider;
      return this.options.applyFactor ? salary * this.options.calculationFactor : false;
    },
    _getRange: function _getRange(m) {
      var min = this.options.applyFactor ? this.options.minSlider * this.options.calculationFactor : this.options.minSlider,
          max = this.options.applyFactor ? this.options.maxSlider * this.options.calculationFactor : this.options.maxSlider,
          minmax;

      if (max % this.options.stepSlider !== 0) {
        max -= max % this.options.stepSlider;
      } // Redondea hacia un multiplo


      if (min % this.options.stepSlider !== 0) {
        min += this.options.stepSlider - min % this.options.stepSlider;
      }

      minmax = {
        min: min,
        max: max
      };
      return minmax[m];
    },
    updateTooltipPosition: function updateTooltipPosition() {
      this._positionTooltips(this.element.find('.' + this._getTooltipWrapper('value')));

      if (this.options.wrapperCalculation) {
        this._positionTooltips(this.element.find('.' + this._getTooltipWrapper('calculation')));
      }
    },
    updateValues: function updateValues() {
      var $sliderElement = this.element.find(this.options.wrapper),
          //value = parseInt(this.options.inputCalculation.val(), 10) / this.options.calculationFactor,
      value = parseFloat(this.options.inputCalculation.val()) / this.options.calculationFactor,
          self = this;
      $sliderElement.slider({
        min: self._getRange('min'),
        max: self._getRange('max')
      });

      this._setSliderValue(value);
    },
    value: function value(_value) {
      if (_value) {
        this.element.find(this.options.wrapper).slider('value', _value);
        return this.element.find(this.options.wrapper).slider('value');
      } else {
        return this.element.find(this.options.wrapper).slider('value');
      }
    },
    destroy: function destroy() {
      this.element.find(this.options.wrapper).slider('destroy');
      this.element.find('.limites, .btn').remove();
      this.options.inputValue.val('').show();
      $.Widget.prototype.destroy.call(this);
    }
  });
  /* B.cSelectMenu
   *
   * parametros:
   *  explicados en la descripcion de inicializar
   * metodos:
   *
   * inicializar:
   *  $('.selector').cWidgetSlider()
   */

  $.widget('B.cSelectMenu', {
    options: {
      truncate: 0,
      listResizer: 3,
      width: 'auto',
      truncateText: true
    },
    _create: function _create() {
      var $el = this.element,
          $select = $el.find('select'),
          self = this,
          selectMenuMenu,
          getSelectMenuMenu = function getSelectMenuMenu() {
        if (!selectMenuMenu.length) {
          selectMenuMenu = $('#' + $select.attr('id') + '-menu').closest('.ui-selectmenu-menu');
        }
      },
          selectMenuMenuUl,
          ulHeight,
          contenedorMenu,
          defaultText = $select.attr('title');

      $select.selectmenu({
        width: 'none',
        transferClasses: false,
        listResizer: this.options.listResizer,
        open: function open(event) {
          //$B_ui.scrollElement(selectMenuMenuUl);
          if (!$select.hasClass('noTruncate')) {
            getSelectMenuMenu();
            selectMenuMenu.find('a:not([data-truncated])').truncateText({
              textMaxLength: self.options.truncate,
              width: self.options.width
            });
          }

          if (selectMenuMenuUl.find('li').length < 4) {
            selectMenuMenuUl.parentsUntil('.ui-selectmenu-menu').css({
              'height': selectMenuMenuUl.height()
            });
            $select.selectmenu('refreshPosition');
          } else {
            var $target = $(event.currentTarget),
                idList = $target.attr('aria-owns'),
                $list = $('#' + idList),
                targetOffsetTop = $target.offset().top,
                positionTopInViewport = targetOffsetTop - $(window).scrollTop(),
                viewportHeight = $(window).height(),
                targetHeight = $target.height(),
                spaceBelow = viewportHeight - (positionTopInViewport + targetHeight),
                spaceAbove = positionTopInViewport,
                newListHeight = null;

            if (spaceBelow > spaceAbove && spaceBelow < selectMenuMenuUl.height()) {
              newListHeight = spaceBelow - 10;
            } else if (spaceAbove > spaceBelow && spaceAbove < selectMenuMenuUl.height()) {
              newListHeight = spaceAbove - 10;
            }

            if ($el.attr('data-max-height')) {
              newListHeight = $el.attr('data-max-height');
            }

            if (!_.isNull(newListHeight)) {
              selectMenuMenuUl.parentsUntil('.ui-selectmenu-menu').css({
                'height': newListHeight
              });

              if ($list.is('[data-assigned-height]') && !$select.hasClass('noTruncate')) {
                $list.parent().css({
                  height: ''
                });
              } else {
                $list.attr('data-assigned-height', true);
              }

              $select.selectmenu('refreshPosition');
            }
          }

          if ($select.is('[data-forced-height]')) {
            setTimeout(function () {
              contenedorMenu = $('#' + $select.attr('id') + '-menu');
              var alturaTotal = contenedorMenu.parent().height();
              contenedorMenu.parent().parent().css('height', alturaTotal);

              if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
                $B.ui.scrollElement(contenedorMenu);
              } else {
                contenedorMenu.customScroll2({
                  scrollType: 'combo'
                });
                contenedorMenu.customScroll2('setPosition');
              }

              $(document).off('click.combo').on('click.combo', function (ev) {
                if (!$(ev.currentTarget).closest('.ui-selectmenu-open').length) {
                  $(document).off('click.combo');
                  $select.selectmenu('close');
                }
              });
            }, 10);
          }
        },
        change: function change() {
          $(document).off('click.combo');

          var _select = $el.find('select'),
              // El el contenedor de pasos estan almacenados los nombres de las instancias del plugin
          // que han sido modificados en la operativa.
          // Esto se usa para validar los select.
          // En formvalidation.js, metodo prepareRequiredSelects se asigna el data-default si procede
          selectedData = _select.parents('.contenedorPasos').data('selectChanged');

          _select.data('default', false);

          if (!selectedData) {
            selectedData = [];
          } else {
            // El nombre del select cambiado se anade a la lista que luego se almacena
            // en el data del contenedor de pasos.
            selectedData.push(this.name);
          }

          _select.parents('.contenedorPasos').data('selectChanged', selectedData);

          if (self.options.truncateText) {
            $el.find('.ui-selectmenu-status').first().truncateText();
          }
        },
        select: function select() {
          if (self.options.truncateText) {
            $el.find('.ui-selectmenu-status').first().truncateText();
          }
        }
      });
      selectMenuMenu = $('#' + $select.attr('id') + '-menu').parent('.ui-selectmenu-menu');
      $select.parent().find('[role="button"]').attr('role', 'combobox');
      selectMenuMenu.addClass($select.attr('class'));
      $el.addClass($select.attr('class'));
      /* LA FUNCION DEL MIXIN truncate LA ASUME EL METODO truncateText presente en bbva.ui */

      /*if (self.options.truncate > 0) {
        selectMenuMenu.find('li a').each(function () {
          if (!$(this).find('abbr, [data-truncated-text]').length) {
            $(this).html(_.truncate($(this).text(), self.options.truncate));
          }
        });
      }*/
      // Anadimos un evento change.customize

      $select.on('change.customize', function () {
        var $this = $(this);

        if ($this.attr('disabled')) {
          $this.selectmenu('disable');
        } else {
          self.enable();
        }
      }); //init scroll

      selectMenuMenuUl = selectMenuMenu.find('ul');
      selectMenuMenu.show(); //si un combo esta vacio (solo tiene un li) y si luego se pobla (con mas li) mantiene el ulHeight anterior
      //por ello se aplica el ulHeight de al menos 3 li

      ulHeight = Math.max(selectMenuMenu.find('li').outerHeight() * 3, selectMenuMenuUl.outerHeight()); //$B_ui.scrollElement(selectMenuMenuUl);

      selectMenuMenu.hide();

      if (!$select.hasClass('noTruncate')) {
        selectMenuMenuUl.css('height', 'auto').wrap('<div class="selectmenu-ul-wrapper" />').closest('div').css({
          'height': ulHeight,
          'overflow': 'hidden',
          'padding-bottom': '2px'
        });
      } else {
        selectMenuMenuUl.css('height', 'auto').wrap('<div class="selectmenu-ul-wrapper" />').closest('div').css({
          'height': ulHeight,
          'overflow-x': 'hidden',
          'overflow-y': 'auto',
          'padding-bottom': '2px'
        });
      } // comprobamos que no exista ningun option seleccionado por defecto desde el mixin y que defaultText venga informado


      if ($select[0] && !$select.find('[data-selected]')[0] && defaultText) {
        $select[0].selectedIndex = -1;
        $el.find('.ui-selectmenu-status').text(defaultText);
      }

      $el.find('.ui-selectmenu-status').first().truncateText();
    },
    index: function index(_index2) {
      return this.element.find('select').selectmenu('index', _index2);
    },
    enable: function enable() {
      var $el = this.element,
          elMenu = 'ul#' + $el.find('select').attr('id') + '-menu'; //la funcion enable de selectmenu no elimina correctamente las clases css

      $el.find('select').selectmenu('enable');
      $el.removeClass('ui-selectmenu-disabled').removeClass('ui-state-disabled');
      $(elMenu).closest('div').removeClass('ui-selectmenu-disabled').removeClass('ui-state-disabled');
    },
    destroy: function destroy() {
      var $el = this.element,
          $select = $el.find('select');
      $select.selectmenu('destroy');
      $el.removeClass($select.attr('class'));
      $.Widget.prototype.destroy.call(this);
    }
  });
  /* $.truncateText
   *
   * parametros:
   *  options {
   *    textMaxLength: [integer with fixed characters limit] (value 0 for no limit)
   *    width: [integer with fixed width]
   *    limiter: [String with ellipsis or equivalent]
   *    reversed: [Boolean add hellip at start instead the end of string]
   *    maskedRegex: [Regular expression for masked strings]
   *    template: [Template selector]
   *    truncatedTextSelector: [Truncated text element selector from specified template]
   * }
   * metodos:
   *
   * inicializar:
   *  $('.selector').truncateText()
   */

  $.fn.extend({
    truncateText: function truncateText(options) {
      var defaults = {
        textMaxLength: 0,
        width: 'auto',
        limiter: '&hellip;',
        reversed: false,
        maskedRegex: /[\*]{4}[0-9]{4}/,
        template: '#c-contenedor-texto-truncado-abbr',
        truncatedTextSelector: '[data-truncated-text]'
      },
          truncateWidth;
      options = $.extend(defaults, options);
      return this.each(function () {
        var text = $(this).find(options.truncatedTextSelector).length ? $(this).find(options.truncatedTextSelector).attr('title') : $(this).text(),
            maskedRegex = new RegExp(options.maskedRegex),
            rtl = maskedRegex.test(text) || options.reversed ? true : false,
            temporaryContainer,
            newTextLength,
            truncatedText; // Se retiran espacios innecesarios, pues distorsionan la precision del truncado de texto

        text = text.replace(/\s+/g, ' '); // retiramos bloques de dos espacios o mas, sustituyendolos por un solo espacio

        text = text.replace(/(^\s+|\s+$)/g, ''); // retiramos espacios al inicio o al final

        if (options.width === 'auto') {
          truncateWidth = $(this).width() - 5; //5px de margen de seguridad
        } else {
          truncateWidth = options.width;
        }

        $(this).html('<span data-temporary-text style="display:block;">' + text + '</span>');
        temporaryContainer = $(this).find('[data-temporary-text]').first().css({
          'display': 'block',
          'position': 'absolute',
          'top': 0,
          'left': 0,
          'white-space': 'nowrap'
        });

        if (temporaryContainer.width() > truncateWidth && temporaryContainer.width() > 0) {
          for (newTextLength = text.length; temporaryContainer.width() > truncateWidth && newTextLength > 0; newTextLength -= 1) {
            temporaryContainer.html(text.substr(0, newTextLength) + options.limiter);
          }

          newTextLength += 1;
          /*el codigo comentado hacia una estimacion de los caracteres que caben, el for anterior lo mide exactamente
          newTextLength = Math.floor((text.length / 100) * (truncateWidth * 100 / temporaryContainer.width()));*/

          newTextLength = newTextLength > options.textMaxLength && options.textMaxLength > 0 ? options.textMaxLength : newTextLength;
          $(this).attr('data-truncated', true);
          truncatedText = rtl ? options.limiter + text.substr(text.length - newTextLength + 2) : text.substr(0, newTextLength).trim() + options.limiter;
          $(this).html(_.c_contenedores_texto_truncado({
            texto: text,
            textoTruncado: truncatedText,
            template: options.template
          }));
          $(this).find(options.truncatedTextSelector).first().css({
            'display': 'block',
            'width': $(this).width()
          });
        } else {
          $(this).html(text);
        }
      });
    }
  });
  /* B.c_aviso_saldo_disponible
   *
   * descripcion:
   *  Muestra un aviso de que el saldo disponible no es suficiente para la operacion que se esta realizando
   * metodos:
   *
   * inicializar:
   *  context.c_aviso_saldo_disponible()
   */

  $.widget('B.c_aviso_saldo_disponible', {
    options: {},
    _create: function _create() {
      var $context = this.element,
          $target = $context.find('[data-saldo-disponible]'),
          $messageContainer,
          data;

      if ($target.length) {
        $messageContainer = $context.find('[data-saldo-disponible-container]');
        data = $target.data('saldo-disponible');
        data.saldo = _.formatNumber(data.saldo);

        if (this.tipos[data.tipo]) {
          this.tipos[data.tipo]($context, $target, $messageContainer, data);
        }
      }
    },
    tipos: {
      input: function input(context, target, messageContainer, data) {
        var onKeyUp = function onKeyUp() {
          if (Globalize.parseFloat(target.val()) > Globalize.parseFloat(data.saldo) && target.val !== '') {
            if (messageContainer.is(':hidden')) {
              messageContainer.css('display', 'block');
            }
          } else {
            if (messageContainer.is(':visible')) {
              messageContainer.css('display', 'none');
            }
          }
        };

        target.on('keyup', onKeyUp);
        onKeyUp();
      },
      inputSlider: function inputSlider(context, target, messageContainer, data) {
        target.on('change', function () {
          if (parseFloat(target.val()) > Globalize.parseFloat(data.saldo)) {
            if (messageContainer.is(':hidden')) {
              messageContainer.css('display', 'block');
            }
          } else {
            if (messageContainer.is(':visible')) {
              messageContainer.css('display', 'none');
            }
          }
        });
      },
      opcionesDependientes: function opcionesDependientes(context, target, messageContainer, data) {
        var listaPredictivo = context.find('.c-buscadores-predictivo-liquido .js-list'),
            listaDependientes = context.find('.c-form-opcionesDependientes-liquido ul');
        listaPredictivo.on('change', 'input:radio', function () {
          if (messageContainer.is(':visible')) {
            messageContainer.css('display', 'none');
          }
        });
        listaDependientes.on('change', 'input:radio', function () {
          var val = $(this).closest('label').text();

          if (Globalize.parseFloat(val) > Globalize.parseFloat(data.saldo)) {
            if (messageContainer.is(':hidden')) {
              messageContainer.css('display', 'block');
            }
          } else {
            if (messageContainer.is(':visible')) {
              messageContainer.css('display', 'none');
            }
          }
        });
      }
    }
  });
  /**
   *  B.c_widget_paginador
   */

  $.widget('B.c_widget_paginador', {
    options: {
      current: 0,
      pages: 3,
      pageWidth: 500,
      mostrarFlechas: false
    },
    _create: function _create() {
      var liClass = '',
          olCode = '',
          olClass = '',
          self = this,
          i; //obtenemos el numero de paginas
      //obtenemos el ancho de las paginas
      //creamos el codigo

      for (i = 0; i < this.options.pages; i += 1) {
        liClass = '';

        if (i === 0) {
          liClass = ' class="first"';
        } else if (i === this.options.pages - 1) {
          liClass = ' class="last"';
        }

        olCode += '<li' + liClass + '><img src="' + $B.staticPath + '/img/widget-pag_R2.png" alt="Ir a pagina ' + (i + 1) + '" /></li>';
      } //comprobamos las flechas


      if (this.options.mostrarFlechas) {
        olCode = '<li class="left"><img src="' + $B.staticPath + '/img/widget-pag_left.png" alt="Anterior" /></li>' + olCode + '<li class="right"><img src="' + $B.staticPath + '/img/widget-pag_right.png" alt="Siguiente" /></li>';
        olClass = ' flechas ';
      } //insertamos el codigo


      this.element.html('<ol class="c-widget-paginador' + olClass + '">' + olCode + '</ol>'); //events

      this.element.delegate('li', 'click', function (ev) {
        ev.stopPropagation();
        ev.preventDefault(); //obtenemos el li pulsado

        var i = $('li').index(this);

        if (self.options.mostrarFlechas) {
          i -= 1;
        }

        i = Math.max(0, Math.min(i, self.options.pages - 1));
        $(this).trigger('handlePaginadorClick', i);
      }); //actualizamos

      this._update();
    },
    _update: function _update() {
      var currentPoint = this.options.mostrarFlechas ? this.options.current + 1 : this.options.current;
      this.element.find('ol li').removeClass('activo').eq(currentPoint).addClass('activo');

      if (this.options.mostrarFlechas) {
        this.element.find('li.left, li.right').removeClass('inactivo');

        if (this.options.current === 0) {
          this.element.find('li.left').addClass('inactivo');
        }

        if (this.options.current === this.options.pages - 1) {
          this.element.find('li.right').addClass('inactivo');
        }
      }
    },
    set: function set(current) {
      current = Math.max(0, Math.min(current, this.options.pages - 1));

      if (this.options.current === current) {
        return;
      }

      this.options.current = current;

      this._update();
    }
  });
  /**
   *  B.c_widget_datoEditable
   */

  $B_ui.c_widget_datoEditable = function (event, action, message) {
    var triggerEl = $(event.currentTarget),
        element = triggerEl.parents('.js-c-widget-datoEditable');
    action = action || triggerEl.data('edit-eventid');
    element.c_widget_datoEditable();
    element.c_widget_datoEditable(action, message);
  };

  $.widget('B.c_widget_datoEditable', {
    cerrar: function cerrar() {
      this.element.find('p:first').show();
      this.element.find('form').removeClass('error').hide().find('.c-mensajes-informativoRefuerzo').hide();
    },
    editar: function editar() {
      this.element.find('p:first').hide();
      this.element.find('form').removeClass('error').show().find('.c-mensajes-informativoRefuerzo').hide();
    },
    error: function error(message) {
      if (message === undefined) {
        return;
      }

      this.editar();
      this.element.find('form').addClass('error');
      this.element.find('form .c-mensajes-informativoRefuerzo').show();
      this.element.find('form .c-mensajes-informativoRefuerzo .textoGestionable p').html(message);
    },
    editando: function editando() {
      return this.element.find('form').is(':visible');
    },
    revert: function revert() {
      var elementoEditable = this.element.find('.js-datoeditable'),
          elementoTag,
          originalData;

      if (elementoEditable) {
        elementoTag = elementoEditable[0].tagName;
        originalData = elementoEditable.data('original-value');

        if (elementoTag === 'SELECT') {
          elementoEditable.find('option[value=' + originalData + ']').attr('selected', true).change();
        } else {
          elementoEditable.val(originalData);
        }
      }
    }
  });
  /**
   * @name $B.ui.dependantfields
   * TODO: Documentar su uso
   */

  (function ($) {
    $B_ui.dependantfields = function (ev) {
      var el = $(ev.currentTarget),
          optionSeleccionado = el.find('option:selected');

      if (optionSeleccionado.size() === 1) {
        optionSeleccionado.DependantFields();
      } else {
        el.DependantFields();
      }
    };

    function esElementoDeFormulario(selector) {
      var selectorTag = selector.tagName;
      return selectorTag === 'INPUT' || selectorTag === 'SELECT' || selectorTag === 'TEXTAREA';
    }

    function eliminaClaseDisabled(elemento) {
      $(elemento).removeClass('disabled');
    }

    function activaElementoFormulario(elemento) {
      elemento.disabled = false;
      eliminaClaseDisabled(elemento);
    }

    function adecuaEstadoElementosElementos(contenedor, accion) {
      var formElements = contenedor.find('input, select, textarea');

      if (accion === 'activa') {
        formElements.removeClass('disabled').removeAttr('disabled');
        $B_ui.updateCustomElementsStatus(contenedor);
      } else {
        formElements.addClass('disabled').attr('disabled', 'disabled');
        $B_ui.updateCustomElementsStatus(contenedor);
      }
    }

    function activaElementosAgrupados(elemento) {
      var contenedor = $(elemento);
      eliminaClaseDisabled(contenedor);
      adecuaEstadoElementosElementos(contenedor, 'activa');
    }

    function anyadeClaseDisabled(elemento) {
      $(elemento).addClass('disabled');
    }

    function desActivaElementoFormulario(elemento) {
      elemento.disabled = true;
      anyadeClaseDisabled(elemento);
    }

    function desactivaElementosAgrupados(elemento) {
      var contenedor = $(elemento);
      anyadeClaseDisabled(contenedor);
      adecuaEstadoElementosElementos(contenedor, 'desactiva');
    }

    var metodos = {
      activaRelacionados: function activaRelacionados(selectores) {
        $.each($(selectores), function (i, selector) {
          if (esElementoDeFormulario(selector)) {
            activaElementoFormulario(selector);
          } else {
            activaElementosAgrupados(selector);
          }
        });
      },
      desactivaRelacionados: function desactivaRelacionados(selectores) {
        $.each($(selectores), function (i, selector) {
          if (esElementoDeFormulario(selector)) {
            desActivaElementoFormulario(selector);
          } else {
            desactivaElementosAgrupados(selector);
          }
        });
      },
      actualizaRelacionados: function actualizaRelacionados(pares) {
        if (!pares) {
          return;
        }

        $.each(pares, function (key, value) {
          $(key).val(value);
        });
      }
    };

    $.fn.DependantFields = function () {
      var data = this.data('dependant-fields');

      if (data) {
        metodos.activaRelacionados(data.activa);
        metodos.desactivaRelacionados(data.desactiva);
        metodos.actualizaRelacionados(data.actualiza);
      }
    };

    $.fn.selectRange = function (start, end) {
      if (!end) {
        end = start;
      }

      return this.each(function () {
        if (this.setSelectionRange) {
          this.focus();
          this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
          var range = this.createTextRange();
          range.collapse(true);
          range.moveEnd('character', end);
          range.moveStart('character', start);
          range.select();
        }
      });
    };

    $.fn.getCursorPosition = function () {
      var el = $(this).get(0),
          pos = !_.isNull(el.selectionStart) ? el.selectionStart : 0,
          Sel,
          SelLength;

      if (typeof pos === 'undefined') {
        el.focus();
        Sel = document.selection.createRange();
        SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
      }

      return pos;
    };
  })($);
  /* TODO: DOCUMENTAR USO
   * de momento, copio codigo de ejemplo para su uso:
   * <form action="" method="POST" class="formulario" id="">
          <fieldset>
            <legend>Campos dependientes</legend>
            <p>
              <label for="tipo">Tipo Reembolso:</label>
              <span class="campo">
                <select name="tipo" id="tipo" data-component-dependant-fields="true">
                  <option value="">Seleccione un tipo</option>
                  <option value="P" id="opcion2" data-dependant-fields='{"activa":"#importeTotal, #selectImporteTotal","desactiva":"#importeParcial, #selectImporteParcial", "actualiza":{"#importeTotal":5,"#importeParcial":10}}'>Importe total</option>
                  <option value="T" id="opcion3" data-dependant-fields='{"activa":"#importeParcial, #selectImporteParcial","desactiva":"#importeTotal, #selectImporteTotal", "actualiza":{"#importeTotal":10,"#importeParcial":5}}'>Importe parcial</option>
                  <option value="P" id="opcion4" data-dependant-fields='{"activa":"#importeTotal, #selectImporteTotal","desactiva":"#contenedorImporteParcial"}'>Importe total bis</option>
                  <option value="P" id="opcion5" data-dependant-fields='{"activa":"#contenedorImporteParcial","desactiva":"#importeTotal, #selectImporteTotal"}'>Importe total bis</option>
                  <option value="X" id="opcion6" data-dependant-fields='{"desactiva":"#importeTotal, #selectImporteTotal"}'>Sin activa</option>
                </select>
              </span>
            </p>
            <p>
              <label for="importeTotal">Importe Total:</label>
              <span class="campo">
                <input type="text" id="importeTotal" name="importeTotal" value="" />
              </span>
              <label for="selectImporteTotal">Select Importe Total:</label>
              <span class="campo">
                <select name="selectImporteTotal" id="selectImporteTotal">
                  <option value="P" >asdfads</option>
                </select>
              </span>
            </p>
            <p id="contenedorImporteParcial">
              <label for="importeParcial">Importe Parcial:</label>
              <span class="campo">
                <input type="text" id="importeParcial" name="importeParcial" value="" />
              </span>
              <label for="selectImporteParcial">Select Importe Parcial:</label>
              <span class="campo">
                <select name="selectImporteParcial" id="selectImporteParcial">
                  <option value="P" >asdfads</option>
                </select>
              </span>
            </p>
          </fieldset>
            <fieldset>
            <legend>Radios dependientes</legend>
              <p class="radios" data-radios-dependant-fields="true">
              <strong class="titulo-componente">Opciones</strong>
                <span style="display:block;clear:both;">
                <label for="opcionRadio1">Opcion radio 1</label>
                <span class="campo">
                  <input type="radio" name="radios" id="opcionRadio1" value="opcionRadio1" data-dependant-fields='{"desactiva":"#campoRelacionadoOpcionRadio3"}' />
                </span>
              </span>
              <span style="display:block;clear:both;">
                <label for="opcionRadio2">Opcion radio 2</label>
                <span class="campo">
                  <input type="radio" name="radios" id="opcionRadio2" value="opcionRadio2" data-dependant-fields='{"desactiva":"#campoRelacionadoOpcionRadio3"}' />
                </span>
              </span>
              <span class="campos-compuestos">
                <span style="display:block;clear:both;">
                  <label for="opcionRadio3">Opcion radio 2</label>
                  <span class="campo">
                    <input type="radio" name="radios" id="opcionRadio3" value="opcionRadio3" data-dependant-fields='{"activa":"#campoRelacionadoOpcionRadio3"}' />
                  </span>
                  <span class="descripcion-error"></span>
                </span>
                <span style="display:block;clear:both;" class="campo-relacionado">
                  <label for="campoRelacionadoOpcionRadio3" class="indentado">campoRelacionadoOpcionRadio3</label>
                  <span class="campo">
                    <input type="text" name="campoRelacionadoOpcionRadio3" id="campoRelacionadoOpcionRadio3" value="campoRelacionadoOpcionRadio3" />
                  </span>
                </span>
              </span>
            </p>
            </fieldset>
        </form>
     */

  /** PLUGINS DE IMPRESION *********************************************/

  /*
  * @name $B.ui.printSection
  * @desc Imprime la seccion determinada por un selector
  * ejemplo: <button data-print='.tabla-movimientos'>Imprimir tabla</button>
  * En mvc.js
  *  events: {
        'click [data-ptint]': 'imprimirSeccion'
    },
    imprimirSeccion: function (ev) {
        $B_ui.printSection(ev);
    }
  */
  // @TODO optimizar y refactorizar selectores y el frame


  $B_ui.printSection = function (ev) {
    if ($('#print_frame')) {
      $('#print_frame').remove();
    }

    $('body').append('<iframe name="print_frame" id="print_frame" width="880" height="0" frameborder="0" src="javascript:false"></iframe>');
    ev.preventDefault();

    var objToprint = $(ev.currentTarget).data('print'),
        $printFrame = $('#print_frame'),
        printContent = $(objToprint).clone(false),
        staticRegex = new RegExp($B.staticPath.replace('/', '\\/') + '\\/img\\/', 'gi'),
        printContentHtml = printContent.html().replace(staticRegex, window.location.protocol + '//' + window.location.host + $B.staticPath + '/img/'),
        makePrint = function makePrint() {
      var frame = window.frames.print_frame.document,
          _printFrame = $('#print_frame'),
          defaultPrintStyleSheet = window.location.protocol + '//' + window.location.host + $B.staticPath + '/css/impresion.css?' + $B.version,
          //frameHead = frame.head,
      frameBody = frame.body;

      $.get(defaultPrintStyleSheet, function (data) {
        // estilos de impresion
        //$(frameHead).html("<link rel='stylesheet' href='" + defaultPrintStyleSheet + "' type='text/css' />");
        // insertamos el contenido para imprimir
        var printDom = '<style type="text/css">' + data + '</style><div id="printContent">' + printContentHtml + '</div>',
            timeForRender = _.isLegacyIE() ? 1000 : 100;
        $.when($(frameBody).append(printDom)).then(function () {
          setTimeout(function () {
            // focus al frame
            window.frames.print_frame.window.focus(); // imprimo

            window.frames.print_frame.window.print(); // remove frame

            _printFrame.remove();
          }, timeForRender);
        });
      });
    };

    $printFrame.on('load.printFrame', makePrint);
    $printFrame.attr('src', 'about:blank');
  };
  /**
   * $B_ui.FilterGraphicChartsV2
     * @param [array] chartData [
   *        {object}: {
   *        "base":                   // JSON with common parameters for all charts (if no parameters common to all graphs, 'base' have to be an empty object '{}'). MANDATORY
   *        "variations":             // ARRAY with one or more JSON with specific parameters for individual charts. MANDATORY
   *
   *        }
   * @example [...]
   ]
   */


  $B_ui.FilterGraphicChartsV2 = function () {
    var getDefaults = function getDefaults() {
      return {};
    },
        graphic = false,
        charts = {
      buildChart: function buildChart(chartData) {
        if (chartData.series[0].type) {
          var type = chartData.series[0].type;

          if (type === 'bar') {
            graphic = $B_ui.GraphicCharts.barChart(chartData);
          } else if (type === 'area') {
            graphic = $B_ui.GraphicCharts.areaChart(chartData);
          } else {
            graphic = $B_ui.GraphicCharts.defaultChart(chartData);
          }
        } else {
          graphic = $B_ui.GraphicCharts.pieChart(chartData);
        }

        return graphic;
      },
      destroyChart: function destroyChart() {
        if (graphic) {
          graphic.destroyChart();
        }
      },
      createChartData: function createChartData(base, variation) {
        return $.extend(true, {}, base, variation);
      },
      filteredOption: function filteredOption(combo) {
        return combo.find(':selected').val();
      },
      filterDataByInterval: function filterDataByInterval(numbers, interval) {
        return _.last(numbers, interval);
      },
      getId: function getId(data) {
        var comma = '',
            idList = '';
        $.each(data.variations, function (index1, variationList) {
          $.each(variationList, function (index, variation) {
            idList += comma + variation[0].types[0].renderAt;

            if (index === 0) {
              comma = ',';
            }
          });
        });
        return idList;
      },
      proccessChartData: function proccessChartData(data, filterProduct, filterInterval, filterType) {
        var selectedProduct = charts.filteredOption(filterProduct),
            selectedInterval,
            selectedVariation = null,
            graphicData; // VERIFY HERE THAT REQUESTED GRAPHIC EXISTS! IF NOT, SAVE THE MODEL AND BRING IT BACK WITH THE GRAPHIC

        $.each(data.variations, function (index1, variationList) {
          $.each(variationList, function (index, variation) {
            selectedVariation = variation[0].types[0];
            graphicData = charts.createChartData(data.base, selectedVariation);
            selectedInterval = filterInterval ? charts.filteredOption(filterInterval) : graphicData.series[0].numbers.length;

            if (selectedVariation !== null) {
              if (graphicData.xAxis) {
                graphicData.xAxis = charts.filterDataByInterval(graphicData.xAxis, selectedInterval);
                $.each(graphicData.series, function (_index, serie) {
                  serie.numbers = charts.filterDataByInterval(serie.numbers, selectedInterval);
                });
              }

              charts.buildChart(graphicData);
            } else {
              $('#' + graphicData.renderAt).append('<p style="color:#ff0000;">No se ha podido cargar el grafico "' + selectedProduct + '"</p>');
            }
          });
        });
      },
      filterFamilies: function filterFamilies(filterFamily, filterProduct) {
        var idFamily = filterFamily.find(':selected').eq(0).val(),
            filterFamilyOptions = filterProduct.find('option').attr('selected', false),
            productFamily;

        if (idFamily === '0') {
          filterFamilyOptions.show();
        } else {
          filterFamilyOptions.each(function () {
            productFamily = $(this).attr('data-family');

            if (productFamily === '0') {
              $(this).attr('selected', true).val(idFamily + ',0');
            }

            if (productFamily === idFamily) {
              $(this).show();
            } else {
              $(this).hide();
            }
          });
        }

        filterProduct.trigger('change');
      },
      createFilter: function createFilter(data) {
        var graphicId = charts.getId(data),
            filterArea = $('[data-graphic="' + graphicId + '"]').eq(0),
            filterCombos = filterArea.find('select[data-graphic-interval], select[data-graphic-family], select[data-graphic-type]'),
            filterFamily = filterArea.find('select[data-graphic-family]').eq(0),
            filterProduct = filterArea.find('select[data-graphic-product]').eq(0),
            filterType = filterArea.find('select[data-graphic-type]').length > 0 ? filterArea.find('select[data-graphic-type]').eq(0) : false,
            filterInterval = filterArea.find('select[data-graphic-interval]').length > 0 ? filterArea.find('select[data-graphic-interval]').eq(0) : false;
        charts.proccessChartData(data, filterProduct, filterInterval, filterType);
        filterCombos.bind('change', function () {
          charts.destroyChart();

          if ($(this).attr('data-graphic-family') !== undefined) {
            charts.filterFamilies(filterFamily, filterProduct);
          } else {
            if (!$(this).attr('data-graphic-interval') && $(this).closest('.c-producto-grafica').find('.c-mensajes-alerta_R2').length === 0) {
              charts.proccessChartData(data, filterProduct, filterInterval, filterType);
            }
          }
        });
      }
    };

    return {
      start: function start(data) {
        charts.createFilter(data, false);
      },
      startAjax: function startAjax(data) {
        charts.createFilter(data, true);
      }
    };
  }();
  /*\
   * toggleMenu
   * Funcion que cambia las clases li.activo de un menu en funcion del elemento pulsado
  \*/


  $B_ui.toggleMenu = function (ev) {
    var item = $(ev.currentTarget).closest('li'),
        menu = item.closest('ul');

    if (menu.length) {
      menu.find('li.activo').removeClass('activo');
      item.addClass('activo');
    }
  };
  /*\
   * loadViewIntoTmpl
   * Funcion que carga un tmpl que recubre una vista. Para ello pegamos el tmpl en el DOM y pegamos la vista dentro del tmpl
   * Esta funcion debe ser usada en area personal y recibos
   | Uso:
   |  $B_ui.loadViewIntoTmpl({
   |    url: '/tmpl/recibos.domiciliados.menu.tmpl.html',
   |    selector: '#contenido',
   |    tmpl: '#tmpl_recibos_domiciliados_menu',
   |    viewId: '#view_recibos_domiciliados'
   |   }, {});
  \*/


  $B_ui.loadViewIntoTmpl = function (tmpl, model) {
    //comprobamos si ya ha sido cargado previamente
    if (!$(tmpl.selector).find(tmpl.selector2).length) {
      //obtenemos el tmpl
      require(['text!' + $B.staticPath + tmpl.url], function (content) {
        //obtenemos la vista
        var view = $(tmpl.viewId).clone(true); //guardamos el tmpl en el body y lo renderizamos

        $body.append(content);
        $(tmpl.selector).html(_.tmpl(tmpl.tmpl, model)); //pegamos la vista

        $(tmpl.selector).find('[data-silent-container]').html(view);
        $B_ui.c_buscadores_predictivoLiquido($body.find('.c-buscadores-predictivo-liquido'));
        $('.c-encabezado-seccion').after($('[autoload-sabiasque]').html());
        $('[autoload-sabiasque]').html('');
      });
    }
  };
  /*\
   * validateNextTooltip
   [ method ]
   > Parametros
   - state (boolean) habilitar, deshabilitar el tooltip en el boton
   - button (jQuery Object) objeto jQuery del boton
   - message (string) #optional template del mensaje por defecto es _.c_v05_mensajes_informativoTooltip()
   * Para pasar un mensaje personalizado se explica mas abajo
   > Uso en el MVC
   | $B_ui.validateNextTooltip([true/false], objeto_del_boton, template_de_mensaje);
  \*/

  /*
  Para personalizar el mensaje hay que incluir en su template lo siguiente:
  ** TEMPLATE **
  <script id="mensaje_validacion" type="text/template">
  _.c_v05_mensajes_informativoTooltip({ message: '##mensaje.personalizado.e.internacionalizado##'})
  </script>
    De esta forma el mensaje sera internacionalizado como todos los otros textos
    Y cuando llamemos a la funcion desde nuestro MVC.JS hay que hacer lo siguiente:
  ** MVC **
  var mensaje = $('#mensaje_validacion');
  $B_ui.validateNextTooltip(state, button, mensaje);
  */


  $B_ui.validateNextTooltip = function (state, button, message, buttonCenter) {
    button = button || $('.c-botones-paginadorInferior .siguiente:not(#boton_aceptar)');
    var infoTooltip = $(message && _.template(message.html(), {}) || _.c_v05_mensajes_informativoTooltip()),
        infoTooltipMsg = infoTooltip.find('.message').text(),
        offset = button.offset();

    if (state) {
      /*
        // Don't know what this was here for :(
      // Do not delete for now.
      -----------------------------------------------------------
        if (button.data('linkedTooltipMsg') === infoTooltipMsg) {
        return;
      }
        */
      button.data('linkedTooltip', infoTooltip).data('linkedTooltipMsg', infoTooltipMsg);
      infoTooltip.appendTo('#contenido').hide();
      button.addClass('inactivoValidacion').click(function () {
        offset = button.offset();
        var offsetTotalLeft = offset.left - 360,
            offsetTotalTop = offset.top - 12;

        if (buttonCenter) {
          offsetTotalLeft = offset.left - 290;
          offsetTotalTop = offset.top - 30;
        }

        infoTooltip.css({
          'z-index': 999999,
          top: offsetTotalTop,
          left: offsetTotalLeft
        }).show();
      }).mouseleave(function () {
        infoTooltip.hide();
      });
    } else {
      if (button.data('linkedTooltip')) {
        button.data('linkedTooltip').remove();
        button.data('linkedTooltipMsg', null);
      }

      button.removeClass('inactivoValidacion').off('click');
    }
  };

  $B_ui.navigateCatalog = function (ev, numProductos, tipoAsesoramiento) {
    var $target = $(ev.currentTarget),
        $siblings = $target.siblings(),
        $parent = $target.closest('.grid_24'),
        $parentIframe = $parent.find('.tab-group-iframe').length ? $parent.find('.tab-group-iframe').first() : $parent,
        $grid16 = $parent.find('.grid_16'),
        $grid8 = $parent.find('.grid_8'),
        $carteraVirtual = $('#carteraVirtual'),
        $iFrameCatalogo = $('#catalogoProductos'),
        $botonesAccion = $('.contenedorListas').find('.c-listas-acciones'),
        $iframe = $('<iframe />'),
        $asesoramiento = $('div#autoloadAsesoramientoEnSubhome'),
        $buscadorMovimientos = $('div#autoloadBuscadorMovimientos'),
        autoloadModificadoPorUrl = false,
        alturaContenido,
        src,
        mapaCatalogo = 1,
        idSeccion,
        urlAsesoramiento = 'asesoramiento',
        productoSeleccionado = $target.attr('data-producto-buscador'),
        tipoBuscador = $target.attr('data-tipo-buscador'),
        etiquetaSeleccionada = $target.attr('data-etiqueta-buscador');

    if ($B.appConfig.menurizacionArbol) {
      src = $B.router.appView.navView.publicNavigationGetOpcionMenu().catalogUrl;
    } else {
      src = '/sistema/catalogo.jsp?mb=si';
    }

    if (!_.isEmpty(tipoAsesoramiento) && tipoAsesoramiento !== 'catalogo') {
      if (tipoAsesoramiento === 'perfilado') {
        urlAsesoramiento = 'asesoramiento/ira/perfilado/DEPPOFONDO/restaurar';
      } else {
        urlAsesoramiento = tipoAsesoramiento.replace(/---/g, '/');
      }

      autoloadModificadoPorUrl = true;
    }

    $B.bridge.on('resize:publica', function (data) {
      $('#catalogoProductos').height(data.height);
    });
    $B.bridge.on('maxHeight:publica', function (data) {
      $('#catalogoProductos').height(data.height);
    });
    $B.bridge.on('navigate:privada', function (data) {
      $B.app.AppView.prototype.executeNavigation(data.url);
    });
    $B.bridge.on('loadingTop:show', function (data) {
      //$B.ui.navigationLoading.show({loadingClass: 'cargandoAsesoramiento', overlayClass: 'loading-message-overlay-class', text: '', overlayZIndex: 100});
      $B.ui.loading.add({
        parent: $('#subhome-ahorro-inversion-contratar-content'),
        loadingClass: 'cargandoAsesoramiento',
        text: '',
        forceLoading: true
      });
    });
    $B.bridge.on('loadingTop:hide', function () {
      //$B.ui.navigationLoading.hide({});
      $B.ui.loading.remove({
        parent: $('#subhome-ahorro-inversion-contratar-content'),
        loadingClass: 'cargandoAsesoramiento'
      });
    });
    $B.bridge.on('scroll:top', function () {
      var $catalogoProductos = $('#catalogoProductos'),
          $idIframeCentral = $catalogoProductos.contents().find('#idIframeCentral'),
          $ofertaComercial = $idIframeCentral.contents().find('.c-encabezado-ofertaComercial'),
          catalogoProductosOffset = 0,
          idIframeCentralOffset = 0,
          ofertaComercialOffset = 0;

      if ($catalogoProductos.length !== 0) {
        catalogoProductosOffset = $catalogoProductos.offset().top;
      }

      if ($idIframeCentral.length !== 0) {
        idIframeCentralOffset = $idIframeCentral.offset().top;
      }

      if ($ofertaComercial.length !== 0) {
        ofertaComercialOffset = $ofertaComercial.offset().top;
      }

      $('html,body').animate({
        scrollTop: catalogoProductosOffset + idIframeCentralOffset + ofertaComercialOffset
      });
    });
    ev.stopPropagation();

    if (_.isNull(numProductos) || _.isUndefined(numProductos)) {
      numProductos = 1;
    }

    if ($B.tipoSegmento === 'PARTICULARES') {
      src = $B.router.appView.navView.publicNavigationGetOpcionMenu().catalogUrl;
    } else if ($B.tipoSegmento === 'BANCA_PERSONAL') {
      mapaCatalogo = 2;
    } else if ($B.tipoSegmento === 'BANCA_PRIVADA') {
      mapaCatalogo = 3;
    }

    $B.setCookie('ordenMapa', mapaCatalogo, 31536000000);
    idSeccion = $B.router.appView.navView.publicNavigationGetOpcionMenu().id;

    if (!$target.hasClass('activo')) {
      window.router.appView.BreadcrumbView.updateBreadcrumbURL($target);

      if ($target.data('tab') === 0 && (numProductos !== 0 || $B.tieneSegurosUnnim)) {
        $iFrameCatalogo.addClass('hidden');
        $grid16.removeClass('hidden');
        $grid8.removeClass('hidden');
        $botonesAccion.removeClass('hidden');
        $buscadorMovimientos.addClass('hidden');
        $asesoramiento.addClass('hidden');
      } else if ($target.data('tab') === 1 || numProductos === 0 || $B.tieneSegurosUnnim && $target.data('tab') !== 2) {
        $grid16.addClass('hidden');
        $grid8.addClass('hidden');
        $botonesAccion.addClass('hidden');
        $buscadorMovimientos.addClass('hidden');

        if (idSeccion === 'ahorroeinversion') {
          if ($asesoramiento.length) {
            $asesoramiento.removeClass('hidden');
            $asesoramiento.show();
          } else {
            $('<div id="autoloadAsesoramientoEnSubhome" />').attr('data-autoload', urlAsesoramiento).prependTo($parentIframe);
            $B.app.AppView.prototype.checkAutoloads($target.closest('[id^=view]'));
          }
        }

        if ($carteraVirtual.length) {
          $carteraVirtual.hide();
        }

        if (!autoloadModificadoPorUrl) {
          if ($iFrameCatalogo.length) {
            $iFrameCatalogo.removeClass('hidden');
            $iFrameCatalogo.show();
          } else {
            $iframe.attr('frameborder', '0');
            $iframe.attr('scrolling', 'no');
            $iframe.attr('id', 'catalogoProductos');
            $iframe.attr('src', src);
            $iframe.addClass('grid_24 plus');
            $iframe.appendTo($parentIframe);
          }
        }
      } else if ($target.data('tab') === 2) {
        $grid16.addClass('hidden');
        $grid8.addClass('hidden');
        $botonesAccion.addClass('hidden');
        $iFrameCatalogo.addClass('hidden');

        if ($buscadorMovimientos.length === 0) {
          $parent.append(_.tmpl($('#tmpl_subhome-cuentas-tarjetas_autoloadBuscadorMovimientos'), {
            productoSeleccionado: productoSeleccionado,
            etiquetaSeleccionada: etiquetaSeleccionada,
            tipoBuscador: tipoBuscador
          }));
          $B.app.AppView.prototype.checkAutoloads($parent.find('#autoloadBuscadorMovimientos'));
        } else {
          $buscadorMovimientos.removeClass('hidden');
        }
      }

      $target.toggleClass('activo');
      $siblings.removeClass('activo');
    }
  };

  $B_ui.markInputWithError = function (input, messageContainer, state) {
    if (!input || !messageContainer || state === null) {
      return;
    }

    var tooltip,
        offset,
        left,
        ul = $('<ul>'),
        li,
        message,
        messageId = messageContainer.attr('id');

    if (state === true) {
      message = messageContainer.html() || '';
      tooltip = _.c_v06_mensajes_errorValidacion({
        inputName: input.attr('name'),
        message: message
      });
      tooltip = $(tooltip);
      li = $('<li>').append(tooltip);

      if ($('#mainValidationSummaryWrapper').find('ul').length) {
        $('#mainValidationSummaryWrapper ul').append(li);
      } else {
        ul.append(li);
        $('#mainValidationSummaryWrapper').append(ul);
      }

      li.css('z-index', '999999996');
      tooltip = li.find('.errorValidacion');
      offset = input.offset();
      li.css({
        top: offset.top,
        left: offset.left,
        position: 'absolute'
      });

      if (input.outerWidth() > 250) {
        // if not small input
        tooltip.css({
          width: input.outerWidth()
        });
      } else {
        // if small input
        left = -135 + input.outerWidth() / 2;
        tooltip.css({
          left: left
        });
      }

      input.addClass('error').hover(function () {
        tooltip.show();
      }, function () {
        tooltip.hide();
      }).mouseout(function () {
        tooltip.hide();
      }).data('validationMsgId', messageId).data('validationMsg', li);
    } else if (state === false) {
      if (!input.data('validationMsgId') || messageId !== input.data('validationMsgId')) {
        return;
      }

      input.removeClass('error').off('hover').data('validationMsg').remove(); // $('#' + input.data('validationMsgId')).remove()

      return;
    }
  };

  $B_ui.getOverlayerProperties = function (layer) {
    if (layer instanceof jQuery && layer.length) {
      return {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '9999',
        width: '100%',
        height: layer.height()
      };
    }

    return {};
  };
  /**
   * $B_ui.loading
   * @param {object} {
  *        "parent":         // Loading message parent element. MANDATORY
  *        "loadingClass":   // Class added to parent element while showing loading message. Defaults to 'loading-parent'. OPTIONAL
  *        "text":           // Text for loading message. Defaults to null. OPTIONAL
  *        "autoStyle":      // Message gets automatic style. Values: 'true' or 'false'. Defaults to 'false' OPTIONAL
  *        }
  *
   * @example $B_ui.loading.add({parent: $(parent-element), loadingClass: 'loading-class', text: 'loading message text', autoStyle: true||false})
  *
   * @example $B_ui.loading.remove({parent: $(parent-element), loadingClass: 'loading-class'})
  }
  */


  $B_ui.loading = function () {
    var loadingDefaults = {
      loadingClass: 'loading-parent',
      text: null,
      autoStyle: true,
      forceLoading: false,
      callback: null,
      zIndex: 9999
    },
        loading = {
      getDefaults: function getDefaults(loadingData) {
        return $.extend({}, loadingDefaults, loadingData);
      },
      setStyle: function setStyle(elLoadingMessage, data) {
        var measures = loading.getMeasures(elLoadingMessage),
            imageOffset = measures.imageOffset,
            margin = 0;

        if (measures.imageOffsetInModal) {
          imageOffset = measures.imageOffsetInModal;
        }

        if (measures.correcionMargin) {
          margin = measures.correcionMargin;
          elLoadingMessage.css({
            width: measures.width
          });
        }

        elLoadingMessage.css({
          height: measures.messageHeight - imageOffset,
          paddingTop: imageOffset,
          zIndex: data.zindex,
          position: 'absolute',
          marginLeft: margin,
          marginRight: margin,
          top: 0,
          left: 0
        }).show();
      },
      getMeasures: function getMeasures(elLoadingMessage) {
        var measures = {
          messageHeight: elLoadingMessage.parent().height(),
          imageHeight: elLoadingMessage.find('img').height()
        },
            wideContainer = elLoadingMessage.closest('.container_12');

        if (wideContainer.length && wideContainer.siblings('#IPOcontratacion_productos').length) {
          measures.width = wideContainer.outerWidth(true);
          measures.correcionMargin = Math.floor((measures.width - wideContainer.width()) / -2);
        }

        measures.imageOffset = Math.floor((measures.messageHeight - measures.imageHeight) / 2);

        if (elLoadingMessage.closest('.overviewModal').length) {
          measures.imageOffsetInModal = Math.floor((elLoadingMessage.closest('.overviewModal').height() - measures.imageHeight) / 2);
        }

        return measures;
      }
    };
    return {
      add: function add(loadingData) {
        var elLoadingMessage,
            data = loading.getDefaults(loadingData),
            $loadingContainer,
            loadingContainerPositionType,
            alreadyHasLoading,
            idLoading; //cde

        if (data.parent === false) {
          return;
        }

        alreadyHasLoading = data.parent !== false && !data.parent.is('[data-sliced-tmpl]') ? data.parent.find('.c-mensajes-cargando').length : 0;
        data.parent.addClass(data.loadingClass);

        if (!alreadyHasLoading || data.forceLoading) {
          if (data.parent.find('#contenedor_asistente_contratacion_productos').length) {
            $loadingContainer = data.parent.find('#contenedor_asistente_contratacion_productos');
          } else if (data.parent.is('#subhome-ahorro-inversion-contratar-content')) {
            $loadingContainer = data.parent;
          } else if (data.parent.find('.contenedorAsistente').length) {
            $loadingContainer = data.parent.find('.contenedorAsistente');
          } else if (data.parent.find('.c-widget-indicadorProgresoOperativa').length) {
            //$loadingContainer = data.parent.find('.c-widget-indicadorProgresoOperativa').next();
            $loadingContainer = data.parent.find('.c-widget-indicadorProgresoOperativa').nextAll('div').first();
          } else {
            $loadingContainer = data.parent;
          }
        } else {
          return;
        }

        loadingContainerPositionType = $loadingContainer.css('position');
        $loadingContainer.data('originalPositionType', loadingContainerPositionType).addClass('js_loadingContainer').css('position', 'relative');

        if ($loadingContainer.children('.c-mensajes-cargando').length) {
          elLoadingMessage = $loadingContainer.children('.c-mensajes-cargando');
        } else {
          if (data.loadingVisorPdf) {
            elLoadingMessage = $(_.c_v06_mensajes_cargando({
              text: $B.app.literals.cargando,
              image: 'preload_general_mini.gif'
            })).appendTo($loadingContainer).hide();
          } else {
            elLoadingMessage = $(_.c_v06_mensajes_cargando({
              text: data.text
            })).appendTo($loadingContainer).hide();
          }
        }

        if (elLoadingMessage.attr('id')) {
          idLoading = elLoadingMessage.attr('id');
        } else {
          idLoading = $B.utils.aria.loading(data.parent, 'active');
        }

        idLoading = $B.utils.aria.loading(data.parent, 'active');
        elLoadingMessage.attr('id', idLoading);

        if (data.autoStyle) {
          loading.setStyle(elLoadingMessage, data);
        }

        if (_.isFunction(data.callback)) {
          data.callback();
        }
      },
      remove: function remove(loadingData) {
        var data = loading.getDefaults(loadingData),
            elLoadingMessage = data.parent.find('.c-mensajes-cargando'),
            originalParent = elLoadingMessage.length ? elLoadingMessage.closest('[aria-busy="true"]') : data.parent,
            $loadingContainer = data.parent,
            originalPositionType = $loadingContainer.data('originalPositionType') || 'static';

        function removeLoadings(_data, wrapper) {
          var $item;

          if (_.has(_data, 'excludeLoadings')) {
            wrapper.each(function (item) {
              $item = $(item);

              if ($item.closest(_data.excludeLoadings).lenght === 0) {
                $item.remove();
              }
            });
          } else {
            wrapper.remove();
          }
        }

        originalParent.removeClass(data.loadingClass); // change aria status

        $B.utils.aria.loading(originalParent, 'inactive'); // remove every loading msg (sometime there are more than one don't know why)

        removeLoadings(data, elLoadingMessage);
        $loadingContainer.css('position', originalPositionType);
      }
    };
  }();
  /**
   * $B_ui.navigationLoading
   * @param {object} {
  *        "loadingClass":   // Class added to loading element while showing loading message. Defaults to 'loading-navigation'. OPTIONAL
  *        "overlayClass":   // Class added to overlay element while showing loading message. Defaults to 'ui-widget-overlay-mensaje-cargando'. OPTIONAL
  *        "text":           // Text for loading message. Defaults to null. OPTIONAL, ONLY FOR show METHOD
  OPTIONAL
  *        "overlayZIndex":  // Overlay z-index css property value. Defaults to 100000 OPTIONAL, ONLY FOR show METHOD
  *        }
  *
   * @example $B_ui.navigationLoading.show({loadingClass: 'loading-message-additional-class', overlayClass: 'loading-message-overlay-class', text: 'loading message text', overlayZIndex: 100})
  *
   * @example $B_ui.navigationLoading.hide({loadingClass: 'loading-message-additional-class', overlayClass: 'loading-message-overlay-class'})
  }
  */


  $B_ui.navigationLoading = function () {
    var defaultOptions = {
      loadingClass: 'loading-navigation',
      overlayClass: 'ui-widget-overlay-mensaje-cargando',
      overlayZIndex: 100000,
      text: null
    },
        $bfirst = $body.first(),
        $loading,
        getDefaults = function getDefaults(data) {
      return $.extend(true, {}, defaultOptions, data);
    },
        options,
        styleLoading = function styleLoading($item) {
      var imgWidth = $item.find('.icoCargando img').width(),
          loadingWidth = $item.width();
      $item.css({
        position: 'fixed',
        background: $item.css('background-color') || 'transparent',
        width: imgWidth > loadingWidth ? imgWidth : loadingWidth,
        zIndex: options.overlayZIndex + 1
      });
      $('.' + options.overlayClass).css({
        width: '100%',
        height: '100%',
        zIndex: options.overlayZIndex
      });
    },
        centerLoading = function centerLoading($item) {
      if (!_.isNull($item) && !_.isUndefined($item)) {
        $item.css({
          top: ($(window).height() - $item.outerHeight()) / 2,
          left: ($(window).width() - $item.outerWidth()) / 2
        });
      }
    },
        initialClassOverlay = 'transparente',
        initialClassWrapper = 'hidden';

    return {
      show: function show(data) {
        options = getDefaults(data || {});

        var template = _.c_v06_mensajes_cargando({
          image: 'preload_general_mini.gif',
          classes: options.loadingClass + ' ' + initialClassWrapper,
          overlay: true,
          text: options.text || $B.app.literals.cargando,
          overlayClass: options.overlayClass + ' ' + initialClassOverlay,
          newUroboroText: true
        });

        $bfirst.append(template);
        $loading = $('.' + options.loadingClass).first();
        this.lastLoadingClass = options.loadingClass;
        styleLoading($loading);
        centerLoading($loading);
        $(window).off('resize.pageLoading').on('resize.pageLoading', function () {
          centerLoading($loading);
        });
        $B.utils.aria.loading($bfirst, 'active');
        setTimeout(function () {
          $('.loading-navigation.' + initialClassWrapper).removeClass(initialClassWrapper);
          $('.ui-widget-overlay-mensaje-cargando.' + initialClassOverlay).removeClass(initialClassOverlay);
        }, 1500);
      },
      hide: function hide(data) {
        options = getDefaults(data || {});
        $loading = $('.c-mensajes-cargando.' + (this.lastLoadingClass || options.loadingClass)).first().add($('.' + options.overlayClass).first());

        if ($bfirst.attr('aria-busy') === 'true') {
          $('[data-link="posicion-global"]').first().focus();
        }

        $B.utils.aria.loading($bfirst, 'inactive');
        $loading.fadeOut(400, function () {
          $(this).remove();
          $loading = null;
        });
      }
    };
  }();
  /* $.navigateAnchor
   *
   * parametros:
   *  options {
   *    attrAnchor: [String atributo que contiene el selector]
   *    animateTime: [Integer Tiempo de animacion en ms]
   * }
   *
   * html:
   * <span role="link" tabindex="0" data-anchor="#destination-selector">[...]</span>
   *
   * inicializar:
   *  $('.selector').navigateAnchor({attrAnchor: 'data-anchor', animateTime: 1000})
   */


  $.fn.extend({
    navigateAnchor: function navigateAnchor(options) {
      var defaults = {
        attrAnchor: 'data-anchor',
        animateTime: 50
      };
      options = $.extend(defaults, options);
      return this.each(function () {
        var $destination = $($(this).attr(options.attrAnchor));
        $('html, body').animate({
          scrollTop: $destination.offset().top
        }, options.animateTime, function () {
          $destination.focus();
        });
      });
    }
  });

  $B_ui.updateBodyHeight = function () {
    var $window = $(window),
        heightCorrection = 60;

    if ($B.isPublic) {
      heightCorrection = 0;
      $body.css({
        'position': 'static',
        'padding-bottom': '0'
      });
    }

    function check() {
      $body.css({
        'min-height': $window.height() - heightCorrection
      });
    }

    $window.resize(check);
    return check;
  }(); // little plugin to get the width of all elements in a jQuery collection
  // e.g. $('div').totalWidth();


  $.fn.totalWidth = function () {
    var totalWidth = 0;
    this.each(function () {
      totalWidth += $(this).width();
    });
    return totalWidth;
  }; // little plugin to get the height of all elements in a jQuery collection
  // e.g. $('div').totalHeight();


  $.fn.totalHeight = function () {
    var totalHeight = 0;
    this.each(function () {
      totalHeight += $(this).height();
    });
    return totalHeight;
  };
  /* $.launchPdfViewer
   *
   * parametros:
   *
   *
   * inicializar:
   *
   */


  $B_ui.launchPdfViewer = function (options) {
    var settings = {
      width: '750',
      widthMobile: '960',
      divId: 'pdfViewerContainer',
      divClass: 'pdfViewerContenedor',
      urlViewer: $B.staticPath + '/pdf_viewer_2014.html?nocache=' + $B.version + '&file=',
      nativeLoadingSelector: '#errorWrapper:not([hidden]), #pageContainer1[data-loaded="true"]',
      selectors: {
        zoomOut: '#zoomOut',
        zoomIn: '#zoomIn',
        print: '#print',
        download: '#downloadPdfKqof',
        numPages: '#numPages',
        paginator: '.paginador',
        errors: {
          wrapperForced: '#errorWrapperForced',
          wrapper: '#errorWrapper',
          message: '#errorMessage'
        },
        prevDoc: '#prevDoc',
        nextDoc: '#nextDoc'
      },
      urlPdf: '',
      legacyPrintable: false,
      target: null,
      error: null,
      resizeForcedError: false,
      isCrossDomain: false,
      literals: [{
        selector: '#previous',
        text: $B.app.literals.visor_pdf.paginaAnterior
      }, {
        selector: '#next',
        text: $B.app.literals.visor_pdf.paginaSiguiente
      }, {
        selector: '#pageNumberLabel',
        text: $B.app.literals.visor_pdf.pagina
      }, {
        selector: '#numPages',
        text: $B.app.literals.visor_pdf.de,
        replaceText: 'of'
      }, {
        selector: '#zoom_out',
        text: $B.app.literals.visor_pdf.reducirZoom
      }, {
        selector: '#zoom_in',
        text: $B.app.literals.visor_pdf.ampliarZoom
      }, {
        selector: '#zoomOut',
        text: $B.app.literals.visor_pdf.reducirZoom
      }, {
        selector: '#zoomIn',
        text: $B.app.literals.visor_pdf.ampliarZoom
      }, {
        selector: '#print',
        text: $B.app.literals.visor_pdf.imprimir
      }, {
        selector: '#download',
        text: $B.app.literals.visor_pdf.descargarOriginal
      }, {
        selector: '.cerrarVisor img',
        text: $B.app.literals.visor_pdf.cerrarVisor
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.noEsPosibleCarga,
        replaceText: 'An error occurred while loading the PDF'
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.documentoNoValido,
        replaceText: 'Invalid or corrupted PDF file'
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.documentoNoEncontrado,
        replaceText: 'Missing PDF file'
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.documentoProtegido,
        replaceText: 'PDF is protected by a password:'
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.documentoNoRenderizable,
        replaceText: 'An error occurred while rendering the page'
      }, {
        selector: '#errorMessage',
        text: $B.app.literals.visor_pdf.errores.error500,
        replaceText: 'ERROR_500'
      }, {
        selector: '#tituloPdf',
        text: options.headerPdf
      }, {
        selector: '#prevDoc',
        text: $B.app.literals.visor_pdf.prevDoc
      }, {
        selector: '#nextDoc',
        text: $B.app.literals.visor_pdf.nextDoc
      }],
      miniatura: options.miniatura,
      $contenedorMiniatura: options.miniatura ? options.contenedorMiniatura : '',
      iframeIndex: options.iframeIndex,
      whiteOverlay: options.whiteOverlay,
      listaDocumentos: options.listaDocumentos
    },
        body = $(document.body),
        iframeContainer,
        iframeViewer,
        iframeViewerContents,
        errorWrapper,
        loadingCounter = 0,
        lateErrorCounter = 0,
        $pdfViewerContainer = $(document.body),
        docToSetReadState = [],
        disableBodyScroll = function disableBodyScroll(disable) {
      $('html').css('overflow', disable ? 'hidden' : 'visible');
      $('body').css('overflow', disable ? 'scroll' : 'auto');
    },
        closeViewer = function closeViewer(event) {
      event.stopPropagation();

      if (_.isUndefined(settings.pdfList)) {
        iframeViewer.off('load.pdfViewer').closest('.c-contenedores-visorPDF').remove();
      } else {
        if (!$(event.target).hasClass('tabs')) {
          iframeViewer.off('load.pdfViewer').closest('.c-contenedores-visorTabspdfs').remove();
        }
      }

      disableBodyScroll(false);
      $.publish('closedViewer', {
        documentosAMarcar: docToSetReadState
      });
    },
        changeCurrentTab = function changeCurrentTab(event) {
      event.stopPropagation();
      var tab_id = $(this).attr('data-tab');
      $('ul.tabs li').removeClass('current');
      $('.tab-content').removeClass('current');
      $(this).addClass('current');
      $('#' + tab_id).addClass('current');
    },
        escKey = function escKey(el) {
      el.off('keydown.pdfViewer').on('keydown.pdfViewer', function (event) {
        if (event.keyCode === 27) {
          closeViewer(event);
        }
      });
    },
        getStyleForSizeError = function getStyleForSizeError(errorWrapperId, currentErrorWrapper) {
      var style;

      if (errorWrapperId !== 'errorWrapperForced' || settings.resizeForcedError) {
        currentErrorWrapper.addClass('sizeEntireViewer');
        style = {
          height: iframeViewerContents.find('#viewerContainer').height() + 2,
          overflow: 'hidden'
        };
      } else {
        style = {
          background: 'transparent'
        };
      }

      return style;
    },
        sizeError = function sizeError() {
      if (errorWrapper) {
        var errorWrapperId = errorWrapper.attr('id'),
            currentErrorWrapper = iframeViewerContents.find('#' + errorWrapperId + ':not([hidden="true"])');
        currentErrorWrapper.css(getStyleForSizeError(errorWrapperId, currentErrorWrapper));
        iframeViewerContents.find('#mainContainer').css({
          overflow: 'hidden'
        });

        if (settings.miniatura) {
          if (settings.whiteOverlay) {
            $('.iconoLupaOverlayMiniatura#iconoLupaOverlayMiniatura' + settings.iframeIndex).hide();
            $('.white-overlay#white-overlay' + settings.iframeIndex).hide();
          }

          $('#pdfViewerContainer').find('iframe').contents().find('#errorWrapper').css('height', $('#pdfViewerContainer').css('height'));
          $('#pdfViewerContainer').find('iframe').attr('height', $('#pdfViewerContainer').css('height'));
        }
      }
    },
        resizeViewer = function resizeViewer() {
      var newHeight = $(window).height();
      iframeViewer.css({
        height: newHeight
      }).attr({
        height: newHeight
      });
      sizeError();
    },
        localization = function localization() {
      _.each(settings.literals, function (item) {
        var element = iframeViewerContents.find(item.selector),
            text = item.text;

        if (element.is('img')) {
          element.attr({
            alt: text,
            title: text
          });
        } else if (!_.isUndefined(item.replaceText)) {
          element.text(element.text().replace(item.replaceText, text));
        } else {
          element.text(text);
        }
      });
    },
        getPrintButton = function getPrintButton(printButton) {
      var printButtonContainer = printButton.parent().is('li') ? printButton.parent() : printButton;

      if (!_.isUndefined($B.ie_version) && $B.ie_version < 11) {
        printButtonContainer.hide();
      } else if (!printButton.is(':visible') && settings.legacyPrintable && !_.isNull(settings.target) && settings.target.closest('.c-listas-acciones').find('.imprimirDatos img').length) {
        printButton.off('click').removeClass('hidden').on('click.printViewer', function () {
          settings.target.closest('.c-listas-acciones').find('.imprimirDatos img').click();
        });
      } else if (!printButton.is(':visible')) {
        printButtonContainer.hide();
      }
    },
        removeViewerLoading = function removeViewerLoading() {
      $B.ui.loading.remove({
        parent: iframeContainer.find('.interiorVisor')
      });
    },
        messageWarning = function messageWarning() {
      var messageText;

      if (!_.isEmpty(settings.error)) {
        messageText = settings.error === 'ERROR_NO_COMPATIBLE' ? $B.app.literals.visor_pdf.errores.documentoNoValido : settings.error;

        if (!iframeViewerContents.find(settings.selectors.errors.wrapperForced).length) {
          iframeViewerContents.find('#mainContainer').append(_.tmpl('#c-contenedores-visor-pdf-error-forzado'));
        }

        errorWrapper = iframeViewerContents.find(settings.selectors.errors.wrapperForced);
      } else {
        messageText = iframeViewerContents.find(settings.selectors.errors.message).text();
      }

      if ($B.appConfig.controlCorrespondenciaVirtualMensajesPdf && settings.miniatura) {
        errorWrapper.html(_.c_mensajes_informativoRefuerzo2({
          titulo: $B.app.literals.visor_pdf.errores.tituloAdvertenciaUps,
          message: '',
          iconoGrande: true,
          opciones: {
            classAside: 'informativo-Error-visor-pdf',
            conContenedorTextoGestionable: true
          }
        }))
        /*.find('.c-mensajes-informativoRefuerzo').find('.contenedor-texto-gestionable').append(_.tmpl('#c-contenedores-visor-pdf-botones-informativo-refuerzo-error-visor')).find('[data-download]').on('click.pdfViewer', function (ev) {
                    ev.preventDefault();
                    iframeViewerContents.find(settings.selectors.download).click();
                  })*/
        ;
        $.publish('errorPdfviewer', {
          interiorVisor: iframeContainer.find('.interiorVisor')
        });
      } else {
        errorWrapper.html(_.c_mensajes_informativoRefuerzo2({
          titulo: $B.app.literals.visor_pdf.errores.tituloAdvertencia,
          message: messageText,
          srcImg: 'ico-aviso-alerta'
        })).find('.c-mensajes-informativoRefuerzo').append(_.tmpl('#c-contenedores-visor-pdf-botones-informativo-refuerzo')).find('[data-download]').on('click.pdfViewer', function (ev) {
          ev.preventDefault();
          iframeViewerContents.find(settings.selectors.download).click();
        });
      }

      if (iframeViewerContents.find('#tituloPdf').text() === 'null') {
        iframeViewerContents.find('#tituloPdf').hide();
      }

      if (errorWrapper.attr('id') === 'errorWrapperForced') {
        errorWrapper.find('.c-mensajes-informativoRefuerzo').append(_.tmpl('#c-contenedores-visor-pdf-boton-cerrar')).find('[data-close]').on('click.pdfViewer', function (ev) {
          ev.preventDefault();
          errorWrapper.remove();
        });
      }
    },
        messageError = function messageError() {
      errorWrapper.html(_.c_v07_mensajes_errorAplicacion({
        titulo: $B.app.literals.visor_pdf.errores.tituloError,
        descripcion: iframeViewerContents.find(settings.selectors.errors.message).text()
      }));
      iframeViewerContents.find(settings.selectors.download).parent().hide();
    },
        manageErrors = function manageErrors(isDownloadable) {
      if (!_.isEmpty(settings.error) || $.trim(iframeViewerContents.find(settings.selectors.errors.message).text()).length > 0) {
        iframeViewerContents.find('.paginador').hide();
        iframeViewerContents.find(settings.selectors.zoomOut).parent().hide();
        iframeViewerContents.find(settings.selectors.zoomIn).parent().hide();
        iframeViewerContents.find(settings.selectors.print).parent().hide();

        if (settings.isCrossDomain) {
          iframeViewerContents.find(settings.selectors.errors.message).text($B.app.literals.visor_pdf.errores.noEsPosibleCarga);
        }

        if (!isDownloadable) {
          messageError();
        } else {
          messageWarning();
        }

        sizeError();
      }
    },
        isError500 = function isError500() {
      var errorMessageText = iframeViewerContents.find(settings.selectors.errors.message).text();
      return errorMessageText === 'ERROR_500' || errorMessageText === 'Missing PDF file.';
    },
        getPdfFileName = function getPdfFileName() {
      var a, file;

      if (settings.urlPdf) {
        a = document.createElement('a');
        a.href = settings.urlPdf;
        file = a.pathname.substr(a.pathname.lastIndexOf('/') + 1);

        if (file.indexOf('.pdf') > -1) {
          return file;
        }
      }

      return null;
    },
        trackDownload = function trackDownload() {
      var pdfname = settings.name || getPdfFileName() || 'Documento PDF';
      var data = settings.model ? settings.model.get('infoContratacion') : null;
      var producto = 'sin producto';

      var checkProduct = function checkProduct(product) {
        if (!product) {
          return '';
        }

        return product.replace(/^\s+|\s+$/g, '');
      };

      if (data && _.isObject(data.registroContrato)) {
        if (!_.isEmpty(checkProduct(data.registroContrato.descripcionProducto))) {
          producto = data.registroContrato.descripcionProducto;
        } else {
          producto = data.registroContrato.idProducto;
        }
      }

      if (settings.tmpFile) {
        pdfname = settings.tmpFile.fileName;

        if ($B.clientFlow.utils.isBrowserCompatible() && $B.clientFlow.utils.isIE10orEdge()) {
          window.navigator.msSaveOrOpenBlob(settings.tmpFile.blob, pdfname + '.' + settings.tmpFile.fileExt);
        } else if (!$B.clientFlow.utils.isBrowserCompatible()) {
          $B.modalBrowserNotCompatible({
            message: $B.app.literals.browserNotCompatible.blockedBrowserMessage,
            logoutOnClose: false,
            hideCloseBtn: false,
            closeOnEscape: true
          });
        }
      }

      if ($B.tracking) {
        $B.tracking.trackEvent({
          id: 'descarga',
          type: 'click',
          data: 'producto=' + producto + '|documento=' + pdfname
        });
      }
    },
        addDocumentToReadStateIfNotExist = function addDocumentToReadStateIfNotExist(doc) {
      var found = false;

      _.each(docToSetReadState, function (item, index) {
        if (item === doc) {
          found = true;
        }

        ;
      });

      if (!found) {
        docToSetReadState.push(doc);
      }

      ;
    },
        iframeLoaded = function iframeLoaded(ev) {
      var printButton,
          loadingInterval,
          renderErrorInterval,
          isDownloadable = true,
          srcImgArrowLeftEnabled = 'img/arrow_left_active.png',
          srcImgArrowLeftDisabled = 'img/arrow_left.png',
          srcImgArrowRightEnabled = 'img/arrow_right_active.png',
          srcImgArrowRightDisabled = 'img/arrow_right.png';
      iframeViewer = $(ev.currentTarget);
      iframeViewerContents = iframeViewer.contents();
      printButton = iframeViewerContents.find('#print');
      iframeViewerContents.find('.cerrarVisor').on('click.closeViewer', closeViewer);

      if (!_.isUndefined(settings.pdfList)) {
        settings.urlPdf = decodeURIComponent(iframeViewer.attr('src').split('file=')[1]);
      }

      iframeViewerContents.find(settings.selectors.download).attr('href', settings.urlPdf);
      iframeViewerContents.find(settings.selectors.download).attr('href', settings.urlPdf).on('click', trackDownload);
      loadingInterval = setInterval(function () {
        if (iframeViewerContents.find(settings.nativeLoadingSelector).length || loadingCounter > 240) {
          clearInterval(loadingInterval);

          if (isError500()) {
            isDownloadable = false;
          }

          localization();
          errorWrapper = iframeViewerContents.find(settings.selectors.errors.wrapper);

          if (!errorWrapper.is('[hidden="true"]')) {
            settings.error = null;
            manageErrors(isDownloadable);
          }

          if (iframeViewerContents.find(settings.selectors.numPages).text() === '/ 1') {
            iframeViewerContents.find(settings.selectors.paginator).hide();
          }

          if (!iframeViewerContents.find(settings.selectors.errors.wrapper).find('.c-mensajes-informativoRefuerzo, .c-mensajes-errorAplicacion').length) {
            renderErrorInterval = setInterval(function () {
              if (!errorWrapper.is('[hidden="true"]') || lateErrorCounter > 200) {
                clearInterval(renderErrorInterval);
                localization();
                manageErrors(isDownloadable);
              }

              lateErrorCounter += 1;
            }, 100);
          }

          if (!_.isEmpty(settings.error)) {
            manageErrors(isDownloadable);
          } else {
            if ($B.appConfig.controlCorrespondenciaVirtualMensajesPdf && !settings.miniatura) {
              if (iframeViewer.attr('src').indexOf('iframeIndex%3D') > -1) {
                addDocumentToReadStateIfNotExist(iframeViewer.attr('src').split('iframeIndex%3D')[1].split('%')[0]);
              }
            }
          }

          if (!_.isUndefined(settings.pdfList)) {
            iframeViewerContents.find(settings.selectors.paginator).show();
          }

          removeViewerLoading();
        }

        loadingCounter += 1;
      }, 250);

      if (_.isUndefined(settings.pdfList)) {
        getPrintButton(printButton);

        if (!settings.miniatura) {
          escKey(iframeViewer);
          $(window).on('resize.pdfViewer', resizeViewer);
          $(window).on('orientationchange.pdfViewer', resizeViewer);
          iframeViewerContents.find('.prevDocument').hide();
          iframeViewerContents.find('.nextDocument').hide();
          iframeViewerContents.find('.opciones').removeClass('opcionesConFlechas');

          if (settings.headerPdf && settings.headerPdf !== '') {
            if (parseInt(settings.iframeIndex) !== parseInt(iframeViewer.attr('src').split('iframeIndex%3D')[1])) {
              settings.iframeIndex = parseInt(iframeViewer.attr('src').split('iframeIndex%3D')[1]);
              iframeViewerContents.find('#tituloPdf').text(settings.listaDocumentos[settings.iframeIndex].header);

              _.each(settings.literals, function (item) {
                if (item.selector === '#tituloPdf') {
                  item.text = settings.listaDocumentos[settings.iframeIndex].header;
                }
              });
            }
          }

          if (settings.conFlechasNavegacion) {
            iframeViewerContents.find('.prevDocument').show();
            iframeViewerContents.find('.nextDocument').show();
            iframeViewerContents.find('.opciones').addClass('opcionesConFlechas');

            if (parseInt(settings.iframeIndex) === 0 && settings.listaDocumentos.length > 1) {
              /* DESHABILITAMOS ANTERIOR */
              iframeViewerContents.find('#prevDocLink').find('img').attr('src', srcImgArrowLeftDisabled);
              iframeViewerContents.find('#prevDocLink').attr('href', '#').off('click');
              /* HABILITAMOS SIGUIENTE */

              iframeViewerContents.find('#nextDocLink').find('img').attr('src', srcImgArrowRightEnabled);
              iframeViewerContents.find('#nextDocLink').attr('href', iframeViewer.attr('src').replace('iframeIndex%3D0', 'iframeIndex%3D' + 1).replace('ficheroADescargar%3D0', 'ficheroADescargar%3D' + 1)).off('click').on('click', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                iframeViewer.attr('src', $(ev.currentTarget).attr('href'));
              });
            } else if (parseInt(settings.iframeIndex) === settings.listaDocumentos.length - 1 && settings.listaDocumentos.length > 1) {
              /* DESHABILITAMOS SIGUIENTE */
              iframeViewerContents.find('#nextDocLink').find('img').attr('src', srcImgArrowRightDisabled);
              iframeViewerContents.find('#nextDocLink').attr('href', '#').off('click');
              /* HABILITAMOS ANTERIOR */

              iframeViewerContents.find('#prevDocLink').find('img').attr('src', srcImgArrowLeftEnabled);
              iframeViewerContents.find('#prevDocLink').attr('href', iframeViewer.attr('src').replace('iframeIndex%3D' + settings.iframeIndex, 'iframeIndex%3D' + (parseInt(settings.iframeIndex) - 1)).replace('ficheroADescargar%3D' + settings.iframeIndex, 'ficheroADescargar%3D' + (parseInt(settings.iframeIndex) - 1))).off('click').on('click', function (ev) {
                ev.preventDefault();
                ev.stopPropagation();
                iframeViewer.attr('src', $(ev.currentTarget).attr('href'));
              });
            } else {
              if (settings.listaDocumentos.length > 1) {
                /* HABILITAMOS ANTERIOR Y SIGUIENTE */
                iframeViewerContents.find('#nextDocLink').find('img').attr('src', srcImgArrowRightEnabled);
                iframeViewerContents.find('#nextDocLink').attr('href', iframeViewer.attr('src').replace('iframeIndex%3D' + settings.iframeIndex, 'iframeIndex%3D' + (parseInt(settings.iframeIndex) + 1)).replace('ficheroADescargar%3D' + settings.iframeIndex, 'ficheroADescargar%3D' + (parseInt(settings.iframeIndex) + 1))).off('click').on('click', function (ev) {
                  ev.preventDefault();
                  ev.stopPropagation();
                  iframeViewer.attr('src', $(ev.currentTarget).attr('href'));
                });
                iframeViewerContents.find('#prevDocLink').find('img').attr('src', srcImgArrowLeftEnabled);
                iframeViewerContents.find('#prevDocLink').attr('href', iframeViewer.attr('src').replace('iframeIndex%3D' + settings.iframeIndex, 'iframeIndex%3D' + (parseInt(settings.iframeIndex) - 1)).replace('ficheroADescargar%3D' + settings.iframeIndex, 'ficheroADescargar%3D' + (parseInt(settings.iframeIndex) - 1))).off('click').on('click', function (ev) {
                  ev.preventDefault();
                  ev.stopPropagation();
                  iframeViewer.attr('src', $(ev.currentTarget).attr('href'));
                });
              } else {
                /*DESHABILITAMOS ANTERIOR Y SIGUIENTE*/
                iframeViewerContents.find('#nextDocLink').find('img').attr('src', srcImgArrowRightDisabled);
                iframeViewerContents.find('#nextDocLink').attr('href', '#').off('click');
                iframeViewerContents.find('#prevDocLink').find('img').attr('src', srcImgArrowLeftDisabled);
                iframeViewerContents.find('#prevDocLink').attr('href', '#').off('click');
              }
            }
          }
        } else {
          errorWrapper = iframeViewerContents.find(settings.selectors.errors.wrapper);

          if (iframeViewerContents.find(settings.selectors.errors.wrapper).find('.c-mensajes-informativoRefuerzo, .c-mensajes-errorAplicacion').length || errorWrapper.is('[hidden="true"]')) {
            if (settings.whiteOverlay) {
              $('.iconoLupaOverlayMiniatura#iconoLupaOverlayMiniatura' + settings.iframeIndex).show();
              $('.white-overlay#white-overlay' + settings.iframeIndex).show();
            }
          }

          iframeViewerContents.find('.page').css('borderImage', 'none');
        }
      }
    },
        getPdfUrl = function getPdfUrl() {
      var regex = new RegExp($B.staticPath, 'i'),
          url = settings.urlPdf;
      return url.match(regex) ? url + '?' + $B.version : url;
    },
        getPdfFromUrl = function getPdfFromUrl(url) {
      var regex = new RegExp($B.staticPath, 'i');
      return url.match(regex) ? url + '?' + $B.version : url;
    },
        parsePdfUrls = function parsePdfUrls(listPdfUrls) {
      return _.map(listPdfUrls, function (pdf, index) {
        return {
          name: pdf.name,
          url: encodeURIComponent(getPdfFromUrl(pdf.url))
        };
      });
    },
        loadTemplate = function loadTemplate() {
      var $templateTarget = $(document.body),
          viewerHeight = $(window).height(),
          viewerWidth = settings.width,
          idIframe = '#iframe-' + settings.divId;

      if (_.isUndefined(settings.pdfList)) {
        if ($B.appConfig.controlCorrespondenciaVirtualMensajesPdf && settings.miniatura) {
          $templateTarget = $(settings.$contenedorMiniatura);
          viewerHeight = $templateTarget.css('height');

          if (viewerHeight === '0px') {
            viewerHeight = '340px';
          }

          viewerWidth = $templateTarget.css('width');
          settings.urlViewer = $B.staticPath + '/pdf_viewer_2015_onContainer.html?nocache=' + $B.version + '&file=';
          idIframe = idIframe + settings.iframeIndex;
          settings.divId = settings.divId + settings.iframeIndex;
        } //Cargamos el visor sin tabs


        $templateTarget.append(_.c_contenedores_visor_pdf({
          viewerId: settings.divId,
          viewerClass: settings.divClass,
          urlViewer: settings.urlViewer,
          urlPdf: encodeURIComponent(getPdfUrl()),
          viewerWidth: viewerWidth,
          viewerWidthMobile: settings.widthMobile,
          isMobile: _.isMobile(),
          viewerHeight: viewerHeight,
          miniatura: settings.miniatura,
          idIframe: idIframe.split('#')[1]
        })).find('iframe' + idIframe).on('load.pdfViewer', iframeLoaded);
      } else {
        if (viewerHeight > 898) {
          viewerHeight = 898;
        }

        ; //Cargamos el visor con tabs

        $templateTarget.append(_.c_contenedores_visorTabspdfs({
          viewerId: settings.divId,
          viewerClass: settings.divClass,
          urlViewer: $B.staticPath + '/pdf_viewer_2015_tabs.html?nocache=' + $B.version + '&file=',
          viewerWidth: viewerWidth,
          viewerHeight: viewerHeight,
          pdfList: parsePdfUrls(settings.pdfList),
          idIframe: idIframe.split('#')[1]
        }));
        $iframesTemplate = $templateTarget.find('iframe' + idIframe);
        $iframesTemplate.on('load.pdfViewer', iframeLoaded);
        $('.cerrar').on('click', closeViewer);
        $('ul.tabs li').on('click', changeCurrentTab);
      }

      if ($B.appConfig.controlCorrespondenciaVirtualMensajesPdf && settings.miniatura) {
        iframeContainer = $templateTarget.find('#' + settings.divId);
      } else {
        iframeContainer = body.find('#' + settings.divId);
      }

      $B.ui.loading.add({
        parent: iframeContainer.find('.interiorVisor'),
        autoStyle: true,
        loadingVisorPdf: true
      });

      if (!settings.miniatura) {
        escKey($(window));
      }

      $('[data-pdf-window]').off('click.pdfViewer').on('click.pdfViewer', closeViewer);
    };

    if (options) {
      $.extend(settings, options);
    } //settings.error = 'ERROR_FORZADO';


    disableBodyScroll(true);

    if (!_.isFunction(_.c_contenedores_visor_pdf)) {
      if (settings.miniatura) {
        $pdfViewerContainer = settings.$contenedorMiniatura;
      }

      require(['text!' + $B.mixinPath + 'c_main_contenedores_visor_pdf.tmpl.html'], function (template_visor_pdf) {
        $.when($pdfViewerContainer.append(template_visor_pdf)).then(function () {
          loadTemplate();
        });
      });
    } else {
      if (!_.isFunction(_.c_contenedores_visorTabspdfs)) {
        require(['text!' + $B.mixinPath + 'c_main_contenedores_visorTabspdfs.tmpl.html'], function (template_visor_pdf) {
          $.when($pdfViewerContainer.append(template_visor_pdf)).then(function () {
            loadTemplate();
          });
        });
      } else {
        loadTemplate();
      }
    }
  };

  $B_ui.createOpinator = function ($viewEl, options) {
    if ($B.appConfig.opinatorEnabled && $viewEl.find('#ph_opinator').length === 0) {
      $.when($viewEl.append(_.tmpl('#c-widget-opinator-container'))).then(function () {
        var Opinator = new $B.app.Opinator(options);
      });
    }
  };
  /* $B.ui.avoidPaste
   *
   * parametros:
   *
   *
   * inicializar:
   *
   */

  /* 
  $B_ui.avoidPaste = function (data) {
    var defaults = {
      context: $('body'),
      fieldSelector: '[data-no-paste]'
    },
      options = $.extend(true, {}, defaults, data);
      options.context.find(options.fieldSelector).on('paste', function (ev) {
      ev.preventDefault();
    });
  };*/


  $B_ui.avoidPaste = function (defaults, options) {
    return function (data) {
      options = $.extend(true, {}, defaults, data);
      options.context.find(options.fieldSelector).on('paste', function (ev) {
        ev.preventDefault();
      });
    };
  }({
    context: $('body'),
    fieldSelector: '[data-no-paste]'
  }, {});

  $B_ui.tabsInHeader = function () {
    var $tabsCopy = null,
        fn = {
      getTabs: function getTabs($pestanas) {
        var tabs = [];
        $.each($pestanas, function () {
          tabs.push({
            id: $(this).attr('data-tab'),
            text: $(this).text(),
            isSelected: $(this).is('.activo')
          });
        });
        return tabs;
      },
      tabsMenu: function tabsMenu($context) {
        var $pestanas = $context.find('[data-tab]:not([data-notfixed])');
        fn.getTabsCopy();

        if ($pestanas.length > 0) {
          $tabsCopy.html(_.tmpl('#app_menu_pestanas_tmpl', {
            tabs: this.getTabs($pestanas)
          }));
        } else {
          $tabsCopy.empty();
        }
      },
      getTabsCopy: function getTabsCopy() {
        if (_.isNull($tabsCopy)) {
          $tabsCopy = $('#app_menu_pestanas');
        }
      }
    };
    return {
      set: function set(view) {
        var $context = !_.isEmpty(view) ? view.$el : $('.contenedorEncabezadoSeccion').eq(0);
        fn.tabsMenu($context);
      },
      unset: function unset() {
        fn.getTabsCopy();
        $tabsCopy.empty();
      }
    };
  }();

  $B_ui.fixedHeader = function () {
    var $cabecera = null,
        $body = $('body'),
        headerHeight = null,
        classHeaderDefault = 'cabeceraDefault',
        classHeaderFixed = 'cabeceraFixed',
        dataPosition = 'data-position',
        fn = {
      getHeader: function getHeader() {
        if (_.isNull($cabecera)) {
          $cabecera = $('#ph_cabecera');
        }
      },
      getHeaderHeight: function getHeaderHeight() {
        this.getHeader();

        if (_.isNull(headerHeight)) {
          headerHeight = $cabecera.height();
        }

        return headerHeight;
      },
      publishHeaderPosition: function publishHeaderPosition(newPosition) {
        $.publish('headerPosition', {
          position: newPosition
        });
      },
      headerGap: function headerGap(gap) {
        $body.css({
          paddingTop: gap
        });
      },
      headerManipulation: function headerManipulation(data) {
        fn.getHeader();
        $cabecera.removeClass(data.classes.remove).addClass(data.classes.add).attr(data.attr.position.name, data.attr.position.value).data('position', data.attr.position.value);
        fn.headerGap(data.gap);
        fn.publishHeaderPosition(data.attr.position.value);
      }
    };
    return {
      set: function set() {
        fn.headerManipulation({
          classes: {
            add: classHeaderFixed,
            remove: classHeaderDefault
          },
          attr: {
            position: {
              name: dataPosition,
              value: 'fixed'
            }
          },
          gap: fn.getHeaderHeight()
        });
      },
      unset: function unset() {
        fn.headerManipulation({
          classes: {
            add: classHeaderDefault,
            remove: classHeaderFixed
          },
          attr: {
            position: {
              name: dataPosition,
              value: 'default'
            }
          },
          gap: 0
        });
      },
      goTop: function goTop() {
        this.unset();
        $B.ui.documentScrollTop();
      }
    };
  }();

  $B_ui.anclaArriba = function () {
    var $anclaArriba = null,
        fn = {
      getAncla: function getAncla() {
        if (_.isNull($anclaArriba)) {
          $anclaArriba = $('#anclaArriba');
        }
      },
      anclaHide: function anclaHide() {
        $anclaArriba.hide();
      },
      anclaShow: function anclaShow(windowScrollTop) {
        var posicionBottom;

        if (windowScrollTop === $(document).height() - $(window).height()) {
          posicionBottom = 60;
        } else {
          posicionBottom = 10;
        }

        $anclaArriba.css({
          bottom: posicionBottom
        }).show();
      }
    };
    return {
      set: function set() {
        fn.getAncla();
        var windowScrollTop = $(window).scrollTop();

        if (windowScrollTop > $B.appConfig.posicionAncla) {
          fn.anclaShow(windowScrollTop);
        } else {
          fn.anclaHide();
        }
      }
    };
  }();

  $B_ui.stickyElements = function () {
    var elementList = {
      header: {
        selector: '.c-menu-auxiliar_R2',
        callback: 'fixedHeader',
        sticked: false,
        offset: null
      },
      tabs: {
        selector: '.contenedorEncabezadoSeccion',
        callback: 'tabsInHeader',
        sticked: false,
        offset: null
      },
      ancla: {
        selector: '#anclaArriba',
        callback: 'anclaArriba',
        customPosition: true
      }
    },
        scrollTimeout,
        fnCallback = {
      fixedHeader: function fixedHeader(scroll) {
        /*if (scroll) {
          $B_ui.fixedHeader.set();
        } else {
          $B_ui.fixedHeader.unset();
        }*/
      },
      tabsInHeader: function tabsInHeader(scroll) {
        if (scroll) {
          $B_ui.tabsInHeader.set();
        } else {
          $B_ui.tabsInHeader.unset();
        }
      },
      anclaArriba: function anclaArriba() {
        $B_ui.anclaArriba.set();
      }
    },
        fn = {
      cached: {
        headerHeight: null
      },
      headerHeight: function headerHeight() {
        if (_.isNull(this.cached.headerHeight)) {
          //this.cached.headerHeight = $(elementList.header.selector).height();
          //this.cached.headerHeight = $(elementList.header.selector).css('margin-top');
          this.cached.headerHeight = $('#ph_cabecera').height();
        }

        return this.cached.headerHeight;
      },
      isHeaderFixed: function isHeaderFixed() {
        return elementList.header.sticked ? this.headerHeight() : 0;
      },
      getScrollTop: function getScrollTop($context) {
        return !_.isUndefined($context) ? $context.offset().top : $(window).scrollTop();
      },
      windowIsBelowElement: function windowIsBelowElement(element, $element) {
        var elementScrollTop,
            elementHeight = $element.height();

        if (_.isNull(element.offset)) {
          elementScrollTop = this.getScrollTop($element);
          element.offset = elementScrollTop;
        } else {
          elementScrollTop = element.offset;
        }

        return elementScrollTop - (element.selector === elementList.header.selector ? 30 : this.isHeaderFixed()) + elementHeight < this.getScrollTop();
      },
      makeCallback: function makeCallback(callback, windowIsBelowElement) {
        fnCallback[callback](windowIsBelowElement);
      },
      afterCheck: function afterCheck() {
        // Hay que hacer algunas verificaciones para evitar el each cuando no es necesario: en determinados tramos del scroll no necesitamos que se haga ninguna comprobación...
        var self = this;

        _.each(elementList, function (element) {
          var windowIsBelowElement = null,
              $element = $(element.selector);

          if ($element.length) {
            if (element.customPosition === true) {
              self.makeCallback(element.callback, null);
            } else {
              windowIsBelowElement = self.windowIsBelowElement(element, $element); // TODO: quitar repetidos

              if (element.sticked !== windowIsBelowElement) {
                element.sticked = windowIsBelowElement;
                self.makeCallback(element.callback, windowIsBelowElement);
              }
            }
          }
        });
      }
    };
    return {
      elementList: elementList,
      initialize: function initialize() {
        fn.headerHeight();
        $(window).off('scroll.sticky').on('scroll.sticky', null, {
          self: this
        }, this.check);
      },
      check: function check(ev) {
        if (!scrollTimeout) {
          scrollTimeout = setTimeout(function () {
            scrollTimeout = null;
            fn.afterCheck(ev);
          }, 100);
        }
      }
    };
  }();

  $B_ui.eventOutsideElement = function (options) {
    var defaults = {
      eventType: 'click',
      eventNamespace: 'outside',
      fn: {
        condition: function condition() {
          return false;
        },
        callback: function callback() {
          return false;
        }
      }
    },
        settings = $.extend(true, {}, defaults, options),
        idJsEvent = settings.eventType + '.' + settings.eventNamespace,
        $clickables = $(document).add('[role="link"], [role="button"], [role="tab"]');
    $clickables.off(idJsEvent).on(idJsEvent, function (ev) {
      if (settings.fn['condition'](ev)) {
        $clickables.off(idJsEvent);
        settings.fn['callback']();
      }
    });
  };

  $B_ui.documentScrollTop = function (options) {
    var defaults = {
      top: 0,
      duration: 500,
      effect: 'swing',
      context: 'html, body'
    },
        options = $.extend(true, {}, defaults, options);
    $(options.context).animate({
      scrollTop: options.top
    }, {
      duration: options.duration,
      easing: options.effect
    });
  };

  $B_ui.slideTour = function (data) {
    var $contenedorAyuda = $('body').append(_.c_contenedores_ayudas_slide(data)).find('.c-contenedores-ayudas-slide'),
        $html = $('html'),
        $closeButton = $contenedorAyuda.find('[data-close-tour]'),
        fn = {
      hideTour: function hideTour() {
        $contenedorAyuda.fadeOut('fast', 'swing', function () {
          $contenedorAyuda.remove();
        });
        $html.css({
          overflow: 'visible'
        });
      }
    };
    $html.css({
      overflow: 'hidden'
    });
    $closeButton.off('click.slideTour').on('click.slideTour', function () {
      fn.hideTour();
    });
    $contenedorAyuda.find('[data-slide-control]').off('click.slideTour').on('click.slideTour', function () {
      $B.ui.documentScrollTop({
        context: '.c-contenedores-ayudas-slide'
      });
    });
    $B.ui.documentScrollTop({
      context: '.c-contenedores-ayudas-slide'
    });
    $contenedorAyuda.off('keydown.closeTour').on('keydown.closeTour', function (ev) {
      if (ev.keyCode === 13 && $closeButton.is(':focus') || ev.keyCode === 27) {
        fn.hideTour();
      }
    });
    $closeButton.focus();
  }; // expose module with custom alias

  /*define('$B.ui', function(){
    return $B_ui;
  });*/

  /*\
   * Funcion para inicializar el conmutador de productos en la ficha de cada producto. 
   * $B.ui.initConmutadorProductosFicha(listasListaProductos); 
   * listasListaProductos ->  List<com.bbva.kqof.webcore.forms.dtos.comun.ListaProductosNombreComponenteFicha> necesario en el form de la ficha
   * Desarrollo: Producto por familia
   * Author: Accenture 
   * Responsable: xe36814
  \*/


  $B_ui.initConmutadorProductosFicha = function (listasListaProductos, modelo_ficha) {
    var alreadyExecuted = false,
        posicion = 'titular',
        functions = {
      eventoAbrirConmutador: function eventoAbrirConmutador() {
        var self = this;
        $('.botonConmutador_productos').addClass('desplegable_abierto');
        $('.conmutador-listado-productos').removeClass('conmutador_productos_cerrado');
        $('.conmutador-listado-productos').addClass('conmutador_productos_abierto');
        $('#contenedor-c-v01-conmutador-listado-productos').addClass('contenedorAbierto');
        $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').addClass('encabezadoConmutadorAbierto');

        if (listasListaProductos[0].listaTmplName !== 'Cuentas' && listasListaProductos[0].listaTmplName !== 'Tarjetas') {
          $('.c-encabezado-descripcionProducto').addClass('encabezadoConmutadorAbierto');
          $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').removeClass('encabezadoConmutadorAbierto');
        } else {
          $('.c-encabezado-descripcionProducto').removeClass('encabezadoConmutadorAbierto');
        }

        if (!alreadyExecuted) {
          $('span[role="button"][data-action="listAll"]').click();
          alreadyExecuted = true;
        }

        $.unsubscribe('clickOn_botonConmutador_productos');
        $.subscribe('clickOn_botonConmutador_productos', function () {
          self.eventoCerrarConmutador();
        });
      },
      eventoCerrarConmutador: function eventoCerrarConmutador() {
        var self = this;
        $('.botonConmutador_productos').removeClass('desplegable_abierto');
        $('.conmutador-listado-productos').removeClass('conmutador_productos_abierto');
        $('.conmutador-listado-productos').addClass('conmutador_productos_cerrado');
        $('#contenedor-c-v01-conmutador-listado-productos').removeClass('contenedorAbierto');
        $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').removeClass('encabezadoConmutadorAbierto');
        $('.c-encabezado-descripcionProducto').removeClass('encabezadoConmutadorAbierto');
        $.unsubscribe('clickOn_botonConmutador_productos');
        $.subscribe('clickOn_botonConmutador_productos', function () {
          self.eventoAbrirConmutador();
        });
      },
      cambiarBuscador: function cambiarBuscador(p_nombreLista) {
        var objetoEncontrado = -1,
            prodActual = false,
            indiceProductoActual = 0,
            self = this;

        _.each(listasListaProductos, function (item, index) {
          if (item.listaTmplName === p_nombreLista) {
            objetoEncontrado = index;

            if (index === indiceProductoActual) {
              prodActual = true;
            }
          }
        });

        if (objetoEncontrado > -1) {
          $('#contenedorBuscadores_conmutador_listado_productos').html(_.tmpl('#vista_buscador_' + p_nombreLista, {
            listaProductos: listasListaProductos[objetoEncontrado],
            prodActual: prodActual,
            modelo_ficha: modelo_ficha
          }));
        }

        $B.ui.initFormComponents();
        $('span[role="button"][data-action="listAll"]').click();

        if ($B.appConfig.controlProductoFamiliaComboAutorizado) {
          self.registrarEventoCambioProducto();
        }
      },
      cambiarBuscadorVisualizadores: function cambiarBuscadorVisualizadores(p_nombreLista, listaProductos) {
        var listaAuxiliar = [],
            prodActual = false,
            indiceProductoActual = 0,
            self = this;
        listaAuxiliar = listaProductos.listaProductos;
        listaProductos.listaProductos = listaProductos.listaProductosVisualizadores;

        _.each(listasListaProductos, function (item, index) {
          if (item.listaTmplName === p_nombreLista) {
            objetoEncontrado = index;

            if (index === indiceProductoActual) {
              prodActual = true;
            }
          }
        });

        $('#contenedorBuscadores_conmutador_listado_productos').html(_.tmpl('#vista_buscador_' + p_nombreLista, {
          listaProductos: listaProductos,
          prodActual: prodActual,
          modelo_ficha: modelo_ficha
        }));
        $B.ui.initFormComponents();
        $('span[role="button"][data-action="listAll"]').click();
        $('.nombreComercialProductosFicha').parent().append('<span class="labelAutorizado"> Autorizado </span>');
        listaProductos.listaProductos = listaAuxiliar;
        self.registrarEventoCambioProducto();
      },
      cambiarBuscadorTodos: function cambiarBuscadorTodos(p_nombreLista) {
        var objetoEncontrado = -1,
            prodActual = false,
            indiceProductoActual = 0,
            self = this,
            listaSeleccionada = [],
            listaAuxiliar = [],
            longitudFilas = 0,
            longitudAutorizados = 0;

        _.each(listasListaProductos, function (item, index) {
          if (item.listaTmplName === p_nombreLista) {
            objetoEncontrado = index;

            if (index === indiceProductoActual) {
              prodActual = true;
            }
          }
        });

        listaSeleccionada = listasListaProductos[objetoEncontrado];
        listaAuxiliar = $.merge(listaAuxiliar, listaSeleccionada.listaProductos);
        listaSeleccionada.listaProductos = $.merge(listaSeleccionada.listaProductos, listaSeleccionada.listaProductosVisualizadores);

        if (objetoEncontrado > -1) {
          $('#contenedorBuscadores_conmutador_listado_productos').html(_.tmpl('#vista_buscador_' + p_nombreLista, {
            listaProductos: listaSeleccionada,
            prodActual: prodActual,
            modelo_ficha: modelo_ficha
          }));
        }

        longitudFilas = $('.filaProducosFicha').length;
        longitudAutorizados = listaSeleccionada.listaProductosVisualizadores.length;
        listaSeleccionada.listaProductos = listaAuxiliar;

        for (i = 0; i < longitudAutorizados; i++) {
          $($('.filaProducosFicha')[longitudFilas - (longitudAutorizados - i)]).addClass('filaProductoAutorizado');
        }

        $('.filaProductoAutorizado .nombreComercialProductosFicha').parent().append('<span class="labelAutorizado"> Autorizado </span>');
        $B.ui.initFormComponents();
        $('span[role="button"][data-action="listAll"]').click();
        self.registrarEventoCambioProducto();
      },
      cambiarComboTitulares: function cambiarComboTitulares() {
        if (this.posicion === 'autorizado') {
          $('#select_comboProductos-Ficha').val($('#select_comboProductos-Ficha-visualizadores').val()).trigger('click').trigger('change');
        } else {
          $('#select_comboProductos-Ficha').val($('#select_comboProductos-Ficha-todos').val()).trigger('click').trigger('change');
        }

        $('#select_comboProductos-Ficha').parent().show();
        $('#select_comboProductos-Ficha-visualizadores').parent().hide();
        $('#select_comboProductos-Ficha-todos').parent().hide();
        this.posicion = 'titular';
      },
      cambiarComboAutorizados: function cambiarComboAutorizados() {
        if (this.posicion === 'titular') {
          $('#select_comboProductos-Ficha-visualizadores').val($('#select_comboProductos-Ficha').val()).trigger('click').trigger('change');
        } else {
          $('#select_comboProductos-Ficha-visualizadores').val($('#select_comboProductos-Ficha-todos').val()).trigger('click').trigger('change');
        }

        $('#select_comboProductos-Ficha-visualizadores').parent().show();
        $('#select_comboProductos-Ficha').parent().hide();
        $('#select_comboProductos-Ficha-todos').parent().hide();
        this.posicion = 'autorizado';
      },
      cambiarComboTodos: function cambiarComboTodos() {
        if (this.posicion === 'titular') {
          $('#select_comboProductos-Ficha-todos').val($('#select_comboProductos-Ficha').val()).trigger('click').trigger('change');
        }

        if (this.posicion === 'autorizado') {
          $('#select_comboProductos-Ficha-todos').val($('#select_comboProductos-Ficha-visualizadores').val()).trigger('click').trigger('change');
        }

        $('#select_comboProductos-Ficha-todos').parent().show();
        $('#select_comboProductos-Ficha-visualizadores').parent().hide();
        $('#select_comboProductos-Ficha').parent().hide();
        this.posicion = 'todos';
      },
      actualizarPosicionLinkAutorizado: function actualizarPosicionLinkAutorizado() {
        if ($('[data-action="listAll"]').length <= 0) {
          $('.linkAutorizados').addClass('linkAutorizadosSinBuscador');
          $('#comboPosiciones-ficha').addClass('comboAutorizadosSinBuscador');
        } else {
          $('.linkAutorizados').removeClass('linkAutorizadosSinBuscador');
          $('#comboPosiciones-ficha').removeClass('comboAutorizadosSinBuscador');
        }
      },
      mostarCargandoEncabezado: function mostarCargandoEncabezado() {
        var anchoLoading = '',
            anchoLoadingSinPx = '';
        $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').before(_.c_v06_mensajes_cargando({
          text: $B.app.literals.cargando,
          image: 'preload_secundario_mini.gif',
          newUroboroText: true
        })).hide();
        $('.newUroboroLoadingP').hide();
        anchoLoading = $('.newUroboroLoadingDiv').css('width');
        anchoLoadingSinPx = anchoLoading.substring(0, anchoLoading.length - 2);
        $('.newUroboroLoadingDiv').css('maxHeight', '90px').css('paddingTop', '30px').addClass('encabezadoConmutadorAbierto').css('width', parseInt(anchoLoadingSinPx) - 2 + 'px');
      },
      ocultarCargandoEncabezado: function ocultarCargandoEncabezado() {
        $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').show();
        $('.newUroboroLoadingDiv').remove();
      },
      establecerEventoFlagVisualizadores: function establecerEventoFlagVisualizadores(posicion, flagVisualizadores, esProductoAutorizado) {
        var eventId = '';

        if (posicion === '1' && !flagVisualizadores || posicion === '0' && flagVisualizadores || posicion !== '0' && posicion !== '1' && esProductoAutorizado) {
          eventId = 'ponerFlagAutorizado';
        } else {
          eventId = 'ponerFlagTitular';
        }

        return eventId;
      },
      comprobarCambioPosicion: function comprobarCambioPosicion(posicion, flagVisualizadores, esProductoAutorizado) {
        var seHaCambiadoPosicionVisualizadores = false;

        if (posicion === '0' || posicion === '2' && flagVisualizadores && esProductoAutorizado || posicion === '2' && !flagVisualizadores && !esProductoAutorizado) {
          seHaCambiadoPosicionVisualizadores = false;
        } else {
          seHaCambiadoPosicionVisualizadores = true;
        }

        return seHaCambiadoPosicionVisualizadores;
      },
      lanzarEventoCambioFlagVisualizadores: function lanzarEventoCambioFlagVisualizadores(nuevoEstadoFlagVisualizadores, urlProducto, cambioPosicionVisualizadores) {
        var self = this;
        modelo_ficha.save({
          _eventId: nuevoEstadoFlagVisualizadores
        }, {
          success: function success() {
            if (cambioPosicionVisualizadores) {
              $B.storage.session.clear();
            }

            setTimeout(function () {
              $B.utils.navigate({
                url: urlProducto,
                forcedNavigation: true
              });
            }, 550);
          },
          error: function error() {
            self.ocultarCargandoEncabezado();
          },
          validationError: function validationError() {
            self.ocultarCargandoEncabezado();
          }
        });
      },
      registrarEventoCambioProducto: function registrarEventoCambioProducto() {
        var self = this;

        if ($B.appConfig.controlProductoFamiliaComboAutorizado) {
          $('.filaProducosFicha').off('click').on('click', function (ev) {
            var estamosEnVisualizadores = modelo_ficha.get('estamosEnVisualizadores'),
                _posicion = $('[name="comboPosiciones-ficha"]').val(),
                nuevoEstadoFlagVisualizadores = '',
                cambioPosicion = false,
                esProductoAutorizado = $(ev.currentTarget).hasClass('filaProductoAutorizado'),
                urlProducto = $(ev.currentTarget).data('link');

            ev.preventDefault();
            ev.stopPropagation();
            nuevoEstadoFlagVisualizadores = self.establecerEventoFlagVisualizadores(_posicion, estamosEnVisualizadores, esProductoAutorizado);
            cambioPosicion = self.comprobarCambioPosicion(_posicion, estamosEnVisualizadores, esProductoAutorizado);
            self.mostarCargandoEncabezado();
            self.lanzarEventoCambioFlagVisualizadores(nuevoEstadoFlagVisualizadores, urlProducto, cambioPosicion);
          });
        }
      },
      registrarEventos: function registrarEventos() {
        var self = this;
        $.subscribe('clickOn_botonConmutador_productos', function () {
          self.eventoAbrirConmutador();
        });
        $('.botonConmutador_productos').off('click').on('click', function () {
          $.publish('clickOn_botonConmutador_productos');
        });
        $('#select_comboProductos-Ficha').off('change').on('change', function (ev) {
          var listaSeleccionada = listasListaProductos[ev.target.value].listaTmplName;
          self.cambiarBuscador(listaSeleccionada);

          if ($B.appConfig.controlProductoFamiliaComboAutorizado) {
            self.actualizarPosicionLinkAutorizado();
          }
        });

        if ($B.appConfig.controlProductoFamiliaComboAutorizado) {
          $('#select_comboPosiciones-ficha').off('change').on('change', function (ev) {
            var _posicion = ev.currentTarget.value;

            if (!modelo_ficha.get('estamosEnVisualizadores')) {
              if (_posicion === '0') {
                self.cambiarComboTitulares();
              } else if (_posicion === '1') {
                self.cambiarComboAutorizados();
              } else {
                self.cambiarComboTodos();
              }
            } else {
              if (_posicion === '0') {
                self.cambiarComboAutorizados();
              } else if (_posicion === '1') {
                self.cambiarComboTitulares();
              } else {
                self.cambiarComboTodos();
              }
            }
          });
          $('#select_comboProductos-Ficha-visualizadores').off('change').on('change', function (ev) {
            var listaSeleccionada = {},
                listasVisualizadores = [];

            _.each(listasListaProductos, function (item) {
              if (item.tieneVisualizadores) {
                listasVisualizadores.push(item);
              }
            });

            listaSeleccionada = listasVisualizadores[ev.target.value].listaTmplName;
            self.cambiarBuscadorVisualizadores(listaSeleccionada, listasVisualizadores[ev.target.value]);
            self.actualizarPosicionLinkAutorizado();
          });
          $('#select_comboProductos-Ficha-todos').off('change').on('change', function (ev) {
            var listaSeleccionada = {},
                listaTodos = [],
                nombreListaSeleccionada = '';

            _.each(listasListaProductos, function (item) {
              if (item.tieneVisualizadores) {
                listaTodos.push(item);
              } else {
                if (item.listaProductos.length > 0) {
                  listaTodos.push(item);
                }
              }
            });

            listaSeleccionada = listaTodos[ev.target.value];
            nombreListaSeleccionada = listaSeleccionada.listaTmplName;
            self.cambiarBuscadorTodos(nombreListaSeleccionada);
            self.actualizarPosicionLinkAutorizado();
          });
          self.registrarEventoCambioProducto();
        }
      },
      initialize: function initialize() {
        var listaAuxiliar = [],
            primeraLista = '',
            listaProductosCliente = listasListaProductos[0],
            listaCambiada = false;
        primeraLista = listaProductosCliente.listaTmplName;

        if (modelo_ficha.get('estamosEnVisualizadores') && $B.appConfig.controlProductoFamiliaComboAutorizado) {
          this.posicion = 'autorizado';
          listaAuxiliar = listaProductosCliente.listaProductos;
          listaProductosCliente.listaProductos = listaProductosCliente.listaProductosVisualizadores;
          listaCambiada = true;
        } else {
          this.posicion = 'titular';
        }

        $('.c-encabezado-descripcionProducto').addClass('encabezadoConmutador' + listaProductosCliente.listaTmplName);
        $('.c-encabezado-descripcionProducto').addClass('encabezadoConmutadorProducto');
        $('.c-form-combo').cSelectMenu();
        $('#contenedorBuscadores_conmutador_listado_productos').html(_.tmpl('#vista_buscador_' + primeraLista, {
          listaProductos: listaProductosCliente,
          prodActual: true,
          modelo_ficha: modelo_ficha
        }));

        if (modelo_ficha.get('estamosEnVisualizadores') && $B.appConfig.controlProductoFamiliaComboAutorizado) {
          $('.nombreComercialProductosFicha').parent().append('<span class="labelAutorizado"> Autorizado </span>');
        }

        this.registrarEventos();

        if (listaCambiada && $B.appConfig.controlProductoFamiliaComboAutorizado) {
          listaProductosCliente.listaProductos = listaAuxiliar;
        }

        if (listasListaProductos[0].listaTmplName === 'Tarjetas') {
          $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').addClass('encabezadoProductoTarjeta');
          $('.c-encabezado-descripcionProducto').removeClass('encabezadoConmutadorProducto');
          $('.c-encabezado-descripcionProducto').addClass('encabezadoConmutadorProductoTarjeta');
        }

        if (listasListaProductos[0].listaTmplName === 'depos' || listasListaProductos[0].listaTmplName === 'Cuentas') {
          $('[data-tmpl-placeholder="encabezadoDescripcionProducto"]').css('paddingTop', '0');
        }

        if ($('.c-contenedores-encabezadoProducto .c-menu-pestanasOperativasConsultas').length > 0) {
          $('.c-contenedores-encabezadoProducto .c-menu-pestanasOperativasConsultas').addClass('mt50');
        } else {
          $('#contenedor-c-v01-conmutador-listado-productos').next().addClass('mt50');
        }

        if (listasListaProductos[0].listaTmplName === 'prestamos') {
          $('.saldo1ProductosFicha-extra-top').removeClass('saldo1ProductosFicha-extra-top');
        }

        if ($B.appConfig.controlProductoFamiliaComboAutorizado) {
          this.actualizarPosicionLinkAutorizado();

          if ($('.newUroboroLoadingDiv').length > 0) {
            this.ocultarCargandoEncabezado();
          }
        }
      }
    };
    functions.initialize();
  };
})($B, jQuery, _);
//# sourceMappingURL=bbva.ui.js.map
