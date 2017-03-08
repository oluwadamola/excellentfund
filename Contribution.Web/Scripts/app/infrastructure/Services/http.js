var Stev;
(function (Stev) {
    var Services;
    (function (Services) {
        var HttpService = (function () {
            function HttpService($http, $q, _notify, _storage) {
                this.http = $http;
                this.Q = $q;
                this.notify = _notify;
                this.storage = _storage;
            }
            HttpService.prototype.setHeaders = function () {
                var oauthtoken = this.storage.Token;
                if (oauthtoken) {
                    this.http.defaults.headers.common["Authorization"] = 'Bearer ' + oauthtoken.access_token;
                }
            };
            HttpService.prototype.request = function (method, url, data, config) {
                var _this = this;
                this.setHeaders();
                //dynamically dispatch the call to HTTP Method
                var request = this.http[method](url, data, config);
                var defer = this.Q.defer();
                request.then(function (resp) { return defer.resolve(resp.data.Result); });
                request.catch(function (r) {
                    _this.notify.error(r.statusText);
                    defer.reject(r.statusText);
                });
                return defer.promise;
            };
            HttpService.prototype.get = function (url, data, config) {
                return this.request("get", url, data, config);
            };
            HttpService.prototype.post = function (url, data, config) {
                return this.request("post", url, data, config);
            };
            HttpService.prototype.put = function (url, data, config) {
                return this.request("put", url, data, config);
            };
            HttpService.prototype.delete = function (url, data, config) {
                return this.request("delete", url, data, config);
            };
            return HttpService;
        }());
        Services.HttpService = HttpService;
        Services.module.service("_http", HttpService);
    })(Services = Stev.Services || (Stev.Services = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=http.js.map