import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { Button } from "./ui/button";
import { useSearchLoaction } from "../hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "../hooks/use-searchhistory";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useFavouries } from "../hooks/use-favourite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const { data: searchData, isLoading } = useSearchLoaction(query);
  const { history, clearHistory, addToHistory } = useSearchHistory();
  const { favourites } = useFavouries()


  const handleSelect = (cityData: string) => {
    //spliting values to compute
    const [lat, lon, name, country] = cityData.split("|");
    setOpen(false);

    //Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    navigate(`/city/${name}?lat=${lat}&lon=${lon}&country=${country}`);
  };

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen((e) => !e)}
      >
        <Search className="mr-2 h-4 w-4" /> Search Cities...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle></DialogTitle>
        <CommandInput
          placeholder="Type a command or search"
          value={query}
          onValueChange={setQuery}
        ></CommandInput>
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found</CommandEmpty>
          )}
          <CommandGroup heading="Favourites">
          {favourites.map((item:any) => {
                  return (
                    <CommandItem
                      key={`${item.id}`}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                    >
                      <Star className="m-2 h-2 text-yellow-500" />
                      <span>{item.name}</span>
                      {item.state && (
                        <span className="text-sm text-muted-foreground">
                          , {item.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {item.country}
                      </span>
                    </CommandItem>
                  )
                })}
          </CommandGroup>
          <CommandSeparator />
          {history.length > 0 && (
            <div>
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">Recent Searches</p>
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" /> Clear
                  </Button>
                </div>
                {history.map((item:any) => {
                  return (
                    <CommandItem
                      key={`${item.lat}-${item.lon}`}
                      value={`${item.lat}|${item.lon}|${item.name}|${item.country}`}
                      onSelect={handleSelect}
                    >
                      <Clock />
                      <span>{item.name}</span>
                      {item.state && (
                        <span className="text-sm text-muted-foreground">
                          , {item.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        , {item.country}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              <CommandSeparator />
            </div>
          )}
          {searchData && searchData.length > 0 && (
            <CommandGroup heading="Suggestions">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {searchData.map((location) => {
                return (
                  <CommandItem
                    key={`${location.lat}-${location.lon}`}
                    value={`${location.lat}|${location.lon}|${location.name}|${location.country}`}
                    onSelect={handleSelect}
                  >
                    <Search />
                    <span>{location.name}</span>
                    {location.state && (
                      <span className="text-sm text-muted-foreground">
                        , {location.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      , {location.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
