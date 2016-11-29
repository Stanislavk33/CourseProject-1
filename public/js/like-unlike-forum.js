'use strict';

        $('.like-post').on('click', function (ev) {

        const $target = $(ev.target);
        const postId = $target.parents("#post-info").attr("data-id");

        $.ajax(`/forum/${postId}/like`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes + 1);
                location.reload();
                toastr.success("Post liked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
        });

        $('.unlike-post').on('click', function (ev) {

        const $target = $(ev.target);
        const postId = $target.parents("#post-info").attr("data-id");

        $.ajax(`/forum/${postId}/unlike`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes - 1);
                location.reload();
                toastr.success("Post unliked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
        });

