var currentSelect = undefined;

function createTextResponseElement(author, topic, text)
{

}

function createProblemElement(name, desc, problemToken)
{
    var problemwindow = $("#member-problem-template");
    problemwindow.removeClass("invisible");
    problemwindow.attr("id", "");
}

function createAssignmentSelectorElement(name, assignmentToken)
{
    var assignwindow = $(document.createElement("div"));
    assignwindow.addClass("member-assignment-selector");
    assignwindow.html(name);
    assignwindow.data("atoken", assignmentToken);
    assignwindow.data("problems", []);
    assignwindow.click(function()
    {
        if (currentSelect !== undefined)
            currentSelect.toggleClass("member-assignment-selected", false);
        currentSelect = assignwindow;
        assignwindow.toggleClass("member-assignment-selected", true);
        var dat = assignwindow.data("problems");
        if (dat.length === 0)
        {
            postServer("/get-all-problems", {token: sessionToken, atoken: assignwindow.data("atoken")}, function(response)
            {
                for (let problem of response.ptokens)
                    dat.push(createProblemElement(problem.name, problem.ptoken));
                assignwindow.data("problems", dat);
            }, function()
            {
                logoutSession();
            });
        }
        else
        {
            postServer("/check-refresh-session", {token: sessionStorage.sessionToken}, function(response)
            {
                if (!response.success)
                    logoutSession();
            });
        }
        $("#member-problem-holder").empty();
        for (let elem of dat)
            $("#member-problem-holder").append(elem);
    });
}

function loadMemberWindow()
{
    $("#member-box").toggleClass("hidden-box", false);
}

function closeMemberWindow()
{
    $("#member-box").toggleClass("hidden-box", true);
}

$(document).ready(function()
{
    $("#member-sidebar-discussion-button").click(function()
    {

    });
    $("#member-sidebar-refresh-button").click(function()
    {

    });
});