"use client"

import { Box, TextField, InputAdornment, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { RootState } from "@/redux-store";
import { useAppSelector, useAppDispatch } from "@/redux-store/hooks";
import { enqueueSnackbar } from "notistack";
import { ApiCallService } from "@/services/http";
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { addWeatherResult } from "@/redux-store/slices/cached-weather-result";
import { WeatherResponseType } from "@/types/weather";
import './weather-box.css'
import Image from "next/image";

export default function WeatherBox() {
    const [currCity, setCurrCity] = useState<string>('');
    const [weatherData, setWeatherData] = useState<WeatherResponseType>();
    const dispatch = useAppDispatch()

    const weatherCachedResult = useAppSelector((state: RootState) => state.weatherCachedResultReducer);
    const currlocation = useAppSelector((state: RootState) => state.currentlocationReducer);
    const weatherApi = process.env.NEXT_PUBLIC_WEATHER_API_URL;

    const fetchWeather = async (params: string) => {
        try {
            enqueueSnackbar('Fetching from Api', { variant: "success" });
            const headers = {
                'x-rapidapi-host': `${process.env.NEXT_PUBLIC_WEATHER_API_HOST}`,
                'x-rapidapi-key': `${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
            };
            const url = `${weatherApi}/${params}`;
            const response = await ApiCallService(url, 'GET', headers, undefined);
            if (response.cod === 200) {
                setWeatherData(response);
                dispatch(addWeatherResult(response));
            } else {
                enqueueSnackbar(response?.message, { variant: "warning" });
                enqueueSnackbar('City not found', { variant: "warning" });
            }
        } catch (error) {
            console.log(error);
            enqueueSnackbar('Failed to fetch weather', { variant: "error" });
        }
    };

    useEffect(() => {
        if (currlocation.latitude !== 0 && currlocation.longitude !== 0) {
            const cachedData = weatherCachedResult.find(
                (item: WeatherResponseType) =>
                    item.coord &&
                    item.coord.lat === currlocation.latitude &&
                    item.coord.lon === currlocation.longitude
            );

            if (cachedData) {
                enqueueSnackbar('Fetching from Cache', { variant: "success" });
                setWeatherData(cachedData);
            } else {
                fetchWeather(`latlon?latitude=${currlocation.latitude}&longitude=${currlocation.longitude}&lang=EN`);
            }
        } else {
            enqueueSnackbar('location permission denied', { variant: "info" });
        }
    }, []);

    // useEffect(() => {
    //     if (!weatherData?.weather?.[0]?.main) return;
    //     const condition = weatherData.weather[0].main.toLowerCase();
    //     let bgColor = "#1e1e1e";

    //     if (condition.includes("clear")) {
    //         bgColor = "#a8e0ff";
    //     } else if (condition.includes("cloud")) {
    //         bgColor = "#7D8CA3";
    //     } else if (condition.includes("rain") || condition.includes("drizzle")) {
    //         bgColor = "#5C6B73";
    //     } else if (condition.includes("thunder")) {
    //         bgColor = "#3A3A3A";
    //     } else if (condition.includes("snow")) {
    //         bgColor = "#EAF4F4";
    //     }
    //     document.body.style.background = bgColor;
    //     document.body.style.transition = "background 0.5s ease";

    // }, [weatherData]);

    const handleCitySearch = () => {
        if (!currCity.trim()) {
            enqueueSnackbar("Empty Search", { variant: "error" })
            return;
        }

        const cachedData = weatherCachedResult.find(
            (item: WeatherResponseType) =>
                item.name &&
                item.name.toLowerCase() === currCity.toLowerCase()
        );

        if (cachedData) {
            enqueueSnackbar('Fetching from Cache', { variant: "success" });
            setWeatherData(cachedData);
        } else {
            fetchWeather(`city?city=${currCity}&lang=EN`);
        }
    };

    const getGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Good Morning";
        if (hours < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <Box className="weather-container">
            {/* Search Bar */}
            <Box className="top-section">
                <TextField
                    className="search-input"
                    fullWidth
                    // label="Search City"
                    placeholder="Search City"
                    // variant="outlined"
                    onKeyDown={(e) => e.key === 'Enter' && handleCitySearch()}
                    onChange={(e) => setCurrCity(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LocationSearchingIcon className="search-icon" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {(!weatherData || weatherData.cod === 400 || !weatherData.main) ?
                (
                    <CircularProgress />
                ) : (
                    <Box className="bottom-section">
                        {/* Left Section */}
                        <Box className="left-info">
                            <Box className="top-info">
                                <Typography variant="h3">{weatherData.name}</Typography>
                                <Typography>{new Date().toLocaleDateString()}</Typography>
                            </Box>

                            <Box className="bottom-temp">
                                <Box className="bottom-temp-info">
                                    <Typography variant="h1">{Math.round(weatherData.main.temp)}°</Typography>
                                    <Box>
                                        <Typography>💨 {weatherData.wind.speed} mph</Typography>
                                        <Typography>💧 {weatherData.main.humidity}%</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h5">{weatherData.weather[0].description}</Typography>
                            </Box>

                            <Box className="bottom-weekly">
                                <Box className="week-card">
                                    <Typography className="label">Today</Typography>
                                    <Typography className="val">{weatherData.main.humidity}%</Typography>
                                    <Typography className="desc">{weatherData.weather[0].description}</Typography>
                                </Box>
                                {[{ day: 'Tues', humidity: 34, description: "Cloudy" }, { day: 'Wed', humidity: 21, description: "Rainy" }, { day: 'Thur', humidity: 76, description: "Thunder" }, { day: 'Fri', humidity: 15, description: "Lightning" }, { day: 'Sat', humidity: 67, description: "Cloudy" }].map((curr) => (
                                    <Box key={curr.day} className="week-card">
                                        <Typography className="label">{curr.day}</Typography>
                                        <Typography className="val">{curr.humidity}°</Typography>
                                        <Typography className="desc">{curr.description}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        {/* Right Section */}
                        <Box className="right-info">
                            <Box className="right-info-heading">
                                <Typography variant="h3">{getGreeting()}!</Typography>
                                <Typography variant="h5">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                            </Box>

                            <Box className="right-temp">
                                <Box className="right-temp-info">
                                    <Typography variant="h4">
                                        {Math.round(weatherData.main.temp)}°

                                    </Typography>
                                    <Box className="detail">
                                        <Typography className="detail-info">
                                            <Image src={'/wind.png'} width={30} height={30} alt="humidity" />
                                            {weatherData.wind.speed} mph
                                        </Typography>
                                        <Typography className="detail-info">
                                            <Image src={'/humidity.png'} width={30} height={30} alt="humidity" />
                                            {weatherData.main.humidity}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography>Feels like {Math.round(weatherData.main.feels_like)}°</Typography>
                                <Typography className="description">{weatherData.weather[0].description}</Typography>
                            </Box>

                            <Box className="right-pressure-visible-container">
                                <Box className="right-pressure">
                                    <Typography variant="caption">Pressure</Typography>
                                    <Typography>{weatherData.main.pressure} hPa</Typography>
                                </Box>
                                <Box className="right-visibility">
                                    <Typography variant="caption">Visibility</Typography>
                                    <Typography>{(weatherData.visibility / 1000).toFixed(1)} km</Typography>
                                </Box>
                            </Box>

                            <Box className="right-hourly">
                                <Typography className="hourly-title">Hourly Forecast</Typography>
                                <Box className="body">
                                    {[{ time: '1 PM', temp: 32, environment: "Cloudy" }, { time: '2 PM', temp: 65, environment: "Rainy" }, { time: '3 PM', temp: 43, environment: "Thunder" }, { time: '4 PM', temp: 76, environment: "Rainy" }, { time: '5 PM', temp: 56, environment: "Thunder" }, { time: '6 PM', temp: 34, environment: "Clear" }].map((curr) => (
                                        <Box className="hourly-grid" key={curr.time}>
                                            <Typography className="hour-label">{curr.time}</Typography>
                                            <Typography className="hour-val">{curr.temp}°</Typography>
                                            <Typography className="hour-desc">{curr.environment}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                )
            }
        </Box >
    );
}
