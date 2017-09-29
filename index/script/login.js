function loginSession(ssessionToken, sstate)
{
    memberType = sstate;
    sessionToken = ssessionToken;
    sessionStorage.memberType = sstate;
    sessionStorage.sessionToken = ssessionToken;
    $("#logout-button").toggleClass("invisible", false);
    $("#login-box").toggleClass("hidden-box", true);
    $("#login-box").prop('disabled', true);
    switch(sstate)
    {
        case "admin":
            break;
        case "mod":
            break;
        case "member":
            loadMemberWindow();
            break;
    }
}

function logoutSession()
{
    postServer("/kill-session", {token: sessionToken});
    closeMemberWindow();
    sessionToken = undefined;
    sessionStorage.sessionToken = undefined;
    $("#logout-button").toggleClass("invisible", true);
    $("#login-box").toggleClass("hidden-box", false);
    $("#login-box").prop('disabled', false);
    $("#classname-box").val("");
    $("#password-box").val("");
}

$(document).ready(function () 
{
    setTimeout(function() { $(document.body).toggleClass("invisible", false); }, 150);
    if (sessionStorage.sessionToken !== undefined)
        postServer("/check-refresh-session", {token: sessionStorage.sessionToken}, function(response)
        {
            if (response.success)
                loginSession(sessionStorage.sessionToken, sessionStorage.memberType);
        });
    $("#classname-box").on("keypress", function(e)
    {
        var code = e.keyCode || e.which;
        if(code === 13)
            $("#password-box").focus();
    });
    $("#password-box").on("keypress", function(e)
    {
        var code = e.keyCode || e.which;
        if(code === 13)
        {
            $("#login-button").trigger("click");
            $(document).focus();
        }
    });
    var $login_statusbox = $("#login-status-box");
    $("#login-button").click(function () 
    {
        var classname = $("#classname-box").val();
        var password = $("#password-box").val();
        if (!(classname && password))
        {
            $login_statusbox.html("Empty class name or password.");
            return;
        }
        $login_statusbox.html("");
        postServer("/login", {class: classname, pass: password}, function(response)
        {
            if (response.success)
                loginSession(response.token, response.memberType);
            else
                $login_statusbox.html(response.message);
        }, function ()
        {
            $login_statusbox.html("Server timeout!");
        });
    });
    $("#logout-button").click(logoutSession);
});