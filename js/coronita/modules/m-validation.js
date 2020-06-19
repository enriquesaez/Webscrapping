Coronita.clientflow.mValidation = function () {
  var SELECTOR_CORONITA_INPUT_DESCRIPTION_M_VALIDATION = '[data-coronita-input-description-m-validation]';
  var SELECTOR_CORONITA_INPUT_DESCRIPTION_TEXT = '[data-coronita-input-description-text]';
  var SELECTOR_CORONITA_INPUT_DESCRIPTION_DESCRIBEDBY = '[data-coronita-input-describedby]';
  var ATTR_CORONITA_INPUT_DESCRIPTION_M_VALIDATION = 'data-coronita-input-description-m-validation';
  var CLASS_IS_INVALID = 'is-invalid';

  function invalid($component, isInvalid, error) {
    var $mValidation = $component.find(SELECTOR_CORONITA_INPUT_DESCRIPTION_M_VALIDATION);
    var hasDescriptionText = $component.find(SELECTOR_CORONITA_INPUT_DESCRIPTION_TEXT).length > 0;
    var $description = $mValidation.closest('[aria-hidden]');
    var $describedBy = $component.find(SELECTOR_CORONITA_INPUT_DESCRIPTION_DESCRIBEDBY);

    if (isInvalid && error) {
      $mValidation.html(_.c_coronita_m_validation({
        id: $mValidation.attr(ATTR_CORONITA_INPUT_DESCRIPTION_M_VALIDATION),
        error: {
          text: error
        }
      }));
    }

    $description.attr('aria-hidden', isInvalid || hasDescriptionText ? 'false' : 'true');

    if (isInvalid || hasDescriptionText) {
      $describedBy.attr('aria-describedby', $description.attr('id'));
    } else {
      $describedBy.removeAttr('aria-describedby');
    }

    $component.toggleClass(CLASS_IS_INVALID, isInvalid).find('[aria-invalid]').attr('aria-invalid', isInvalid ? 'true' : 'false');
  }

  return invalid;
}();

var uiCoronitaModulesValidation = Coronita.clientflow.mValidation;
//# sourceMappingURL=m-validation.js.map
