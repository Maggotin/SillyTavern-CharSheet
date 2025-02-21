import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from './theme'; // We'll create this next

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <div>
                    {/* Your character sheet components will go here */}
                    <h1>D&D 5e Character Sheet</h1>
                </div>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);