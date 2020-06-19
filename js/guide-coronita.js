$(document).ready(function () {
  function animateScroll(top) {
    $('html, body').animate({
      scrollTop: top
    }, '300');
  }

  $('[data-guide-block]').each(function () {
    var id = $(this).closest('[id]').attr('id');
    var $listItem = $('<li class="text_15 margin-right-xsmall margin-bottom-xsmall"><a href="#' + id + '" data-link-section="' + id + '">' + $(this).find('[data-guide-block-title]').text() + '</a></li>');
    $('[data-guide-menu]').append($listItem);
  });
  var $linkTop = $('[data-link="go-top"]');
  $linkTop.hide();
  $(window).scroll(function () {
    /*var scrollHeight = $(window).scrollTop();
     if (scrollHeight >= levelScroll1) {
      $linkTop.fadeIn();
    }
     if (scrollHeight < levelScroll1) {
      $linkTop.fadeOut();
    }*/
  });
  $linkTop.on('click.top', function () {
    animateScroll(0);
  });
});
//# sourceMappingURL=guide-coronita.js.map
