jQuery.extend(jQuery.expr[':'], {
  focusable: function focusable(el, index, selector) {
    return $(el).is('a, button, :input, [tabindex]');
  }
});
//# sourceMappingURL=helpers.js.map
