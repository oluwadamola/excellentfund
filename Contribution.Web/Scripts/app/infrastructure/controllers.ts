namespace Stev.Infrastructure {

    class NavBarCtrl {
        storage: Services.StorageService;

        User: UserModel;

        constructor(_storage) {
            this.storage = _storage;
            this.User = this.storage.User;
        }

        getFullName(user: Token) {
            user.FirstName + " " + user.LastName
        }

        SignOut() {
            this.storage.Clear();
            return true;
        }
    }

    module.controller("NavBarCtrl", NavBarCtrl);
}