import { Button } from "../components/ui/button";
import { AlertCircle, MapPin, RefreshCcw } from "lucide-react";
import { useGeoLocation } from "../hooks/use-geolocation";
import LoadingSkeleton from "../components/loading-skeleton";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "../hooks/use-weather";
import CurrentWeather from "../components/current-weather";
import HourlyTemperature from "../components/hourly-temperature";
import WeatherDetails from "../components/weather-details";
import WeatherForecast from "../components/weather-forecast";
import FavouriteCities from "../components/favourite-cities";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading,
  } = useGeoLocation();

  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const handleRefesh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      locationQuery.refetch();
      forecastQuery.refetch();
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-start">Location Error</AlertTitle>
        <AlertDescription className="flex flex-col justify-start gap-4">
          <p className="text-start">{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-2 w-4"></MapPin> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-start">Location Required</AlertTitle>
        <AlertDescription className="flex flex-col justify-start gap-4">
          <p className="text-start">
            Please enable location access to see your local weather.
          </p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-2 w-4"></MapPin> Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data;
  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-start">Location Required</AlertTitle>
        <AlertDescription className="flex flex-col justify-start gap-4">
          <p className="text-start">
            Failed to fetch weather data. Please retry again!
          </p>
          <Button onClick={handleRefesh} variant={"outline"} className="w-fit">
            <RefreshCcw className="mr-2 h-2 w-4"></RefreshCcw> Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      <FavouriteCities/>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefesh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCcw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {weatherQuery.data && locationQuery.data && (
          <div className="grid gap-6">
            <CurrentWeather
              weatherData={weatherQuery?.data}
              locationData={locationQuery.data?.[0]}
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

export default WeatherDashboard;
