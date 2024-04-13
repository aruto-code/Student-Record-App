import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from './components/Registration';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import ShowStudentsData from './components/ShowStudentsData';
import InsertStudentsRecord from './components/InsertStudentsRecord';
import SearchStudentRecord from './components/SearchStudentRecord';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/register" element={<Registration />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/show" element={<ShowStudentsData />} />
          <Route exact path="/insert" element={<InsertStudentsRecord />} />
          <Route exact path="/search" element={<SearchStudentRecord />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
