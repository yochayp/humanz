import { QueryClient, QueryClientProvider } from "react-query";
import Home from "./pages/Home";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {

  return (
      <QueryClientProvider client={queryClient}>
        <Home/>
      </QueryClientProvider>
  );
}

export default App;