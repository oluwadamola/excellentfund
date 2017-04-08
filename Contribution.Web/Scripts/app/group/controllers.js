var Stev;
(function (Stev) {
    var Group;
    (function (Group) {
        var Controllers;
        (function (Controllers) {
            var GroupsCtrl = (function () {
                function GroupsCtrl($uibModal, _group, _storage, $stateParams) {
                    this.modal = $uibModal;
                    this.group = _group;
                    this.storage = _storage;
                    this.GetGroups();
                }
                GroupsCtrl.prototype.GetGroups = function () {
                    var _this = this;
                    var role = Stev.Constants.Roles.SystemAdministrator;
                    //Check to see if user has admin role
                    var hasRole = this.storage.User.Roles.filter(function (r) { return r.RoleName == role; }).length;
                    if (hasRole) {
                        this.group.GetGroups().then(function (g) { return _this.Groups = g; });
                    }
                    else {
                        this.group.GetUserGroup(this.storage.User.UserId).then(function (ug) { return _this.Groups = ug; });
                    }
                };
                GroupsCtrl.prototype.showCreate = function () {
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
                GroupsCtrl.prototype.add = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "group.html",
                        controller: "AddGroupCtrl as model",
                    });
                    instance.result.then(function (g) { return _this.GetGroups(); });
                };
                return GroupsCtrl;
            }());
            var AddGroupCtrl = (function () {
                function AddGroupCtrl($uibModalInstance, _notify, _group) {
                    this.instance = $uibModalInstance;
                    this.notify = _notify;
                    this.group = _group;
                }
                AddGroupCtrl.prototype.Ok = function (form, group) {
                    var _this = this;
                    if (form.$valid) {
                        var instance = this.group.createGroup(group).then(function (g) {
                            _this.Group = g;
                            _this.notify.success("Group successfully added");
                            _this.instance.close();
                        });
                    }
                    else {
                        this.notify.warning("Group name is required");
                    }
                };
                AddGroupCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User closed dialog"));
                };
                return AddGroupCtrl;
            }());
            var GroupCtrl = (function () {
                function GroupCtrl(_group, _notify, $stateParams, $uibModal) {
                    var _this = this;
                    this.group = _group;
                    this.notify = _notify;
                    this.modal = $uibModal;
                    this.group.GetGroup($stateParams["id"]).then(function (g) { return _this.Group = g; });
                }
                GroupCtrl.prototype.editGroup = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "group.html",
                        controller: "EditGroupCtrl as model",
                        resolve: {
                            group: function () { return angular.copy(_this.Group); }
                        }
                    });
                    instance.result.then(function (g) { return _this.Group = g; });
                };
                return GroupCtrl;
            }());
            var EditGroupCtrl = (function () {
                function EditGroupCtrl(_notify, _group, $uibModalInstance, group) {
                    this.Title = "Edit Group";
                    this.notify = _notify;
                    this.group = _group;
                    this.instance = $uibModalInstance;
                    this.Group = group;
                }
                EditGroupCtrl.prototype.Ok = function (form) {
                    var _this = this;
                    if (form.$valid) {
                        this.group.updateGroup(this.Group).then(function (g) { return _this.instance.close(g); });
                    }
                    else {
                        this.notify.warning("Invalid data received");
                    }
                };
                EditGroupCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User Closed dialog box"));
                };
                return EditGroupCtrl;
            }());
            Group.module.controller("GroupsCtrl", GroupsCtrl);
            Group.module.controller("AddGroupCtrl", AddGroupCtrl);
            Group.module.controller("GroupCtrl", GroupCtrl);
            Group.module.controller("EditGroupCtrl", EditGroupCtrl);
        })(Controllers = Group.Controllers || (Group.Controllers = {}));
    })(Group = Stev.Group || (Stev.Group = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Group;
    (function (Group) {
        var Controllers;
        (function (Controllers) {
            var UsersGrpCtrl = (function () {
                function UsersGrpCtrl(_user, $stateParams, _notify, _group, $uibModal, _storage) {
                    var _this = this;
                    this.user = _user;
                    this.modal = $uibModal;
                    this.notify = _notify;
                    this.group = _group;
                    this.storage = _storage;
                    this.group.GetGroup($stateParams["gid"]).then(function (g) { return _this.Group = g; });
                    this.fetchUsers($stateParams["gid"]);
                }
                UsersGrpCtrl.prototype.fetchUsers = function (groupId) {
                    //this.user.getUsersInGroup(groupId).then(g => this.Users = g);
                    this.Users = new PagedList(this.user.getUsersInGroup1(groupId), 10);
                    console.log(this.Users);
                };
                UsersGrpCtrl.prototype.showCreate = function () {
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
                UsersGrpCtrl.prototype.addUserGroup = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "usergroup.html",
                        controller: "AddUserGroupCtrl as model"
                    });
                    instance.result.then(function () { return _this.fetchUsers(_this.Group.GroupId); });
                };
                UsersGrpCtrl.prototype.upload = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "uploadUser.html",
                        controller: "UploadUserCtrl as model",
                        resolve: {
                            group: function () { return _this.Group; }
                        }
                    });
                    instance.result.then(function () { return _this.fetchUsers(_this.Group.GroupId); });
                };
                return UsersGrpCtrl;
            }());
            var UploadUserCtrl = (function () {
                function UploadUserCtrl(group, _user, $uibModalInstance, _notify) {
                    var _this = this;
                    this.Group = group;
                    this.user = _user;
                    this.notify = _notify;
                    this.instance = $uibModalInstance;
                    this.user.getUsers().then(function (u) { return _this.Users = u; });
                }
                UploadUserCtrl.prototype.Ok = function () {
                    var _this = this;
                    this.user.uploadUsers(this.Group.GroupId, this.UserFile).then(function (u) { return _this.instance.close(u); });
                };
                UploadUserCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User closed dialog"));
                };
                return UploadUserCtrl;
            }());
            var UserGrpCtrl = (function () {
                function UserGrpCtrl(_user, _notify, _group, $stateParams) {
                    var _this = this;
                    this.user = _user;
                    this.notify = _notify;
                    this.group = _group;
                    this.UserId = $stateParams["id"];
                    //this.user.getUserInGroup(1, 1).then(u => this.User = u);
                    this.user.getUserInGroup($stateParams["gid"], this.UserId).then(function (u) { return _this.User = u; });
                    this.group.GetGroup($stateParams["gid"]).then(function (g) { return _this.Group = g; });
                }
                return UserGrpCtrl;
            }());
            var AddUserGroupCtrl = (function () {
                function AddUserGroupCtrl(_group, _user, $uibModalInstance, _notify, $stateParams) {
                    var _this = this;
                    this.group = _group;
                    this.user = _user;
                    this.notify = _notify;
                    this.instance = $uibModalInstance;
                    this.GroupId = $stateParams["gid"];
                    //this.group.GetGroups().then(g => this.Groups = g);
                    this.user.getUsers().then(function (u) { return _this.Users = u; });
                }
                AddUserGroupCtrl.prototype.Ok = function (form, user) {
                    var _this = this;
                    if (form.$valid) {
                        this.user.assignUserToGroup(this.GroupId, user).then(function (u) { return _this.Users = u; })
                            .then(function () {
                            _this.notify.success("User added to group successfully");
                            _this.instance.close();
                        });
                    }
                    else {
                        this.notify.error("Please select a user to add to this group");
                    }
                };
                AddUserGroupCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User closed dialog"));
                };
                return AddUserGroupCtrl;
            }());
            Group.module.controller("UsersGrpCtrl", UsersGrpCtrl);
            Group.module.controller("UserGrpCtrl", UserGrpCtrl);
            Group.module.controller("AddUserGroupCtrl", AddUserGroupCtrl);
            Group.module.controller("UploadUserCtrl", UploadUserCtrl);
        })(Controllers = Group.Controllers || (Group.Controllers = {}));
    })(Group = Stev.Group || (Stev.Group = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Group;
    (function (Group) {
        var Controllers;
        (function (Controllers) {
            var ContributorsCtrl = (function () {
                function ContributorsCtrl(_user, _notify, _contribution, $stateParams, _group, $uibModal, _storage) {
                    var _this = this;
                    this.user = _user;
                    this.notify = _notify;
                    this.contribution = _contribution;
                    this.group = _group;
                    this.modal = $uibModal;
                    this.storage = _storage;
                    this.fetchContributors($stateParams["gid"]);
                    this.group.GetGroup($stateParams["gid"]).then(function (g) { return _this.Group = g; });
                }
                ContributorsCtrl.prototype.fetchContributors = function (groupId) {
                    var _this = this;
                    this.contribution.getContributorsInGroup(groupId).then(function (c) { return _this.Contributions = c; });
                };
                ContributorsCtrl.prototype.showCreate = function () {
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
                ContributorsCtrl.prototype.addContributionsGroup = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "usercontributiongroup.html",
                        controller: "AddUserContributionGroupCtrl as model",
                        resolve: {
                            group: function () { return _this.Group; }
                        }
                    });
                    instance.result.then(function () { return _this.fetchContributors(_this.Group.GroupId); });
                };
                return ContributorsCtrl;
            }());
            var AddUserContributionGroupCtrl = (function () {
                function AddUserContributionGroupCtrl(_user, _contribution, _notify, $uibModalInstance, group) {
                    var _this = this;
                    this.user = _user;
                    this.contribution = _contribution;
                    this.notify = _notify;
                    this.instance = $uibModalInstance;
                    this.Group = group;
                    this.user.getUsersInGroup(this.Group.GroupId).then(function (u) { return _this.Users = u; });
                    this.Months = this.contribution.getAllMonths();
                }
                AddUserContributionGroupCtrl.prototype.Ok = function (form, contribution) {
                    var _this = this;
                    if (form.$valid) {
                        contribution.GroupId = this.Group.GroupId;
                        contribution.UserId = contribution.Users[0].UserId;
                        contribution.MonthId = contribution.Month.MonthId;
                        var instance = this.contribution.addUserContributionToGroup(contribution).then(function (c) {
                            _this.Contribution = c;
                            _this.notify.success("User Contribution is successfully added to this Group");
                            _this.instance.close();
                        });
                    }
                    else {
                        this.notify.warning("User Contribution not added!..Something went wrong");
                    }
                };
                AddUserContributionGroupCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User closed dialog"));
                };
                return AddUserContributionGroupCtrl;
            }());
            Group.module.controller("ContributorsCtrl", ContributorsCtrl);
            Group.module.controller("AddUserContributionGroupCtrl", AddUserContributionGroupCtrl);
        })(Controllers = Group.Controllers || (Group.Controllers = {}));
    })(Group = Stev.Group || (Stev.Group = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Group;
    (function (Group) {
        var Controllers;
        (function (Controllers) {
            var CollectorsCtrl = (function () {
                function CollectorsCtrl(_user, _group, _notify, $uibModal, $stateParams, _collector, _storage) {
                    var _this = this;
                    this.user = _user;
                    this.collector = _collector;
                    this.group = _group;
                    this.notify = _notify;
                    this.modal = $uibModal;
                    this.storage = _storage;
                    this.user.getUsersInGroup($stateParams["gid"]).then(function (u) { return _this.Users = u; });
                    this.group.GetGroup($stateParams["gid"]).then(function (g) { return _this.Group = g; });
                    this.fetchCollectors($stateParams["gid"]);
                }
                CollectorsCtrl.prototype.fetchCollectors = function (groupId) {
                    var _this = this;
                    this.collector.getCollectorsInGroup(groupId).then(function (c) { return _this.Collectors = c; });
                };
                CollectorsCtrl.prototype.showCreate = function () {
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
                CollectorsCtrl.prototype.addCollector = function () {
                    var _this = this;
                    var instance = this.modal.open({
                        templateUrl: "collector.html",
                        controller: "CollectorCtrl as model",
                        resolve: {
                            group: function () { return _this.Group; }
                        }
                    });
                    instance.result.then(function () { return _this.fetchCollectors(_this.Group.GroupId); });
                };
                return CollectorsCtrl;
            }());
            var CollectorCtrl = (function () {
                function CollectorCtrl(_user, _notify, $uibModalInstance, group, _contribution, _collector) {
                    var _this = this;
                    this.user = _user;
                    this.notify = _notify;
                    this.instance = $uibModalInstance;
                    this.Group = group;
                    this.contribution = _contribution;
                    this.collector = _collector;
                    this.user.getUsersInGroup(this.Group.GroupId).then(function (u) { return _this.Users = u; });
                    this.collector.getCollectorsInGroup(this.Group.GroupId).then(function (c) { return _this.Collectors = c; });
                    this.Months = this.contribution.getAllMonths();
                }
                CollectorCtrl.prototype.Ok = function (form, collector) {
                    var _this = this;
                    if (form.$valid) {
                        collector.UserId = collector.User.UserId;
                        collector.GroupId = this.Group.GroupId;
                        collector.MonthId = collector.Month.MonthId;
                        this.collector.addCollectorToGroup(collector).then(function (c) { return _this.Collectors = c; });
                    }
                };
                CollectorCtrl.prototype.Cancel = function () {
                    this.instance.dismiss(this.notify.info("User closed dialog"));
                };
                return CollectorCtrl;
            }());
            Group.module.controller("CollectorsCtrl", CollectorsCtrl);
            Group.module.controller("CollectorCtrl", CollectorCtrl);
        })(Controllers = Group.Controllers || (Group.Controllers = {}));
    })(Group = Stev.Group || (Stev.Group = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=controllers.js.map