export default class CountriesUI {
    
    // Отображение индикатора загрузки
    showLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <div class="spinner"></div>
                <p>Загрузка данных о странах...</p>
            </div>
        `;
    }

    // Отрисовка карточек стран
    renderCountries(container, countries) {
        if (!container) return;
        
        // Пустое состояние
        if (!countries || countries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <h3>Ничего не найдено</h3>
                    <p>Попробуйте изменить параметры поиска или фильтрации</p>
                </div>
            `;
            return;
        }

        // Генерация карточек
        const cardsHTML = countries.map(country => `
            <div class="country-card">
                <div class="flag-container">
                    <img src="${country.flagUrl}" alt="Флаг ${country.name}" class="country-flag" loading="lazy" onerror="this.src='https://via.placeholder.com/320x160?text=No+Flag'">
                </div>
                <div class="country-info">
                    <h3 class="country-name">${this.escapeHtml(country.name)}</h3>
                    <div class="country-detail">
                        <span class="detail-label">🏛️ Столица:</span>
                        <span class="detail-value">${this.escapeHtml(country.capital)}</span>
                    </div>
                    <div class="country-detail">
                        <span class="detail-label">🌍 Регион:</span>
                        <span class="detail-value">${this.escapeHtml(country.region)}</span>
                    </div>
                    <div class="country-detail">
                        <span class="detail-label">👥 Население:</span>
                        <span class="detail-value">${this.formatPopulation(country.population)}</span>
                    </div>
                    <div class="country-detail">
                        <span class="detail-label">📐 Площадь:</span>
                        <span class="detail-value">${this.formatArea(country.area)} км²</span>
                    </div>
                    <div class="country-detail">
                        <span class="detail-label">🗣️ Языки:</span>
                        <span class="detail-value">${this.formatLanguages(country.languages)}</span>
                    </div>
                    ${country.independent ? '<span class="independent-badge">✓ Независимая</span>' : '<span class="independent-badge dependent">✗ Зависимая территория</span>'}
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="countries-grid">${cardsHTML}</div>`;
    }

    // Форматирование населения
    formatPopulation(population) {
        if (population >= 1000000000) return (population / 1000000000).toFixed(1) + ' млрд';
        if (population >= 1000000) return (population / 1000000).toFixed(1) + ' млн';
        if (population >= 1000) return (population / 1000).toFixed(1) + ' тыс';
        return population.toLocaleString();
    }

    // Форматирование площади
    formatArea(area) {
        if (area >= 1000000) return (area / 1000000).toFixed(1) + ' млн';
        return area.toLocaleString();
    }

    // Форматирование списка языков
    formatLanguages(languages) {
        if (!languages || languages.length === 0) return 'Нет данных';
        if (languages.length <= 2) return languages.join(', ');
        return languages.slice(0, 2).join(', ') + '...';
    }

    // Отображение ошибки
    showError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <h2>Ошибка загрузки данных</h2>
                <p>${message}</p>
                <button onclick="location.reload()" class="btn-retry">🔄 Попробовать снова</button>
            </div>
        `;
    }

    // Экранирование HTML
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
}