var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        Account.module = angular.module("Stev", ["Stev.Services", "Stev.Infrastructure", "ui.router", "ngAnimate"]);
        /// UI Router States
        Account.module.config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/signin");
            $urlRouterProvider
                .when("/notauthorised", function (_notify) {
                _notify.warning("You are not Authorised to perform this Action");
                return "/signin";
            })
                .when("/signout", function (_notify, _storage) {
                _notify.success("You have successfully logged out");
                _storage.Clear();
                return "/signin";
            });
            $stateProvider
                .state("signin", {
                url: "/signin",
                templateUrl: "/account/template/signin",
                controller: "SignInCtrl",
                controllerAs: "model"
            })
                .state("signup", {
                url: "/signup",
                templateUrl: "/account/template/signup",
                controller: "SignUpCtrl",
                controllerAs: "model"
            })
                .state("recovery", {
                url: "/recovery",
                templateUrl: "/account/template/recovery",
                controller: "RecoveryCtrl",
                controllerAs: "model"
            })
                .state("challenge", {
                url: "/challenge/{id}",
                templateUrl: "/account/template/challenge",
                controller: "ChallengeCtrl",
                controllerAs: "model"
            });
        });
        /// https://github.com/angular-ui/ui-router/issues/2889
        Account.module.config(function ($qProvider) { return $qProvider.errorOnUnhandledRejections(false); });
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=app.js.map