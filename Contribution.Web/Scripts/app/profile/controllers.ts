module Stev.Profile.Controllers {

    class MainCtrl {
        User: UserModel;
        storage: Services.StorageService;

        constructor(_storage) {
            this.storage = _storage;

            this.User = this.storage.User;
        }
    }

    class InfoCtrl {

        Titles = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof.", "Chief"];
        User: UserModel;
        Original: UserModel;

        storage: Services.StorageService;
        notify: Services.NotifyService;
        user: Services.Domain.User;

        constructor(_storage, _user, _notify) {
            this.storage = _storage;

            this.user = _user;
            this.notify = _notify;
            var token = this.storage.Token;

            //Fetch User Data and Populate Model and Backup
            this.User = this.storage.User;
            this.Original = angular.copy(this.User);

        }

        SaveInfo() {
            this.user.updateUser(this.User).then(u => {
                this.notify.success("Update Successful");

                this.storage.User.FirstName = u.FirstName;
                this.storage.User.LastName = u.LastName;
            });
        }

        Reset() {
            //Restore Backup
            this.User = this.storage.User = this.Original;
            return false;
        }
    }

    class OverviewCtrl {
        User: UserModel;
        
        user: Services.Domain.User;

        constructor(_user) {
            this.user = _user;
        }
    }

    class AvatarCtrl {

        Image: String;

        file: Services.FileService;
        user: Services.Domain.User;
        storage: Services.StorageService;
        notify: Services.NotifyService;

        constructor(_file, _user, _storage, _notify) {
            this.file = _file;
            this.user = _user;
            this.storage = _storage;
            this.notify = _notify;
            this.Image = this.storage.User.ImageUrl;
        }

        SelectImage(file: File) {
            //Validate File
            if (!file) { this.Image = null; return }


            //Validate Image
            var extensions = ".jpg,.gif,.jpeg,.png".split(",");
            var isImage = extensions.filter(e => file.name.indexOf(e) > 0).length > 0;
            if (!isImage) { this.notify.error("Only Images are Allowed"); return; }

            //Read File and Create Preview
            this.file.read(file).then(r => this.Image = r);
        }

        UploadImage(file: File) {
            this.user.uploadImage(file).then(imageUrl => {
                //Update Token with Profile Image
                this.storage.User.ImageUrl = imageUrl
                this.notify.success("Profile Image was changed Successfully");
            });
        }


    }

    class PasswordCtrl {
        User: UserModel;
        Password: string;
        NewPassword: string;
        ConfirmPassword: string;

        user: Services.Domain.User;
        notify: Services.NotifyService;
        storage: Services.StorageService;

        constructor(_user, _notify, _storage) {
            this.user = _user;
            this.notify = _notify;
            this.storage = _storage;

            this.User = this.storage.User;
        }

        
        ChangePassword() {
            if (this.NewPassword != this.ConfirmPassword) {
                this.notify.error("Password does not match");
                return;
            }         
            this.user.changePassword(this.User.UserId, this.Password, this.ConfirmPassword)
                .then(() => {
                    this.notify.success("Password is successfully changed");
                    this.Password = this.NewPassword = this.ConfirmPassword = null;
                });
        }

    }

    module.controller("Profile.MainCtrl", MainCtrl);
    module.controller("Profile.InfoCtrl", InfoCtrl);
    module.controller("Profile.OverviewCtrl", OverviewCtrl);
    module.controller("Profile.AvatarCtrl", AvatarCtrl);
    module.controller("Profile.PasswordCtrl", PasswordCtrl);

}