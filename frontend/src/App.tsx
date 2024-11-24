import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import Home from "./pages/HomePage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="cards" element={<CardPage />} />
        <Route path="homepage" element={<Home />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
