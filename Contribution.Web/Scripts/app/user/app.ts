module Stev.User {
    export const module = angular.module("Stev", [
        "Stev.Services",
        "Stev.Profile",
        "Stev.Group",
        "Stev.Infrastructure",
        "ui.bootstrap",
        "ui.router",
        "ngAnimate"
    ]);

    /// UI Router States
    module.config(($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
        $urlRouterProvider.otherwise("/")
         
        $urlRouterProvider.when("/users", "/users/list");
        //$urlRouterProvider.when("/subscription", "/subscription/current")


        $stateProvider
            .state("home", {
                url: "/",
                templateUrl: "/user/template/home", //<-- /account/signin
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
            })

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
    module.run(function ($rootScope: ng.IRootScopeService, _storage: Services.StorageService) {
        $rootScope.$on('$stateChangeStart',
            function (event, toState, toStateParams) {

                var role = Constants.Roles.User;

                //Check to see if user has this role for current organisation
                var hasRole = _storage.User
                    .Roles
                    .filter(ur => ur.RoleName == role).length;
                if (!hasRole) {
                    document.location.href = "/account/#!/notauthorised";
                }
            });
    });

    /// https://github.com/angular-ui/ui-router/issues/2889
    module.config($qProvider => $qProvider.errorOnUnhandledRejections(false));
}