module Stev.Group.Controllers {

    class GroupsCtrl {

        Groups: GroupModel[];
        Group: GroupModel;

        modal: angular.ui.bootstrap.IModalService;
        group: Services.Domain.Group;
        storage: Services.StorageService;

        constructor($uibModal, _group, _storage, $stateParams) {
            this.modal = $uibModal;
            this.group = _group;
            this.storage = _storage;
            this.GetGroups();
        }

        GetGroups() {
            var role = Constants.Roles.SystemAdministrator

            //Check to see if user has admin role
            var hasRole = this.storage.User.Roles.filter(r => r.RoleName == role).length;
            if (hasRole) {
                this.group.GetGroups().then(g => this.Groups = g);
            }
            else {
                this.group.GetUserGroup(this.storage.User.UserId).then(ug => this.Groups = ug);
            }
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

        add() {

           var instance = this.modal.open({
                templateUrl: "group.html",
                controller: "AddGroupCtrl as model",
            });
            instance.result.then(g =>  this.GetGroups());
        }
    }

    class AddGroupCtrl {
        Title: string;
        Group: GroupModel;

        instance: angular.ui.bootstrap.IModalServiceInstance;
        notify: Services.NotifyService;
        group: Services.Domain.Group;

        constructor($uibModalInstance, _notify, _group) {
            this.instance = $uibModalInstance;
            this.notify = _notify;
            this.group = _group;
        }

        Ok(form: angular.IFormController, group: GroupModel) {
            if (form.$valid) {
                var instance = this.group.createGroup(group).then(g => {
                    this.Group = g;
                    this.notify.success("Group successfully added");
                    this.instance.close();
                });
            }
            else {
                this.notify.warning("Group name is required");
            }
        }

        Cancel() {
            this.instance.dismiss(this.notify.info("User closed dialog"));
        }
    }

    class GroupCtrl {
        Group: GroupModel;

        notify: Services.NotifyService;
        group: Services.Domain.Group;
        modal: angular.ui.bootstrap.IModalService;
        

        constructor(_group, _notify, $stateParams, $uibModal) {
            this.group = _group;
            this.notify = _notify;
            this.modal = $uibModal;

            this.group.GetGroup($stateParams["id"]).then(g => this.Group = g);
        }

        editGroup() {
            var instance = this.modal.open({
                templateUrl: "group.html",
                controller: "EditGroupCtrl as model",
                resolve: {
                    group: () => angular.copy(this.Group)
                }

            });

            instance.result.then(g => this.Group = g);
        }
    }

    class EditGroupCtrl {
        Group: GroupModel;
        Title = "Edit Group";

        notify: Services.NotifyService;
        instance: angular.ui.bootstrap.IModalServiceInstance;
        group: Services.Domain.Group;

        constructor(_notify, _group, $uibModalInstance, group) {

            this.notify = _notify;
            this.group = _group;
            this.instance = $uibModalInstance;
            this.Group = group;
        }

        
        Ok(form: angular.IFormController) {
            if (form.$valid) {
                this.group.updateGroup(this.Group).then(g => this.instance.close(g));

            }
            else {
                this.notify.warning("Invalid data received")
            }
        }
        Cancel() {
            this.instance.dismiss(this.notify.info("User Closed dialog box"));
        }

    }
    module.controller("GroupsCtrl", GroupsCtrl);
    module.controller("AddGroupCtrl", AddGroupCtrl);
    module.controller("GroupCtrl", GroupCtrl);
    module.controller("EditGroupCtrl", EditGroupCtrl);
}

module Stev.Group.Controllers {

    class UsersGrpCtrl {

        Users: UserModel[];
        Group: GroupModel;

        user: Services.Domain.User;
        group: Services.Domain.Group;
        notify: Services.NotifyService;
        modal: angular.ui.bootstrap.IModalService;

        constructor(_user, $stateParams, _notify, _group, $uibModal) {
            this.user = _user;
            this.modal = $uibModal;
            this.notify = _notify;
            this.group = _group;

            this.user.getUsersInGroup($stateParams["gid"]).then(u => {
                this.Users = u;
            }).catch(m => this.notify.warning(m));

            this.group.GetGroup($stateParams["gid"]).then(g => this.Group = g);
            //this.getUsers();

            this.fetchUsers($stateParams["gid"])
        }

