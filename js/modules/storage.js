export default class UserStorage {
    saveUserName(name) {
        localStorage.setItem('catalog_user', name);
    }

    getUserName() {
        return localStorage.getItem('catalog_user');
    }

    clearUserData() {
        localStorage.removeItem('catalog_user');
    }
}