"use client"

import { store } from "@/redux-store";
import { StyledEngineProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <StyledEngineProvider injectFirst>
            <SnackbarProvider maxSnack={5} autoHideDuration={4000}>
                <Provider store={store}>
                    {children}
                </Provider>
            </SnackbarProvider>
        </StyledEngineProvider>
    );
}

export default HomeLayout;