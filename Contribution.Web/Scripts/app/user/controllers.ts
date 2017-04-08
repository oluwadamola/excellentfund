module Stev.User.Controllers {
    class HomeCtrl {


    }

    class UsersCtrl {

        User: UserModel;
        Users: UserModel[];

        user: Services.Domain.User;
        notify: Services.NotifyService;
        modal: angular.ui.bootstrap.IModalService;
        state: angular.ui.IStateService;
        storage: Services.StorageService;

        constructor(_user, _notify, $uibModal, $state, $stateParams, _storage) {
            this.user = _user;
            this.notify = _notify;
            this.modal = $uibModal;
            this.state = $state;
            this.storage = _storage;

            var GetUsers = this.user.getUsers().then(u => this.Users = u);
            
        }

       
        
        Add() {
           var instance = this.modal.open({
                templateUrl: "addUser.html",
                controller: "AddUserCtrl as model",            
            });

          // instance.result.then(() => this.Users = GetUsers());
        }

        showCreate() {
            var role = Constants.Roles.SystemAdministrator

            //Check to see if user has admin role
            var hasRole = this.storage.User.Roles.filter(r => r.RoleName == role).length;
            if (hasRole) {
                return true;
            }
            else {
                return false;
            }
        }

        Select(user: UserModel) {
            this.state.go("users.profile",
                {
                    id: user.UserId
                });
            //this.user.getUser(user.UserId).then(u => this.User = u);
        }

    }

    class AddUserCtrl {

        User: UserModel;

        instance: angular.ui.bootstrap.IModalServiceInstance;
        user: Services.Domain.User;
        notify: Services.NotifyService;

        constructor($uibModalInstance, _user, _notify) {
            this.instance = $uibModalInstance;
            this.user = _user;
            this.notify = _notify;
        }


        Ok(form: angular.IFormController, user) {
            if (form.$valid) {
                this.user.addUser(user).then(() => {
                    this.notify.success("User is successfully created");
                    this.instance.close();
                });
            }
            else {
                this.notify.warning("Invalid Data Received");
            }
           
        }

        Cancel() {
            this.instance.dismiss("User closed dialog");
        }
    }

    class UserCtrl {
        
        User: UserModel;
        Roles: RoleModel[];
        
        user: Services.Domain.User;
        modal: angular.ui.bootstrap.IModalService;

        constructor(_user, $stateParams, $uibModal) {
            this.user = _user;
            this.modal = $uibModal;
            //this.user.getUser($stateParams["id"]).then(u => this.User = u);

            this.GetRoles($stateParams["id"]);
        }

        GetRoles(userId: number) {
            //this.Roles = this.user.getAllRoles();
            /*this.user.getUser(userId).then(u => {
                this.User = u;
                //this.Roles = u.Roles.map(r => this.user.getRole(r.RoleName))
            });*/

            this.user.getUserRoles(userId).then(r => this.Roles = r);
        }

        AddRole() {
            var instance = this.modal.open({
                templateUrl: "role.html",
                controller: "AddRoleCtrl as model",

            });

            instance.result.then(() => this.GetRoles(this.User.UserId));
        }

        RemoveRole(role: RoleModel) {
            var instance =  this.modal.open({
                templateUrl: "remove-role.html",
                controller: "RemoveRoleCtrl as model",
                resolve: { user: () => this.User, role: () => role  }
            });

            instance.result.then(() => {

                this.user.removeRole(this.User, role);

                var rIndex = this.Roles.indexOf(role);
                if (rIndex != -1) this.Roles.splice(rIndex, 1);
            });
        }
    }

    class AddRoleCtrl {
        Roles: RoleModel[];
        User: UserModel;

        user: Services.Domain.User;
        notify: Services.NotifyService;
        instance: angular.ui.bootstrap.IModalServiceInstance;

        constructor(_user, _notify, $uibModalInstance, user) {
            this.user = _user;
            this.notify = _notify;
            this.instance = $uibModalInstance;
            this.Roles = this.user.getAllRoles();
            this.User = user;
        }

        Ok(form: angular.IFormController, role: RoleModel) {
            if (form.$valid) {
                this.user.assignRole(this.User.UserId, role.RoleName).then(() => {
                    this.notify.success("Role added successfully");
                    this.instance.close();
                });
            }
            else {
                this.notify.warning("Fill all required field");
            }

        }

        Cancel() {
            this.instance.dismiss("User close dialog");
        }
    }

    class RemoveRoleCtrl{
        instance: angular.ui.bootstrap.IModalServiceInstance;
        Role: RoleModel;
        User: UserModel;


        constructor($uibModalInstance, role, user) {
            this.instance = $uibModalInstance;
            this.Role = role;
            this.User = user;
        }

        Ok(role: RoleModel) {
            this.instance.close();
        }

        Cancel() {
            this.instance.dismiss();
        }
    }

    module.controller("HomeCtrl", HomeCtrl);
    module.controller("UsersCtrl", UsersCtrl);
    module.controller("AddUserCtrl", AddUserCtrl);
    module.controller("UserCtrl", UserCtrl);
    module.controller("AddRoleCtrl", AddRoleCtrl);
    module.controller("RemoveRoleCtrl", RemoveRoleCtrl);

}