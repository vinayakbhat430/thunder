import { format } from "date-fns";
import { ForecastData } from "../api/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";
import { Arrow } from "@radix-ui/react-tooltip";

interface WeatherForeCastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}
const WeatherForecast = ({ data }: WeatherForeCastProps) => {
  const dailyForecasts = data.list.reduce((acc, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = {
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
        date: forecast.dt,
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }

    return acc;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(0, 6);

  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-start"> 6 - Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {nextDays.map((day) => {
              return (
                <div
                  key={day.date}
                  className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(day.date * 1000), "EEE, MMM, d")}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {day.weather.description}
                    </p>
                  </div>
                  <div>
                    <span className="flex items-center text-blue-500">
                      <ArrowDown className="mr-1 h-4 w-4" />
                      {formatTemp(day.temp_min)}
                    </span>
                    <span className="flex items-center text-red-500">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      {formatTemp(day.temp_max)}
                    </span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          {day.humidity}%
                        </p>
                      </div>
                    </span>
                    <span className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <div className="space-y-0.5">
                        <p className="text-sm text-muted-foreground">
                          {day.wind} m/s
                        </p>
                      </div>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherForecast;
