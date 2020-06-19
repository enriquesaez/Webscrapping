$(document).ready(function () {
  var button = document.getElementById("button-01"),
      button2 = document.getElementById("button-02");

  if (button) {
    button.addEventListener("click", expandCollapsible);
  }

  if (button2) {
    button2.addEventListener("click", expandCollapsible2);
  }

  function changeProperties(el, attr, val1, val2) {
    var el = document.querySelector(el);
    el.setAttribute(attr, el.getAttribute(attr) === val1 ? val2 : val1);
  }

  ;

  function expandCollapsible() {
    var ctrlText = this.querySelector("span");
    var ctrlIcon = this.querySelector("i");
    changeProperties("#button-01", "aria-expanded", "false", "true");
    changeProperties("#button-01", "aria-label", "Ver más", "Ver menos");
    changeProperties("#pannel-01", "aria-hidden", "true", "false");
    ctrlText.firstChild.data = ctrlText.firstChild.data == "Ver más" ? "Ver menos" : "Ver más";
    ctrlIcon.classList.toggle("rotate_180");
    event.preventDefault();
  }

  function expandCollapsible2() {
    var ctrlText = this.querySelector("span");
    var ctrlIcon = this.querySelector("i");
    changeProperties("#button-02", "aria-expanded", "false", "true");
    changeProperties("#button-02", "aria-label", "Ver más", "Ver menos");
    changeProperties("#pannel-02", "aria-hidden", "true", "false");
    ctrlText.firstChild.data = ctrlText.firstChild.data == "Ver más" ? "Ver menos" : "Ver más";
    ctrlIcon.classList.toggle("rotate_180");
    event.preventDefault();
  }

  $('[data-layout-tabs-conditions]').each(function () {
    var $tabBox = $(this),
        $tabs = $tabBox.find('[aria-controls]'),
        $panels = $tabBox.find('[aria-labelledby][role="tabpanel"]');
    $tabs.on('click.tab', function () {
      var $tab = $(this),
          id = $tab.attr('aria-controls');
      $tab.removeClass('border-bottom').attr('aria-selected', 'true').siblings().addClass('border-bottom').attr('aria-selected', 'false');
      $tab.children().eq(0).removeClass('text-primary').addClass('text-grey_500');
      $tab.siblings().each(function () {
        $(this).children().eq(0).removeClass('text-grey_500').addClass('text-primary');
      });
      $panels.addClass('hide-content').filter('[id="' + id + '"]').removeClass('hide-content');
    });
  });
  $('#sinPlan').click(function () {
    $('#content1').removeClass('m-data-summary-flip__contenido1');
    $('#content1').addClass('m-data-summary-flip__contenido2');
    $('#content2').removeClass('m-data-summary-flip__contenido2');
    $('#content2').addClass('m-data-summary-flip__contenido1');
    $('#barra-Collapsible').addClass('opacity_0');
    $('#pannel-01').addClass('opacity_0');
    setTimeout(function () {
      $('#barra-Collapsible').addClass('hide-content');
      $('#pannel-01').addClass('hide-content');
    }, 1000);
  });
  $('#conPlan').click(function () {
    $('#content2').addClass('m-data-summary-flip__contenido2');
    $('#content2').removeClass('m-data-summary-flip__contenido1');
    $('#content1').addClass('m-data-summary-flip__contenido1');
    $('#content1').removeClass('m-data-summary-flip__contenido2');
    $('#barra-Collapsible').removeClass('hide-content');
    $('#pannel-01').removeClass('hide-content');
    setTimeout(function () {
      $('#barra-Collapsible').removeClass('opacity_0');
      $('#pannel-01').removeClass('opacity_0');
    }, 10);
  });
});
//# sourceMappingURL=layout-seguros-oferta-unica.js.map
