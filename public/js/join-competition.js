(function(){
    $("#join").on("click", function(ev){
        const competitionId = $("#info").attr("data-id");
        $.ajax(`/competitions/${competitionId}/join`,{
            method: "PUT"
        })
        .done((result)=>{
            const username = result.result.username;
            const points = result.result.points;
            const $newRow = $("<tr>").appendTo($("#joined-users"));
            $("<a>").attr("href", `/users/${username}`).html(username).appendTo("<td>").appendTo($newRow);
            $("<td>").html(points).appendTo($newRow);
            toastr.success("You joined!");
        })
        .fail((err)=>{
            toastr.err(err.message);
        });

        ev.preventDefault();
        return false;
    })
}());