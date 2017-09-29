var sessionToken = undefined;
var memberType = "none"; //none : admin : member

function postServer(command, data, success, fail=0)
{
    var call = $.ajax({type: "POST", url: ("http://localhost:8080" + command), timeout: 4000, 
        data: data, success: success });
    if (fail !== 0)
        call.fail(success);
}

//http://localhost:8080
//http://hwsharer-hwsharer.7e14.starter-us-west-2.openshiftapps.com