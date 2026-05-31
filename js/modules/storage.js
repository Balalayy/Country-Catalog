export default class UserStorage {
    
    // Сохранение имени пользователя
    saveUserName(name) {
        localStorage.setItem('catalog_user', name);
    }

    // Получение имени пользователя
    getUserName() {
        return localStorage.getItem('catalog_user');
    }

    // Очистка данных пользователя
    clearUserData() {
        localStorage.removeItem('catalog_user');
    }
}