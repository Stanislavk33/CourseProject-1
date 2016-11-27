module.exports = (data) => {
    return {
        loadForumPosts(req, res) {
            data.getAllForumPosts()
                .then(forumPosts => {
                    return res.status(200).render("forum-page", { result: forumPosts });
                });
        },
        getCreatePage(req, res) {
            return res.status(200).render("create-forum-post");
        },
        createForumPost(req, res) { 
            let body = req.body;
            let user = req.user; 
            console.log(user);

            data.createForumPost({
                    title: body.title,
                    description: body.description,
                    user: {username: 'someusername', points: 0} // TODO: get from req.user
                })
                .then(() => {
                    res.redirect('/forum')
                }).catch(err => {
                    console.log(err);
                });
        },
        getByID(req, res) { //
            const id = req.params.id;
            data.getForumPostById(id)
                .then(forumPost => {
                    res.render("forum-post-page", { result: forumPost });
                });
        }, 
        addComment(req, res) { //
            // TODO: post query to db
        },
        likes(req, res) { //
            // TODO 
        }   
    };
};