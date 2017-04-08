var Stev;
(function (Stev) {
    var Services;
    (function (Services) {
        var Domain;
        (function (Domain) {
            var User = (function () {
                function User($q, $http, _http, _file, _storage) {
                    this.http = _http;
                    this.$http = $http;
                    this.Q = $q;
                    this.file = _file;
                    this.storage = _storage;
                }
                User.prototype.createUser = function (model) {
                    debugger;
                    return this.http.post('/api/users', model);
                };
                User.prototype.updateUser = function (model) {
                    return this.http.put('/api/users/' + model.UserId, model);
                };
                User.prototype.signIn = function (email, password) {
                    var _this = this;
                    var deferred = this.Q.defer();
                    var data = "grant_type=password&username=" + email + "&password=" + password;
                    var postCredentials = this.$http.post('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
                    var signIn = postCredentials
                        .then(function (response) {
                        var token = response.data;
                        _this.storage.Token = token;
                        return token;
                    })
                        .then(function (t) {
                        return _this.http.get("/api/users/" + t.UserId);
                    }) //Also Fetch User Information
                        .then(function (u) {
                        _this.storage.User = u;
                        deferred.resolve(u);
                    });
                    signIn.catch(function (err) { return deferred.reject(err.data.error_description); });
                    return deferred.promise;
                };
                User.prototype.getUser = function (userId) {
                    return this.http.get('/api/users/' + userId);
                };
                User.prototype.getUsers = function () {
                    return this.http.get("/api/users/GetUsers");
                };
                User.prototype.uploadUsers = function (groupId, userFile) {
                    var defer = this.Q.defer();
                    var uploadFile = this.file.post("/api/groups/" + groupId + "/users", userFile);
                    uploadFile.then(function (r) { return defer.resolve(r.Result); });
                    uploadFile.catch(function (r) {
                        defer.reject(r);
                    });
                    return defer.promise;
                };
                User.prototype.addUser = function (user) {
                    return this.http.post("/api/users/user", user);
                };
                User.prototype.getRole = function (role) {
                    switch (role) {
                        case Stev.Constants.Roles.SystemAdministrator:
                            return { RoleId: 1, RoleName: Stev.Constants.Roles.SystemAdministrator, Title: "System Administrator", Url: "/systemadmin" };
                        case Stev.Constants.Roles.User:
                            return { RoleId: 2, RoleName: Stev.Constants.Roles.User, Title: "User", Url: "/user" };
                    }
                };
                User.prototype.isInRole = function (role) {
                    var roles = this.storage.User.Roles.map(function (r) { return r.RoleName.toLowerCase(); });
                    var isInRole = roles.indexOf(role.toLowerCase()) >= 0;
                    return isInRole;
                };
                User.prototype.recover = function (email) {
                    return this.http.put("/api/users/recover/?email=" + email);
                };
                User.prototype.changePassword = function (userID, password, newPassword) {
                    return this.http.put("/api/users/" + userID + "/password", {
                        Password: password,
                        NewPassword: newPassword
                    });
                };
                /* getRoles(userID: number) {
                     return this.http.get<RoleModel[]>(`/api/users/${userID}/roles`);
                 }*/
                User.prototype.getUserRoles = function (userId) {
                    return this.http.get("/api/users/" + userId + "/roles");
                };
                User.prototype.getAllRoles = function () {
                    var _this = this;
                    return Object.keys(Stev.Constants.Roles).map(function (k) { return _this.getRole(Stev.Constants.Roles[k]); });
                };
                User.prototype.assignRole = function (userID, role) {
                    return this.http.put("/api/users/" + userID + "/roles", {
                        Role: role
                    });
                };
                User.prototype.removeRole = function (user, role) {
                    return this.http.delete("/api/users/" + user.UserId + "/roles?role=" + role.RoleName);
                };
                User.prototype.uploadImage = function (file) {
                    var defer = this.Q.defer();
                    var userId = this.storage.User.UserId;
                    var uploadFile = this.file.post("/api/users/" + userId + "/image", file);
                    uploadFile.then(function (r) { return defer.resolve(r.Result); });
                    uploadFile.catch(function (r) { return defer.reject(r); });
                    return defer.promise;
                };
                User.prototype.getUsersInGroup = function (groupId) {
                    return this.http.get("/api/groups/" + groupId + "/users");
                };
                User.prototype.getUsersInGroup1 = function (groupId) {
                    var _this = this;
                    debugger;
                    var list = {
                        Count: function () { return _this.http.get("/api/groups/" + groupId + "/users/count"); },
                        Slice: function (offset, limit) { return _this.http.get(("/api/groups/" + groupId + "/users?offset=") + offset + "&limit=" + limit); }
                    };
                    return list;
                };
                User.prototype.assignUserToGroup = function (groupId, User) {
                    return this.http.post("/api/groups/" + groupId + "/users/" + User.UserId);
                };
                User.prototype.getUserInGroup = function (groupId, userId) {
                    return this.http.get("/api/groups/" + groupId + "/users/" + userId);
                };
                return User;
            }());
            Domain.User = User;
            var Group = (function () {
                function Group(_http, _storage, $http, $q) {
                    this.$http = $http;
                    this.http = _http;
                    this.Q = $q;
                    this.storage = _storage;
                }
                Group.prototype.createGroup = function (model) {
                    return this.http.post("/api/groups", model);
                };
                Group.prototype.updateGroup = function (model) {
                    return this.http.put("/api/groups" + model.GroupId, model);
                };
                Group.prototype.GetGroups = function () {
                    return this.http.get("/api/groups");
                };
                Group.prototype.GetGroup = function (groupId) {
                    return this.http.get("/api/groups/" + groupId);
                };
                Group.prototype.GetUserGroup = function (userId) {
                    return this.http.get("/api/groups/users/" + userId);
                };
                return Group;
            }());
            Domain.Group = Group;
            var Contribution = (function () {
                function Contribution(_storage, _http, $http, $q) {
                    this.http = _http;
                    this.Q = $q;
                    this.$http = $http;
                    this.storage = _storage;
                }
                Contribution.prototype.getContributors = function () {
                    return this.http.get("/api/contributors");
                };
                Contribution.prototype.getContributorsInGroup = function (groupId) {
                    return this.http.get("/api/contributors/" + groupId);
                };
                Contribution.prototype.getAllMonths = function () {
                    var _this = this;
                    return Object.keys(Stev.Constants.AppMonths).map(function (k) { return _this.getMonth(Stev.Constants.AppMonths[k]); });
                    ;
                };
                Contribution.prototype.getMonth = function (month) {
                    switch (month) {
                        case Stev.Constants.AppMonths.January:
                            return { MonthId: 1, MonthName: Stev.Constants.AppMonths.January };
                        case Stev.Constants.AppMonths.February:
                            return { MonthId: 2, MonthName: Stev.Constants.AppMonths.February };
                        case Stev.Constants.AppMonths.March:
                            return { MonthId: 3, MonthName: Stev.Constants.AppMonths.March };
                        case Stev.Constants.AppMonths.April:
                            return { MonthId: 4, MonthName: Stev.Constants.AppMonths.April };
                        case Stev.Constants.AppMonths.May:
                            return { MonthId: 5, MonthName: Stev.Constants.AppMonths.May };
                        case Stev.Constants.AppMonths.June:
                            return { MonthId: 6, MonthName: Stev.Constants.AppMonths.June };
                        case Stev.Constants.AppMonths.July:
                            return { MonthId: 7, MonthName: Stev.Constants.AppMonths.July };
                        case Stev.Constants.AppMonths.August:
                            return { MonthId: 8, MonthName: Stev.Constants.AppMonths.August };
                        case Stev.Constants.AppMonths.September:
                            return { MonthId: 9, MonthName: Stev.Constants.AppMonths.September };
                        case Stev.Constants.AppMonths.October:
                            return { MonthId: 10, MonthName: Stev.Constants.AppMonths.October };
                        case Stev.Constants.AppMonths.November:
                            return { MonthId: 11, MonthName: Stev.Constants.AppMonths.November };
                        case Stev.Constants.AppMonths.December:
                            return { MonthId: 12, MonthName: Stev.Constants.AppMonths.December };
                    }
                };
                Contribution.prototype.addUserContributionToGroup = function (model) {
                    return this.http.post("/api/contributors", model);
                };
                return Contribution;
            }());
            Domain.Contribution = Contribution;
            var Collector = (function () {
                function Collector(_storage, _http, $http, $q) {
                    this.http = _http;
                    this.Q = $q;
                    this.$http = $http;
                    this.storage = _storage;
                }
                Collector.prototype.getCollectorsInGroup = function (groupId) {
                    return this.http.get("/api/collectors/" + groupId);
                };
                Collector.prototype.addCollectorToGroup = function (collector) {
                    return this.http.post("/api/collectors", collector);
                };
                return Collector;
            }());
            Domain.Collector = Collector;
            Services.module.service("_user", User);
            Services.module.service("_group", Group);
            Services.module.service("_contribution", Contribution);
            Services.module.service("_collector", Collector);
        })(Domain = Services.Domain || (Services.Domain = {}));
    })(Services = Stev.Services || (Stev.Services = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=domain.js.map