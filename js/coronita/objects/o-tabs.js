// OBJECT - o-tabs
Coronita.clientflow.oTabs = function () {
  var KEY_SPACE = 32;
  var KEY_ENTER = 13;
  var KEY_END = 35;
  var KEY_HOME = 36;
  var KEY_ARROW_LEFT = 37;
  var KEY_ARROW_RIGHT = 39;
  var KEY_TAB = 9;
  var KEY_DOWN_EVENTS = [KEY_ARROW_LEFT, KEY_ARROW_RIGHT, KEY_HOME, KEY_END];
  var CLASS_ACTIVE = 'is-active';
  var SELECTOR_ACTIVE = ".".concat(CLASS_ACTIVE);
  return function (userData) {
    var data = {};

    function changeTab(tab) {
      tab.focus();

      if (userData.autoloadPanel) {
        selectTab(tab);
        selectPanel(tab);
      }
    }

    function keydownTab(ev) {
      var currentTab = ev.currentTarget;
      var tabs = data.$refs.tabs;

      if (KEY_DOWN_EVENTS.indexOf(ev.keyCode) !== -1) {
        ev.preventDefault();
      }

      if (ev.keyCode === KEY_ARROW_LEFT) {
        changeTab(currentTab.previousElementSibling || Array.from(tabs)[tabs.length - 1]);
      } else if (ev.keyCode === KEY_ARROW_RIGHT) {
        changeTab(currentTab.nextElementSibling || tabs[0]);
      } else if (ev.keyCode === KEY_HOME) {
        changeTab(tabs[0]);
      } else if (ev.keyCode === KEY_END) {
        changeTab(tabs[tabs.length - 1]);
      }
    }

    function clickTab(ev) {
      if (isClick(ev)) {
        var tab = ev.currentTarget;
        ev.preventDefault();
        selectTab(tab);
        selectPanel(tab);
      }
    }

    function isClick(ev) {
      return ev.type === 'click' || [KEY_ENTER, KEY_SPACE].indexOf(ev.keyCode) !== -1;
    }

    function selectPanel(tab) {
      var panelId = tab.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      var previousTab = data.$refs.activeTab;
      var previousPanel = document.getElementById(previousTab.getAttribute('aria-controls'));
      previousTab.classList.remove(CLASS_ACTIVE);
      tab.classList.add(CLASS_ACTIVE);
      data.$refs.activeTab = tab;
      previousPanel.setAttribute('aria-hidden', 'true');
      panel.setAttribute('aria-hidden', 'false');

      if (typeof userData.onChangeTab === 'function') {
        userData.onChangeTab({
          currentTarget: tab
        });
      }
    }

    function selectTab(currentTab) {
      var previousTab = currentTab.parentNode.querySelector('[aria-selected="true"]');
      previousTab.setAttribute('tabindex', '-1');
      previousTab.setAttribute('aria-selected', 'false');
      currentTab.setAttribute('tabindex', '0');
      currentTab.setAttribute('aria-selected', 'true');
    }

    function setActiveTabindex(ev) {
      if (ev.keyCode === KEY_TAB) {
        var tab = ev.currentTarget;
        var currentSelected = data.$refs.activeTab;

        if (tab !== currentSelected) {
          currentSelected.setAttribute('tabindex', '0');
          currentSelected.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '-1');
          tab.setAttribute('aria-selected', 'false');
        }
      }
    }
    /**
     * Init method
     * @public
     */


    function init() {
      var oTabs = document.getElementById("o-tabs-".concat(userData.id));
      data.$refs = {
        oTabs: oTabs,
        tabs: oTabs.querySelector('[role="tablist"]').querySelectorAll('[role="tab"]'),
        activeTab: oTabs.querySelector(SELECTOR_ACTIVE)
      };
      Array.from(data.$refs.tabs).forEach(function (tab) {
        tab.addEventListener('click', clickTab);
        tab.addEventListener('keydown', keydownTab);
        tab.addEventListener('keydown', clickTab);
        tab.addEventListener('keydown', setActiveTabindex);
      });
    }

    return {
      init: init
    };
  };
}();

Coronita.ui.oTabs = function () {
  function init() {
    $('[data-coronita-o-tabs]').each(function () {
      var oTabs = Coronita.clientflow.oTabs({
        id: $(this).attr('data-coronita-o-tabs'),
        autoloadPanel: false
      });
      oTabs.init();
    });
  }

  return {
    init: init
  };
}();
//# sourceMappingURL=o-tabs.js.map
