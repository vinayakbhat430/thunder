import { format } from "date-fns";
import { WeatherData } from "../api/types";
import { title } from "process";
import { Gauge, Sunrise, Sunset } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

interface WeatherDetailsProps {
  data: WeatherData;
}
const WeatherDetails = ({ data }: WeatherDetailsProps) => {
  const { wind, main, sys } = data;
  const formatTime = (timeStamp:number) => format(new Date(timeStamp*1000), "h:mm a");

  const getWindDirection = (degree: number) => {
    const directions = ["N","NE","E","SE","S","SW","W","NW"]
    const index = Math.round(((degree %= 360) < 0 ? degree+360 : degree)/45) % 8;
    return `${directions[index]} ${degree}°`
  }
  

  const detaiils = [
    {
        title:"Sunrise",
        value: formatTime(sys.sunrise),
        icon: Sunrise,
        color: "text-orange-500",
    },
    {
        title:"Sunset",
        value: formatTime(sys.sunset),
        icon: Sunset,
        color: "text-blue-500",
    },
    {
        title:"Wind Direction",
        value: getWindDirection(wind.deg),
        icon: Sunrise,
        color: "text-green-500",
    },
    {
        title:"Pressure",
        value:`${main.pressure} hPa`,
        icon: Gauge,
        color: "text-purple-500",
    },
  ]
  return <div>
    <Card>
        <CardHeader>

        </CardHeader>
        <CardContent>
            <div className="grid gap-6 sm:grid-cols-2">
                {detaiils.map(detail =>{
                    return (
                        <div key={detail.title} className="flex items-center gap-3 rounded-lg border p-4">
                            <detail.icon className={`h-5 w-5 ${detail.color}`}/>
                            <div>
                                <p className="text-sm font-medium leading-none">
                                    {detail.title}
                                </p>
                                <p className="text-sm text-muted-foreground flex items-start">{detail.value}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </CardContent>
    </Card>
  </div>;
};

export default WeatherDetails;
