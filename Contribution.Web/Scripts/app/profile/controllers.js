var Stev;
(function (Stev) {
    var Profile;
    (function (Profile) {
        var Controllers;
        (function (Controllers) {
            var MainCtrl = (function () {
                function MainCtrl(_storage) {
                    this.storage = _storage;
                    this.User = this.storage.User;
                }
                return MainCtrl;
            }());
            var InfoCtrl = (function () {
                function InfoCtrl(_storage, _user, _notify) {
                    this.Titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Chief"];
                    this.storage = _storage;
                    this.user = _user;
                    this.notify = _notify;
                    var token = this.storage.Token;
                    //Fetch User Data and Populate Model and Backup
                    this.User = this.storage.User;
                    this.Original = angular.copy(this.User);
                }
                InfoCtrl.prototype.SaveInfo = function () {
                    var _this = this;
                    this.user.updateUser(this.User).then(function (u) {
                        _this.notify.success("Update Successful");
                        _this.storage.User.FirstName = u.FirstName;
                        _this.storage.User.LastName = u.LastName;
                    });
                };
                InfoCtrl.prototype.Reset = function () {
                    //Restore Backup
                    this.User = this.storage.User = this.Original;
                    return false;
                };
                return InfoCtrl;
            }());
            var OverviewCtrl = (function () {
                function OverviewCtrl(_user) {
                    this.user = _user;
                }
                return OverviewCtrl;
            }());
            var AvatarCtrl = (function () {
                function AvatarCtrl(_file, _user, _storage, _notify) {
                    this.file = _file;
                    this.user = _user;
                    this.storage = _storage;
                    this.notify = _notify;
                    this.Image = this.storage.User.ImageUrl;
                }
                AvatarCtrl.prototype.SelectImage = function (file) {
                    var _this = this;
                    //Validate File
                    if (!file) {
                        this.Image = null;
                        return;
                    }
                    //Validate Image
                    var extensions = ".jpg,.gif,.jpeg,.png".split(",");
                    var isImage = extensions.filter(function (e) { return file.name.indexOf(e) > 0; }).length > 0;
                    if (!isImage) {
                        this.notify.error("Only Images are Allowed");
                        return;
                    }
                    //Read File and Create Preview
                    this.file.read(file).then(function (r) { return _this.Image = r; });
                };
                AvatarCtrl.prototype.UploadImage = function (file) {
                    var _this = this;
                    this.user.uploadImage(file).then(function (imageUrl) {
                        //Update Token with Profile Image
                        _this.storage.User.ImageUrl = imageUrl;
                        _this.notify.success("Profile Image was changed Successfully");
                    });
                };
                return AvatarCtrl;
            }());
            var PasswordCtrl = (function () {
                function PasswordCtrl(_user, _notify, _storage) {
                    this.user = _user;
                    this.notify = _notify;
                    this.storage = _storage;
                    this.User = this.storage.User;
                }
                PasswordCtrl.prototype.ChangePassword = function () {
                    var _this = this;
                    if (this.NewPassword != this.ConfirmPassword) {
                        this.notify.error("Password does not match");
                        return;
                    }
                    this.user.changePassword(this.User.UserId, this.Password, this.ConfirmPassword)
                        .then(function () {
                        _this.notify.success("Password is successfully changed");
                        _this.Password = _this.NewPassword = _this.ConfirmPassword = null;
                    });
                };
                return PasswordCtrl;
            }());
            Profile.module.controller("Profile.MainCtrl", MainCtrl);
            Profile.module.controller("Profile.InfoCtrl", InfoCtrl);
            Profile.module.controller("Profile.OverviewCtrl", OverviewCtrl);
            Profile.module.controller("Profile.AvatarCtrl", AvatarCtrl);
            Profile.module.controller("Profile.PasswordCtrl", PasswordCtrl);
        })(Controllers = Profile.Controllers || (Profile.Controllers = {}));
    })(Profile = Stev.Profile || (Stev.Profile = {}));
})(Stev || (Stev = {}));
//# sourceMappingURL=controllers.js.map