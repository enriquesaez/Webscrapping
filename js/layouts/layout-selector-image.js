var imageSelected;

function imageToggle(ev) {
  if (imageSelected) {
    imageSelected.classList.remove('opacity_100', 'border-blue-accessible');
    imageSelected.classList.add('opacity_60');
    imageSelected.setAttribute("tabindex", "-1");
    imageSelected.setAttribute("aria-checked", "false");
  }

  ev.currentTarget.classList.remove('opacity_60');
  ev.currentTarget.classList.add('opacity_100', 'border-blue-accessible');
  ev.currentTarget.setAttribute("tabindex", "0");
  ev.currentTarget.setAttribute("aria-checked", "true");
  imageSelected = ev.currentTarget;
}

document.addEventListener("DOMContentLoaded", function () {
  var SELECTOR_CORONITA_IMAGE_CONTENT = document.querySelectorAll('[data-coronita-metas-cargar-image]');
  Array.from(SELECTOR_CORONITA_IMAGE_CONTENT).forEach(function (item) {
    ['click', 'keypress'].forEach(function (event) {
      item.addEventListener(event, imageToggle);
    });
  });
});
//# sourceMappingURL=layout-selector-image.js.map
