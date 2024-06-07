import React, { useState, useEffect } from 'react';
import ApexChart from './ApexChart';
import './dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [matricules, setMatricules] = useState([]);
  const [employee1Id, setEmployee1Id] = useState('');
  const [employee2Id, setEmployee2Id] = useState('');

  useEffect(() => {
    // Fetch data from backend for matricules
    fetch('http://localhost:4000/matricules')
      .then(response => response.json())
      .then(data => setMatricules(data))
      .catch(error => console.error('Error fetching employee matricules:', error));
  }, []);

  return (
    <div className="dashboard-container">
      <div className="select-container">
        <select value={employee1Id} onChange={(e) => setEmployee1Id(e.target.value)}>
          <option value="">Select Employee 1</option>
          {matricules.map(matricule => (
            <option key={matricule} value={matricule}>{matricule}</option>
          ))}
        </select>
        <select value={employee2Id} onChange={(e) => setEmployee2Id(e.target.value)}>
          <option value="">Select Employee 2</option>
          {matricules.map(matricule => (
            <option key={matricule} value={matricule}>{matricule}</option>
          ))}
        </select>
      </div>
      <div className="charts-container">
        <ApexChart employee1Id={employee1Id} employee2Id={employee2Id} chartType="bar" />
        <ApexChart employee1Id={employee1Id} employee2Id={employee2Id} chartType="radar" />
      </div>
    </div>
  );
};

export default Dashboard;
