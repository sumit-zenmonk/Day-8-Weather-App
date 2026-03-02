import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface locationState {
    latitude: number,
    longitude: number
}

const initialState: locationState = {
    latitude: 0,
    longitude: 0
}

export const currentlocationSlice = createSlice({
    name: 'current_location',
    initialState,
    reducers: {
        currentlocation: (state: locationState, action: PayloadAction<locationState>) => {
            state.latitude = action.payload.latitude;
            state.longitude = action.payload.longitude;
        }
    },
})

export const { currentlocation } = currentlocationSlice.actions

export default currentlocationSlice.reducer