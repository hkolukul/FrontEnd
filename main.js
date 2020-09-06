$(document).ready(function () {

    var $member_detail = $('#member_detail');
    var $members = $('#members');
    var $mdm_person_id =$('#mdm_person_id');
    var $user_id=$('#user_id');
    var $policy_id=$('#policy_id');


    $('#button').on('click',function () {

       $.ajax({
            method: 'GET',
            url: "http://localhost:8080/Restful1/jnv/students",
            success: function(members) {
                $.each(members, function(i,member) {
                    //console.log(member);
                    $members.append('<li>name: '+member.name +'   age: '+member.age + '</li>');

                });
            },
            error: function() {
                console.log("Errors in calling Web service");
            }
       });

       console.log("I am at then end")

    });




    $('#submit').on('click',function () {

        var member = {
            mdm_person_id: $mdm_person_id.val(),
            user_Id: $user_id.val(),
            policy_id: $policy_id.val()
       };

       console.log(member);
    
       $.ajax({
            method: 'POST',
            url: "http://localhost:8080/IcIntegration/ic/offers",
            data: JSON.stringify(member),
            contentType: "application/json; charset=utf-8",
           // data: {"mdm_person_id":"1", "user_Id":"hkolukul", "policy_id":"00123890"},
            datatype: 'json',
            success: function(response) {
                var res = "";
                res += "<tr><td>"+response.mdm_person_id+"</td><td>"+response.firstname+"</td><td>"+response.lastname+"</td><td>"+response.user_id+"</td><td>"+response.policy_id+"</td></tr>";
                if(res != "") {
                    $("#member_detail").append(res).removeClass("hidden");
                }
                $.each(response.offers, function(i,offer) {
                    var txt = "";
                    txt += "<tr><td>"+offer.offer_name+"</td><td>"+offer.score+"</td></tr>";

                    if(txt != "") {
                        $("#offers").append(txt).removeClass("hidden");
                        $("#response").removeClass("hidden");
                    }
                });
            },
            error: function() {
                console.log("Errors in calling Web service");
            }
       });

       console.log("I am at then end")

    });

});