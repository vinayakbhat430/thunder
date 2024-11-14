import { Star } from "lucide-react";
import { WeatherData } from "../api/types"
import { useFavouries } from "../hooks/use-favourite";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface FavouriteButtonProps{
    data: WeatherData;
}
const FavouriteButton = ({data}:FavouriteButtonProps) => {
   const {addToFavourites, isFavourite, removeFavourites} =  useFavouries()

   const isCurrentlyFavourite = isFavourite(data.coord.lat, data.coord.lon);

   const handleToggleFavourite = () => {
    if(isCurrentlyFavourite){
        removeFavourites.mutate(`${data.coord.lat}-${data.coord.lon}`);
        toast.error(`Removed ${data.name} from favourites`)
    }else{
        addToFavourites.mutate({
            name:data.name,
            lat:data.coord.lat,
            lon: data.coord.lon,
            country: data.sys.country
        });
        toast.success(`Added ${data.name} to favourites`)
    }
   }

  return (
    <div>
        <Button size={'icon'} className={isCurrentlyFavourite ? "bg-yellow-500 hover:bg-yellow-600": ""} onClick={handleToggleFavourite}><Star className={`h-4 w-4 ${isCurrentlyFavourite ? 'fill-current':''}`}/></Button>
    </div>
  )
}

export default FavouriteButton