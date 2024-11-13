import { useEffect, useState } from "react";
import { Coordinates } from "../api/types";
import { error } from "console";

interface GeoLocationState{
    coordinates: Coordinates|null,
    error: string|null;
    isLoading:boolean;
}

export function useGeoLocation(){
    const [location, setLocation] = useState<GeoLocationState>({
        coordinates:null,
        error: null,
        isLoading:true
    });

    const getLocation = () => {
        setLocation((prev)=> ({...location, isLoading:true, error:null }))
        if(!navigator.geolocation){
            setLocation({
                coordinates:null,
                error:'GeoLocation is not supported by browser',
                isLoading:false
            });
            return;
        }

        navigator.geolocation.getCurrentPosition((position)=>{
            setLocation({
                coordinates:{
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                },
                error:null,
                isLoading:false,
            })
        },(error) => {
            let errorMessage:string;
            switch(error.code){
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location Permission denied. Please enable location access';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location request timed out';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out';
                    break;
                default:
                    errorMessage = 'An unknown error occured';
            };
            
            setLocation({
                coordinates:null,
                error:errorMessage,
                isLoading:false
            })
        },{
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0
        })
    };

    useEffect(()=>{
        getLocation()
    },[])

    return {
        ...location,
        getLocation
    }
}