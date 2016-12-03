console.log('script linked!');
$('.category-title').on('click', function(ev){

    const $target = $(ev.target);
    console.log('FIRED');
    const categoryTitle = $target.html();
    const categoryLink = categoryTitle.replace(' ', '-').toLowerCase();
    console.log('categoryLink');
    document.location.href = `/categories/${categoryLink}`
});