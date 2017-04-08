var Stev;
(function (Stev) {
    var Group;
    (function (Group) {
        Group.module = angular.module("Stev.Group", ["ui.router", "Stev.Infrastructure"]);
        Group.module.config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when("/groups", "/groups/list");
            $stateProvider
                .state("groups", {
                url: "/groups",
                template: "<div ui-view class='view-frame'></div>",
            })
                .state("groups.list", {
                url: "/list",
                templateUrl: "/group/template/groups",
                controller: "GroupsCtrl",
                controllerAs: "model"
            })
                .state("groups.details", {
                url: "/details/{id}",
                templateUrl: "/group/template/group",
                controller: "GroupCtrl",
                controllerAs: "model"
            })
                .state("groups.users", {
                url: "/details/{gid}/users",
                templateUrl: "/group/template/users",
                controller: "UsersGrpCtrl",
                controllerAs: "model"
            })
                .state("groups.user", {
                url: "/details/{gid}/user",
                template: "<div ui-view class='view-frame'></div>"
            })
                .state("groups.user.details", {
                url: "/details/{id}",
                templateUrl: "/group/template/user",
                controller: "UserGrpCtrl",
                controllerAs: "model"
            })
                .state("groups.contributors", {
                url: "/details/{gid}/contributors",
                templateUrl: "/group/template/contributors",
                controller: "ContributorsCtrl",
                controllerAs: "model"
            })
                .state("groups.contributor", {
                url: "/details/{gid}/contributor",
                template: "<div ui-view class='view-frame'></div>"
            })
                .state("groups.contributor.details", {
                url: "/details/{id}",
                templateUrl: "/group/template/contributor",
                controller: "ContributorCtrl",
                controllerAs: "model"
            })
                .state("groups.collectors", {
                url: "/details/{gid}/collectors",
                templateUrl: "/group/template/collectors",
                controller: "CollectorsCtrl",
                controllerAs: "model"
            })
                .state("groups.collector", {
                url: "/details/{gid}/collector",
                template: "<div ui-view class='view-frame'></div>"
            })
                .state("groups.collector.details", {
                url: "/details/{id}",
                templateUrl: "/group/template/collector",
                controller: "CollectorCtrl",
                controllerAs: "model"
            });
        });
        /// https://github.com/angular-ui/ui-router/issues/2889
        Group.module.config(function ($qProvider) { return $qProvider.errorOnUnhandledRejections(false); });
    })(Group = Stev.Group || (Stev.Group = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=app.js.map