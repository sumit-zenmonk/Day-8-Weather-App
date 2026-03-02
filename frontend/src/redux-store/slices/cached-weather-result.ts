import { WeatherResponseType } from '@/types/weather';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: WeatherResponseType[] = []

export const WeatherResultSlice = createSlice({
    name: 'WeatherResult',
    initialState,
    reducers: {
        addWeatherResult: (state: WeatherResponseType[], action: PayloadAction<WeatherResponseType>) => {
            return [...state, action.payload];
        }
    },
})

export const { addWeatherResult } = WeatherResultSlice.actions

export default WeatherResultSlice.reducer