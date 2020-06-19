// expense-calculator.jade
// baby-gear.jade
$(document).ready(function () {
  var helper,
      $article = $('#add-article-combo-box'),
      $otherArticle = $('#other-article-input-box');
  helper = {
    validateSaveProduct: function validateSaveProduct() {
      var articleVal = $article.val(),
          otherArticleVal = $otherArticle.val(),
          isOther = articleVal === 'Otros',
          isUnselected = articleVal === 'Selecciona una opción*',
          isNotWritten = otherArticleVal.length < 1;
      return !isUnselected && !isOther || isOther && !isNotWritten;
    },
    saveProduct: function saveProduct() {
      if (helper.validateSaveProduct()) {
        var time = new Date().getTime(),
            lastSlider = $('article.row.margin-bottom-large').last(),
            article = $article.attr('value'),
            html = $('<div></div>').append(lastSlider.clone()).html(),
            replaceable = $(html).find('h3').text(),
            attrFor,
            attrId,
            attrIdText,
            attrDescribedBy;
        article = article === 'Otros' ? $otherArticle.val() : article;
        html = html.replace(new RegExp(replaceable, 'gm'), article);
        attrFor = $(html).find('[for^="article-check-"]').attr('for');
        attrId = $(html).find('[type="range"]').attr('id');
        attrIdText = $(html).find('[id^="article-input-box-]').attr('id');
        attrDescribedBy = $(html).find('[aria-describedby^="article-slider-description-]').attr('aria-describedby');
        html = html.replace(new RegExp(attrFor, 'gm'), 'article-check-' + time);
        html = html.replace(new RegExp(attrId, 'gm'), 'article-check-' + time); //html = html.replace(new RegExp(attrDescribedBy, 'gm'), 'article-slider-description-' + time);

        html = html.replace(new RegExp('id="' + attrIdText, 'gm'), 'id="article-input-box-' + time);
        lastSlider.after(html);
        helper.hideAdd();
      } else {
        $article.each(function () {
          $(this).after('<i class="c-combo-box__icon c-icon-alert" aria-hidden="true"></i>').closest('.c-input-box, .c-combo-box').addClass('is-invalid');
          $(this).attr('aria-describedby', 'error-' + $(this).attr('id')).parent().append('<span class="c-input-box__description" id="error-' + $(this).attr('id') + '">Ya has agregado un producto con "Otros"</span>');
        });
        $otherArticle.each(function () {
          $(this).after('<i class="c-input-box__icon c-icon-alert" aria-hidden="true"></i>').closest('.c-input-box, .c-combo-box').addClass('is-invalid');
          $(this).attr('aria-describedby', 'error-' + $(this).attr('id')).parent().append('<span class="c-input-box__description" id="error-' + $(this).attr('id') + '">El nombre del producto es obligatorio</span>');
        });
      }
    },
    addProduct: function addProduct() {
      $("#add-article-button").addClass("hide-content").attr("aria-expanded", "true").attr("aria-hidden", "true");
      $('#save-article-button').removeClass('hide-content').attr('aria-hidden', 'false');
      $("#cancel-add-article-button").removeClass("hide-content").attr("aria-expanded", "true");
      $("#add-article-form").removeClass("hide-content").attr("aria-hidden", "false");
    },
    cancelAdd: function cancelAdd() {
      helper.hideAdd();
    },
    hideAdd: function hideAdd() {
      $("#cancel-add-article-button").attr("aria-expanded", "false").addClass("hide-content");
      $("#add-article-button").removeClass('hide-content').attr("aria-expanded", "false").attr('aria-hidden', 'false');
      $("#add-article-form").addClass("hide-content").attr("aria-hidden", "true");
      $('#save-article-button').addClass("hide-content").attr("aria-hidden", "true");
    },
    removeArticlesOpacity: function removeArticlesOpacity() {
      $(this).css("opacity", "0.1");
      $("#set-opacity").find('.m-slide-input-box').find('.o-heading').hide();
      $("#set-opacity").find('.m-slide-input-box').find('label.c-checkbox--bodycopy').removeClass('hide-content');
      $("#set-opacity").find('.m-slide-input-box').find('.m-slide-input-box__validation, .m-validation__error').css("opacity", "0.1");
      $("#set-opacity").find("#add-article-content").addClass("hide-content");
      $("#set-opacity").find("#remove-article-buttons").removeClass("hide-content");
      /*$("#set-opacity")
        .find("#download-button, #save-list-button, .c-slider, .c-input-box")
        .css("opacity", "0.1");
      $("#set-opacity")
        .find("article h3.c-bodycopy--bold, #add-article-content").addClass("hide-content");
      $("#set-opacity")
        .find("article label.c-checkbox--bodycopy, #remove-article-buttons").removeClass("hide-content");
      $("#set-opacity")
        .find('[type="range"], [type="text"], [role="combobox"], [role="button"]').attr({
          'aria-hidden': 'true',
          'tabindex': '-1'
        })*/
      //- .find('[type="range"], [type="text"]').attr({
      //-   'aria-hidden': 'true',
      //-   'disabled': 'true'
      //- })
    }
  };
  $("#add-article-button").on('click.add', helper.addProduct);
  $('#save-article-button').on('click.save', helper.saveProduct);
  $("#cancel-add-article-button").on("click.cancelAdd", helper.cancelAdd);
  $otherArticle.closest('.c-input-box').addClass("hide-content");
  $('#combo-box-listbox').children().on('click', function () {
    if ($(this).is(':last-child')) {
      $otherArticle.closest('.c-input-box').removeClass("hide-content");
    } else {
      $otherArticle.closest('.c-input-box').addClass("hide-content");
    }
  });
  $(document).scroll(function () {
    if ($(document).scrollTop() > 390) {
      $('.m-sticky-bar').addClass('m-sticky-bar--sticked').parent().css({
        paddingTop: 96 + 48 + 16
      });
    } else {
      $('.m-sticky-bar').removeClass('m-sticky-bar--sticked').parent().removeAttr('style');
    }
  });
  $('#save-list-button').on('click.save', function () {
    $('.m-alert--popup').removeClass('hide-content');
    setTimeout(function () {
      $('.m-alert--popup').addClass('hide-content');
    }, 3000);
  });
  $('[data-layout-row-edit]').each(function () {
    var $icon = $(this).find('.c-icon-contract'),
        $row = $(this).closest('article');
    $row.hover(function () {
      $icon.removeClass('hide-content');
    }, function () {
      $icon.addClass('hide-content');
    });
    $row.find('[type="text"]').on('focus.text', function () {
      $icon.removeClass('hide-content');
    });
  });
});
//# sourceMappingURL=layout-we-help-you.js.map
