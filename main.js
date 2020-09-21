$(document).ready(function () {

    var $members = $('#members');
    var $mdm_person_id = $('#mdm_person_id');
    var $user_id = $('#user_id');
    var $policy_id = $('#policy_id');

    $('#button').on('click', function () {
        $.ajax({
            method: 'GET',
            url: "http://localhost:8080/Restful1/jnv/students",
            success: function (members) {
                $.each(members, function (i, member) {
                    //console.log(member);
                    $members.append('<li>name: ' + member.name + '   age: ' + member.age + '</li>');
                });
            },
            error: function () {
                console.log("Errors in calling Web service");
            }
        });
        console.log("I am at then end")
    });




    $('#submit').on('click', function () {

        $("#member_detail").addClass("hidden");
        $("#offers").addClass("hidden");
        $("#accept").addClass("hidden");
        $("#reject").addClass("hidden");
        $("#end").addClass("hidden");
        $("#member_detail").find("tr:gt(0)").remove();
        $("#offers").find("tr:gt(0)").remove();
        // $('member_detail').children( 'tr:not(:first)' ).remove();
        // $('offers').children( 'tr:not(:first)' ).remove();

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
            datatype: 'json',
            success: function (response) {
                var res = " ";
                res += "<tr><td>" + response.mdm_person_id + "</td><td>" + response.firstname + "</td><td>" + response.lastname + "</td><td>" + response.user_id + "</td><td>" + response.policy_id + "</td></tr>";
                if (res != "") {
                    $("#member_detail").append(res).removeClass("hidden");
                }
                $.each(response.offers, function (i, offer) {
                    var txt = " ";
                    // txt += "<tr><td>"+offer.offer_name+"</td><td>"+offer.score+"</td><td>"+$('<input type="radio" name="select">');+"</td></tr>";
                    txt = "<tr>";
                    txt = txt + "<td>" + offer.offer_name + "</td><td>" + offer.score + "</td>";
                    txt = txt + '<td><input type="radio" id="ERow" class="ERow" name="SelERow" value="' + offer.offer_name + '" /></td>'
                    txt = txt + "</tr>";
                    if (txt != "") {
                        $("#offers").append(txt).removeClass("hidden");
                        $("#accept").removeClass("hidden");
                        $("#reject").removeClass("hidden");
                        $("#end").removeClass("hidden");
                    }

                });


                $(".ERow").change(function () {
                    $.each(response.offers, function (i, offer) {
                        if ($("input[type='radio']:checked").val() == offer.offer_name) {
                            // console.log(offer.offer_name);
                            // console.log(offer.treatmentCode);
                            // console.log(response.session_id);
                            var contactEvent = {
                                sessionId: response.session_id,
                                eventName: "contact",
                                treatmentCode: offer.treatmentCode
                            };

                            $.ajax({
                                method: 'POST',
                                url: "http://localhost:8080/IcIntegration/ic/offers/contact",
                                data: JSON.stringify(contactEvent),
                                contentType: "application/json; charset=utf-8",
                                datatype: 'json',
                                success: function (response) {
                                    if (response.peStatus == 0)
                                        console.log(offer.offer_name + " Contacted.");
                                    else
                                        alert("issue in contacting " + offer.offer_name);
                                }
                            });


                            $('#accept').on('click', function () {
                                var acceptEvent = {
                                    sessionId: response.session_id,
                                    eventName: "accept",
                                    treatmentCode: offer.treatmentCode
                                };
                                $.ajax({
                                    method: 'POST',
                                    url: "http://localhost:8080/IcIntegration/ic/offers/response",
                                    data: JSON.stringify(acceptEvent),
                                    contentType: "application/json; charset=utf-8",
                                    datatype: 'json',
                                    success: function (response) {
                                        if (response.peStatus == 0)
                                            alert(offer.offer_name + " accepted.");
                                    },
                                    error: function () {
                                        alert("Errors in calling accept session web service");
                                    } 
                                });
                            });

                            $('#reject').on('click', function () {
                                console.log("in reject function");
                                var rejectEvent = {
                                    sessionId: response.session_id,
                                    eventName: "reject",
                                    treatmentCode: offer.treatmentCode
                                };

                                $.ajax({
                                    method: 'POST',
                                    url: "http://localhost:8080/IcIntegration/ic/offers/response",
                                    data: JSON.stringify(rejectEvent),
                                    contentType: "application/json; charset=utf-8",
                                    datatype: 'json',
                                    success: function (response) {
                                        if (response.peStatus == 0)
                                            alert(offer.offer_name + " rejected.");
                                    },
                                    error: function () {
                                        alert("Errors in calling reject event web service");
                                    } 
                                });
                            });
                            
                            $('#end').on('click', function () {
                               // console.log("in reject function");
                                var endEvent = {
                                    sessionId: response.session_id,
                                    eventName: "",
                                    treatmentCode: ""
                                };

                                $.ajax({
                                    method: 'POST',
                                    url: "http://localhost:8080/IcIntegration/ic/offers/end",
                                    data: JSON.stringify(endEvent),
                                    contentType: "application/json; charset=utf-8",
                                    datatype: 'json',
                                    success: function (response) {
                                        if (response.peStatus == 0)
                                            alert("Session ended");
                                            location.reload();
                                    },
                                    error: function () {
                                        alert("Errors in calling end session web service");
                                    } 
                                    
                                });
                            });

                        }
                    });
                });
            },
            error: function () {
                alert("Errors in calling get offers web service");
            }
        });

    });

});