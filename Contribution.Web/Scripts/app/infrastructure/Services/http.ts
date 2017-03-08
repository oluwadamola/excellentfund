module Stev.Services {

    export class HttpService {

        http: angular.IHttpService;
        Q: angular.IQService;
        notify: NotifyService;
        storage: StorageService;
        constructor($http, $q, _notify, _storage) {

            this.http = $http;
            this.Q = $q;
            this.notify = _notify;
            this.storage = _storage;
        }

        private setHeaders() {
            var oauthtoken = this.storage.Token;

            if (oauthtoken) {
                this.http.defaults.headers.common["Authorization"] = 'Bearer ' + oauthtoken.access_token;
            }
        }

        private request<T>(method: string, url: string, data?: any, config?: angular.IRequestShortcutConfig) {

            this.setHeaders();

            //dynamically dispatch the call to HTTP Method
            var request: angular.IHttpPromise<Operation<T>> = this.http[method](url, data, config)
            var defer = this.Q.defer<T>();

            request.then(resp => defer.resolve(resp.data.Result));
            request.catch(r => {
                this.notify.error(r.statusText);
                defer.reject(r.statusText);
            });

            return defer.promise;
        }

        get<T>(url: string, data?: any, config?: angular.IRequestShortcutConfig) {
            return this.request<T>("get", url, data, config);
        }

        post<T>(url: string, data?: any, config?: angular.IRequestShortcutConfig) {
            return this.request<T>("post", url, data, config);
        }

        put<T>(url: string, data?: any, config?: angular.IRequestShortcutConfig) {
            return this.request<T>("put", url, data, config);
        }

        delete<T>(url: string, data?: any, config?: angular.IRequestShortcutConfig) {
            return this.request<T>("delete", url, data, config);
        }
    }

    module.service("_http", HttpService);
}