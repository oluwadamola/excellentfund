module Stev.Infrastructure.Interceptors {

    function OAuthHttpInterceptor($q: angular.IQService, $location: angular.ILocationService): angular.IHttpInterceptor {
        return {
            responseError: function (response) {
                if (response.status === 403 || response.status === 401) {
                    document.location.href = Constants.LoginUrl + "#/notauthorized";
                }
                return $q.reject(response);
            }
        }
    }

    module.config(($httpProvider: angular.IHttpProvider) => $httpProvider.interceptors.push(OAuthHttpInterceptor));

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

    module.config(($httpProvider: angular.IHttpProvider) => $httpProvider.interceptors.push(LoadingInterceptor));
}