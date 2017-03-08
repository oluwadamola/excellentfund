
module Stev.Services {

    export class FileService {

        scope: angular.IRootScopeService;
        notify: NotifyService;
        storage: StorageService;
        Q: angular.IQService;


        headers: { name: string, value: string }[] = [];

        constructor(_notify, $rootScope, $q, _storage) {
            this.notify = _notify;
            this.storage = _storage;
            this.scope = $rootScope;
            this.Q = $q;
            this.init();
        }

        init() {
            var oauthtoken = this.storage.Token;

            if (oauthtoken) {
                this.setHeader("Authorization", 'Bearer ' + oauthtoken.access_token);
            }

        }

        setHeader(name: string, value: any) {
            var header = this.headers.filter(h => h.name === name)[0]
            if (header) {
                header.value = value;
            }
            else {
                this.headers.push({ name: name, value: value });
            }
        }


        read(file: File) {

            var defer = this.Q.defer<string>();

            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                this.scope.$apply(function () {
                    //Notify Angular that the Reading is complete
                    var target: any = e.currentTarget;
                    defer.resolve(target.result);
                });
            }

            reader.onerror = (e) => {
                this.scope.$apply(function () {
                    defer.reject("Could not Read File");
                });
            };

            reader.onabort = e => {
                this.scope.$apply(function () {
                    defer.reject("Read aborted");
                });
            };

            return defer.promise;
        }

        upload<T>(url: string, name: string, file: File, method = "POST") {

            //Create new Deferred Object
            var defer = this.Q.defer<T>();
            var scope = this.scope;
            var notify = this.notify;

            //Show Loading
            var $loader = angular.element("[data-loader]").show(10);

            var fd = new FormData();
            fd.append(name, file);
            var xhr = new XMLHttpRequest();

            //Attach Event Handlers
            xhr.upload.onprogress = function (e) {
                scope.$apply(function () {
                    if (e.lengthComputable) {
                        defer.notify(e);
                    }
                });
            };

            //On Upload Successful
            xhr.onload = function (e) {
                scope.$apply(function () {
                    if (xhr.status == 200) {
                        var result = <T>JSON.parse(xhr.responseText);
                        defer.resolve(result);
                    }
                    else {
                        notify.error(xhr.statusText);
                        defer.reject(xhr.statusText);
                    }
                    $loader.hide(20);
                });
            };

            // On Upload Error
            xhr.onerror = function (e: ErrorEvent) {
                scope.$apply(function () {
                    notify.error(e.message);
                    defer.reject(e.message);
                    $loader.hide(20);
                });
            };

            // On Upload Aborted
            xhr.onabort = function (e) {
                scope.$apply(function () {
                    var message = "Upload Aborted";
                    notify.error(message);
                    defer.reject(message);
                    $loader.hide(20);
                });
            };

            // Open the Request
            xhr.open("POST", url, true);

            //Set Headers
            this.headers.map(h => xhr.setRequestHeader(h.name, h.value));

            //Peform Actual Upload
            xhr.send(fd);

            return defer.promise;
        }

        post<T>(url: string, file: File) {
            return this.upload<T>(url, "file", file);
        }

        put<T>(url: string, file: File) {
            return this.upload<T>(url, "file", file, "PUT");
        }
    }

    module.service("_file", FileService);
}