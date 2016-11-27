(function(){
    $("#join").on("click", function(ev){
        const competitionId = $("#info").attr("data-id");
        $.ajax(`/competitions/${competitionId}/join`,{
            method: "PUT"
        })
        .done((competition)=>{
            toastr.success("You joined!");
        })
        .fail((err)=>{
            toastr.err(err.message);
        });

        ev.preventDefault();
        return false;
    })
}());