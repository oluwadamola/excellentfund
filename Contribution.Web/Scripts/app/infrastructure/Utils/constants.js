var Stev;
(function (Stev) {
    var Constants;
    (function (Constants) {
        //constant for fetching authorization from local browser keystore
        Constants.OAuthTokenKey = "Stev.Security.OAuth.AuthorizationToken-KEY";
        Constants.UserKey = "Stev.User";
        Constants.LoginUrl = "/account/index";
        Constants.Roles = {
            User: "User",
            SystemAdministrator: "SystemAdministrator"
        };
        Constants.AppMonths = {
            January: "January",
            February: "February",
            March: "March",
            April: "April",
            May: "May",
            June: "June",
            July: "July",
            August: "August",
            September: "September",
            October: "October",
            November: "November",
            December: "December"
        };
    })(Constants = Stev.Constants || (Stev.Constants = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=constants.js.map