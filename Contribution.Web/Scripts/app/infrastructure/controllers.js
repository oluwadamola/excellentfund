var Stev;
(function (Stev) {
    var Infrastructure;
    (function (Infrastructure) {
        var NavBarCtrl = (function () {
            function NavBarCtrl(_storage) {
                this.storage = _storage;
                this.User = this.storage.User;
            }
            NavBarCtrl.prototype.getFullName = function (user) {
                user.FirstName + " " + user.LastName;
            };
            NavBarCtrl.prototype.SignOut = function () {
                this.storage.Clear();
                return true;
            };
            return NavBarCtrl;
        }());
        Infrastructure.module.controller("NavBarCtrl", NavBarCtrl);
    })(Infrastructure = Stev.Infrastructure || (Stev.Infrastructure = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=controllers.js.map