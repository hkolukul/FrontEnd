$(document).ready(function () {

    var $offers = $('#offers');
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
                $offers.append('<li>LastName: '+response.firstname +'   FirstName: '+response.lastname + ' Offer1: '+response.offers[0].offer_name + ' Offer2: '+response.offers[1].offer_name + '</li>');
            },
            error: function() {
                console.log("Errors in calling Web service");
            }
       });

       console.log("I am at then end")

    });

});