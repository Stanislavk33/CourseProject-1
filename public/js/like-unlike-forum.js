'use strict';
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
                toastr.success("Post liked!");
            })
            .fail((err) => {
                toastr.err(err.message);
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
                toastr.success("Post unliked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
    }
    function likePostAnswer(ev){
        const $target = $(ev.target);
        const postId = $target.parents("#post-answer-info").siblings('h1').attr("data-id");
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
                toastr.success("Post answer liked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
    }
    function unlikePostAnswer(ev) {
        const $target = $(ev.target);
        const postId = $target.parents("#post-answer-info").siblings('h1').attr("data-id");
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
                toastr.success("Post answer unliked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
    }
    
        $('.like-post').one('click', likePost);
        $('.unlike-post').one('click', unlikePost);
        $('.like-post-answer').one('click', likePostAnswer);
        $('.unlike-post-answer').one('click', unlikePostAnswer);


