export default class CountriesAPI {
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