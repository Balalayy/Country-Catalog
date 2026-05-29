// Модуль для работы с хранилищем
class UserStorage {
    saveUserName(name) {
        localStorage.setItem('catalog_user', name);
    }

    getUserName() {
        return localStorage.getItem('catalog_user');
    }
}

// Модуль для работы с API
class CountriesAPI {
    async fetchAllCountries() {
        console.log('Начинаем загрузку стран...');
        
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,independent,flags,languages');
            
            console.log('Статус ответа:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ошибка: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Получено стран:', data.length);
            
            return data.map(country => ({
                name: country.name?.common || 'Unknown',
                officialName: country.name?.official || 'Unknown',
                capital: country.capital ? country.capital[0] : 'Нет столицы',
                region: country.region || 'Unknown',
                population: country.population || 0,
                area: country.area || 0,
                independent: country.independent === true,
                flagUrl: country.flags?.svg || country.flags?.png || '',
                languages: country.languages ? Object.values(country.languages) : []
            }));
            
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            throw error;
        }
    }
}

// Главное приложение
class App {
    constructor() {
        this.storage = new UserStorage();
        this.api = new CountriesAPI();
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
        console.log('Загружаем страны...');
        
        try {
            this.allCountries = await this.api.fetchAllCountries();
            console.log('Страны загружены:', this.allCountries.length);
            
            const firstCountry = this.allCountries[0];
            console.log('Первая страна:', firstCountry.name);
            
            const mainContent = document.querySelector('.main-content .container');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="background: #e8f4f8; padding: 20px; border-radius: 10px;">
                        <h2>Данные успешно загружены</h2>
                        <p>Загружено стран: <strong>${this.allCountries.length}</strong></p>
                        <p>Пример: ${firstCountry.name} (${firstCountry.capital})</p>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Ошибка:', error);
            const mainContent = document.querySelector('.main-content .container');
            if (mainContent) {
                mainContent.innerHTML = `
                    <div style="background: #fee; padding: 20px; border-radius: 10px; color: #c0392b;">
                        <h2>❌ Ошибка загрузки</h2>
                        <p>Не удалось загрузить данные о странах.</p>
                        <p>Проверьте подключение к интернету.</p>
                    </div>
                `;
            }
        }
    }
}

const app = new App();