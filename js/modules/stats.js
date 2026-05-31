export default class StatisticsCalculator {
    
    // Подсчёт общего количества стран
    getTotalCount(countries) {
        return countries.length;
    }

    // Расчёт среднего населения
    getAveragePopulation(countries) {
        if (!countries || countries.length === 0) return 0;
        const total = countries.reduce((sum, country) => sum + country.population, 0);
        return Math.round(total / countries.length);
    }

    // Расчёт средней площади
    getAverageArea(countries) {
        if (!countries || countries.length === 0) return 0;
        const total = countries.reduce((sum, country) => sum + country.area, 0);
        return Math.round(total / countries.length);
    }

    // Поиск самой населённой страны
    getMostPopulousCountry(countries) {
        if (!countries || countries.length === 0) return null;
        return countries.reduce((max, country) => 
            country.population > max.population ? country : max
        , countries[0]);
    }

    // Поиск страны с наибольшей площадью
    getLargestCountryByArea(countries) {
        if (!countries || countries.length === 0) return null;
        return countries.reduce((max, country) => 
            country.area > max.area ? country : max
        , countries[0]);
    }

    // Подсчёт независимых стран
    getIndependentCount(countries) {
        return countries.filter(country => country.independent).length;
    }

    // Расчёт среднего населения
    getMedianPopulation(countries) {
        if (!countries || countries.length === 0) return 0;
        
        const populations = countries.map(c => c.population).sort((a, b) => a - b);
        const middle = Math.floor(populations.length / 2);
        
        if (populations.length % 2 === 0) {
            return Math.round((populations[middle - 1] + populations[middle]) / 2);
        }
        return populations[middle];
    }

    // Форматирование больших чисел
    formatNumber(num) {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + ' млрд';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + ' млн';
        if (num >= 1000) return (num / 1000).toFixed(1) + ' тыс';
        return num.toLocaleString();
    }


}