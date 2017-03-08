var Stev;
(function (Stev) {
    var Services;
    (function (Services) {
        var FileService = (function () {
            function FileService(_notify, $rootScope, $q, _storage) {
                this.headers = [];
                this.notify = _notify;
                this.storage = _storage;
                this.scope = $rootScope;
                this.Q = $q;
                this.init();
            }
            FileService.prototype.init = function () {
                var oauthtoken = this.storage.Token;
                if (oauthtoken) {
                    this.setHeader("Authorization", 'Bearer ' + oauthtoken.access_token);
                }
            };
            FileService.prototype.setHeader = function (name, value) {
                var header = this.headers.filter(function (h) { return h.name === name; })[0];
                if (header) {
                    header.value = value;
                }
                else {
                    this.headers.push({ name: name, value: value });
                }
            };
            FileService.prototype.read = function (file) {
                var _this = this;
                var defer = this.Q.defer();
                var reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = function (e) {
                    _this.scope.$apply(function () {
                        //Notify Angular that the Reading is complete
                        var target = e.currentTarget;
                        defer.resolve(target.result);
                    });
                };
                reader.onerror = function (e) {
                    _this.scope.$apply(function () {
                        defer.reject("Could not Read File");
                    });
                };
                reader.onabort = function (e) {
                    _this.scope.$apply(function () {
                        defer.reject("Read aborted");
                    });
                };
                return defer.promise;
            };
            FileService.prototype.upload = function (url, name, file, method) {
                if (method === void 0) { method = "POST"; }
                //Create new Deferred Object
                var defer = this.Q.defer();
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
                            var result = JSON.parse(xhr.responseText);
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
                xhr.onerror = function (e) {
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
                this.headers.map(function (h) { return xhr.setRequestHeader(h.name, h.value); });
                //Peform Actual Upload
                xhr.send(fd);
                return defer.promise;
            };
            FileService.prototype.post = function (url, file) {
                return this.upload(url, "file", file);
            };
            FileService.prototype.put = function (url, file) {
                return this.upload(url, "file", file, "PUT");
            };
            return FileService;
        }());
        Services.FileService = FileService;
        Services.module.service("_file", FileService);
    })(Services = Stev.Services || (Stev.Services = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=file.js.map