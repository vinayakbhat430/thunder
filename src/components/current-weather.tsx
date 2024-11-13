import { ArrowDown, ArrowUp } from "lucide-react";
import { GeoCodingResponse, WeatherData } from "../api/types";
import { Card, CardContent } from "./ui/card";

interface CurrentWeatherProps {
  data: WeatherData;
  locationName: GeoCodingResponse;
}
const CurrentWeather = ({ data, locationName }: CurrentWeatherProps) => {
  const {
    main: { temp, feels_like, temp_min, temp_max, humidity },
    wind: { speed },
  } = data;

  const formatTemp = (temp: number) => `${Math.round(temp)}`;
  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold tracking-tighter">
                    {locationName?.name}
                  </h2>
                  {locationName?.state && (
                    <span className="text-sm text-muted-foreground">
                      , {locationName.state}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {locationName?.country}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-7xl font-bold tracking-tighter">
                {formatTemp(temp)}
              </p>
              <div className="space-y-1">
                <p className="">Feels Like {formatTemp(feels_like)}</p>
                <div className="flex gap-2 text-sm font-medium">
                    <span className="flex items-center gap-1 text-blue-500">
                        <ArrowDown className="h-3 w-3" />
                        {formatTemp(temp_min)}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500">
                        <ArrowUp className="h-3 w-3" />
                        {formatTemp(temp_max)}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CurrentWeather;
