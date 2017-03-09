module Stev.Services.Domain {

    export class User {
        private http: HttpService;      // Custom HTTP Service that understands Operation
        private Q: angular.IQService;
        private $http: angular.IHttpService; // Angular's HTTP Service
        private file: FileService;
        private storage: StorageService;

        constructor($q, $http, _http, _file, _storage) {
            this.http = _http;
            this.$http = $http;
            this.Q = $q;
            this.file = _file;
            this.storage = _storage;
        }


        createUser(model: UserModel) {
            debugger;
            return this.http.post<UserModel>('/api/users', model);
        }

        updateUser(model: UserModel) {
            return this.http.put<UserModel>('/api/users/' + model.UserId, model);
        }

        signIn(email: string, password: string) {
            var deferred = this.Q.defer<UserModel>();

            var data = "grant_type=password&username=" + email + "&password=" + password;
            var postCredentials = this.$http.post<Token>('/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

            var signIn = postCredentials
                .then(response => {
                    var token = response.data;
                    this.storage.Token = token;
                    return token
                })
                .then(t => {
                    return this.http.get<UserModel>(`/api/users/${t.UserId}`);
                }) //Also Fetch User Information
                .then(u => {
                    this.storage.User = u;
                    deferred.resolve(u);
                });

            signIn.catch(err => deferred.reject(err.data.error_description));

            return deferred.promise;
        }

        getUser(userId: number) {
            return this.http.get<UserModel>('/api/users/' + userId);
        }

        getUsers() {
            return this.http.get<UserModel[]>("/api/users/GetUsers");
        }

        addUser(user: UserModel) {
            return this.http.post<number>("/api/users/user", user);
        }

        getRole(role: string): RoleModel {
            switch (role) {
                case Constants.Roles.SystemAdministrator:
                    return {RoleId:1, RoleName: Constants.Roles.SystemAdministrator, Title: "System Administrator", Url: "/systemadmin" };
                case Constants.Roles.User:
                    return {RoleId:2, RoleName: Constants.Roles.User, Title: "User", Url: "/user" };
            }
        }

        isInRole(role: string) {
            var roles = this.storage.User.Roles.map(r => r.RoleName.toLowerCase());
            var isInRole = roles.indexOf(role.toLowerCase()) >= 0;
            return isInRole;
        }

        recover(email: string) {
            return this.http.put<void>(`/api/users/recover/?email=${email}`);
        }

        changePassword(userID: number, password: string, newPassword: string) {
            return this.http.put<void>(`/api/users/${userID}/password`, {
                Password: password,
                NewPassword: newPassword
            });
        }

        getRoles(userID: number) {
            return this.http.get<RoleModel[]>(`/api/users/${userID}/roles`);
        }

        getUserRoles(userId: number) {
            return this.http.get<RoleModel[]>(`/api/users/${userId}/roles`);
        }

        getAllRoles() {
            return Object.keys(Constants.Roles).map(k => this.getRole(Constants.Roles[k]));
        }

        assignRole(userID: number, role: string) {
            return this.http.put<UserModel>(`/api/users/${userID}/roles`, {
                Role: role
            });
        }

        removeRole(user: UserModel, role: RoleModel) {
            return this.http.delete(`/api/users/${user.UserId}/roles?role=${role.RoleName}`);
        }

        uploadImage(file: File) {

            var defer = this.Q.defer<string>();

            var userId = this.storage.User.UserId;
            var uploadFile = this.file.post<Operation<string>>(`/api/users/${userId}/image`, file);

            uploadFile.then(r => defer.resolve(r.Result));
            uploadFile.catch(r => defer.reject(r));

            return defer.promise;
        }

        getUsersInGroup(groupId: number) {
            return this.http.get<UserModel[]>(`/api/groups/${groupId}/users`);
        }

        assignUserToGroup(groupId: number, User: UserModel) {

            return this.http.post<UserModel[]>(`/api/groups/${groupId}/users/${User.UserId}`);
        }

        getUserInGroup(groupId: number, userId: number) {
            return this.http.get<UserModel>(`/api/groups/${groupId}/users/${userId}`);
        }
    }

    export class Group {
        private http: HttpService;
        private $http: angular.IHttpService;
        private Q: angular.IQService;
        private storage: StorageService;

        constructor(_http, _storage, $http, $q) {
            this.$http = $http; 
            this.http = _http;
            this.Q = $q;
            this.storage = _storage;
        }

        createGroup(model: GroupModel) {
            return this.http.post<GroupModel>("/api/groups", model);
        }
        updateGroup(model: GroupModel) {
            return this.http.put<GroupModel>("/api/groups" + model.GroupId, model);
        }
        GetGroups() {
            return this.http.get<GroupModel[]>("/api/groups");
        }

        GetGroup(groupId: number) {
            return this.http.get<GroupModel>(`/api/groups/${groupId}`);
        }

        GetUserGroup(userId: number) {
            return this.http.get<GroupModel[]>(`/api/groups/users/${userId}`);
        }

    }

    export class Contribution {
        private http: HttpService;
        private $http: angular.IHttpService;
        private Q: angular.IQService;
        private storage: StorageService;

        constructor(_storage, _http, $http, $q) {
            this.http = _http;
            this.Q = $q;
            this.$http = $http;
            this.storage = _storage;

        }

        getContributors() {
            return this.http.get<ContributionModel[]>(`/api/contributors`);
        }

        getContributorsInGroup(groupId: number) {
            return this.http.get<ContributionModel[]>(`/api/contributors/${groupId}`);
        }

        getAllMonths() {
            return Object.keys(Constants.AppMonths).map(k => this.getMonth(Constants.AppMonths[k]));;
        }

        getMonth(month: string): MonthModel {
            switch (month) {
                case Constants.AppMonths.January:
                    return { MonthId: 1, MonthName: Constants.AppMonths.January };
                case Constants.AppMonths.February:
                    return { MonthId: 2, MonthName: Constants.AppMonths.February };
                case Constants.AppMonths.March:
                    return { MonthId: 3, MonthName: Constants.AppMonths.March };
                case Constants.AppMonths.April:
                    return { MonthId: 4, MonthName: Constants.AppMonths.April };
                case Constants.AppMonths.May:
                    return { MonthId: 5, MonthName: Constants.AppMonths.May };
                case Constants.AppMonths.June:
                    return { MonthId: 6, MonthName: Constants.AppMonths.June };
                case Constants.AppMonths.July:
                    return { MonthId: 7, MonthName: Constants.AppMonths.July };
                case Constants.AppMonths.August:
                    return { MonthId: 8, MonthName: Constants.AppMonths.August };
                case Constants.AppMonths.September:
                    return { MonthId: 9, MonthName: Constants.AppMonths.September };
                case Constants.AppMonths.October:
                    return { MonthId: 10, MonthName: Constants.AppMonths.October };
                case Constants.AppMonths.November:
                    return { MonthId: 11, MonthName: Constants.AppMonths.November };
                case Constants.AppMonths.December:
                    return { MonthId: 12, MonthName: Constants.AppMonths.December };
            }
        }

        addUserContributionToGroup(model: ContributionModel) {
            return this.http.post<ContributionModel>(`/api/contributors`, model);
        }
    }

    export class Collector {
        private http: HttpService;
        private $http: angular.IHttpService;
        private Q: angular.IQService;
        private storage: StorageService;

        constructor(_storage, _http, $http, $q) {
            this.http = _http;
            this.Q = $q;
            this.$http = $http;
            this.storage = _storage;

        }

        getCollectorsInGroup(groupId: number) {
            return this.http.get<CollectorModel[]>(`/api/collectors/${groupId}`);
        }

        addCollectorToGroup(collector: CollectorModel) {
            return this.http.post<CollectorModel[]>(`/api/collectors`, collector);
        }
    }

    

    module.service("_user", User);
    module.service("_group", Group);
    module.service("_contribution", Contribution);
    module.service("_collector", Collector);
}