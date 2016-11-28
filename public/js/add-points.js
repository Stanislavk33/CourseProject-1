$(".addPoints").on("click", function(ev) {

    let dataId = $(this).attr('data-id');

    let devider = dataId.indexOf(' ');
    let username = dataId.substr(0, devider);
    let points = +dataId.substr(devider + 1, dataId.length);

    ev.preventDefault();
    const data = {
        username,
        points
    };

    $.ajax("/users/addPoints", {
        method: "PUT",
        data: JSON.stringify(data),
        contentType: "application/json"
    }).
    done(() => {
            toastr.success("magic");
        })
        .fail(() => {
            toastr.error("You are a fail!")
        })
});