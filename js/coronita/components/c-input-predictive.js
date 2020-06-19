// COMPONENT - c-input-predictive
Coronita.clientflow.cInputPredictive = function () {
  var SELECTOR_HIGHTLIGHTED_TEMPLATE = '#c-coronita-c-input-predictive-listbox-hightlighted';
  var SELECTOR_LISTBOX_TEMPLATE = '#c-coronita-c-input-predictive-listbox';
  var DEFAULT_PREDICION_TYPE = 'listbox';
  var DEFAULT_PREDICION_TIMEOUT = 200;
  var DEFAULT_PREDICION_MIN_LENGTH = 3;
  var DEFAULT_PREDICION_EVENT = 'keyup';
  var KEY_ARROW_UP = 38;
  var KEY_ARROW_DOWN = 40;
  var KEY_ESC = 27;
  var KEY_TAB = 9;
  var KEY_ENTER = 13;
  var ATTR_DATA_LAST_VALUE = 'data-coronita-c-input-predictive-last-value';
  var MOUSE_EVENTS_LISTENER_ADD = true;
  var MOUSE_EVENTS_LISTENER_REMOVE = false;
  return function (userData) {
    var data = {};
    var emptyResults = {
      block: emptyResultsBlock,
      listbox: emptyResultsListbox
    };
    var fillResults = {
      block: fillResultsBlock,
      listbox: fillResultsListbox
    };

    function clickOptionListbox(ev) {
      emptyResults[data.prediction.type]();
      selectOption(ev.currentTarget);
    }

    function emptyResultsBlock() {
      document.getElementById(userData.resultsTargetId).innerHTML = '';
      data.$refs.input.setAttribute('aria-expanded', 'false');
      data.$refs.input.removeAttribute(ATTR_DATA_LAST_VALUE);
      data.$refs.input.removeAttribute('aria-activedescendant');
    }

    function emptyResultsListbox() {
      removeResultsListbox();

      if (data.$refs.results) {
        uiCoronitaComponentsListbox.mouseEventsListener(MOUSE_EVENTS_LISTENER_REMOVE, data.$refs.results, data.$refs.input, emptyResultsListbox);
      }

      data.$refs.input.removeEventListener('keydown', operateListbox);
      data.$refs.input.removeEventListener('click', operateListbox);
      data.$refs.input.setAttribute('aria-expanded', 'false');
      data.$refs.input.removeAttribute(ATTR_DATA_LAST_VALUE);
      data.$refs.input.removeAttribute('aria-activedescendant');
    }

    function fillResultsBlock(results) {
      emptyResultsBlock();
      document.getElementById(userData.resultsTargetId).insertAdjacentHTML('beforeend', _.tmpl('#' + userData.resultsTemplateId, {
        options: results,
        id: userData.id
      }));
    }

    function fillResultsListbox(results, inputValue) {
      var parsedResults = highlightResults(results, inputValue);
      removeResultsListbox(); //data.$refs.results = uiCoronitaComponentsListbox.appendResults(SELECTOR_LISTBOX_TEMPLATE, parsedResults, userData.id);

      data.$refs.results = uiCoronitaComponentsListbox.moveResults(userData.id);
      uiCoronitaComponentsListbox.setPosition(data.$refs.results, data.$refs.cInputPredictive, userData.isLabelOver);
      data.$refs.results.style.display = 'block';
      data.$refs.input.setAttribute('aria-expanded', 'true');
      data.$refs.input.addEventListener('keydown', operateListbox);
      data.$refs.input.addEventListener('click', operateListbox);
      Array.from(data.$refs.results.children).forEach(function (option) {
        option.addEventListener('click', clickOptionListbox);
      });
      uiCoronitaComponentsListbox.mouseEventsListener(MOUSE_EVENTS_LISTENER_ADD, data.$refs.results, data.$refs.input, emptyResultsListbox);
    }

    function highlightResults(results, inputValue) {
      var updatedResults = $.extend(true, [], results);
      /*updatedResults.map(function (result) {
        result.contentHightlighted = result.content.replace(inputValue, document.createRange().createContextualFragment(`<span class="c-input-predictive__mark">{$inputValue}</span>`)).replace(/^\s+|\s+$/g, '');
        result.contentHightlighted = result.content;
        return result;
      });*/

      return updatedResults;
    }

    function getExtendedData() {
      var minLength = userData.prediction.minLength;
      data.prediction = {
        type: userData.prediction.type || DEFAULT_PREDICION_TYPE,
        timeout: userData.prediction.timeout || DEFAULT_PREDICION_TIMEOUT,
        minLength: minLength || minLength === 0 ? minLength : DEFAULT_PREDICION_MIN_LENGTH,
        action: userData.prediction.action || _.noop,
        event: userData.prediction.event || DEFAULT_PREDICION_EVENT
      };
    }

    function getResults(inputValue) {
      var results = Promise.resolve(data.prediction.action(inputValue));
      results.then(function (response) {
        if (response && response.length > 0) {
          fillResults[data.prediction.type](response, inputValue);
        } else {
          emptyResults[data.prediction.type]();
        }
      });
    }

    function ignoredKeys(ev) {
      return [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_ESC, KEY_TAB, KEY_ENTER].indexOf(ev.keyCode) !== -1;
    }

    function onInputEvent(ev) {
      if (!ignoredKeys(ev)) {
        var timeout;
        var inputValue = ev.currentTarget.value;

        if (inputValue !== data.$refs.input.getAttribute(ATTR_DATA_LAST_VALUE)) {
          if (timeout) {
            clearTimeout(timeout);
          }

          timeout = setTimeout(function () {
            data.$refs.input.setAttribute(ATTR_DATA_LAST_VALUE, inputValue);

            if (inputValue.length >= data.prediction.minLength) {
              getResults(inputValue);
            } else {
              emptyResults[data.prediction.type](data);
            }
          }, data.prediction.timeout);
        }
      }
    }

    function operateListbox(ev) {
      var isExpanded = ev.currentTarget.getAttribute('aria-expanded') === 'true';
      var evIsClick = ev.keyCode === KEY_ENTER || ev.type === 'click';
      var $list = data.$refs.results;
      var $activeOptionAria = $list.querySelector('[aria-selected="true"]');
      var $activeOption = $activeOptionAria || $list.children[0];
      var $activeOptionPrev = $activeOption.previousElementSibling;
      var $activeOptionNext = $activeOption.nextElementSibling;

      if (isExpanded && (evIsClick || ev.keyCode === KEY_ESC || ev.keyCode === KEY_TAB)) {
        emptyResults[data.prediction.type]();
      } else if (isExpanded && ev.keyCode === KEY_ARROW_UP) {
        ev.preventDefault();

        if ($activeOptionPrev) {
          if ($activeOptionPrev.offsetTop < 0) {
            $list.scrollTop = $activeOptionPrev.offsetTop;
          }

          selectOption($activeOptionPrev);
        }
      } else if (isExpanded && ev.keyCode === KEY_ARROW_DOWN) {
        ev.preventDefault();

        if ($activeOptionNext) {
          if ($activeOptionNext.offsetTop > $list.scrollTop) {
            $list.scrollTop = $activeOptionNext.offsetTop;
          }

          selectOption($activeOptionNext);
        }
      }
    }

    function removeResultsListbox() {
      data.$refs.results = uiCoronitaComponentsListbox.moveResults(userData.id, data.$refs.cInputPredictive); //uiCoronitaComponentsListbox.removeResults(userData.id);
    }

    function selectOption($activeOption) {
      if ($activeOption) {
        Array.prototype.filter.call(Array.from($activeOption.parentNode.children), function (child) {
          child.setAttribute('aria-selected', child === $activeOption);
        });
        data.$refs.input.value = $activeOption.getAttribute('data-value');
        uiCoronitaComponentsListbox.checkActiveDescendant(data.$refs.input, data.$refs.results);
        uiCoronitaComponentsListbox.triggerInputChange(data.$refs.input);
        data.$refs.input.focus();
        $.publish('coronita:component:predictive', {
          value: data.$refs.input.value,
          name: data.$refs.input.getAttribute('name')
        });
      }
    }
    /**
     * init method
     * Call template mixin '_.c_coronita_c_input_predictive()' (c_coronita_c_input_predictive.tmpl.html) in the html file
     *
     * @public
     */

    /*****************************/


    function init() {
      getExtendedData(userData);
      var cInputPredictive = document.getElementById('c-input-predictive-' + userData.id);
      data.$refs = {
        cInputPredictive: cInputPredictive,
        input: cInputPredictive.querySelector('input'),
        results: null
      };
      data.$refs.input.addEventListener(data.prediction.event, onInputEvent);
    }

    return {
      init: init,
      search: getResults
    };
  };
}();

Coronita.ui.cInputPredictive = function () {
  function init() {
    $('[data-coronita-c-input="predictive"]').each(function () {
      var cInputPredictive = new Coronita.clientflow.cInputPredictive({
        id: $(this).attr('id').split('c-input-predictive-')[1],
        prediction: {
          minLength: 3,
          action: function action() {
            return [{
              content: 'Fondo 1',
              selected: false
            }, {
              content: 'Fondo 2'
            }, {
              content: 'Fondo 3'
            }, {
              content: 'Lorem ipsum dolor sit'
            }, {
              content: 'Fondo 4',
              selected: true
            }, {
              content: 'Fondo 5'
            }];
          }
        }
      });
      cInputPredictive.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-input-predictive.js.map
