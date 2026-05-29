// Импортируем модули
import UserStorage from './modules/storage.js';
import CountriesAPI from './modules/api.js';
import CountriesUI from './modules/ui.js';

// Главное приложение
class App {
    constructor() {
        this.storage = new UserStorage();
        this.api = new CountriesAPI();
        this.ui = new CountriesUI();
        this.allCountries = [];
        this.init();
    }

    async init() {
        const savedName = this.storage.getUserName();
        
        if (savedName) {
            this.showMainApp(savedName);
            await this.loadCountries();
        } else {
            this.showWelcomeScreen();
        }
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainApp = document.getElementById('main-app');
        
        welcomeScreen.style.display = 'flex';
        mainApp.style.display = 'none';
        
        const form = document.getElementById('welcome-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('user-name');
            const name = nameInput.value.trim();
            
            if (name && name.length > 0) {
                this.storage.saveUserName(name);
                this.showMainApp(name);
                this.loadCountries();
            } else {
                alert('Пожалуйста, введите ваше имя');
            }
        });
    }

    showMainApp(name) {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainApp = document.getElementById('main-app');
        const greetingEl = document.getElementById('greeting');
        
        welcomeScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        if (greetingEl) {
            greetingEl.textContent = `Привет, ${name}! 👋`;
        }
    }

    async loadCountries() {
        const mainContent = document.querySelector('.main-content .container');
        
        // Показываем загрузку через UI модуль
        this.ui.showLoading(mainContent);
        
        try {
            this.allCountries = await this.api.fetchAllCountries();
            console.log('Страны загружены:', this.allCountries.length);
            
            const firstCountry = this.allCountries[0];
            this.ui.showSuccess(mainContent, this.allCountries, firstCountry);
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.ui.showError(mainContent, error.message);
        }
    }
}

// Запуск приложения
const app = new App();