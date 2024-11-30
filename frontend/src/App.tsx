import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import CompleteProfilePage from "./pages/CompleteProfilePage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="cards" element={<CardPage />} />
        <Route path="homepage" element={<HomePage />}></Route>
        <Route path="completeprofile" element={<CompleteProfilePage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
