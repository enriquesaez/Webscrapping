// MODULE - m-share
Coronita.clientflow.mCategorySelector = function () {
  var SELECTOR_CORONITA_M_CATEGORY_SELECTOR = '[data-coronita-m-category-selector]';
  var SELECTOR_CORONITA_M_CATEGORY_TRACK_SELECTOR = '[data-coronita-m-category-selector-track]';
  var SELECTOR_CORONITA_M_CATEGORY_TRACK_ATTR = 'data-coronita-m-category-selector-track';
  var SELECTOR_CORONITA_M_CATEGORY_TRACK_CONTROL_PREVIOUS = '[data-coronita-m-category-selector-control="previous"]';
  var SELECTOR_CORONITA_M_CATEGORY_TRACK_CONTROL_NEXT = '[data-coronita-m-category-selector-control="next"]';
  var CLASS_HIDE_CONTENT = 'hide-content';

  function track($mCategorySelector) {
    var $track = $mCategorySelector.find(SELECTOR_CORONITA_M_CATEGORY_TRACK_SELECTOR);
    var trackWidth = $track.width();
    var $list = $mCategorySelector.find('[role="tablist"]');
    var $listItems = $list.find('[role="tab"]');
    var $controlNext = $mCategorySelector.find(SELECTOR_CORONITA_M_CATEGORY_TRACK_CONTROL_NEXT);
    var $controlPrev = $mCategorySelector.find(SELECTOR_CORONITA_M_CATEGORY_TRACK_CONTROL_PREVIOUS);
    var listItemWidth = $listItems.eq(0).width();
    var listWidth = getListWidth($list);

    function getListWidth($list) {
      return listItemWidth * $listItems.length;
    }

    function setNewPosition(newPosition) {
      $track.attr(SELECTOR_CORONITA_M_CATEGORY_TRACK_ATTR, newPosition);
      $list.css({
        left: newPosition * -1
      });
    }

    function getCurrentPosition() {
      return parseFloat($track.attr(SELECTOR_CORONITA_M_CATEGORY_TRACK_ATTR));
    }

    function trackControls(ev) {
      if (ev.type === 'click' || ev.key === 'Enter') {
        var currentPosition = getCurrentPosition();
        var newPosition;

        if ($(ev.currentTarget).is(SELECTOR_CORONITA_M_CATEGORY_TRACK_CONTROL_NEXT)) {
          newPosition = currentPosition + movementLength;
          newPosition = newPosition > gap ? gap : newPosition;
          trackControlsToggleNext(newPosition);
        } else {
          newPosition = currentPosition - movementLength;
          newPosition = newPosition < 0 ? 0 : newPosition;
          trackControlsTogglePrevious(newPosition);
        }

        setNewPosition(newPosition);
      }
    }

    function trackControlsTogglePrevious(newPosition) {
      $controlPrev.toggleClass(CLASS_HIDE_CONTENT, !(newPosition > 0));
      $controlNext.toggleClass(CLASS_HIDE_CONTENT, newPosition > gap);
    }

    function trackControlsToggleNext(newPosition) {
      $controlNext.toggleClass(CLASS_HIDE_CONTENT, newPosition >= gap);
      $controlPrev.toggleClass(CLASS_HIDE_CONTENT, !(newPosition > 0));
    }

    function trackControlsKeys(ev) {
      if (ev.keyCode === 37 || ev.keyCode === 39) {
        var $target = $(ev.currentTarget);
        var currentPosition = getCurrentPosition();
        var newPosition;

        if (ev.keyCode === 37) {
          newPosition = 0;

          if ($target.prev().length) {
            newPosition = currentPosition - listItemWidth;
            newPosition = newPosition < 0 ? 0 : newPosition;
            $target.prev().focus().click();
          } else {
            newPosition = getListWidth() - gap;
            $listItems.eq($listItems.length - 1).focus().click();
          }
        } else if (ev.keyCode === 39) {
          newPosition = currentPosition;

          if ($target.next().length) {
            newPosition = currentPosition + listItemWidth;
            newPosition = newPosition > gap ? gap : newPosition;
            $target.next().focus().click();
          } else {
            newPosition = 0;
            $listItems.eq(0).focus().click();
          }
        }

        if (trackWidth < listWidth) {
          if (ev.keyCode === 37) {
            trackControlsTogglePrevious(newPosition);
          }

          if (ev.keyCode === 39) {
            trackControlsToggleNext(newPosition);
          }

          setNewPosition(newPosition);
        }
      }
    }

    if (trackWidth < listWidth) {
      $controlNext.removeClass(CLASS_HIDE_CONTENT);
      trackWidth = $track.width();
      listWidth = getListWidth($list);
      var gap = listWidth - trackWidth;
      var movements = Math.floor(gap / trackWidth);
      var movementLength = Math.ceil(gap / movements);
      $controlNext.on('click keyup', trackControls);
      $controlPrev.on('click keyup', trackControls);
    }

    $listItems.on('keyup', trackControlsKeys);
  }

  function toggleTabs(ev) {
    if (ev.type === 'click' || ev.key === 'Enter') {
      $(ev.currentTarget).attr({
        'aria-selected': 'true',
        'tabindex': '0'
      }).siblings().attr({
        'aria-selected': 'false',
        'tabindex': '-1'
      });
      $('#' + $(ev.currentTarget).attr('aria-controls')).attr('aria-hidden', 'false').siblings().attr('aria-hidden', 'true');
    }
  }
  /**
   * init method
   * Call template mixin '_.c_coronita_m_share()' (c_coronita_m_share.tmpl.html) in the html file
   * Call init in *.mvc.js, for example in 'afterRender' method:
   * uiCoronitaModulesShare.init(this.$el);
   * @param $idViewContainer - jquery object container element selector
   * @public
   */


  function init($view) {
    $view.find(SELECTOR_CORONITA_M_CATEGORY_SELECTOR).each(function () {
      $(this).find('[role="tab"]').on('click keyup', toggleTabs);
      track($(this));
    });
  }

  return {
    init: init
  };
}();

Coronita.ui.mCategorySelector = function () {
  function init() {
    Coronita.clientflow.mCategorySelector.init($('body'));
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-category-selector.js.map
