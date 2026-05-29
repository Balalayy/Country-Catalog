export default class CountriesUI {
    showLoading(container) {
        if (!container) return;
        container.innerHTML = `
            <div style="text-align: center; padding: 60px;">
                <div style="width: 50px; height: 50px; border: 4px solid #ddd; border-top-color: #3498db; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p>Загрузка данных о странах...</p>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    showSuccess(container, countries, firstCountry) {
        if (!container) return;
        container.innerHTML = `
            <div style="background: #e8f4f8; padding: 20px; border-radius: 10px;">
                <h2>Данные успешно загружены!</h2>
                <p>Загружено стран: <strong>${countries.length}</strong></p>
                <p>Пример: ${firstCountry.name} (${firstCountry.capital})</p>
                <p>Регион: ${firstCountry.region}</p>
                <p>Население: ${firstCountry.population.toLocaleString()}</p>
            </div>
        `;
    }

    showError(container, message) {
        if (!container) return;
        container.innerHTML = `
            <div style="background: #fee; padding: 20px; border-radius: 10px; color: #c0392b;">
                <h2>Ошибка загрузки</h2>
                <p>Не удалось загрузить данные о странах.</p>
                <p>Проверьте подключение к интернету.</p>
                <p>Детали: ${message}</p>
            </div>
        `;
    }
}