        fetchUsers(groupId: number) {
            this.user.getUsersInGroup(groupId).then(g => this.Users = g);
        }

        addUserGroup() {
           var instance = this.modal.open({
                templateUrl: "usergroup.html",
                controller: "AddUserGroupCtrl as model"
            });

           instance.result.then(() => this.fetchUsers(this.Group.GroupId));
        }
    }

    class UserGrpCtrl {

        User: UserModel;
        Group: GroupModel;
        UserId: number;

        user: Services.Domain.User;
        notify: Services.NotifyService;
        group: Services.Domain.Group;


        constructor(_user, _notify,_group,$stateParams) {

            this.user = _user;
            this.notify = _notify;
            this.group = _group;

            this.UserId = $stateParams["id"];

            //this.user.getUserInGroup(1, 1).then(u => this.User = u);
            this.user.getUserInGroup($stateParams["gid"], this.UserId).then(u => this.User = u);
            this.group.GetGroup($stateParams["gid"]).then(g => this.Group = g);
        }


    }

    class AddUserGroupCtrl {

        //User: UserModel;
        Group: GroupModel;
        Users: UserModel[];
        GroupId: number;
        //Groups: GroupModel[];

        group: Services.Domain.Group;
        user: Services.Domain.User;
        notify: Services.NotifyService;
        instance: angular.ui.bootstrap.IModalServiceInstance;

        constructor(_group, _user, $uibModalInstance, _notify, $stateParams) {

            this.group = _group;
            this.user = _user;
            this.notify = _notify;
            this.instance = $uibModalInstance;
            this.GroupId = $stateParams["gid"];

            //this.group.GetGroups().then(g => this.Groups = g);
            this.user.getUsers().then(u => this.Users = u);
        }

        Ok(form: angular.IFormController, user: UserModel) {
            if (form.$valid) {
                this.user.assignUserToGroup(this.GroupId, user).then(u => this.Users = u)
                    .then(() => {
                        this.notify.success("User added to group successfully");
                        this.instance.close();
                    });
            }
            else {
                this.notify.error("Please select a user to add to this group");
            }
        }

        Cancel() {

            this.instance.dismiss(this.notify.info("User closed dialog"));
        }
    }


    module.controller("UsersGrpCtrl", UsersGrpCtrl);
    module.controller("UserGrpCtrl", UserGrpCtrl);
    module.controller("AddUserGroupCtrl", AddUserGroupCtrl);
}


module Stev.Group.Controllers {

    class ContributorsCtrl {

        User: UserModel;
        //Users: UserModel[];
        Group: GroupModel;
        Contributions: ContributionModel[];

        modal: angular.ui.bootstrap.IModalService;
        group: Services.Domain.Group;
        user: Services.Domain.User;
        contribution: Services.Domain.Contribution;
        notify: Services.NotifyService;

        constructor(_user, _notify, _contribution, $stateParams, _group, $uibModal) {
            this.user = _user;
            this.notify = _notify;
            this.contribution = _contribution;
            this.group = _group;
            this.modal = $uibModal;
            //this.contribution.getContributors().then(c => this.Contribution = c);

            //this.contribution.getContributorsInGroup($stateParams["gid"]).then(c => this.Contributions = c);
            this.fetchContributors($stateParams["gid"])
            this.group.GetGroup($stateParams["gid"]).then(g => this.Group = g);

        }

        fetchContributors(groupId: number) {
            this.contribution.getContributorsInGroup(groupId).then(c => this.Contributions = c);
        }

        addContributionsGroup() {

          var instance =  this.modal.open({
                templateUrl: "usercontributiongroup.html",
                controller: "AddUserContributionGroupCtrl as model",
                resolve: {
                    group: () => this.Group
                }
            });

          instance.result.then(() => this.fetchContributors(this.Group.GroupId));
        }

    }

    class AddUserContributionGroupCtrl {

        Users: UserModel[];
        User: UserModel;
        Month: MonthModel;
        Months: MonthModel[];
        Contribution: ContributionModel;
        Group: GroupModel;

