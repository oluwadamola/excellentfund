var Stev;
(function (Stev) {
    var Services;
    (function (Services) {
        var StorageService = (function () {
            function StorageService() {
            }
            Object.defineProperty(StorageService.prototype, "User", {
                //Gets currently logged in User
                get: function () {
                    if (!this.user) {
                        this.user = this.Get(Stev.Constants.UserKey);
                    }
                    return this.user;
                },
                set: function (user) {
                    this.user = user;
                    this.Store(Stev.Constants.UserKey, user);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StorageService.prototype, "Token", {
                get: function () {
                    if (!this.token) {
                        this.token = this.Get(Stev.Constants.OAuthTokenKey);
                    }
                    return this.token;
                },
                set: function (token) {
                    this.token = token;
                    this.Store(Stev.Constants.OAuthTokenKey, token);
                },
                enumerable: true,
                configurable: true
            });
            //Local Storage Methods
            StorageService.prototype.Store = function (key, value) {
                return window.localStorage.setItem(key, JSON.stringify(value));
            };
            StorageService.prototype.Remove = function (key) {
                window.localStorage.removeItem(key);
            };
            StorageService.prototype.Get = function (key) {
                return JSON.parse(window.localStorage.getItem(key));
            };
            StorageService.prototype.Clear = function () {
                window.localStorage.clear();
            };
            return StorageService;
        }());
        Services.StorageService = StorageService;
        Services.module.service("_storage", StorageService);
    })(Services = Stev.Services || (Stev.Services = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=storage.js.map