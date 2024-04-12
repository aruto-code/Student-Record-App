// App.js

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ShowStudentsData from './components/ShowStudentsData';
import InsertStudentsRecord from './components/InsertStudentsRecord';
import SearchStudentRecord from './components/SearchStudentRecord';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage/>} />
          <Route exact path="/show" element={<ShowStudentsData/>} />
          <Route exact path="/insert" element={<InsertStudentsRecord/>} />
          <Route exact path="/search" element={<SearchStudentRecord/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
