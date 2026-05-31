import UserStorage from './modules/storage.js';
import CountriesAPI from './modules/api.js';
import CountriesUI from './modules/ui.js';
import StatisticsCalculator from './modules/stats.js';

class App {
    constructor() {
        this.storage = new UserStorage();
        this.api = new CountriesAPI();
        this.ui = new CountriesUI();
        this.stats = new StatisticsCalculator();
        this.allCountries = [];
        this.filteredCountries = [];
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
        this.ui.showLoading(mainContent);
        
        try {
            this.allCountries = await this.api.fetchAllCountries();
            console.log('Страны загружены:', this.allCountries.length);
            
            this.populateRegionFilter();
            this.applyFilters();
            this.bindEvents();
            
        } catch (error) {
            console.error('Ошибка:', error);
            this.ui.showError(mainContent, error.message);
        }
    }

    populateRegionFilter() {
        const regionFilter = document.getElementById('region-filter');
        if (!regionFilter) return;
        
        const regions = [...new Set(this.allCountries.map(c => c.region))].sort();
        
        regionFilter.innerHTML = '<option value="all">🌍 Все регионы</option>';
        regions.forEach(region => {
            const option = document.createElement('option');
            option.value = region;
            option.textContent = region;
            regionFilter.appendChild(option);
        });
    }

    applyFilters() {
        if (!this.allCountries.length) return;
        
        const sortBy = document.getElementById('sort-select')?.value || 'name';
        const region = document.getElementById('region-filter')?.value || 'all';
        const searchTerm = document.getElementById('search-input')?.value || '';
        const onlyIndependent = document.getElementById('independent-filter')?.checked || false;
        
        let filtered = [...this.allCountries];
        
        // Фильтр по региону
        if (region !== 'all') {
            filtered = filtered.filter(country => country.region === region);
        }
        
        // Фильтр по поиску
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(country => 
                country.name.toLowerCase().includes(term) ||
                country.capital.toLowerCase().includes(term)
            );
        }
        
        // Фильтр по независимости
        if (onlyIndependent) {
            filtered = filtered.filter(country => country.independent === true);
        }
        
        // Сортировка
        if (sortBy === 'name_asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name_desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'population_asc') {
            filtered.sort((a, b) => a.population - b.population);
        } else if (sortBy === 'population_desc') {
            filtered.sort((a, b) => b.population - a.population);
        } else if (sortBy === 'area_asc') {
            filtered.sort((a, b) => a.area - b.area);
        } else if (sortBy === 'area_desc') {
            filtered.sort((a, b) => b.area - a.area);
}
        
        this.filteredCountries = filtered;
        
        // Отображение стран
        const mainContent = document.querySelector('.main-content .container');
        this.ui.renderCountries(mainContent, this.filteredCountries);
        
        // Обновление статистики
        this.updateStatistics();
    }

    updateStatistics() {
        // Используем методы из модуля статистики
        const totalCount = this.stats.getTotalCount(this.allCountries);
        const filteredCount = this.stats.getTotalCount(this.filteredCountries);
        const avgPopulation = this.stats.getAveragePopulation(this.filteredCountries);
        const avgArea = this.stats.getAverageArea(this.filteredCountries);
        
        document.getElementById('total-count').textContent = totalCount;
        document.getElementById('filtered-count').textContent = filteredCount;
        document.getElementById('avg-population').textContent = this.stats.formatNumber(avgPopulation);
        document.getElementById('avg-area').textContent = this.stats.formatNumber(avgArea);
    }

    formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' млрд';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + ' млн';
        if (num >= 1000) return (num / 1000).toFixed(1) + ' тыс';
        return num.toLocaleString();
    }

    bindEvents() {

        // Сортировка
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.applyFilters());
        }
        
        // Фильтр по региону
        const regionFilter = document.getElementById('region-filter');
        if (regionFilter) {
            regionFilter.addEventListener('change', () => this.applyFilters());
        }
        
        // Фильтр по независимости
        const independentCheckbox = document.getElementById('independent-filter');
        if (independentCheckbox) {
            independentCheckbox.addEventListener('change', () => this.applyFilters());
        }
        
        // Поиск
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('keyup', () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => this.applyFilters(), 300);
            });
        }
        
        // Кнопка сброса
        const resetButton = document.getElementById('reset-filters');
        if (resetButton) {
             resetButton.addEventListener('click', () => {
                if (sortSelect) sortSelect.value = 'name_asc';  // Было 'name'
                if (regionFilter) regionFilter.value = 'all';
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';
                if (independentCheckbox) independentCheckbox.checked = false;
                this.applyFilters();
            });
        }

        // Кнопка выхода
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
        logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    logout() {
    // Очищаем сохранённое имя пользователя
    this.storage.clearUserData();
    
    // Очищаем данные о странах
    this.allCountries = [];
    this.filteredCountries = [];
    
    // Показываем экран приветствия
    this.showWelcomeScreen();
    
    // Очищаем поля ввода, если они были заполнены
    const nameInput = document.getElementById('user-name');
    if (nameInput) {
        nameInput.value = '';
    }
    
    console.log('Пользователь вышел из аккаунта');
}
}

const app = new App();