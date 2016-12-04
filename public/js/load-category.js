$('.category-title').on('click', function(ev) {

    var $target = $(ev.target),
        categoryTitle = $target.html(),
        categoryLink = categoryTitle.replace(' ', '-').toLowerCase();
    document.location.href = '/categories/' + categoryLink;
});