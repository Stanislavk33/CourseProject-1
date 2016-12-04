/* globals $ */

'use strict';

var app = app || {};

function likeCompetition(ev) {
    var $target = $(ev.target),
        competitionId = $target.parents("#competition-info").attr("data-id");
    $.ajax('/competitions/' + competitionId + '/like', {
            method: "PUT"
        })
        .done(function() {
            var $likesSpan = $target.prev(),
                likes = $likesSpan.html();
            $likesSpan.html(+likes + 1);
            $target.html("Dislike");
            $target.removeClass('btn-success');
            $target.addClass('btn-danger');
            $target.one('click', dislikeCompetition);
            app.notifier.showNotification("Competition liked!", "success");
        })
        .fail(function(err) {
            app.notifier.showNotification(err.message, "error");
        });
}

function dislikeCompetition(ev) {
    var $target = $(ev.target),
        competitionId = $target.parents("#competition-info").attr("data-id");
    $.ajax('/competitions/' + competitionId + '/dislike', {
            method: "PUT"
        })
        .done(function() {
            var $likesSpan = $target.prev(),
                likes = $likesSpan.html();
            $likesSpan.html(+likes - 1);
            $target.html("Like");
            $target.removeClass('btn-danger');
            $target.addClass('btn-success');
            $target.one('click', likeCompetition);
            app.notifier.showNotification("Competition disliked!", "success");
        })
        .fail(function(err) {
            app.notifier.showNotification(err.message, "error");
        });
}

$('.like-competition').one('click', likeCompetition);
$('.dislike-competition').one('click', dislikeCompetition);