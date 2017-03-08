var Stev;
(function (Stev) {
    var SystemAdmin;
    (function (SystemAdmin) {
        SystemAdmin.module = angular.module("Stev", [
            "Stev.Services",
            "Stev.Profile",
            "Stev.Group",
            "Stev.Infrastructure",
            "ui.bootstrap",
            "ui.router",
            "ngAnimate"]);
        /// UI Router States
        SystemAdmin.module.config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");
            $urlRouterProvider.when("/users", "/users/list");
            $urlRouterProvider.when("/groups", "/groups/list");
            //$urlRouterProvider.when("/subscription", "/subscription/current")
            $stateProvider
                .state("home", {
                url: "/",
                templateUrl: "/systemadmin/template/home",
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
            //.state("groups", {
            //    url: "/groups",
            //    templateUrl: "<div ui-view class='view-frame'></div>",
            //})
            //.state("groups.list", {
            //    url: "/list",
            //    templateUrl:"/systemadmin/template/groups",
            //    controller: "GroupCtrl",
            //    controllerAs: "model"
            //})
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
        SystemAdmin.module.run(function ($rootScope, _storage) {
            $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
                var role = Stev.Constants.Roles.SystemAdministrator;
                //Check to see if user has this role 
                var hasRole = _storage.User
                    .Roles
                    .filter(function (ur) { return ur.RoleName == role; }).length;
                if (!hasRole) {
                    document.location.href = "/account/#!/notauthorised";
                }
            });
        });
        /// https://github.com/angular-ui/ui-router/issues/2889
        SystemAdmin.module.config(function ($qProvider) { return $qProvider.errorOnUnhandledRejections(false); });
    })(SystemAdmin = Stev.SystemAdmin || (Stev.SystemAdmin = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=app.js.map