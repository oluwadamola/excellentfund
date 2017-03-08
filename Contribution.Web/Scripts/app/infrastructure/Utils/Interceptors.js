var Stev;
(function (Stev) {
    var Infrastructure;
    (function (Infrastructure) {
        var Interceptors;
        (function (Interceptors) {
            function OAuthHttpInterceptor($q, $location) {
                return {
                    responseError: function (response) {
                        if (response.status === 403 || response.status === 401) {
                            document.location.href = Stev.Constants.LoginUrl + "#/notauthorized";
                        }
                        return $q.reject(response);
                    }
                };
            }
            Infrastructure.module.config(function ($httpProvider) { return $httpProvider.interceptors.push(OAuthHttpInterceptor); });
            function LoadingInterceptor($q) {
                return {
                    // optional method
                    'request': function (config) {
                        // do something on success
                        angular.element("div[data-loader]").show(10);
                        return config;
                    },
                    // optional method
                    'requestError': function (rejection) {
                        // do something on error
                        angular.element("div[data-loader]").hide(10);
                        return $q.reject(rejection);
                    },
                    // optional method
                    'response': function (response) {
                        // do something on success
                        angular.element("div[data-loader]").hide(10);
                        return response;
                    },
                    // optional method
                    'responseError': function (rejection) {
                        // do something on error
                        angular.element("div[data-loader]").hide(10);
                        return $q.reject(rejection);
                    }
                };
            }
            Infrastructure.module.config(function ($httpProvider) { return $httpProvider.interceptors.push(LoadingInterceptor); });
        })(Interceptors = Infrastructure.Interceptors || (Infrastructure.Interceptors = {}));
    })(Infrastructure = Stev.Infrastructure || (Stev.Infrastructure = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=Interceptors.js.map