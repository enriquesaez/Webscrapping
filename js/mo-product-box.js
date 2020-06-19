// product box script
$(document).ready(function () {
  $(".mo-product-box").on("keypress click", ".mo-product-box__controller", function (event) {
    if (event.which === 13 || event.type === 'click') {
      if ($(this).hasClass("is-active")) {
        $(this).removeClass("is-active").attr("aria-expanded", "false");
        $(this).closest(".mo-product-box").children(".mo-product-box__content").attr("aria-hidden", "true");
      } else {
        $(this).addClass("is-active").attr("aria-expanded", "true");
        $(this).closest(".mo-product-box").children(".mo-product-box__content").attr("aria-hidden", "false");
      }

      ;
    }

    ;
  });
  $(".mo-product-box").on("keypress click", ".mo-product-box__content-controller", function (event) {
    if (event.which === 13 || event.type === 'click') {
      if ($(this).parent(".mo-product-box__content").find("table[aria-hidden=false],tr[aria-hidden=false]").length) {
        $(this).parent(".mo-product-box__content").find("table[aria-hidden=false],tr[aria-hidden=false]").addClass("hide-content").attr("aria-hidden", "true");
        $(this).find(".c-link__icon").removeClass("c-icon-substract").addClass("c-icon-add");
        $(this).find(".c-link__text").text("Mostrar productos");
      } else {
        $(this).parent(".mo-product-box__content").find("table[aria-hidden=true],tr[aria-hidden=true]").removeClass("hide-content").attr("aria-hidden", "false");
        $(this).find(".c-link__icon").removeClass("c-icon-add").addClass("c-icon-substract");
        $(this).find(".c-link__text").text("Ocultar productos");
      }

      ;
    }

    ;
  });
});
//# sourceMappingURL=mo-product-box.js.map
