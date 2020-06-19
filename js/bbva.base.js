function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function () {
  /*\
   * $B
   * Global namespace for BBVA
  \*/
  $B = window.$B || {};
  /*\
   * $B.provide
   [ method ]
   * Creates a namespace in the global
   * $B namespace.
   > Arguments
   - ns (object) Object in which to create this namespace
   - ns_string (string) Name for this namespace
   > Usage
   | $B.provide($B, 'app')
  \*/

  $B.provide = function (ns, ns_string) {
    var parts = ns_string.split('.'),
        parent = ns,
        pl,
        i;

    if (parts[0] === '$B') {
      parts = parts.slice(1);
    }

    pl = parts.length;

    for (i = 0; i < pl; i += 1) {
      if (typeof parent[parts[i]] === 'undefined') {
        parent[parts[i]] = {};
      }

      parent = parent[parts[i]];
    }

    return parent;
  };
  /**
   * Modal Operativa no encontrada
   */


  $B.modalOperativaNoEncontrada = function () {
    var data = {
      modalType: 'modalesAvisoCore',
      modalId: 'operativaNoEncontrada',
      // modal Header
      modalTitle: $B.app.literals.coreLiterals.operativa_no_encontrada_title,
      modalSubTitle: $B.app.literals.coreLiterals.operativa_no_encontrada_subTitle,
      // modal info
      messageOptionsPage: [$B.app.literals.coreLiterals.operativa_no_encontrada_opcion_posicion_global, $B.app.literals.coreLiterals.operativa_no_encontrada_opcion_hipotecas_y_prestamos, $B.app.literals.coreLiterals.operativa_no_encontrada_opcion_seguros, $B.app.literals.coreLiterals.operativa_no_encontrada_opcion_cuentas_y_tarjetas, $B.app.literals.coreLiterals.operativa_no_encontrada_opcion_ahorro_e_inversion]
    },
        content = _.c_mensajes_informativoRefuerzo2(data),
        selectedPage = function selectedPage(ev) {
      var indexPage = $(ev.currentTarget).val(),
          urls = ['posicion-global', 'subhome-cuentas-tarjetas', 'subhome-creditos-hipotecas', 'subhome-ahorro-inversion', 'subhome-seguros'];
      $B.ui.dialog.destroy('dialogNoRoute');
      window.router.navigate(urls[indexPage], true);
    };

    $B.coreNotification({
      id: 'dialogNoRoute',
      content: content,
      title: '',
      dialogOptions: {
        autoOpen: true,
        width: 640,
        close: function close() {
          $B.ui.dialog.destroy('dialogNoRoute');
        },
        open: function open() {
          $('#js-comboOptionsPage').cSelectMenu({
            truncateText: false
          });

          if ($B.clientFlow.utils.isLegacyIE()) {
            $('.modal-image-background').addClass('no-svg');
          }

          $('#js-comboOptionSelected').prop('selectedIndex', -1);
          $('#js-comboOptionSelected').on('change', selectedPage);
        }
      }
    });
  };
  /**
   * Modal Operativa Bloqueada por incompatiblidad de Browser
   */


  $B.modalBrowserNotCompatible = function (options) {
    var data = {
      modalType: 'modalesAvisoCore',
      modalId: 'browserNotCompatible',
      // modal Header
      modalTitle: $B.app.literals.browserNotCompatible.modalTitle,
      modalSubTitle: options.message
    },
        content = _.c_mensajes_informativoRefuerzo2(data);

    $B.coreNotification({
      id: 'browserNotCompatible',
      content: content,
      title: '',
      dialogOptions: {
        autoOpen: true,
        width: 640,
        closeOnEscape: options.closeOnEscape || true,
        close: function close() {
          $B.ui.dialog.destroy('browserNotCompatible');

          if (options.logoutOnClose) {
            $B.sessionManager.logout();
          }
        },
        open: function open() {
          if ($B.clientFlow.utils.isLegacyIE()) {
            $('.modal-image-background').addClass('no-svg');
          }

          if (options.hideCloseBtn) {
            $(this).find('#browserNotCompatible .cerrarModal').hide();
          }
        }
      }
    });
  };
  /*\
   * $B.noRoute
   [ method ]
   * Function that displays a modal dialog when
   * a route is not defined in our applications routes
   > Arguments
   - route (string) Name/URI for this route
   > Usage
   | $B.noRoute('nonexisting')
  \*/


  $B.noRoute = function (route) {
    var rbaControl = false;
    $B.ui.dialog.destroyAll();

    if ($B.ui.dialog.exists('loading-app')) {
      $B.ui.dialog.destroy('loading-app');
    } // Control por si el usuario tiene operativas bloqueadas por RBA


    if ($B.appConfig.enableBlockUserOperationsWhenLackData && $B.clientResources.user.get('usuarioBloqueadoRBA')) {
      // Devuelve true si route es una operativa bloqueada por RBA
      rbaControl = _.contains($B.appConfig.rutasBloqueadasRBA, route);
    }

    if (rbaControl) {
      // Operativas Bloqueadas por RBA, mostraría el modal de usuario bloqueado RBA.
      $B.userInfoView.lanzarModalUsuarioBloqueadoRBA();
    } else {
      // Operativas Bloqueadas, mostraría el modal de Página no encontrada.
      $B.modalOperativaNoEncontrada();
    }
  };

  $B.errorGenerico = function (error, message) {
    if ($B.ui.dialog.exists('loading-app')) {
      $B.ui.dialog.destroy('loading-app');
    }

    $B.coreNotification({
      id: 'serverError',
      content: '<p><strong>' + error + ':</strong> ' + message + '</p>',
      title: 'Error',
      width: 'w640'
    });
  };
  /*\
   * $B.coreNotification
   [ method ]
   * Function that creates a core modal notification
   * will not be destroyed unless call explicit destroy() passing its id
   * It is used at the end of all MVCs
   > Arguments
   - options (object) object of name/value pairs
   o {
   o    id (string) id for the dialog must be unique
   o    content (string) html string content
   o    title (string) title for the dialog (temporal, should be on the tmpl)
   o }
   > Usage
   | $B.coreNotification({
   |  id: 'serverError',
   |  content: '<p>Hubo un error</p>',
   |  title: 'Error'
   | });
  \*/


  $B.coreNotification = function (options) {
    var el = _.c_v06_contenedores_ventanaModal(options);

    if ($B.ui.dialog.exists(options.id)) {
      $B.ui.dialog.get(options.id).html(el).dialog('open');
    } else {
      if (!_.isUndefined(options.dialogOptions)) {
        $B.ui.dialog.create({
          id: options.id,
          content: el,
          isCore: true,
          dialogOptions: options.dialogOptions
        });
      } else {
        $B.ui.dialog.create({
          id: options.id,
          content: el,
          isCore: true,
          dialogOptions: {
            zIndex: 100000,
            autoOpen: true
          }
        });
      }
    }
  };
  /*\
   * $B.viewLoaded
   [ method ]
   * Function that triggers viewLoaded
   * It is used at the end of all MVCs
   > Arguments
   - viewId (string) jQuery dom form object
   - viewCtor (object) Instance of a Backbone View
   > Usage
   | $B.viewLoaded(moduleId, StackView)
   * or if StackView was declared passing the id directly just use:
   | $B.viewLoaded(StackView)
  \*/


  $B.viewLoaded = function (viewId, viewCtor) {
    // accept viewId to be the view itself
    // and get the id from its id property
    var View, id;

    if (viewCtor) {
      View = viewCtor;
      View.id = viewId;
    } else {
      View = viewId;
      viewId = null;
    }

    id = View.id || View.moduleId || viewId;

    if (!id) {
      throw 'moduleId is undefined';
    }

    return {
      id: id,
      initialize: function initialize(options) {
        return new View(options);
      }
    };
  };
  /*\
   * $B.serializeForm
   [ method ]
   * Serializes a form and binds it's values to a Backbone Model
   > Arguments
   - form (object) jQuery dom form object
   - model (object) Instance of a Backbone Model
   > Usage
   | $B.serializeForm($('#myForm'), model)
  \*/


  $B.serializeForm = function (form, model) {
    var binder = new Binder.PropertyAccessor(model.attributes),
        keyValues,
        i,
        l,
        objArray,
        key,
        value; // if it is already a jquery obj do not wrap it

    form = form instanceof jQuery ? form : $(form); // if there are more than 1 form
    // or there is no dom form object, do nothing

    if (form.length > 1 || !form[0]) {
      return;
    }

    _.each(form.find('.required_hidden[data-date-mirror]'), function (item) {
      var $item = $(item),
          _value = parseInt($item.val(), 10),
          dateValue,
          utcDateValue;

      if (isNaN(_value)) {
        return;
      }

      dateValue = new Date(_value);
      utcDateValue = _value - dateValue.getTimezoneOffset() * 60000;
      $item.val(utcDateValue);
    });

    form.find('input.watermark').each(function () {
      $(this).val('');
    });
    keyValues = _.map(form.serializeArray(), function (_value) {
      if (_.isObject(_value) && _.isString(_value.value)) {
        return (_value.name + '=' + _value.value).replace(/\&/g, "\\u0026");
      }
    });
    l = keyValues.length;

    if (keyValues[0] === '') {
      return;
    }

    for (i = 0; i < l; i += 1) {
      objArray = keyValues[i].split('=');
      key = objArray[0];
      value = objArray[1].replace(/\+/ig, ' ');
      binder.set(key, value);
    }
  };
  /*\
   * $B.validateForm
   [ method ]
   * Indicates weather a form passes validation
   > Arguments
   - form (object) jQuery dom form object
   = (boolean) Returns true/false indicating weather the form passes validation
   > Usage
   | $B.validateForm($('#myForm'))
  \*/


  $B.validateForm = function (form) {
    return form.validate();
  };

  $B.prepareErrorTmplMsg = function (model, moduleId, e) {
    var msg = $B.app.literals.coreLiterals.error_tempalte + ' ',
        modelUrl,
        modelViewStateId;

    if (moduleId) {
      msg += '#tmpl_' + moduleId + ', ';
    }

    if (model) {
      modelUrl = model.url;
      modelViewStateId = _.isFunction(model.get) ? model.get('viewStateId') : model.viewStateId;

      if (modelUrl && !_.isFunction(modelUrl)) {
        msg += 'url: ' + modelUrl + ', ';
      }

      if (modelViewStateId) {
        msg += 'viewStateId: ' + modelViewStateId + ', ';
      }
    }

    return msg += $B.app.literals.coreLiterals.mensage_de_error + ' ' + e.message;
  };

  $B.tryGetTemplate = function (template, model, moduleId) {
    var data,
        resultErrorMsg = '';

    try {
      if (typeof template === 'string') {
        data = template;
      } else {
        data = model ? template(model.toJSON()) : template();
      }
    } catch (e) {
      resultErrorMsg = $B.prepareErrorTmplMsg(model, moduleId, e);
      log().error(resultErrorMsg);
      data = $B.errorTemplate('Error de templating', [resultErrorMsg]);
      $B.tt.helper.trackErrorTmpl(model, moduleId, e);
    }

    return data;
  };
  /*\
   * $B.setCookie
   [ method ]
   * Sets a cookie with the given name
   > Arguments
   - name (string) name of the cookie to be created
   - value (any) any value, could be object, string, array, etc
   - expire (number) number in milliseconds the cookie will exist
   > Usage
   | $B.setCookie('cookieName', 'any value', 3600)
  \*/


  $B.setCookie = function (name, value, expire) {
    if (expire) {
      var d = new Date();
      d.setTime(d.getTime() + expire);
      expire = '; expires=' + d.toGMTString();
    } else {
      expire = '';
    }

    document.cookie = name + '=' + value + expire + '; path=/';
  };
  /*\
   * $B.getCookie
   [ method ]
   * Gets a cookie with the given name
   > Arguments
   - name (string) name of the cookie
   = (any) Returns cookie value
   *
   = (null) Returns null if there is no cookie with the given name
   > Usage
   | $B.getCookie('cookieName')
  \*/


  $B.getCookie = function (name) {
    var nameEQ = name + '=',
        cookies = document.cookie.split(';'),
        i,
        l = cookies.length,
        cookie;

    for (i = 0; i < l; i += 1) {
      cookie = cookies[i];

      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1, cookie.length);
      }

      if (cookie.indexOf(nameEQ) === 0) {
        return cookie.substring(nameEQ.length, cookie.length);
      }
    }

    return null;
  };
  /*\
   * $B.deleteCookie
   [ method ]
   * Deletes a cookie with the given name
   > Arguments
   - name (string) name of the cookie to be deleted
   > Usage
   | $B.deleteCookie('cookieName')
  \*/


  $B.deleteCookie = function (name) {
    $B.setCookie(name, '', -1);
  };
  /*\
   * $B.getResourcePath
   [ method ]
   * Returns an object with resources paths
   > Arguments
   - view (string) id of the view to get its resources
   - hasClientFlow (boolean) flag to look for clientFlow resources of the view
   = Returns an object
   > Usage
   | $B.getResourcePath('posicion-global', false)
   | // Returns
   | {
   |    id: "posicion-global",
   |    script: "/BBVANet/resources/posicion-global.mvc.js",
   |    tmpl: "/BBVANet/resources/es_posicion-global.tmpl.html"
   | }
  \*/


  $B.getResourcePath = function (view, hasClientFlow) {
    var path = $B.staticPath + '/tmpl/',
        fileName = view.replace(/\_/g, '.'),
        moduleId = fileName;

    if (hasClientFlow) {
      fileName = fileName + '.clientflow';
    }

    return {
      id: moduleId,
      script: path + fileName + '.mvc.js',
      tmpl: path + $B.tmplPrefix + fileName + '.tmpl.html?' + $B.version,
      flow: path + fileName + '.flow.json?' + $B.version
    };
  };
  /*\
   * $B.getFucCoordinates
   [ method ]
   * Returns the coordinates according to the 'fuc' code
   > Arguments
   - code (string) The code "fuc"
   - [callback] (function) the message to be displayed in the confirm dialog
   > Usage
   | $B.getFucCoordinates('000001909', function (data) {
   | });
  \*/


  $B.getFucCoordinates = function (code, callback) {
    if (typeof code !== 'string') {
      throw new TypeError($B.app.literals.coreLiterals.fuc_must_be_string);
    }

    var url = 'csapi?fuc=$fuc'.replace(/\$fuc/, code),
        resp,
        xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resp = JSON.parse(xhr.responseText);
        } else if (xhr.status === 500) {
          resp = null;
        }

        if (typeof callback === 'function') {
          callback(resp);
        }
      }
    };

    xhr.open('GET', url, true);
    xhr.send(null); // Return the XMLHttpRequest object just in case
    // we would want to cancel the operation, etc...

    return xhr;
  };

  $B.getGeolocationByOffice = function (office, callback) {
    if (typeof office !== 'string') {
      throw new TypeError($B.app.literals.coreLiterals.office_must_be_string);
    }

    $.ajax('csapi?oficina=' + office, {
      data: {},
      error: function error() {
        $B.errorGenerico('ERROR', $B.app.literals.coreLiterals.hubo_un_error);
      },
      success: function success(data) {
        if (callback && typeof callback === 'function') {
          callback(data);
        }
      }
    });
  };
  /*\
   * $B.showConfirm
   [ method ]
   * Shows a confirm dialog when closing the 'application'
   * given the passed arguments
   > Arguments
   - value (boolean) flag indicating if we should or shouldn't show this confirm dialog
   - message (string) the message to be displayed in the confirm dialog
   > Usage
   | $B.showConfirm(true, 'Are you sure you want to quit?')
  \*/


  $B.showConfirm = function (value, message) {
    var callback = function callback() {
      if (value) {
        return message;
      }

      return null;
    };

    window.onbeforeunload = callback;
  }; // subscribe to the 'showConfirm' event
  // and bind it to $B.showConfirm handler
  // publish with
  // $.publish('showConfirm', true, 'Are you sure?');


  $.subscribe('showConfirm', $B.showConfirm);
  /*\
   * Global $.ajaxError handler
  \*/

  $('body').ajaxError(function (e, jqxhr, settings, exception) {
    var msg;

    if (settings.url !== $B.dynPath + 'viewClientLog') {
      msg = '\nError [AJAX]:\n' + 'Request Url: ' + settings.url + ' \n' + 'Error message: ' + exception + ' \n' + 'From: ' + window.location.href + ' \n' + 'XHR: ' + JSON.stringify(jqxhr);
      log().error(msg);
    }
  });
  /*\
   * $B.errorTemplate
   [ method ]
   * Returns an HTML string used for error templates
   > Arguments
   - title (string) Title for this error
   - description (string) Description for this error
   - showButton (boolean) Flag indicating whether to display a button (to close this error 'div')
   - buttonDataAttribute (string) The value of the 'data' attriute for the button
   > Usage
   | $B.errorTemplate('Error 500', 'Something went wrong', false)
  \*/

  $B.errorTemplate = function (title, description, showButton, buttonDataAttribute, viewCid) {
    var template, $template;

    if (title === 'ERROR_SERVICIO' || title === 'ERROR_VALIDACION') {
      title = $B.app.literals.coreLiterals.error;
    }

    template = _.c_v07_mensajes_errorAplicacion({
      titulo: title || $B.app.literals.coreLiterals.error,
      descripcion: description || $B.app.literals.coreLiterals.error_inesperado,
      exception: showButton || false,
      viewCid: viewCid || null,
      dataAttr: buttonDataAttribute || null,
      showButton: showButton || false
    });
    template = '<div>' + template + '</div>';
    $template = $(template);
    return $template.html();
  };

  $B.validationErrorTemplate = function (data) {
    // si no llega array de descripciones, lo eliminamos para mostrar el mensaje por defecto
    if (_.isUndefined(data.descriptions) || _.isNull(data.descriptions)) {
      delete data.descriptions;
    }

    return _.c_mensajes_alerta_servervalidation(data);
  };

  $B.warningTemplate = function (data) {
    return _.c_mensajes_alerta_aviso(data);
  };
  /*\
   * $B.reloadSpi
   [ method ]
   * Reload the spi
   > Arguments
   > Usage
   | $B.reloadSpi()
  \*/


  $B.reloadSpi = function () {
    var hash = document.location.hash;

    if (hash.length > 1) {
      window.location.href = $B.reloadAppUrl + '=' + hash.substring(1) + hash;
    } else {
      window.location.href = $B.reloadAppUrl;
    }
  };
  /*\
   * $B.showLoading
   [ method ]
   * Returns an HTML string used for 'loading messages'
   > Arguments
   - text (string) Text of the loading message (optional, defaults to 'Cargando')
   > Usage
   | $B.showLoading('Cerrando')
  \*/


  $B.showLoading = function (text) {
    return _.c_v06_mensajes_cargando({
      text: text || $B.app.literals.cargando,
      image: 'preload_general_mini.gif'
    });
  }; // preparativos antes de iniciar la navegacion


  $B.prepareToTryToNavigateTo = function () {
    /*$B.ui.fixedHeader.goTop();*/
    $B.showNavigateLoading();
    $B.resetBuscador(); // Se limpia el cacheo de colores de graficos

    $B.ui.GraphicChartsColors = {};
  }; // muestra v.modal de loading


  $B.showNavigateLoading = function (loadingClass, loadingOverlayClass) {
    $B.ui.navigationLoading.show({
      loadingClass: loadingClass || 'loading-navigation',
      overlayClass: loadingOverlayClass || 'ui-widget-overlay-mensaje-cargando'
    });

    if (!$B.initialLoading && ($B.errorInInitialStaticLoad || $B.initialStaticLoad)) {
      $B.errorInInitialStaticLoad = false;
      $B.initialStaticLoad = false;
    }
  }; // oculta v.modal de loading


  $B.hideLoading = function (loadingClass) {
    $B.ui.navigationLoading.hide({
      loadingClass: loadingClass || 'loading-navigation'
    });
    $B.initialLoading = false;
  }; // limpia posibles valores del buscador


  $B.resetBuscador = function () {
    $('#ph_menu').removeClass('buscadorDesplegado').find('#buscadorGeneral input[type="text"]').val('');
  }; // se encarga de comprobar que se han ocultado las modales, ejecutar preparativos e invocar al callback pasado


  $B.checkModalClosedAndExecNavigation = function (data) {
    var callbackFn,
        callbackArgs,
        callbackContext,
        _checker,
        invalidDataParameters = function () {
      return !data || !data.callback && (!_.isFunction(data.callback) || !_.isFunction(data.context[data.callback]));
    }();

    if (invalidDataParameters) {
      return;
    }

    callbackContext = data.context;
    callbackFn = _.isObject(callbackContext) && _.isString(data.callback) ? callbackContext[data.callback] : data.callback;
    callbackArgs = data.params;

    _checker = function checker() {
      if (!$('.ui-widget-overlay:visible, [role=dialog]:visible')[0]) {
        $B.prepareToTryToNavigateTo();
        callbackFn.apply(null, callbackArgs);
      } else {
        $B.hideLoading();
        setTimeout(function () {
          _checker();
        }, 0);
      }
    };

    _checker();
  }; // Subscribe to the 'updateUrl' event


  $.subscribe('updateUrl', function (e, fragment) {
    if (fragment) {
      Backbone.history.navigate(fragment, {
        trigger: false
      });
    }
  });
  /*\
   * $B.subscribes
   [ method ]
   * Anade suscripciones a un objeto
   > Arguments
   - viewSubscribes (object) objeto que, organizado como events, nos indica el evento y la funcion asociada, como Function o String (ej: { 'evento' : 'nombreFuncionVista' })
   - view (object) la vista que contiene la funcion asociada al evento (inidicado en el objeto anterior)
   > Usage
   | $B.subscribes(this.subscribes, this);
  \*/

  $B.subscribes = function (viewSubscribes, view) {
    var event = null;

    for (event in viewSubscribes) {
      if (viewSubscribes.hasOwnProperty(event)) {
        if (_.isFunction(viewSubscribes[event])) {
          $.subscribe(event, _.bind(viewSubscribes[event], view));
        } else if (_.isFunction(view[viewSubscribes[event]])) {
          $.subscribe(event, view[viewSubscribes[event]]);
        }
      }
    }
  };
  /*\
   * $B.checkViewOptions
   [ method ]
   * Checks the options object of a given Backbone.View to make
   * sure some of the default options can't be over written
   > Arguments
   - options (object) An object (hash) reprensenting a Backbone.View's options hash
   > Usage
   | $B.checkViewOptions(someView.options);
  \*/


  $B.checkViewOptions = function (options) {
    var excludes = ['initialize', 'render', 'loadPage', 'pageLoaded'],
        i,
        l = excludes.length,
        option = null;

    if (options && _typeof(options) === 'object' && !_.isArray(options)) {
      for (option in options) {
        if (options.hasOwnProperty(option)) {
          for (i = 0; i < l; i += 1) {
            if (option === excludes[i]) {
              option = null;
            }
          }
        }
      }

      return options;
    }
  };
  /*\
   * $B.checkModelAttributes
   [ method ]
   * Checks if attributes are present in a given model's attribute
   > Arguments
   - attributes (array) An array of attribute names to check against
   - model (Backbone.Model) The Backbone.Model to check against
   > Usage
   | $B.checkModelAttributes(['name', 'email'], someModel);
  \*/


  $B.checkModelAttributes = function (attributes, model) {
    if (_.isArray(attributes)) {
      var i,
          l = attributes.length,
          attr;

      for (i = 0; i < l; i += 1) {
        attr = attributes[i];

        if (!model.get(attr)) {
          return false;
        }
      }

      return true;
    }
  };
  /*\
   * Global scroll handler
  \*/


  $(window).scroll(function (ev) {
    $.publish('scroll:window', [ev]);
  });
  $B.signature = {
    viewStates: ['mostrarFormularioClaveOperaciones', 'mostrarFormularioClaveOTP', 'mostrarFormularioClaveSMS', 'mostrarFormularioToken', 'mostrarFormularioClavePasscode', 'mostrarAppletFirma'],
    eventsId: ['comprobarClaveOTP', 'comprobarClaveSMS', 'comprobarToken', 'comprobarClavePasscode', 'validarDesafioFirmado'],
    checkEventId: function checkEventId(eventIdToCheck) {
      return _.find(this.eventsId, function (eventId) {
        return eventId === eventIdToCheck;
      });
    },
    checkViewStateId: function checkViewStateId(viewStateToCheck) {
      return _.find(this.viewStates, function (viewState) {
        return viewState === viewStateToCheck;
      });
    },
    evaluarMetodoFirmaSegundoNivel: function evaluarMetodoFirmaSegundoNivel(view) {
      // es verdadero cuando hay mas de un nivel de firma
      // y ninguno de ellos es dnie
      if (view.methods.length > 1) {
        return true;
      } // tb es verdadero si hay mas de un metodo de firma de segundo nivel


      if (view.methods2Lv.length > 1) {
        return true;
      }

      return false;
    },
    setEventId: function setEventId(view, doReturn) {
      var eventId;
      this.setSimpleMethods(view);

      if (view.model.get('mostrarInformacionInterviniente') && !view.methods[0]) {
        eventId = 'evaluarMetodoAccesoOtroInterviniente'; //      } else if (this.evaluarMetodoFirmaSegundoNivel(view)) {
        //        eventId = 'evaluarMetodoFirmaSegundoNivelSeleccionado';
      } else {
        switch (view.methods[0]) {
          case 'DNI_ELECTRONICO':
            eventId = 'generarDesafioDNIe';
            break;

          case 'CLAVE_OPERACIONES':
            eventId = 'comprobarClaveOperaciones';
            break;

          case 'CLAVE_ACCESO':
            eventId = 'comprobarClaveAcceso';
            break;

          case 'SOLO_OTP':
            eventId = 'comprobarClaveOTP';
            break;

          case 'SOLO_OTP_SEGUNDO_FACTOR':
            eventId = view.model.get('evolutivoEliminacionClaveOperaciones') ? 'comprobarClaveOTP' : 'comprobarClaveSMS';
            break;
        }
      }

      if (!doReturn) {
        // seteamos el data-eventid del form con el apropiado
        view.$('form').data('eventid', eventId).attr('data-eventid', eventId);
      } else {
        return eventId;
      }
    },
    clearMethods: function clearMethods(view) {
      delete view.methods;
    },
    setSimpleMethods: function setSimpleMethods(view) {
      if (!view.methods) {
        view.methods = [];
      }

      view.methods = function () {
        if (view.methods.length > 0 && !view.model.get('mostrarInformacionInterviniente')) {
          return view.methods;
        }

        return _.pluck(view.model.get('metodosFirmaPrimerNivel'), 'value');
      }(); //es necesario incluir los metodos de segundo nivel para saber si hay que llamar a evaluarMetodoFirmaSegundoNivel


      if (!view.methods2Lv) {
        view.methods2Lv = [];
      }

      view.methods2Lv = view.methods2Lv.length > 0 ? view.methods2Lv : _.pluck(view.model.get('metodosFirmaSegundoNivel'), 'value');
    },
    dom_toggleDisableState: function dom_toggleDisableState(ev) {
      ev.stopPropagation();
      $B.ui.changevisibility(ev);
      $B.ui.dialogCenter();
    },
    setApperance: function setApperance(view) {
      var dataAttr;

      if ($B.app.SingleStepView) {
        dataAttr = 'claves-' + (view instanceof $B.app.SingleStepView ? 'pastilla' : 'pasos');
      } else {
        dataAttr = 'claves-pasos';
      }

      view.$el.attr('data-' + dataAttr, true);
      view.$el.data(dataAttr, true);
    },
    checkSecondLevelMethodsAssociated: function checkSecondLevelMethodsAssociated(view, $associatedDomMethod) {
      var secondLevelMethods = view.model.get('metodosFirmaSegundoNivel');

      if ($associatedDomMethod[0] && secondLevelMethods !== null && secondLevelMethods.length <= 1) {
        $associatedDomMethod.find('input[name=indiceMetodoFirmaSegundoNivelSeleccionado]').click();
      }
    },
    dom_prepareDomMethods: function dom_prepareDomMethods(view) {
      this.setSimpleMethods(view);

      if (view.methods.length) {
        // Si hay 3 metodos de firma de segundo nivel, se pone la clase tresBotones al contenedor
        var listSecondLevelMethods = view.model.get('metodosFirmaSegundoNivel');

        if (listSecondLevelMethods !== null && listSecondLevelMethods.length === 3) {
          $('.jsFirmasSegundoNivel').addClass('tresBotones');
        }
      } else if (!view.model.get('mostrarInformacionInterviniente')) {
        view.$('.contenedorPaso').html($B.errorTemplate('ERROR', $B.app.literals.error_no_metodos_firma, true, null, view.options.parentViewCid));
        $B.utils.aria.alertDialog(view.$('.contenedorPaso'));
      }

      if ($('.c-botones-seleccion:visible').length) {
        $B.utils.aria.switcher({
          element: $('.c-botones-seleccion:visible'),
          tabs: 'li',
          tabsChildren: 'label',
          selected: 'label.checked',
          id: 'switcher-botones-seleccion'
        });
      }
    },
    dom_initStatus: function dom_initStatus(view) {
      this.setSimpleMethods(view); // Si hay menos de 2 metodos de firma de segundo nivel se oculta

      var listSecondLevelMethods = view.model.get('metodosFirmaSegundoNivel');

      if (listSecondLevelMethods && listSecondLevelMethods.length < 2) {
        $('.jsFirmasSegundoNivel .c-botones-seleccion').hide();
      }
    }
  }; //OBJETO DE FIRMA CON DNIe

  $B.DNIe = {
    DNIeTimeout: 2000,
    _counterAppletReady: 0,
    _secondsTryingCheckingAppletReady: 60,
    _checkingApplet: false,
    alreadyLaunchedApplet: false,
    getApplet: function getApplet() {
      return this.view.$('#idApplet')[0] || {};
    },
    appletInitialize: function appletInitialize(view) {
      this._setViewParameters(view);

      this._counterAppletReady = 0;

      this._checkAppletReady();
    },
    launchApplet: function launchApplet() {
      if (this.alreadyLaunchedApplet === false) {
        this.getApplet().launch();
        this.alreadyLaunchedApplet = true;
        this.appletCheckDone();
      }
    },
    appletCheckDone: function appletCheckDone() {
      var self = this,
          applet = self.getApplet(),
          dseventdone = _.isObject(applet) && applet.dseventdone();

      if (dseventdone) {
        self._checkingApplet = false;

        self._proccessResponse();
      } else {
        self._checkingApplet = true;
        setTimeout(function () {
          self.appletCheckDone();
        }, self.DNIeTimeout);
      }
    },
    appletCorrect: function appletCorrect() {
      var self = this;
      this.alreadyLaunchedApplet = false;
      self.viewModel.save({
        desafio: self.getApplet().output(),
        userCertificate: self.getApplet().getCertificate(),
        _eventId: 'validarDesafioFirmado'
      }, {
        error: function error(model, resp) {
          var jsonResp = resp.operacionResultado ? resp : $.parseJSON(resp.responseText);

          self._showServerError(jsonResp.operacionResultado, jsonResp.operacionMensaje);
        },
        success: function success(model, resp) {
          if (_.isFunction(self.view.DNIe_customSuccess)) {
            self.view.DNIe_customSuccess(model, resp);
          } else {
            $(self.view.$('[data-error-applet]')[0] || self.view.$('.c-mensajes-alerta_R2')[0]).remove();
            self.view.model.set(model.attributes);

            if (_.isFunction(self.view.processDNIeSignedCorrectly)) {
              self.view.processDNIeSignedCorrectly();
            }
          }
        },
        validationError: function validationError(model, resp) {
          self._showServerError(resp.operacionResultado, resp.operacionMensaje);
        }
      });
    },
    appletError: function appletError() {
      var errorTitle,
          errorMsg,
          self = this;

      try {
        errorMsg = $B.app.literals.appletDnie[self.getApplet().getError()];
        errorTitle = 'ERROR';
      } catch (e) {
        errorMsg = $B.app.literals.appletDnie.updateJava;
        errorTitle = $B.app.literals.appletDnie.aviso;
      }

      self.alreadyLaunchedApplet = false;

      self._showAppletError(errorTitle, errorMsg);
    },
    _checkAppletReady: function _checkAppletReady() {
      var self = this;
      setTimeout(function () {
        function isAppletReady() {
          var dseventready = function dseventready() {
            try {
              return self.getApplet().dseventready();
            } catch (e) {
              return false;
            }
          };

          return dseventready();
        }

        function isOnTime() {
          return self._counterAppletReady < self._secondsTryingCheckingAppletReady / 2;
        }

        self._counterAppletReady += 1;

        try {
          if (isAppletReady()) {
            self.launchApplet();
          } else if (isOnTime()) {
            self._checkAppletReady();
          } else {
            self.appletError();
          }
        } catch (e) {
          if (isAppletReady()) {
            self._checkAppletReady();
          } else if (!self.alreadyLaunchedApplet && isOnTime()) {
            self.appletError();
          }
        }
      }, self.DNIeTimeout);
    },
    _proccessResponse: function _proccessResponse() {
      var appletResult = this.getApplet().getError() || false;

      if (appletResult === 'ERR00') {
        this.appletCorrect();
      } else {
        this.appletError();
      }
    },
    _showServerError: function _showServerError(title, description) {
      var $wrapper = $(this.view.$('.c-form-claveOperacionesFM')[0] || this.view.$('.contenedorPaso')[0]);
      $wrapper.children('*:not(.btnCierre)').remove();
      $wrapper.append($B.errorTemplate(title, description));
    },
    _showAppletError: function _showAppletError(title, description) {
      var self = this,
          $wrapper = $(this.view.$('.jsFirmasSegundoNivel')[0] || this.view.$('.contenedorPaso')[0]),
          $containerErrorAndRetryButton = $($wrapper.find('[data-error-applet]')[0] || $wrapper.append('<div data-error-applet class="contenedorPaso"></div>').find('[data-error-applet]')[0]),
          content = $B.validationErrorTemplate({
        title: title,
        descriptions: [description]
      }) + _.template($('#tmpl_reintentarAppletDNIe').html(), self.viewModel.toJSON()); // ocultamos las capas sobrantes


      self._toggleVisibilityOnErrorApplet('hide'); // incluimos el mensaje de error y el boton de reintentar


      $wrapper.before($containerErrorAndRetryButton.html(content)); // bindeamos el click en el boton reintentar para que reinicie el applet

      self.view.$('[data-reintentar-firma-dnie]').on('click', function () {
        // destruimos tanto capa de error como boton
        $containerErrorAndRetryButton.remove(); // mostramos las capas necesarias

        self._toggleVisibilityOnErrorApplet('show'); // iniciamos el applet nuevamente


        self._counterAppletReady = 0;
        setTimeout(function () {
          self._checkAppletReady();
        }, self.DNIeTimeout);
      });
    },
    _toggleVisibilityOnErrorApplet: function _toggleVisibilityOnErrorApplet(type) {
      var self = this,
          $loadingAndInfoRetryLayers = self.$loadingAndInfoRetryLayers || self.view.$('[data-firmadnie-loading], .moduloFirma.dnie, [data-applet]'),
          $wrapperMultipleOptionFirsLevel = self.$wrapperMultipleOptionFirsLevel || self.view.$('.moduloFirma.dnie').closest('.jsFirmasSegundoNivel'),
          $applet = $loadingAndInfoRetryLayers.find('applet');
      self.appletContainer = self.appletContainer || $applet.parent();
      self.appletTag = self.appletTag || $applet;

      if (!type) {
        return;
      }

      if (type === 'hide') {
        $loadingAndInfoRetryLayers.hide();
        $applet.remove();

        if ($wrapperMultipleOptionFirsLevel[0]) {
          $wrapperMultipleOptionFirsLevel.hide();
        }
      } else if (type === 'show') {
        try {
          $loadingAndInfoRetryLayers.show();
          self.appletContainer.html(self.appletTag);

          if ($wrapperMultipleOptionFirsLevel[0]) {
            $wrapperMultipleOptionFirsLevel.show();
          }
        } catch (e) {
          self.appletError();
        }
      }
    },
    _setViewParameters: function _setViewParameters(view) {
      this.view = view;
      this.viewModel = _.extend({}, view.model);
    }
  }; //Objeto para inyectar el applet del DNIe en cualquier vista con un contenedor para alojar caulquier posible error

  $B.DNIeCustom = function (DNIeObj) {
    var overrideMethods,
        customMethods,
        selectorWrapperError = '[data-dniemodule-error]',
        selectorWrapperApplet = '[data-dniemodule-container]';

    if (!_.isObject(DNIeObj)) {
      return;
    }

    overrideMethods = {
      _showAppletError: function _showAppletError(title, description) {
        var self = this,
            $wrapperError = $(selectorWrapperError),
            $wrapperApplet = $(selectorWrapperApplet),
            content = $B.validationErrorTemplate({
          title: title,
          descriptions: [description]
        }) + _.template($('#tmpl_reintentarAppletDNIe').html(), self.viewModel.toJSON()); // ocultamos las capas sobrantes


        $wrapperApplet.hide(); // incluimos el mensaje de error y el boton de reintentar

        $wrapperError.html(content); // bindeamos el click en el boton reintentar para que reinicie el applet

        self.view.$('[data-reintentar-firma-dnie]').off('click').on('click', function () {
          // destruimos tanto capa de error como boton
          $wrapperError.empty(); // mostramos las capas necesarias
          // renderizar de nuevo el applet

          $wrapperApplet.show(); // iniciamos el applet nuevamente

          self._counterAppletReady = 0;

          self._checkAppletReady();
        });
      }
    };
    customMethods = {
      init: function init(view) {
        var self = this,
            content,
            params,
            $wrapper;
        self.$el = $wrapper = view.$(selectorWrapperApplet);
        content = _.template($('#tmpl_pantalla_intermedia_applet_dnie').html());
        $wrapper.html(content);
        view.$('[data-firma-btnenviar]').off('click').on('click', function () {
          params = {
            keyStoreCertificados: view.model.get('keyStoreCertificados'),
            desafio: view.model.get('desafio'),
            mostrarInformacionInterviniente: false
          };
          $wrapper.html(_.tmpl('#tmpl_mostrarAppletFirma', params));
          self.appletInitialize(view);
        });
      }
    };
    return _.extend({}, DNIeObj, overrideMethods, customMethods);
  }($B.DNIe);

  $B.checkContentHeightDialogs = {
    ultimoHeight: 0,
    isActiveInterval: false,
    frequency: 100,
    domModalSelector: '.contenidoModal:visible',
    init: function init() {
      var modalInterval,
          self = this,
          checkModalHeight,
          removeInterval,
          posScroll,
          initInterval;

      if (self.isActiveInterval) {
        return false;
      }

      initInterval = function initInterval() {
        modalInterval = setInterval(checkModalHeight, self.frequency);

        if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
          posScroll = $('body').scrollTop();
          $('body').scrollTop(0);
          $('body >.c-estructural-pie').hide();
          $('body >.container_24').hide();
        }

        return true;
      };

      removeInterval = function removeInterval() {
        self.ultimoHeight = 0;
        clearInterval(modalInterval);

        if ($B.appConfig.enableTabletFeatures && $B.capabilities.touch) {
          $('body >.c-estructural-pie').show();
          $('body >.container_24').show();
          $('body').scrollTop(posScroll);
        }

        return false;
      };

      checkModalHeight = function checkModalHeight() {
        if ($(self.domModalSelector)[0]) {
          var heightActual = function () {
            return $('.scrollable.scrollableModal').children().filter(function (i, item) {
              item = $(item);

              if (item.is(':visible') && item.height() > 0) {
                return item;
              }
            }).height();
          }();

          if (heightActual !== self.ultimoHeight || !$B.ui.dialogHasSecureHeight()) {
            $B.ui.dialogCenter();
          }

          self.ultimoHeight = heightActual;
        } else {
          self.isActiveInterval = removeInterval();
        }
      };

      if ($(self.domModalSelector)[0]) {
        self.isActiveInterval = initInterval();
      } else {
        self.isActiveInterval = removeInterval();
      }
    }
  };

  $B.switchOperativa = function () {
    var self = this,
        ocultarPaso = function ocultarPaso($el) {
      var $contenedorOperativas = $el.closest('div[data-switchOperativa]'),
          $modal = $el.closest('.ui-dialog'); // restaurar el titulo

      $modal.find('.headerModal h1').text($contenedorOperativas.attr('data-tituloAnterior')); // mostrar el contenido anterior y eliminar el abierto

      $contenedorOperativas.parent().children().show();
      $contenedorOperativas.remove(); // volver a mostrar el boton de cerrar original

      $modal.find('.cerrarModal').eq(1).remove();
      $modal.find('.cerrarModal').eq(0).show();
    },
        duplicarBotonCerrar = function duplicarBotonCerrar($el) {
      var $modal = $el.closest('.ui-dialog'),
          $botonCerrar = $modal.find('.cerrarModal'),
          $newBotonCerrar; // duplicar el boton de cerrar y ocultarlo

      $botonCerrar.parent().append($botonCerrar.clone());
      $botonCerrar.hide(); // quitarle el atributo de cerrar y ponerle un atributo para referenciarlo desde el dom

      $newBotonCerrar = $modal.find('.cerrarModal').eq(1);
      $newBotonCerrar.removeAttr('data-dialog-close');
      $newBotonCerrar.attr('data-switchOperativa', 'si'); // poner eventos de click

      $newBotonCerrar.off('click');
      $newBotonCerrar.on('click', function () {
        ocultarPaso($el.find('[data-switchOperativa=si]'));
      });
    },
        mostrarPaso = function mostrarPaso(selectorContenedor, url) {
      var $el, tituloAnterior, capaAutoloadHTML, $trower; // contenedor donde se realiza el cambio

      $el = $(selectorContenedor); // guardar el tirulo de la modal ya que se modifica desde la nueva operativa abierta

      tituloAnterior = $(selectorContenedor).closest('.ui-dialog').find('.headerModal h1').text(); // crear un nuevo contenedor para la nueva operativa
      // data-switchOperativa para poder buscar via dom la capa
      //  data-tituloAnterior para gaurdar el titulo que tenia la modal antes del cambio

      capaAutoloadHTML = $('<div>', {
        'data-autoload': url,
        'data-switchOperativa': 'si',
        'data-tituloAnterior': tituloAnterior
      }); //ocultar el contenido del paso

      $el.children().hide(); // crear una capa con el div autoload

      $el.append(capaAutoloadHTML);
      $trower = jQuery('div[data-autoload="' + url + '"]');
      $B.app.AppView.prototype.prepareAutoload($trower); // como el bootn de cerrar cierra la modal pongo un duplicado para intercambiar los contenidos

      duplicarBotonCerrar($el, capaAutoloadHTML);
    };

    self.switchOperativa = function (e, objParam) {
      if (objParam.selectorContenedor && objParam.url) {
        mostrarPaso(objParam.selectorContenedor, objParam.url);
      } else if (objParam.$el) {
        ocultarPaso(objParam.$el);
      }
    };

    self.isSwitchOperativa = function ($el) {
      if ($el.closest('div[data-switchOperativa]').length > 0) {
        return true;
      }

      return false;
    };

    $.subscribe('switchOperativa', self.switchOperativa);
    return self;
  }();
  /* recubrimiento para intervalos */


  (function () {
    function isInDom(el) {
      return $(el).closest('body')[0];
    }

    $B.setLinkedInterval = function (el, interval, fn) {
      var wrapper, intervalId, heartBeat, heartBeatId, applyCallback, callback;

      if (!fn) {
        return;
      }

      applyCallback = function applyCallback() {
        if (_.isObject(fn)) {
          callback = fn.context[fn.fn].apply(fn.context);
        } else if (_.isFunction(fn)) {
          callback = fn;
        }
      };

      heartBeat = function heartBeat() {
        if (!isInDom(el)) {
          clearInterval(intervalId);
          clearInterval(heartBeatId);
        }
      };

      wrapper = function wrapper() {
        if (isInDom(el)) {
          applyCallback();
        } else {
          clearInterval(intervalId);
          clearInterval(heartBeatId);
        }
      };

      intervalId = setInterval(wrapper, interval);
      heartBeatId = setInterval(heartBeat, 1000);
      return intervalId;
    };
  })();

  $B.checkAndPreparePublicRoute = function (route) {
    if ($B.isPublic) {
      return route.split($B.publicPath)[1] ? route : $B.publicPath + route;
    }

    return route;
  };

  $B.getUrlPatternFromModelUrl = function (urlModel) {
    var urlPatternResult = urlModel,
        processedUrlModel = $B.checkAndPreparePublicRoute(urlModel.split($B.dynPath)[1]),
        replaceParams = function replaceParams(urlRegExp) {
      var params = urlRegExp.exec(processedUrlModel),
          url = params[0];

      _.each(params, function (param) {
        if (url !== param) {
          url = url.replace('/' + param, '/*');
        }
      });

      return url;
    },
        routeExistRegExp = $B.router.routeExists(processedUrlModel);

    if (routeExistRegExp) {
      urlPatternResult = replaceParams(routeExistRegExp);
    }

    return urlPatternResult;
  };
  /**
   * Obtiene las templates mergeadas adicionales en modo comprimido si $B.mergedTmpl esta definido
   * @param {Boolean} async True para instancia XHR asincrona. Default False
   */


  $B.getMergedTmpl = function () {
    var tries = 0;
    return function getMergedTmpl(async) {
      if ($B.mergedTmpl) {
        // performs a sync XHR (not AJAX)
        $.ajax({
          url: $B.mergedTmpl,
          type: 'GET',
          async: async || false,
          timeout: 7000,
          dataType: 'html',
          data: $B.version,
          success: function success(data) {
            if ($B.mergedTmpl) {
              $(document.body).append(data);
              $B.mergedTmpl = false;
            }
          },
          error: function error() {
            if ($B.mergedTmpl) {
              // "timeout", "error", "abort", and "parsererror"
              if (tries < 3) {
                tries += 1;
                getMergedTmpl();
              } else {
                $B.mergedTmpl = false;
              }
            }
          }
        });
      }
    };
  }();
  /**
   * Ejecuta la funcion pasada como parametro asegurandose de que esta cargada la API de gmaps
   * @param {function} funcion a ejecutar
   */


  $B.gmaps = function () {
    var stack = [];

    function checkGmapsAndApplyCallback(data) {
      var loadGmap = function loadGmap() {
        require(['async!https://maps.googleapis.com/maps/api/js?v=3.7&client=gme-bbva&sensor=false&channel=bbvanet'], function () {
          require(['order!bbva.tlgo.map', 'order!libs/infobox'], function () {
            if (!$B.google && _.isArray(stack)) {
              $B.google = true;
              $.when(_.each(stack, function (o) {
                o.callbackFn.apply(o.callbackContext, o.callbackArgs);
              })).done(function () {
                stack = null;
              });
            }
          });
        });
      },
          callbackContext = data.context,
          callbackFn = _.isObject(callbackContext) && _.isString(data.callback) ? callbackContext[data.callback] : data.callback,
          callbackArgs = data.params || [],
          invalidDataParameters = function () {
        return !data || !data.callback && (!_.isFunction(data.callback) || !_.isFunction(data.context[data.callback]));
      }();

      if (invalidDataParameters) {
        return;
      }

      if (!$B.google) {
        stack.push({
          callbackFn: callbackFn,
          callbackArgs: callbackArgs,
          callbackContext: callbackContext
        });
        loadGmap();
      } else {
        callbackFn.apply(callbackContext, callbackArgs);
      }
    }

    return checkGmapsAndApplyCallback;
  }();
  /**
   * Obtiene las dependencias adicionales (Google Maps y templates mergeadas)
   * @param {Boolean} async True para instancia XHR asincrona. Default False
   */


  $B.getExtraDeps = function (async) {
    if (!$B.extraDepsLoaded) {
      $.unsubscribe('graphicTuSituacionLoaded');
      $B.extraDepsLoaded = true;
    } // merged templates


    $B.getMergedTmpl(async);
  };
  /**
   * Muestra capa fija en la parte superior de la pantalla indicando que la sesion ha expirado y que debe recargar para poder operar
   */


  $B.showEndSessionWarning = function () {
    var contenidoAviso = $($B.warningTemplate({
      tittle: $B.app.literals.alerta_sesion_expirada + ' <span role="link">' + $B.app.literals.alerta_sesion_expirada_recargar + '</span>.'
    }));
    contenidoAviso.attr('id', 'sesionCaducada').find('.textoGestionable').remove();
    contenidoAviso.find('h1 span').on('click', function () {
      $B.reloadSpi();
    });
    $('body').prepend(contenidoAviso);
    $('.container_24').eq(0).css({
      'padding-top': contenidoAviso.outerHeight() + 'px'
    });
  };

  (function () {
    var injectElementWithStyles = function injectElementWithStyles(rule, callback, nodes, testnames) {
      var style,
          ret,
          node,
          docOverflow,
          mod = 'modernizr',
          docElement = document.documentElement,
          div = document.createElement('div'),
          body = document.body,
          fakeBody = body || document.createElement('body');

      if (parseInt(nodes, 10)) {
        while (nodes) {
          node = document.createElement('div');
          node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
          div.appendChild(node);
          nodes = nodes - 1;
        }
      }

      style = ['&#173;', '<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);

      if (!body) {
        fakeBody.style.background = '';
        fakeBody.style.overflow = 'hidden';
        docOverflow = docElement.style.overflow;
        docElement.style.overflow = 'hidden';
        docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);

      if (!body) {
        fakeBody.parentNode.removeChild(fakeBody);
        docElement.style.overflow = docOverflow;
      } else {
        div.parentNode.removeChild(div);
      }

      return !!ret;
    },
        getTouchCapabilities = function getTouchCapabilities() {
      var bool,
          prefixes = [' ', '-webkit-', '-moz-', '-o-', '-ms-', ' '],
          mod = 'modernizr';

      if (document.hasOwnProperty && document.hasOwnProperty('ontouchstart') || window.hasOwnProperty && window.hasOwnProperty('ontouchstart') || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
      } else {
        injectElementWithStyles(['@media (', prefixes.join('touch-enabled),('), mod, ')', '{#modernizr{top:9px;position:absolute}}'].join(''), function (node) {
          bool = node.offsetTop === 9;
        });
      }

      return bool;
    },
        getFlashSupport = function getFlashSupport() {
      var bool;

      if (typeof navigator.plugins !== 'undefined' && _typeof(navigator.plugins['Shockwave Flash']) === 'object') {
        bool = true;
      } else {
        bool = false;
      }

      return bool;
    };

    if ($B.appConfig.enableTabletFeatures) {
      $B.capabilities.touch = getTouchCapabilities();
      $B.capabilities.flash = getFlashSupport();

      if ($B.capabilities.touch) {
        $('body').addClass('tabletCapabilities');
      }
    }
  })();
})(window, jQuery);
//# sourceMappingURL=bbva.base.js.map
