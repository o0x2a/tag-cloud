'use strict';

$(function() {
  $('form').on('submit', function(e) {
    e.preventDefault();
    $('.cloud-container button').attr('disabled', true).text('Loading...');
    var type = $('.tab-pane.active').attr('id');
    var query = $('.tab-pane.active').find('[type="text"]').val();
    displayTags(type, query);
  })
});

function displayTags(type, query) {
  var tagToHtml = function(tag) {
    return '<span class="word tag'+ tag.size +'"><a href="#tag" title='+ tag.count + '" times">' + tag.word + '</a></span>';
  };
  $('#error-alert').hide();
  var request = $.ajax({
    url: "/api/" + type,
    method: "GET",
    data: { q : query },
    dataType: "json"
  });

  request.done(function( tags ) {
    var tagsHtml = tags.map(tagToHtml);
    $('#' + type + ' .tags').removeClass('hidden').html(tagsHtml);
  });

  request.fail(function( jqXHR, textStatus, data ) {
    var message = textStatus;
    try {
      message = JSON.parse(jqXHR.responseText).message;
    } catch(e) {}
    $('#error-alert').text("Request failed: " +  message).removeClass('hidden').show();
  });

  request.always(function() {
    $('.cloud-container button').attr('disabled', false).text('Go!')
  });
}
