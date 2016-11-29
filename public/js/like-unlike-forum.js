'use strict';
    function like(ev){
        const $target = $(ev.target);
        const postId = $target.parents("#post-info").attr("data-id");
        $.ajax(`/forum/${postId}/like`, {
            method: "PUT"
        })
            .done(() => {     
                const $likesSpan = $target.prev();    
                const likes = $likesSpan.html();
                $likesSpan.html(+likes + 1);
                //location.reload();
                $target.html('Unlike');
               // $target.off('click', like);
                $target.one('click', unlike);
                toastr.success("Post liked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
    }
    function unlike(ev) {
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
                $target.one('click', like);
                toastr.success("Post unliked!");
            })
            .fail((err) => {
                toastr.err(err.message);
            });
    }
    
        $('.like-post').one('click', like);
        $('.unlike-post').one('click', unlike);
        

