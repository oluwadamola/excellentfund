module Stev.Profile {
    export const module = angular.module("Stev.Profile", ["ui.router"]);

    //Profile Module
    module.config(function ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) {

        $urlRouterProvider.when("/profile", "/profile/overview");
        $urlRouterProvider.when("/profile/account", "/profile/account/info");

        $stateProvider
            .state("profile", {
                url: "/profile",
                controller: "Profile.MainCtrl",
                controllerAs: "model",
                templateUrl: "/profile/template/index",
            })
            .state("profile.overview", {
                url: "/overview",
                templateUrl: "/profile/template/overview",
                controller: "Profile.OverviewCtrl",
                controllerAs: "model"
            })

            .state("profile.account", {
                url: "/account",
                templateUrl: "/profile/template/account",
            })
            .state("profile.account.info", {
                url: "/info",
                templateUrl: "/profile/template/info",
                controller: "Profile.InfoCtrl",
                controllerAs: "model"
            })
            .state("profile.account.avatar", {
                url: "/avatar",
                templateUrl: "/profile/template/avatar",
                controller: "Profile.AvatarCtrl",
                controllerAs: "model"
            })
            .state("profile.account.password", {
                url: "/password",
                templateUrl: "/profile/template/password",
                controller: "Profile.PasswordCtrl",
                controllerAs: "model"
            })
    });

    /// https://github.com/angular-ui/ui-router/issues/2889
    module.config($qProvider => $qProvider.errorOnUnhandledRejections(false));
}