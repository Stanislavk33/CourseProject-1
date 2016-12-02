'use strict';

function likeCompetition(ev) {
    const $target = $(ev.target);
    const competitionId = $target.parents("#competition-info").attr("data-id");
    $.ajax(`/competitions/${competitionId}/like`, {
            method: "PUT"
        })
        .done(() => {
            const $likesSpan = $target.prev();
            const likes = $likesSpan.html();
            $likesSpan.html(+likes + 1);
            $target.html("Dislike");
            $target.removeClass('btn-success');
            $target.addClass('btn-danger');
            $target.one('click', dislikeCompetition);
            toastr.success("Competition liked!");
        })
        .fail((err) => {
            toastr.err(err.message);
        });
}

function dislikeCompetition(ev) {
    const $target = $(ev.target);
    const competitionId = $target.parents("#competition-info").attr("data-id");
    $.ajax(`/competitions/${competitionId}/dislike`, {
            method: "PUT"
        })
        .done(() => {
            const $likesSpan = $target.prev();
            const likes = $likesSpan.html();
            $likesSpan.html(+likes - 1);
            $target.html("Like");
            $target.removeClass('btn-danger');
            $target.addClass('btn-success');
            $target.one('click', likeCompetition);
            toastr.success("Competition disliked!");
        })
        .fail((err) => {
            toastr.err(err.message);
        });
}

$('.like-competition').one('click', likeCompetition);
$('.dislike-competition').one('click', dislikeCompetition);