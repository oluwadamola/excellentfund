var Stev;
(function (Stev) {
    var User;
    (function (User) {
        var Controllers;
        (function (Controllers) {
            var HomeCtrl = (function () {
                function HomeCtrl() {
                }
                return HomeCtrl;
            }());
            var UsersCtrl = (function () {
                function UsersCtrl(_user, _notify, $uibModal, $state, $stateParams, _storage) {
                    var _this = this;
                    this.user = _user;
                    this.notify = _notify;
                    this.modal = $uibModal;
                    this.state = $state;
                    this.storage = _storage;
                    var GetUsers = this.user.getUsers().then(function (u) { return _this.Users = u; });
                }
                UsersCtrl.prototype.Add = function () {
                    var instance = this.modal.open({
                        templateUrl: "addUser.html",
                        controller: "AddUserCtrl as model",
                    });
                    // instance.result.then(() => this.Users = GetUsers());
                };
                UsersCtrl.prototype.showCreate = function () {
                    var role = Stev.Constants.Roles.SystemAdministrator;
                    //Check to see if user has admin role
                    var hasRole = this.storage.User.Roles.filter(function (r) { return r.RoleName == role; }).length;
                    if (hasRole) {
                        return true;
                    }
                    else {
                        return false;
                    }
                };
                UsersCtrl.prototype.Select = function (user) {
                    this.state.go("users.profile", {
                        id: user.UserId
                    });
                    //this.user.getUser(user.UserId).then(u => this.User = u);
                };
                return UsersCtrl;
            }());
            var AddUserCtrl = (function () {
                function AddUserCtrl($uibModalInstance, _user, _notify) {
                    this.instance = $uibModalInstance;
                    this.user = _user;
                    this.notify = _notify;
                }
                AddUserCtrl.prototype.Ok = function (form, user) {
                    var _this = this;
                    if (form.$valid) {
                        this.user.addUser(user).then(function () {
                            _this.notify.success("User is successfully created");
                            _this.instance.close();
                        });
                    }
                    else {
                        this.notify.warning("Invalid Data Received");
                    }
                };
                AddUserCtrl.prototype.Cancel = function () {
                    this.instance.dismiss("User closed dialog");
                };
                return AddUserCtrl;
            }());
            var UserCtrl = (function () {
                function UserCtrl(_user, $stateParams, $uibModal) {
                    this.user = _user;
                    this.modal = $uibModal;
                    //this.user.getUser($stateParams["id"]).then(u => this.User = u);
                    this.GetRoles($stateParams["id"]);
                }
                UserCtrl.prototype.GetRoles = function (userId) {
                    //this.Roles = this.user.getAllRoles();
                    /*this.user.getUser(userId).then(u => {
                        this.User = u;
                        //this.Roles = u.Roles.map(r => this.user.getRole(r.RoleName))
                    });*/
                    var _this = this;
                    this.user.getUserRoles(userId).then(function (r) { return _this.Roles = r; });
                };
                UserCtrl.prototype.AddRole = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "role.html",
                        controller: "AddRoleCtrl as model",
                    });
                    instance.result.then(function () { return _this.GetRoles(_this.User.UserId); });
                };
                UserCtrl.prototype.RemoveRole = function (role) {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "remove-role.html",
                        controller: "RemoveRoleCtrl as model",
                        resolve: { user: function () { return _this.User; }, role: function () { return role; } }
                    });
                    instance.result.then(function () {
                        _this.user.removeRole(_this.User, role);
                        var rIndex = _this.Roles.indexOf(role);
                        if (rIndex != -1)
                            _this.Roles.splice(rIndex, 1);
                    });
                };
                return UserCtrl;
            }());
            var AddRoleCtrl = (function () {
                function AddRoleCtrl(_user, _notify, $uibModalInstance, user) {
                    this.user = _user;
                    this.notify = _notify;
                    this.instance = $uibModalInstance;
                    this.Roles = this.user.getAllRoles();
                    this.User = user;
                }
                AddRoleCtrl.prototype.Ok = function (form, role) {
                    var _this = this;
                    if (form.$valid) {
                        this.user.assignRole(this.User.UserId, role.RoleName).then(function () {
                            _this.notify.success("Role added successfully");
                            _this.instance.close();
                        });
                    }
                    else {
                        this.notify.warning("Fill all required field");
                    }
                };
                AddRoleCtrl.prototype.Cancel = function () {
                    this.instance.dismiss("User close dialog");
                };
                return AddRoleCtrl;
            }());
            var RemoveRoleCtrl = (function () {
                function RemoveRoleCtrl($uibModalInstance, role, user) {
                    this.instance = $uibModalInstance;
                    this.Role = role;
                    this.User = user;
                }
                RemoveRoleCtrl.prototype.Ok = function (role) {
                    this.instance.close();
                };
                RemoveRoleCtrl.prototype.Cancel = function () {
                    this.instance.dismiss();
                };
                return RemoveRoleCtrl;
            }());
            User.module.controller("HomeCtrl", HomeCtrl);
            User.module.controller("UsersCtrl", UsersCtrl);
            User.module.controller("AddUserCtrl", AddUserCtrl);
            User.module.controller("UserCtrl", UserCtrl);
            User.module.controller("AddRoleCtrl", AddRoleCtrl);
            User.module.controller("RemoveRoleCtrl", RemoveRoleCtrl);
        })(Controllers = User.Controllers || (User.Controllers = {}));
    })(User = Stev.User || (Stev.User = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=controllers.js.map