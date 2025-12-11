import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizQuestion from "./Main/QuizQuestion";


function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<QuizQuestion />} />
      </Routes>
    </Router>
  );
}

export default App;
