"use client"

import WeatherBox from "@/components/weather-box/weather-box";
import { useAppDispatch } from "@/redux-store/hooks";
import { currentlocation } from "@/redux-store/slices/curr-lat-lng";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import './page.css'

export default function Home() {
  const [error, setError] = useState<any>(null);
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          dispatch(currentlocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (err) => {
          setError(err.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  if (error) {
    enqueueSnackbar(error, { variant: "error" });
    return <div>Error: {error}</div>;
  }

  return (
    <Box className="main-content">
      <WeatherBox />
    </Box>
  );
}
