'use strict';

var app = app || {};
    function likePost(ev){
        const $target = $(ev.target);
        const postId = $target.parents("#post-info").attr("data-id");
        $.ajax(`/forum/${postId}/like`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes + 1);
                $target.html('Unlike');
                $target.one('click', unlikePost);
                app.notifier.showNotification("Post liked!", "success");
            })
            .fail((err) => {
                app.notifier.showNotification(err.message, "error");
            });
    }
    function unlikePost(ev) {
        const $target = $(ev.target);
        const postId = $target.parents("#post-info").attr("data-id");
        $.ajax(`/forum/${postId}/unlike`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes - 1);
                $target.html('Like');
                $target.one('click', likePost);
                app.notifier.showNotification("Post unliked!", "success");
            })
            .fail((err) => {
                app.notifier.showNotification(err.message, "error");
            });
    }
    function likePostAnswer(ev){
        const $target = $(ev.target);
        const postId = $target.parents("#post-answer-info").parents('#post-info').attr("data-id");
        const postAnswerId = $target.parents("#post-answer-info").attr("data-id");
        $.ajax(`/forum/${postId}/comment/${postAnswerId}/like`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes + 1);
                $target.html('Unlike');
                $target.one('click', unlikePostAnswer);
                app.notifier.showNotification("Post answer liked!", "success");
            })
            .fail((err) => {
                app.notifier.showNotification(err.message, "error");
            });
    }
    function unlikePostAnswer(ev) {
        const $target = $(ev.target);
        const postId = $target.parents("#post-answer-info").parents('#post-info').attr("data-id");
        const postAnswerId = $target.parents("#post-answer-info").attr("data-id");
        $.ajax(`/forum/${postId}/comment/${postAnswerId}/unlike`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes - 1);
                $target.html('Like');
                $target.one('click', likePostAnswer);
                app.notifier.showNotification("Post answer unliked!", "success");
            })
            .fail((err) => {
                app.notifier.showNotification(err.message, "error");
            });
    }
    
        $('.like-post').one('click', likePost);
        $('.unlike-post').one('click', unlikePost);
        $('.like-post-answer').one('click', likePostAnswer);
        $('.unlike-post-answer').one('click', unlikePostAnswer);


