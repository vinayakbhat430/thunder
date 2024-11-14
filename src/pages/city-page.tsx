import { useParams, useSearchParams } from "react-router-dom";
import { useForecastQuery, useWeatherQuery } from "../hooks/use-weather";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import CurrentWeather from "../components/current-weather";
import HourlyTemperature from "../components/hourly-temperature";
import LoadingSkeleton from "../components/loading-skeleton";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";
import FavouriteButton from "../components/favourite-button";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-start">Location Required</AlertTitle>
        <AlertDescription className="flex flex-col justify-start gap-4">
          <p className="text-start">
            Failed to fetch weather data. Please try again!
          </p>
        </AlertDescription>
      </Alert>
    );
  }

  if(!weatherQuery.data || !forecastQuery.data || !params.cityName){
    return <LoadingSkeleton />
  }
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName}, {weatherQuery.data.sys.country}</h1>
        { weatherQuery.data && <FavouriteButton data={weatherQuery.data}/>}
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {weatherQuery.data && (
          <div className="grid gap-6">
            <CurrentWeather
              weatherData={weatherQuery?.data}
            />
          </div>
        )}

        {forecastQuery.data && <HourlyTemperature data={forecastQuery.data} />}
      </div>
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {weatherQuery.data && <WeatherDetails data={weatherQuery.data} />}
        {
          forecastQuery.data && <WeatherForecast data={forecastQuery.data}/>
        }
      </div>
    </div>
  );
};

export default CityPage;
