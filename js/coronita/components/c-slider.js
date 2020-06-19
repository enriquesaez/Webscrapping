// COMPONENT - c-slider
Coronita.clientflow.CSlider = function (userData) {
  var CLASS_SLIDER_HANDLE_ACTIVE = 'c-slider__handle--active';
  var CLASS_SLIDER_DISABLED = 'is-disabled';
  var IS_DRAG_AND_DROP = true;
  var IS_NOT_DRAG_AND_DROP = false;
  var ID_PREFIX = 'c-slider-';
  var EVENT_CHANGE_INPUT = 'change.input';
  var data = {
    valueSliderOld: null
  };

  function calculepercent() {
    var value = Number(data.valueSlider);
    var min = Number(userData.value.min);
    var max = Number(userData.value.max);
    var percent;

    if (value < min) {
      percent = 0;
    } else if (value > max) {
      percent = 100;
    } else {
      percent = 100 * (value - min) / (max - min);
    }

    if (percent < 0) {
      percent = 0;
    } else if (percent > 100) {
      percent = 100;
    }

    return percent;
  }

  function getOffset(el) {
    var rect = el.getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  }

  function handleBarClick(ev) {
    handleSlider(IS_NOT_DRAG_AND_DROP, ev.pageX);
    ev.stopPropagation();
  }

  function handleBarMove(ev) {
    handleSlider(IS_DRAG_AND_DROP, null);
    ev.stopPropagation();
  }

  function handleInputBlur() {
    data.$refs.sliderHandle.classList.remove(CLASS_SLIDER_HANDLE_ACTIVE);
  }

  function handleInputChange() {
    data.valueSlider = data.$refs.input.value;
    data.percent = calculepercent();
    setSlider(EVENT_CHANGE_INPUT);
  }

  function handleInputFocus(ev) {
    data.$refs.sliderHandle.classList.add(CLASS_SLIDER_HANDLE_ACTIVE);
  }

  function handleMouseMove(ev) {
    move(ev.pageX);
  }

  function handleMouseUp(ev) {
    data.$refs.sliderHandle.classList.remove(CLASS_SLIDER_HANDLE_ACTIVE);
    document.removeEventListener('mousemove', handleMouseMove, false);
    document.removeEventListener('mouseup', handleMouseUp, false);
  }

  function handleSlider(isDragAndDrop, pageX) {
    if (isDragAndDrop) {
      data.activeHandle = true;
      data.$refs.sliderHandle.classList.add(CLASS_SLIDER_HANDLE_ACTIVE);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mouseup', handleMouseUp, false);
    } else {
      move(pageX);
    }
  }

  function inputDisable() {
    data.$refs.cSlider.classList.add(CLASS_SLIDER_DISABLED);
    data.$refs.input.setAttribute('disabled', true);
  }

  function inputEnable() {
    data.$refs.input.removeAttribute('disabled');
    data.$refs.cSlider.classList.remove(CLASS_SLIDER_DISABLED);
  }

  function inputGetValue() {
    return data.$refs.input.value;
  }

  function inputSetValue(value) {
    data.valueSlider = Number(value);
    data.percent = calculepercent();
    setSlider('change');
  }

  function isValid() {
    return data.$refs.input.getAttribute('aria-invalid') !== 'true';
  }

  function move(pageX) {
    var offsetWidth = data.$refs.wrapper.offsetWidth;
    var offset = getOffset(data.$refs.wrapper).left;

    if (pageX >= offset && pageX <= offset + offsetWidth) {
      data.percent = parseInt(Math.round((pageX - offset) / offsetWidth * 100));
      data.valueSlider = userData.hasFixedValues ? moveFixed() : moveRegular();
      setSlider('input');
      return true;
    }

    return false;
  }

  function moveRegular() {
    var value = data.percent * (Number(data.$refs.input.max) - Number(data.$refs.input.min)) / 100 + Number(data.$refs.input.min);
    return value;
  }

  function moveFixed() {
    var valueIndex = Math.round((userData.value.fixedValues.length - 1) * data.percent / 100);
    return userData.value.fixedValues[valueIndex];
  }

  function setFixedValues() {
    var fixedValues = Array.from(data.$refs.fixedValues.children);
    var fixedValuesLength = fixedValues.length;
    var maxIndex = fixedValuesLength - 1;
    fixedValues.forEach(function (fixedValue, index) {
      var position = index * 100 / maxIndex;

      if (index > 0 && index < maxIndex) {
        fixedValue.style.left = "".concat(position, "%");
      }
    });
  }

  function setSlider(event) {
    setSliderStep(event);
    data.$refs.input.value = data.valueSlider;
    data.$refs.sliderFill.style.width = data.percent + '%';
    data.$refs.sliderHandle.style.left = data.percent + '%';

    if (event) {
      $('#' + data.$refs.input.id).trigger(event);
    }

    if (data.$refs.sliderTooltip !== null) {
      data.$refs.sliderTooltipContent.innerHTML = data.$refs.input.value + (data.$refs.sliderUnit !== null ? data.$refs.sliderUnit.innerHTML : '');
      data.$refs.sliderTooltip.style.left = data.percent + '%';
      data.$refs.sliderTooltip.style.transform = 'translateX(-50%)';
    }
  }

  function setSliderClosest() {
    return userData.value.fixedValues.reduce(function (prev, curr) {
      return Math.abs(curr - data.valueSlider) < Math.abs(prev - data.valueSlider) ? curr : prev;
    });
  }

  function setSliderStep(event) {
    if (userData.hasFixedValues) {
      setSliderStepFixed(event);
    } else if (userData.value.step) {
      setSliderStepRegular();
    }
  }

  function setSliderStepFixed(event) {
    var value = userData.value;

    if (data.valueSliderOld && event === EVENT_CHANGE_INPUT) {
      var indexValueOld = value.fixedValues.indexOf(data.valueSliderOld);
      var nextValue = data.$refs.input.value > data.valueSliderOld ? 1 : -1;
      data.valueSlider = value.fixedValues[indexValueOld + nextValue];
      data.$refs.input.value = data.valueSlider;
    } else {
      data.valueSlider = setSliderClosest();
    }

    data.valueSliderOld = data.valueSlider;
    data.percent = value.fixedValues.indexOf(data.valueSlider) * 100 / (value.fixedValues.length - 1);
  }

  function setSliderStepRegular() {
    var value = userData.value;
    var length = value.max - value.min;
    data.percent = (data.$refs.input.value - value.min) * 100 / length;
  }

  function validate() {
    uiCoronitaModulesValidation.validate(data.$refs.input.value, userData.validation || {}, $(data.$refs.cSlider));
  }

  function init() {
    var cSlider = document.getElementById("".concat(ID_PREFIX).concat(userData.id));

    if (cSlider) {
      data.$refs = {
        cSlider: cSlider,
        input: cSlider.querySelector('input'),
        wrapper: cSlider.querySelector('[data-coronita-c-slider-wrapper]'),
        slider: cSlider.querySelector('[data-coronita-c-slider-bar]'),
        sliderFill: cSlider.querySelector('[data-coronita-c-slider-bar-fill]'),
        sliderHandle: cSlider.querySelector('[data-coronita-c-slider-bar-handle]'),
        sliderUnit: cSlider.querySelector('[data-coronita-c-slider-unit]'),
        sliderTooltip: cSlider.querySelector('[data-coronita-c-slider-tooltip]'),
        sliderTooltipContent: cSlider.querySelector('[data-coronita-c-tooltip-content]'),
        fixedValues: document.getElementById("c-slider-".concat(userData.id, "-description-text-values"))
      };
      data.valueSlider = userData.value.current;
      data.percent = calculepercent();
      setSlider('change');

      if (data.$refs.input.disabled) {
        return false;
      }

      data.$refs.input.addEventListener('change', handleInputChange, false);
      data.$refs.input.addEventListener('focus', handleInputFocus, false);
      data.$refs.input.addEventListener('blur', handleInputBlur, false);
      data.$refs.slider.addEventListener('mousedown', handleBarClick, false);
      data.$refs.sliderHandle.addEventListener('mousedown', handleBarMove, false);
      uiCoronitaModulesValidation.init($(data.$refs.input), $(cSlider), userData.validation || {});

      if (data.$refs.fixedValues) {
        setFixedValues();
      }
    }
  }

  return {
    disable: inputDisable,
    enable: inputEnable,
    getValue: inputGetValue,
    setValue: inputSetValue,
    init: init,
    isValid: isValid,
    validate: validate
  };
};

Coronita.ui.cSlider = function () {
  function init() {
    $('[data-coronita-c-slider]').each(function (index, item) {
      var fixedValues = $(this).find('[data-layout-fixed-values]').attr('data-layout-fixed-values');
      var $input = $(item).find('input');
      var coronitaCSlider = Coronita.clientflow.CSlider({
        id: $(item).attr('id').replace('c-slider-', ''),
        value: {
          fixedValues: fixedValues ? JSON.parse(fixedValues) : null,
          min: $input.attr('min'),
          max: $input.attr('max'),
          step: $input.attr('step'),
          current: $input.attr('value')
        },
        hasFixedValues: fixedValues ? true : false,
        description: {
          unit: fixedValues ? '€' : null
        }
      });
      coronitaCSlider.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-slider.js.map
