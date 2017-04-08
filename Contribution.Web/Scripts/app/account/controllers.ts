module Stev.Account.Controllers {
    class NavigationCtrl {
        location: angular.ILocationService;

        constructor($location) {
            this.location = $location;
            //angular.element(".sidebar-nav li a").click("")
        }

        IsActive(viewLocation: string) {
            //Make sure that viewLocation starts location so that /home/index is valid for /home  
            return this.location.path().indexOf(viewLocation) == 0;
        };
    }
    module.controller("NavigationCtrl", NavigationCtrl);
}

module Stev.Account.Controllers {

    class SignInCtrl {

        Roles: {}[];
        UserId: number;

        user: Services.Domain.User;
        notify: Services.NotifyService;
        storage: Services.StorageService;
        state: angular.ui.IStateService;

        User = { Email: "", Password: "" }

        constructor(_user, _notify, $state, _storage) {
            this.user = _user;
            this.notify = _notify;
            this.state = $state;
            this.storage = _storage;
        }

        SignIn() {
            //Validate User

            var signIn = this.user
                .signIn(this.User.Email, this.User.Password)
                .then(u => {
                    this.user.getUserRoles(u.UserId).then(r => {
                        this.Redirect(r),
                            u.Roles = r;
                        this.storage.User = u;       //Save Role to Storage
                    }),
                        this.UserId = u.UserId
                })
                .catch(err => this.notify.error(err));
        }


        Redirect(roles: RoleModel[]) {
            if (!roles.length) {
                this.notify.error("No Role found, Please Contact your Administrator");
            }
            else if (roles.length == 1) {
                //Redirect to Challenge Area
                var role = this.user.getRole(roles[0].RoleName);
                document.location.href = role.Url;
            }
            else if (roles.length > 1) {
                var userId = this.UserId;
                this.state.go("challenge", { id: userId });
            }
        }
        

        KeyPress($event: JQueryEventObject) {
            //If Enter was Pressed
            if ($event.keyCode == 13) {
                this.SignIn();
            }
        }
    }
    module.controller("SignInCtrl", SignInCtrl);
}

module Stev.Account.Controllers {

    class SignUpCtrl {

        User: UserModel;
        Roles: RoleModel[];

        ConfirmPassword: string;

        user: Services.Domain.User;
        notify: Services.NotifyService;
        state: angular.ui.IStateService;
        storage: Services.StorageService;

        constructor(_user, _notify, $state, _storage) {
            this.user = _user;
            this.notify = _notify;
            this.state = $state;
            this.storage = _storage;
        }


        SignUp() {
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
            var signIn = register.then(u => this.user.signIn(this.User.Email, this.User.Password));

            signIn.then(id => {
                this.notify.success("User was created Successfully");
            }).then(u => 
                this.user.getUserRoles(this.User.UserId))
                .then(r => {

                    this.Roles = r;
                var admin = Stev.Constants.Roles.SystemAdministrator;

                let adminRole = {
                    RoleId: this.Roles[0].RoleId,
                        RoleName: Stev.Constants.Roles.SystemAdministrator,
                        Title: Stev.Constants.Roles.SystemAdministrator,
                        Url: "/systemadmin"
                };

                //Add User Role
                let user = this.storage.User    //Get Role from Storage
                user.Roles.push(adminRole);
                this.storage.User = user;       //Save Role to Storage

                document.location.href = "/systemadmin";
            });;
        }

        KeyPress($event: JQueryEventObject) {
            //If Enter was Pressed
            if ($event.keyCode == 13) {
                this.SignUp();
            }
        }
    }
    module.controller("SignUpCtrl", SignUpCtrl);
}

module Stev.Account.Controllers {
    export class RecoveryCtrl {

        user: Services.Domain.User;
        notify: Services.NotifyService;
        User: UserModel;

        constructor(_user, _notify) {
            this.user = _user;
            this.notify = _notify;
        }

        recover() {
            if (this.User) {
                this.user
                    .recover(this.User.Email)
                    .then(() => this.notify.success("Your password is now reset and an email has been sent to your mailbox"));
            }
        }

        KeyPress($event: JQueryEventObject) {
            if ($event.keyCode == 13) {
                this.recover();
            }
        }
    }

    module.controller("RecoveryCtrl", RecoveryCtrl);
}

module Stev.Account.Controllers {
    export class ChallengeCtrl {

        user: Services.Domain.User;
        storage: Services.StorageService;
        notify: Services.NotifyService;

        Roles: {}[];

        constructor($stateParams, _user, _notify, _storage) {

            this.user = _user;
            this.notify = _notify;
            this.storage = _storage;

            this.user
                .getUserRoles($stateParams["id"])
                .then(r => this.SetRoles(r));
        }

        SetRoles(roles: RoleModel[]) {
            //this.Roles = userRoles.map(r => { return { UserRole: r, Role: this.user.getRole(r.Role.Name) } });

            debugger;
            this.Roles = roles.map(r =>
            {
                var role = this.user.getRole(r.RoleName);
                return  { Role: role}
            });
        }

        Select(url: string) {
            document.location.href = url;
        }

        GetIcon(role: RoleModel): {} {
            switch (role.RoleName) {
                case Constants.Roles.SystemAdministrator:
                    return { "fa-gear": true };
                case Constants.Roles.User:
                    return { "fa-user": true };
            }
        }

        GetTitle(role: RoleModel) {
            switch (role.RoleName) {
                case Constants.Roles.SystemAdministrator:
                    return "Admin";
                case Constants.Roles.User:
                    return "User";
            }
        }
    }

    module.controller("ChallengeCtrl", ChallengeCtrl);
}

