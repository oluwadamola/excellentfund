module Stev.Services {
    export class StorageService {

        private user: UserModel;
        private token: Token;

        //Gets currently logged in User
        get User() {
            if (!this.user) {
                this.user = this.Get<UserModel>(Constants.UserKey);
            }
            return this.user;
        }

        set User(user: UserModel) {
            this.user = user;
            this.Store(Constants.UserKey, user);
        }

        get Token() {
            if (!this.token) {
                this.token = this.Get<Token>(Constants.OAuthTokenKey);
            }
            return this.token;
        }

        set Token(token: Token) {
            this.token = token;
            this.Store(Constants.OAuthTokenKey, token);
        }


        //Local Storage Methods
        private Store(key, value) {
            return window.localStorage.setItem(key, JSON.stringify(value));
        }

        private Remove(key: string) {
            window.localStorage.removeItem(key);
        }

        private Get<T>(key: string) {
            return <T>JSON.parse(window.localStorage.getItem(key));
        }

        Clear() {
            window.localStorage.clear();
        }
    }

    module.service("_storage", StorageService)
}