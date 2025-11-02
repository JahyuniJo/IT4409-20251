import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        {/* other pages like login, profile, feed will go here later */}
      </Routes>
    </Router>
  );
}

export default App;
