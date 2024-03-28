import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";

function App() {
  return (
    <BrowserRouter>
      <Routes> -
        <Route path="/" Component={Login} />
        <Route path="/dashboard" Component={Home} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
