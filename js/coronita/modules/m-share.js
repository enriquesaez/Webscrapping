// MODULE - m-share
Coronita.clientflow.mShare = function () {
  var SELECTOR_CORONITA_M_SHARE = '[data-coronita-m-share]';
  var SELECTOR_CORONITA_M_SHARE_TOOLTIP_COPY = '[data-coronita-c-tooltip]';
  var SELECTOR_CORONITA_M_SHARE_BUTTON = '[data-coronita-m-share-button]';
  var SELECTOR_CORONITA_M_SHARE_INPUT_COPY = '[data-coronita-m-share-input-copy]';
  var shareServices = {
    copy: function copy(content, $mShare) {
      var $mShareInput = $mShare.find(SELECTOR_CORONITA_M_SHARE_INPUT_COPY);
      var $mShareTooltipCopy = $mShare.find(SELECTOR_CORONITA_M_SHARE_TOOLTIP_COPY);

      if ($mShareInput && $mShareInput.select) {
        $mShareInput.select();
        document.execCommand('copy');
        $mShareInput.blur();

        if (!$mShareTooltipCopy.is(':visible')) {
          $mShareTooltipCopy.show().attr('aria-hidden', 'false');
          setTimeout(function () {
            $mShareTooltipCopy.hide().attr('aria-hidden', 'true');
          }, 1000);
        }
      }
    },
    email: function email(content) {
      openShareService('mailto:?Subject=' + content.subject + '&body=' + content.body + '%20' + content.url + content.reference);
    },
    facebook: function facebook(content) {
      openShareService('https://www.facebook.com/sharer.php?u=' + content.url + content.reference);
    },
    twitter: function twitter(content) {
      openShareService('https://twitter.com/intent/tweet?url=' + content.url + content.reference + '&text=' + content.body + '&hashtags=' + content.hashtag);
    }
  };

  function openShareService(url) {
    window.open(url, '_blank');
  }

  function share() {
    var $mShare = $(this);
    var textContent = {
      body: encodeURI($mShare.attr('data-coronita-m-share-body')),
      subject: encodeURI($mShare.attr('data-coronita-m-share-subject')),
      hashtag: $mShare.attr('data-coronita-m-share-hashtag'),
      url: encodeURI($mShare.attr('data-coronita-m-share-url')),
      reference: encodeURIComponent(btoa($mShare.attr('data-coronita-m-share-reference') || ''))
    };
    $mShare.find(SELECTOR_CORONITA_M_SHARE_BUTTON).on('keypress click', function (ev) {
      if (ev.keyCode === 13 || ev.type === 'click') {
        shareServices[$(ev.currentTarget).attr('data-coronita-m-share-button')](textContent, $mShare);
      }
    });
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
    $view.find(SELECTOR_CORONITA_M_SHARE).each(share);
  }

  return {
    init: init
  };
}();

Coronita.ui.mShare = function () {
  function init() {
    Coronita.clientflow.mShare.init($('body'));
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=m-share.js.map
