export default class CountriesAPI {
    async fetchAllCountries() {
        console.log('Начинаем загрузку стран...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,independent,flags,languages', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
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
            clearTimeout(timeoutId);
            console.error('Ошибка загрузки:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Превышено время ожидания ответа от сервера');
            }
            
            throw new Error(`Не удалось загрузить данные: ${error.message}`);
        }
    }
}