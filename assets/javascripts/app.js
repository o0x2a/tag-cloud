'use strict';
var $ = window.$ || window.jQuery;

$(function () {
  var submitBtn = $('.cloud-container button');
  $('form').on('submit', function (e) {
    var activePane = $('.tab-pane.active');
    var type = activePane.attr('id');
    var query = activePane.find('[type="text"]').val();
    e.preventDefault();
    if (!type || !query) { return; }
    submitBtn.attr('disabled', true).text('Loading...');
    displayTags(type, query);
  });

  function displayTags(type, query) {
    var tagToHtml = function (tag) {
      return '<span class="word tag' + tag.size + '"><a href="#tag" title=' + tag.count + '"times">' + tag.word + '</a></span>';
    };
    var request = $.ajax({
      url: '/api/' + type,
      method: 'GET',
      data: {q: query},
      dataType: 'json'
    });

    request.done(function (tags) {
      var tagsHtml = tags.map(tagToHtml);
      $('#' + type + ' .tags').removeClass('hidden').html(tagsHtml);
    });

    request.fail(function (jqXHR, textStatus) {
      var message = textStatus;
      try {
        message = JSON.parse(jqXHR.responseText).message;
      } catch (e) {
        console.error(jqXHR.responseText);
      }
      $('#error-alert').text('Request failed: ' + message).removeClass('hidden').show();
    });

    request.always(function () {
      submitBtn.attr('disabled', false).text('Go!');
    });
  }
});