        user: Services.Domain.User;
        contribution: Services.Domain.Contribution;
        notify: Services.NotifyService;
        instance: angular.ui.bootstrap.IModalServiceInstance;

        constructor(_user, _contribution, _notify, $uibModalInstance, group) {
            debugger;
            this.user = _user;
            this.contribution = _contribution;
            this.notify = _notify;
            this.instance = $uibModalInstance;
            this.Group = group;

            this.user.getUsersInGroup(this.Group.GroupId).then(u => this.Users = u);
            this.Months = this.contribution.getAllMonths();
            
        }

        Ok(form: angular.IFormController, contribution: ContributionModel) {
            if (form.$valid) {
                contribution.GroupId = this.Group.GroupId;
                contribution.UserId = contribution.Users[0].UserId;
                contribution.MonthId = contribution.Month.MonthId;

                var instance = this.contribution.addUserContributionToGroup(contribution).then(c => {
                    this.Contribution = c;
                    this.notify.success("User Contribution is successfully added to this Group");
                    this.instance.close();
                })
            }
            else {
                this.notify.warning("User Contribution not added!..Something went wrong");
            }
        }
        Cancel() {
            this.instance.dismiss(this.notify.info("User closed dialog"));
        }
    }

    module.controller("ContributorsCtrl", ContributorsCtrl);
    module.controller("AddUserContributionGroupCtrl", AddUserContributionGroupCtrl);
}

module Stev.Group.Controllers {

    class CollectorsCtrl {

        Users: UserModel[];
        Collectors: CollectorModel[];
        Group: GroupModel;

        user: Services.Domain.User;
        group: Services.Domain.Group;
        collector: Services.Domain.Collector;
        notify: Services.NotifyService;
        modal: angular.ui.bootstrap.IModalService;
 
    
         
        constructor(_user, _group, _notify, $uibModal, $stateParams, _collector) {
            this.user = _user;
            this.collector = _collector;
            this.group = _group;
            this.notify = _notify;
            this.modal = $uibModal;
            
            this.user.getUsersInGroup($stateParams["gid"]).then(u => this.Users = u);
            this.group.GetGroup($stateParams["gid"]).then(g => this.Group = g);
            this.fetchCollectors($stateParams["gid"]);

        }

        fetchCollectors(groupId: number) {
            this.collector.getCollectorsInGroup(groupId).then(c => this.Collectors = c);
        }

        addCollector() {
           var instance = this.modal.open({
                templateUrl: "collector.html",
                controller: "CollectorCtrl as model",
                resolve: {
                    group: () => this.Group
                }
            });
           instance.result.then(() => this.fetchCollectors(this.Group.GroupId));
        }

    }

    class CollectorCtrl {

        Users: UserModel[];
        Collector: CollectorModel;
        Collectors: CollectorModel[];
        User: UserModel;
        Month: MonthModel;
        Months: MonthModel[];
        Contribution: ContributionModel;
        Group: GroupModel;

        user: Services.Domain.User;
        contribution: Services.Domain.Contribution;
        notify: Services.NotifyService;
        instance: angular.ui.bootstrap.IModalServiceInstance;
        collector: Services.Domain.Collector;

        constructor(_user, _notify, $uibModalInstance, group, _contribution, _collector) {
        
            this.user = _user;
            this.notify = _notify;
            this.instance = $uibModalInstance;
            this.Group = group;
            this.contribution = _contribution;
            this.collector = _collector;

            this.user.getUsersInGroup(this.Group.GroupId).then(u => this.Users = u);
            this.collector.getCollectorsInGroup(this.Group.GroupId).then(c => this.Collectors = c);
            this.Months = this.contribution.getAllMonths();

        }
        Ok(form: angular.IFormController, collector: CollectorModel) {
            if (form.$valid) {
                collector.UserId = collector.User.UserId;
                collector.GroupId = this.Group.GroupId;
                collector.MonthId = collector.Month.MonthId;

                this.collector.addCollectorToGroup(collector).then(c => this.Collectors = c);
            }
        }

        Cancel() {
            this.instance.dismiss(this.notify.info("User closed dialog"));
        }
    }

    module.controller("CollectorsCtrl", CollectorsCtrl);
    module.controller("CollectorCtrl", CollectorCtrl);

}