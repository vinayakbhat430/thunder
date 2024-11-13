export const API_CONFIG = {
    BASE_URL:"https://api.openweathermap.org/data/2.5",
    GEO:'http://api.openweathermap.org/geo/1.0',
    apiKey: import.meta.env.VITE_OPEN_WEATHER_API_ACCESS_TOKEN,
    DEFAULT_PARAMS:{
        units:'metric',
        appid: import.meta.env.VITE_OPEN_WEATHER_API_ACCESS_TOKEN,
    }
}