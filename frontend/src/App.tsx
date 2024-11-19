import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import CardPage from "./pages/CardPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import CreateAccountPage from "./pages/CreateAccountPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="cards" element={<CardPage />} />
        <Route path="createAccount" element={<CreateAccountPage />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
