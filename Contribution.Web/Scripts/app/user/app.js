var Stev;
(function (Stev) {
    var User;
    (function (User) {
        User.module = angular.module("Stev", [
            "Stev.Services",
            "Stev.Profile",
            "Stev.Group",
            "Stev.Infrastructure",
            "ui.bootstrap",
            "ui.router",
            "ngAnimate"
        ]);
        /// UI Router States
        User.module.config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $urlRouterProvider.when("/users", "/users/list");
            //$urlRouterProvider.when("/subscription", "/subscription/current")
            $stateProvider
                .state("home", {
                url: "/",
                templateUrl: "/user/template/home",
                controller: "HomeCtrl",
                controllerAs: "model"
            })
                .state("users", {
                url: "/users",
                template: "<div ui-view class='view-frame'></div>",
            })
                .state("users.list", {
                url: "/list",
                templateUrl: "/systemadmin/template/users",
                controller: "UsersCtrl",
                controllerAs: "model"
            })
                .state("users.profile", {
                url: "/profile/{id}",
                templateUrl: "/systemadmin/template/user",
                controller: "UserCtrl",
                controllerAs: "model"
            });
            //.state("subscription", {
            //    url: "/subscription",
            //    template: "<div ui-view class='view-frame'></div>",
            //})
            //.state("subscription.current", {
            //    url: "/current",
            //    templateUrl: "/systemadmin/template/subscription",
            //    controller: "SubscriptionCtrl",
            //    controllerAs: "model"
            //})
            //.state("subscription.plans", {
            //    url: "/plans",
            //    templateUrl: "/systemadmin/template/plans",
            //    controller: "PlansCtrl",
            //    controllerAs: "model"
            //})
        });
        /// Configure Authentication
        User.module.run(function ($rootScope, _storage) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                var role = Stev.Constants.Roles.SystemAdministrator;
                //Check to see if user has this role for current organisation
                var hasRole = _storage.User
                    .Roles
                    .filter(function (ur) { return ur.RoleName == role; }).length;
                if (!hasRole) {
                    document.location.href = "/account/#!/notauthorised";
                }
            });
        });
        /// https://github.com/angular-ui/ui-router/issues/2889
        User.module.config(function ($qProvider) { return $qProvider.errorOnUnhandledRejections(false); });
    })(User = Stev.User || (Stev.User = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=app.js.map