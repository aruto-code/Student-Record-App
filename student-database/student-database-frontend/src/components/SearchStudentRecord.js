import React, { useState, useEffect } from 'react';

const SearchStudentRecord = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);

  useEffect(() => {
    // Add Bootstrap CSS link to the document's head
    const link = document.createElement('link');
    link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    fetchSearchOptions();

    // Cleanup function to remove the link when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const fetchSearchOptions = () => {
    fetch('http://localhost:5000/students/search-options')
      .then(response => response.json())
      .then(data => {
        setSearchOptions(data);
      })
      .catch(error => console.error('Error fetching search options:', error));
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchValue(''); // Reset search value when search term changes
  };

  const handleValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send search request to backend API
    fetch(`http://localhost:5000/students/search?searchTerm=${searchTerm}&searchValue=${searchValue}`)
      .then(response => response.json())
      .then(data => {
        setSearchResults(data);
      })
      .catch(error => console.error('Error searching students:', error));
  };

  return (
    <div className="container-fluid py-5" style={{ background: 'linear-gradient(to right, #4a148c, #ff6f00)', minHeight: '100vh' }}>
      <div className="container bg-white p-5 rounded shadow">
        <h2 className="mb-4 text-center">Search Student Record</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Select Search Term:</label>
            <select className="form-select" value={searchTerm} onChange={handleChange}>
              <option value="">Select...</option>
              {searchOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          {searchTerm && (
            <div className="mb-3">
              <label className="form-label">Enter Search Value:</label>
              <input type="text" className="form-control" value={searchValue} onChange={handleValueChange} />
            </div>
          )}
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        {searchResults.length > 0 && (
          <table className="table table-bordered table-striped mt-4">
            <thead className="thead-light">
              <tr>
                <th>Enrollment Number</th>
                <th>Faculty Number</th>
                <th>Name</th>
                <th>Address</th>
                <th>Hall</th>
                <th>Course</th>
                <th>Branch</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map(student => (
                <tr key={student.enrollmentNumber}>
                  <td>{student.enrollment_number}</td>
                  <td>{student.faculty_number}</td>
                  <td>{student.name}</td>
                  <td>{student.address}</td>
                  <td>{student.hall}</td>
                  <td>{student.course}</td>
                  <td>{student.branch}</td>
                  <td>{student.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SearchStudentRecord;