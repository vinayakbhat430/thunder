import { useQuery } from "@tanstack/react-query";
import { Coordinates } from "../api/types";
import { weatherAPI } from "../api/weather";


const WEATHER_KEYS = {
    weather: (coordinates: Coordinates) => ['weather', coordinates] as const,
    forecast: (coordinates: Coordinates) => ['weather', coordinates] as const,
    location: (coordinates: Coordinates) => ['weather', coordinates] as const, 
}

export const useWeatherQuery = (coordinates: Coordinates|null)=>{
    return useQuery({
        queryKey:WEATHER_KEYS.weather(coordinates ?? {lat:0, lon:0}),
        queryFn: () => coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates
    })
}

export const useForecastQuery = (coordinates: Coordinates|null)=>{
    return useQuery({
        queryKey:WEATHER_KEYS.forecast(coordinates ?? {lat:0, lon:0}),
        queryFn: () => coordinates ? weatherAPI.getForecast(coordinates) : null,
        enabled: !!coordinates
    })
}


export const useReverseGroCoding = (coordinates: Coordinates|null)=>{
    return useQuery({
        queryKey:WEATHER_KEYS.location(coordinates ?? {lat:0, lon:0}),
        queryFn: () => coordinates ? weatherAPI.reverseGeoCode(coordinates) : null,
        enabled: !!coordinates
    })
}