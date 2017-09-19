function logoutSession()
{
    postServer("/kill-session", {token: sessionToken});
    sessionToken = undefined;
    localStorage.sessionToken = undefined;
    $("#logout-button").toggleClass("invisible", true);
    $("#login-box").toggleClass("hidden-login-box", false);
    $("#classname-box").val("");
    $("#password-box").val("");
}

$(document).ready(function () 
{
    if (localStorage.sessionToken !== undefined)
        postServer("/check-refresh-session", {token: localStorage.sessionToken}, function(response)
        {
            if (response.success)
            {
                state = response.memberType;
                sessionToken = localStorage.sessionToken;
                state = localStorage.memberType;
                $("#logout-button").toggleClass("invisible", false);
                $("#login-box").toggleClass("hidden-login-box", true);
            }
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
            {
                state = response.memberType;
                sessionToken = response.token;
                localStorage.sessionToken = sessionToken;
                localStorage.memberType = state;
                $("#login-box").toggleClass("hidden-login-box", true);
                $("#logout-button").toggleClass("invisible", false);
            }
            else
            {
                $login_statusbox.html(response.message);
            }
        }, function ()
        {
            $login_statusbox.html("Server timeout!");
        });
    });
    $("#logout-button").click(function ()
    {
        logoutSession();
    });
});