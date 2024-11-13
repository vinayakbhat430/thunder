import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout";
import { ThemeProvider } from "./context/theme-provider";
import WeatherDashboard from "./pages/weather-dashboard";
import CityPage from "./pages/city-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime: 5*60*1000,
        gcTime: 10*60*1000,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  })
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <ThemeProvider defaultTheme="dark">
      <Layout>
        <Routes>
          <Route path="/" element={<WeatherDashboard/>}></Route>
          <Route path="/city/:cityName" element={<CityPage/>}></Route>
        </Routes>
      </Layout>
    </ThemeProvider>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;
