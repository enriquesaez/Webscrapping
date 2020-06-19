// COMPONENT - c-input-file
Coronita.clientflow.CInputFile = function (userData, uiCoronitaModulesValidation) {
  var FILE_NAME_LENGTH = 18;
  var CLASS_DRAG_ACTIVE = 'is-moving';
  var CLASS_FOCUS_ACTIVE = 'is-active';
  var CLASS_IMAGE_HORIZONTAL = 'c-input-file__preview-image--horizontal';
  var CLASS_IMAGE_VERTICAL = 'c-input-file__preview-image--vertical';
  var data = {};

  function addFile(files) {
    if (!files.length) {
      return;
    }

    var file = files[0];

    if (checkFile(file)) {
      data.fileName = file.name;

      if (userData.modifier === 'image') {
        imageSet(file);
      }

      toggleView();
      setFileName();
      setResetButton();

      if (typeof userData.onCheckedFile === 'function') {
        userData.onCheckedFile(file);
      }
    } else {
      data.$refs.inputFile.value = '';
    }

    data.$refs.inputFile.focus();
  }

  function allowedExtension(extension) {
    if (userData.validation.type.allowed.length) {
      return transverser.get('validation.type.allowed', [])(userData).find(function (e) {
        return e === extension;
      });
    }

    return true;
  }

  function checkFile(file) {
    var valid = true;

    if (userData.validation.size.max && userData.validation.size.max < file.size || userData.validation.size.min && userData.validation.size.min > file.size) {
      emitError(userData.validation.size.error);
      valid = false;
    } else if (!allowedExtension(file.type.split('/')[1])) {
      emitError(userData.validation.type.error);
      valid = false;
    } else {
      emitSuccess();
    }

    return valid;
  }

  function clickReset() {
    ['click', 'keyup'].forEach(function (eventName) {
      data.$refs.resetButton.addEventListener(eventName, onResetInput, false);
    });
  }

  function dragAndDrop() {
    var dropArea = data.$refs.view.querySelectorAll('[data-coronita-c-input-file-drag-and-drop]')[0];
    ['dragenter', 'dragover'].forEach(function (eventName) {
      dropArea.addEventListener(eventName, onDragEnterOver, false);
    });
    dropArea.addEventListener('dragleave', onDragLeave, false);
    dropArea.addEventListener('drop', onDrop, false);
  }

  function onDragEnterOver(ev) {
    if (!data.$refs.inputFile.disabled) {
      ev.preventDefault();
      data.$refs.view.classList.add(CLASS_DRAG_ACTIVE);
    }
  }

  function onDragLeave(ev) {
    ev.preventDefault();
    data.$refs.view.classList.remove(CLASS_DRAG_ACTIVE);
  }

  function onDrop(ev) {
    if (!data.$refs.inputFile.disabled) {
      ev.preventDefault();
      ev.stopPropagation();
      data.$refs.view.classList.remove(CLASS_DRAG_ACTIVE);
      addFile(ev.target.files || ev.dataTransfer.files, data);
    }
  }

  function emitError(error) {
    var callInvalid = uiCoronitaModulesValidation.statusInvalid || uiCoronitaModulesValidation;
    callInvalid(data.$view, true, error);
  }

  function emitSuccess() {
    var callInvalid = uiCoronitaModulesValidation.statusInvalid || uiCoronitaModulesValidation;
    callInvalid(data.$view, false);
  }

  function focusActive() {
    data.$refs.inputFile.onfocus = function (ev) {
      data.$refs.view.classList.add(CLASS_FOCUS_ACTIVE);
    };

    data.$refs.inputFile.onblur = function (ev) {
      data.$refs.view.classList.remove(CLASS_FOCUS_ACTIVE);
    };
  }

  function getFileName() {
    if (!data.fileName) {
      return;
    }

    var ext = data.fileName.split('.')[data.fileName.split('.').length - 1];
    return data.fileName.length < FILE_NAME_LENGTH ? data.fileName : "".concat(data.fileName.substr(0, FILE_NAME_LENGTH), "... ").concat(ext);
  }

  function imageReset() {
    data.$refs.view.querySelector('[data-coronita-c-input-file-image-preview]').innerHTML = '';
  }

  function imageSet(file) {
    var reader = new FileReader();

    reader.onload = function (ev) {
      data.$refs.preview.innerHTML = "<img alt=\"\" src=\"".concat(ev.target.result, "\">");
      var image = data.$refs.preview.querySelector('img');
      var imageClass = image.offsetWidth / image.offsetHeight > 1 ? CLASS_IMAGE_HORIZONTAL : CLASS_IMAGE_VERTICAL;
      image.classList.add(imageClass);
    };

    reader.readAsDataURL(file);
  }

  function isClick(ev) {
    return ev.type === 'click' || [13, 32].indexOf(ev.keyCode) !== -1;
  }

  function onFileChange(ev) {
    addFile(ev.target.files || ev.dataTransfer.files);
  }

  function resetInput() {
    if (data.$refs.inputFile.value !== '') {
      var file = data.$refs.inputFile.files && data.$refs.inputFile.files[0];
      data.$refs.resetButton.setAttribute('aria-label', '');
      data.fileName = '';
      data.$refs.inputFile.value = '';
      resetFileName();
      toggleView();

      if (userData.modifier === 'image') {
        imageReset();
      }

      if (typeof userData.onClearedFile === 'function') {
        userData.onClearedFile(file);
      }
    }
  }

  function onResetInput(ev) {
    if (isClick(ev)) {
      data.$refs.inputFile.focus();
      resetInput();
    }
  }

  function resetFileName() {
    data.$refs.visibleFileName.setAttribute('title', '');
    data.$refs.visibleFileName.textContent = '';
  }

  function setFileName() {
    data.$refs.visibleFileName.setAttribute('title', data.fileName);
    data.$refs.visibleFileName.textContent = getFileName();
  }

  function setResetButton() {
    var resetButtonDefaultText = data.$refs.resetButton.getAttribute('data-coronita-c-input-file-reset');
    data.$refs.resetButton.setAttribute('aria-label', resetButtonDefaultText + ' ' + data.fileName);
  }

  function toggleView() {
    var fileViews = data.$refs.view.querySelectorAll('[data-coronita-c-input-file-view]');
    fileViews[0].classList.toggle('sr-only');
    fileViews[1].classList.toggle('hidden');
  }
  /**
   * init method
   * Call template mixin '_.c_coronita_c_input_file()' (c_coronita_c_input_file.tmpl.html) in the html file
   * @param $view - jquery object container element selector
   * @param data - object options
   * @public
   */


  function init() {
    var refView = document.getElementById("c-input-file-".concat(userData.id));
    data.$view = $(refView);
    data.$refs = {
      view: refView,
      inputFile: document.getElementById("c-input-file-".concat(userData.id, "-input")),
      resetButton: refView.querySelectorAll('[data-coronita-c-input-file-reset]')[0],
      visibleFileName: refView.querySelectorAll('[data-coronita-c-input-file-filename]')[0],
      preview: refView.querySelector('[data-coronita-c-input-file-image-preview]')
    };
    data.$refs.inputFile.addEventListener('change', onFileChange);
    focusActive();
    clickReset();
    dragAndDrop();
  }

  return {
    init: init,
    resetInput: resetInput,
    checkFile: checkFile
  };
};

Coronita.ui.CInputfile = function () {
  function init() {
    var uiCoronitaModulesValidation = function uiCoronitaModulesValidation() {
      return true;
    };

    $('[data-coronita-c-input-file]').each(function (index, item) {
      var coronitaCInputFile = Coronita.clientflow.CInputFile({
        modifier: $(item).is('.c-input-file--image') ? 'image' : null,
        validation: {
          size: {
            max: null,
            min: null
          },
          type: {
            allowed: []
          }
        },
        id: $(item).attr('id').split('c-input-file-')[1],
        inputId: $(item).find('input').eq(0).attr('id')
      }, uiCoronitaModulesValidation);
      coronitaCInputFile.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=c-input-file.js.map
