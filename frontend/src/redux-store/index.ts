import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from "redux-persist";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import currentlocationReducer from './slices/curr-lat-lng';
import weatherCachedResultReducer from './slices/cached-weather-result';

const rootReducer = combineReducers({
    currentlocationReducer: currentlocationReducer,
    weatherCachedResultReducer: weatherCachedResultReducer,
});

const persistConfig = {
    key: "root",
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
    }),
});

const persister = persistStore(store);
export { store, persister, rootReducer };

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch