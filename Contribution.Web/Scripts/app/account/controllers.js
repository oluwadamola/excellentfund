var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        var Controllers;
        (function (Controllers) {
            var NavigationCtrl = (function () {
                function NavigationCtrl($location) {
                    this.location = $location;
                    //angular.element(".sidebar-nav li a").click("")
                }
                NavigationCtrl.prototype.IsActive = function (viewLocation) {
                    //Make sure that viewLocation starts location so that /home/index is valid for /home  
                    return this.location.path().indexOf(viewLocation) == 0;
                };
                ;
                return NavigationCtrl;
            }());
            Account.module.controller("NavigationCtrl", NavigationCtrl);
        })(Controllers = Account.Controllers || (Account.Controllers = {}));
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        var Controllers;
        (function (Controllers) {
            var SignInCtrl = (function () {
                function SignInCtrl(_user, _notify, $state, _storage) {
                    this.User = { Email: "", Password: "" };
                    this.user = _user;
                    this.notify = _notify;
                    this.state = $state;
                    this.storage = _storage;
                }
                SignInCtrl.prototype.SignIn = function () {
                    var _this = this;
                    //Validate User
                    debugger;
                    var user = this.storage.User; //Get Role from Storage
                    var signIn = this.user
                        .signIn(this.User.Email, this.User.Password)
                        .then(function (u) {
                        _this.user.getRoles(u.UserId).then(function (r) {
                            _this.Redirect(r),
                                //Initialize User
                                /*this.Userstrg =
                                {
                                    UserId: this.storage.User.UserId,
                                    Email: this.storage.User.Email,
                                    Title: this.storage.User.Title,
                                    Roles: r,
                                    FirstName: this.storage.User.FirstName,
                                    LastName: this.storage.User.LastName,
                                    ImageUrl: this.storage.User.ImageUrl,
                                    FullName: this.storage.User.FullName
                                }*/
                                //this.User.Roles = r;
                                //Add User Role
                                user.Roles = r;
                            _this.storage.User = user; //Save Role to Storage
                        }),
                            _this.UserId = u.UserId;
                    })
                        .catch(function (err) { return _this.notify.error(err); });
                };
                SignInCtrl.prototype.Redirect = function (roles) {
                    debugger;
                    if (!roles.length) {
                        this.notify.error("No Role found, Please Contact your Administrator");
                    }
                    else if (roles.length == 1) {
                        debugger;
                        //Redirect to Challenge Area
                        var role = this.user.getRole(roles[0].RoleName);
                        document.location.href = role.Url;
                    }
                    else if (roles.length > 1) {
                        var userId = this.UserId;
                        this.state.go("challenge", { id: userId });
                    }
                };
                SignInCtrl.prototype.KeyPress = function ($event) {
                    //If Enter was Pressed
                    if ($event.keyCode == 13) {
                        this.SignIn();
                    }
                };
                return SignInCtrl;
            }());
            Account.module.controller("SignInCtrl", SignInCtrl);
        })(Controllers = Account.Controllers || (Account.Controllers = {}));
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        var Controllers;
        (function (Controllers) {
            var SignUpCtrl = (function () {
                function SignUpCtrl(_user, _notify, $state, _storage) {
                    this.user = _user;
                    this.notify = _notify;
                    this.state = $state;
                    this.storage = _storage;
                }
                SignUpCtrl.prototype.SignUp = function () {
                    var _this = this;
                    if (!this.User) {
                        this.notify.error("Incomplete Form");
                        return false;
                    }
                    //Validate that password match
                    if (this.User.Password != this.ConfirmPassword) {
                        this.notify.error("Passwords Don't match");
                        return false;
                    }
                    //Register User
                    var register = this.user.createUser(this.User);
                    //If the User was created succesfully, Sign the User in
                    var signIn = register.then(function (u) { return _this.user.signIn(_this.User.Email, _this.User.Password); });
                    signIn.then(function (id) {
                        _this.notify.success("User was created Successfully");
                    }).then(function (u) {
                        return _this.user.getRoles(_this.User.UserId);
                    })
                        .then(function (r) {
                        _this.Roles = r;
                        var admin = Stev.Constants.Roles.SystemAdministrator;
                        var adminRole = {
                            RoleId: _this.Roles[0].RoleId,
                            RoleName: Stev.Constants.Roles.SystemAdministrator,
                            Title: Stev.Constants.Roles.SystemAdministrator,
                            Url: "/systemadmin"
                        };
                        //Add User Role
                        var user = _this.storage.User; //Get Role from Storage
                        user.Roles.push(adminRole);
                        _this.storage.User = user; //Save Role to Storage
                        document.location.href = "/systemadmin";
                    });
                    ;
                };
                SignUpCtrl.prototype.KeyPress = function ($event) {
                    //If Enter was Pressed
                    if ($event.keyCode == 13) {
                        this.SignUp();
                    }
                };
                return SignUpCtrl;
            }());
            Account.module.controller("SignUpCtrl", SignUpCtrl);
        })(Controllers = Account.Controllers || (Account.Controllers = {}));
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        var Controllers;
        (function (Controllers) {
            var RecoveryCtrl = (function () {
                function RecoveryCtrl(_user, _notify) {
                    this.user = _user;
                    this.notify = _notify;
                }
                RecoveryCtrl.prototype.recover = function () {
                    var _this = this;
                    if (this.User) {
                        this.user
                            .recover(this.User.Email)
                            .then(function () { return _this.notify.success("Your password is now reset and an email has been sent to your mailbox"); });
                    }
                };
                RecoveryCtrl.prototype.KeyPress = function ($event) {
                    if ($event.keyCode == 13) {
                        this.recover();
                    }
                };
                return RecoveryCtrl;
            }());
            Controllers.RecoveryCtrl = RecoveryCtrl;
            Account.module.controller("RecoveryCtrl", RecoveryCtrl);
        })(Controllers = Account.Controllers || (Account.Controllers = {}));
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
var Stev;
(function (Stev) {
    var Account;
    (function (Account) {
        var Controllers;
        (function (Controllers) {
            var ChallengeCtrl = (function () {
                function ChallengeCtrl($stateParams, _user, _notify, _storage) {
                    var _this = this;
                    this.user = _user;
                    this.notify = _notify;
                    this.storage = _storage;
                    this.user
                        .getRoles($stateParams["id"])
                        .then(function (r) { return _this.SetRoles(r); });
                }
                ChallengeCtrl.prototype.SetRoles = function (roles) {
                    //this.Roles = userRoles.map(r => { return { UserRole: r, Role: this.user.getRole(r.Role.Name) } });
                    var _this = this;
                    debugger;
                    this.Roles = roles.map(function (r) {
                        var role = _this.user.getRole(r.RoleName);
                        return { Role: role };
                    });
                };
                ChallengeCtrl.prototype.Select = function (url) {
                    document.location.href = url;
                };
                ChallengeCtrl.prototype.GetIcon = function (role) {
                    switch (role.RoleName) {
                        case Stev.Constants.Roles.SystemAdministrator:
                            return { "fa-gear": true };
                        case Stev.Constants.Roles.User:
                            return { "fa-user": true };
                    }
                };
                ChallengeCtrl.prototype.GetTitle = function (role) {
                    switch (role.RoleName) {
                        case Stev.Constants.Roles.SystemAdministrator:
                            return "Admin";
                        case Stev.Constants.Roles.User:
                            return "User";
                    }
                };
                return ChallengeCtrl;
            }());
            Controllers.ChallengeCtrl = ChallengeCtrl;
            Account.module.controller("ChallengeCtrl", ChallengeCtrl);
        })(Controllers = Account.Controllers || (Account.Controllers = {}));
    })(Account = Stev.Account || (Stev.Account = {}));
})(Stev || (Stev = {}));
