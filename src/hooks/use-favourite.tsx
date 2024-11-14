import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./use-localstorage";

interface FavoiriteItem {
    id:string;
    lat:number;
    lon:number;
    name:string;
    country:string;
    state?:string;
    addedAt: number;
}

export function useFavouries (){
    const [favourites, setfavourites] = useLocalStorage<FavoiriteItem[]>("search-favourites",[]);

    const favouritesQuery = useQuery({
        queryKey:['search-favourites'],
        queryFn: () => favourites,
        initialData: favourites,
        staleTime: Infinity
    });

    const queryClient = useQueryClient();

    const addToFavourites = useMutation({
        mutationFn: async (search: Omit<FavoiriteItem, "id"|"addedAt">)=>{
            const newFavourite: FavoiriteItem = {
                ...search,
                id: `${search.lat}-${search.lon}`,
                addedAt: Date.now()
            };
            const exists = favourites.some((fav:FavoiriteItem)=> fav.id === newFavourite.id);
            if(exists) return favourites;


            const newfavourites = [...favourites, newFavourite].slice(0,10);

            setfavourites(newfavourites);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['search-favourites']})
        }
    });

    const removeFavourites = useMutation({
        mutationFn: async (cityId:string) => {
            const newFavourites = favourites.filter((city:FavoiriteItem)=> city.id !== cityId)
            setfavourites(newFavourites);
            return [];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['search-favourites']})
        }
    });


    return {
        favourites: favouritesQuery.data ?? [],
        addToFavourites,
        removeFavourites,
        isFavourite: (lat:number, lon:number) => favourites.some((city: { lat: number; lon: number; })=> city.lat === lat && city.lon === lon)
    }
}