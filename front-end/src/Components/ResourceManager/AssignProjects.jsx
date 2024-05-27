import React, { useState, useEffect } from 'react';
import RmDashboard from './RmDashboard';
import { URL } from '../../data';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chart from 'chart.js/auto';
import './Assign.css';
import io from 'socket.io-client';
const socket = io.connect(`${URL}`)
const AssignProjects = () => {
  const [titles, setTitles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [projectDetails, setProjectDetails] = useState(null);
  const [departmentEmployees, setDepartmentEmployees] = useState([]);
  const [projectPDF, setProjectPDF] = useState(null);
  const [employeeResume, setEmployeeResume] = useState(null);
  //const [similarityScore, setSimilarityScore] = useState(null);
  //const chartRefs = useRef([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const toggleEmployeeSelection = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  useEffect(() => {
    fetchTitlesFromDatabase();
    fetchDepartmentsFromDatabase();
  }, []);



  const fetchTitlesFromDatabase = async () => {
    try {
      // const response = await fetch(`${URL}/titles`);
      const response = await fetch(`http://demo.darwinboxlocal.com/ProjectRequest/Getdistincttitles`);
      if (response.ok) {
        const data = await response.json();
        setTitles(data.titles);
      } else {
        throw new Error('Failed to fetch titles');
      }
    } catch (error) {
      console.error('Error fetching titles:', error);
    }
  };

  const fetchDepartmentsFromDatabase = async () => {
    try {
      // const response = await fetch(`${URL}/department`);
      const response = await fetch(`http://demo.darwinboxlocal.com/employee/departments`);
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments);
      } else {
        throw new Error('Failed to fetch departments');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  const viewProjectPdf = async (projectId) => {

    try {
      // window.open(`${URL}/Project-data/${projectId}/pdf`, '_blank');
      window.open(`http://demo.darwinboxlocal.com/project/getprojectpdf?projectId=${projectId}`,'_blank')
    } catch (error) {
      console.error('Error viewing project PDF:', error);
    }
  };
  const handleViewResume = async (employeeId) => {
    try {
      // window.open(`${URL}/employee-data/${employeeId}/pdf`, '_blank');
      window.open(`http://demo.darwinboxlocal.com/employee/getemployeepdf?employeeId=${employeeId}`, '_blank')
    } catch (error) {
      console.error('Error viewing project PDF:', error);
    }
  };

  const fetchProjectDetails = async (title) => {
    try {
      const response = await fetch(`http://localhost:5000/project?title=${title}`);
      if (response.ok) {
        const data = await response.json();
        setProjectDetails(data);
        // Automatically fetch project PDF when project is selected
        fetchProjectPDF(data._id);
      } else {
        throw new Error('Failed to fetch project details');
      }
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  const fetchEmpoyeeDetails = async (department) => {
    try {
      const response = await fetch(`http://localhost:5000/employee-data?department=${department}`);
      if (response.ok) {
        const data = await response.json();
        setDepartmentEmployees(data);
        // Automatically fetch employee resume when department is selected
        fetchEmployeeResume(data[0]._id); // Assuming first employee in the list
      } else {
        throw new Error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  

  const fetchProjectPDF = async (projectId) => {
    try {
      const response = await fetch(`http://demo.darwinboxlocal.com/project/getprojectpdf?projectId=${projectId}`);
      if (response.ok) {
        const blob = await response.blob();
        setProjectPDF(blob);
      } else {
        throw new Error('Failed to fetch project PDF');
      }
    } catch (error) {
      console.error('Error fetching project PDF:', error);
    }
  };

  const fetchEmployeeResume = async (employeeId) => {
    try {
      const response = await fetch(`http://demo.darwinboxlocal.com/employee/getemployeepdf?employeeId=${employeeId}`)
      if (response.ok) {
        const blob = await response.blob();
        setEmployeeResume(blob);
      } else {
        throw new Error('Failed to fetch employee resume');
      }
    } catch (error) {
      console.error('Error fetching employee resume:', error);
    }
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setSelectedTitle(title);
    if (title) {
      fetchProjectDetails(title);
    } else {
      setProjectDetails(null);
    }
  };

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    if (department) {
      fetchEmpoyeeDetails(department);
    } else {
      setDepartmentEmployees([]);
    }
  };


  // got for individual employee---------------------------------------------------------------------------------------------------
  const handleViewScore = async () => {
    if (selectedTitle && selectedDepartment) {
      try {
        const response = await fetch(`http://demo.darwinboxlocal.com/project/calScore?department=${selectedDepartment}&title=${selectedTitle}`, {
          method: 'POST'
        });
       
        console.log(response)
        if (response.ok) {
          const data = await response.json();
          
          console.log('Response Data:', data);
          const scores = data['cosine scores'];
          if (Array.isArray(scores)) { // Check if scores is an array
            console.log('Similarity Scores:', scores);

            // Loop through each employee to generate a chart
            departmentEmployees.forEach(employee => {
              const employeeScores = scores.find(score => score.employeeId === employee.employeeId);
              if (employeeScores) {
                generateChart(employee._id, employeeScores.score, employeeScores.difference);
              }
            });
          } else {
            console.error('Invalid format for similarity scores:', scores);
          }
        } else {
          console.error('Failed to calculate scores for department:', selectedDepartment);
        }
      } catch (error) {
        console.error('Error calculating scores:', error);
      }
    } else {
      console.error('Please select project and department to calculate scores');
    }
};

  const generateChart = (employeeId, score) => {
    const canvasId = `chart-${employeeId}`;
    const difference = 100 - score;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = canvasId;

    // Append canvas to the container div
    const container = document.getElementById(`chart-container-${employeeId}`);
    container.innerHTML = ''; // Clear previous chart if exists
    container.appendChild(canvas);


    // Get canvas context
    const ctx = canvas.getContext('2d');

    // Create chart
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Score', 'Difference'],
        datasets: [{
          data: [score, difference],
          backgroundColor: [
            'rgba(146, 94, 250, 0.91)',
            'rgba(54, 162, 235, 0.5)',
          ],
          borderColor: [
            'rgba(153, 102, 255, 0.5)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'right'
        },
        title: {
          display: true,
          text: `Similarity Score for ${employeeId}`
        },
        plugins: {
          // Configure the datalabels plugin
          datalabels: {
            color: '#fff',
            formatter: (value, ctx) => {
              const label = ctx.chart.data.labels[ctx.dataIndex];
              return label === 'Score' ? `${value.toFixed(2)}%` : null;
            },
            font: {
              size: 16 // Adjust font size as needed
            }
          }
        }
      }

    });

  };
  const handleRefer = () => {
    // Assuming you have a backend server running on http://localhost:3000
    // const backendUrl = 'http://localhost:3000/refer'; // Update this URL with your actual backend endpoint

    // Extract selected employees' details
    const token = localStorage.getItem('token');
    const selectedEmployeesDetails = departmentEmployees.filter(emp => selectedEmployees.includes(emp._id));

    // Create payload object containing selected employees and project details
    const payload = {
      employeesDetails: selectedEmployeesDetails,
      projectDetails: projectDetails
    };

    // Make a POST request to the backend
    fetch(`${URL}/refer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Handle success
        toast.success('Employees referred successfully.');
        console.log('Data referred successfully');
        // Clear selected employees after referring
        setSelectedEmployees([]);
      })
      .catch(error => {
        // Handle error
        console.error('Error referring data:', error);
        toast.error('Failed');
      });
  };
  const splitDateByT = (date) => {
    // console.log('Date:', date);
    if (date) {
      return date.split('T')[0];
    } else {
      return ''; // or any default value you want to return when date is undefined
    }
  };
  const notify = (selectedTitle) => {
    socket.emit("resource_message", { message: `Employees are referred to the project ${selectedTitle}` });
  };
  const filteredEmployees = departmentEmployees.filter(employee => employee.department === selectedDepartment);
  return (
    <React.Fragment>
      <RmDashboard />
      <ToastContainer />
      {/* <RmNavbar/> */}
      <div className='filterr'>
        <div className='filtertitle'>
          <label htmlFor="titleFilter">Select Project: </label>
          <select id="titleFilter" value={selectedTitle} onChange={handleTitleChange}>
            <option value="">Select Project</option>
            {titles.map((title, index) => (
              <option key={index} value={title}>{title}</option>
            ))}
          </select>
        </div>
        <div className='filterdept'>
          <label htmlFor="titleDept">Select Department:</label>
          <select id="titleDept" value={selectedDepartment} onChange={handleDepartmentChange}>
            <option value="">Select Department</option>
            {departments.map((department, index) => (
              <option key={index} value={department}>{department}</option>
            ))}
          </select>
        </div>
        <button onClick={handleViewScore}>View Scores</button>
        {/* <button onClick={handleRefer}>Refer Selected Employees</button> */}

        <button onClick={() => { handleRefer(); notify(selectedTitle); }}>Refer Selected Employees</button>

      </div>


      {projectDetails && (
        <div className="project-detailss">
          <div className="view-pdff-button">
            <button onClick={() => viewProjectPdf(projectDetails.projectId)}>View PDF</button>
          </div>
          <h5><p> {projectDetails.title}</p></h5>
          <p>Start Date: {splitDateByT(projectDetails.startDate)}</p>
          <p>End Date: {splitDateByT(projectDetails.endDate)}</p>
          <p>Department: {projectDetails.department}</p>
          <p>Description: {projectDetails.description}</p>
          {/* <p>ProjectID:{projectDetails.projectId}</p> */}
        </div>
      )}
     
      {filteredEmployees.map((employee, index) => (
        <div key={index} className="employee-detailss">
          <h2>Employee</h2>
          <p>Name: {employee.name}</p>
          <p>Email: {employee.email}</p>
          <p>Phone Number: {employee.phone}</p>
          <p>Department: {employee.department}</p>
          <p>Category: {employee.selectedOption}</p>
          <p>Status: {employee.status}</p>

          <input
            type="checkbox"
            id={`checkbox-${employee._id}`}
            checked={selectedEmployees.includes(employee._id)}
            onChange={() => toggleEmployeeSelection(employee._id)}
          />
          <label htmlFor={`checkbox-${employee._id}`} className="checkbox-label">Select employee</label>
          <span className="checkmark"></span>


          <div className='chart-container' id={`chart-container-${employee._id}`}>


          </div>


          <p><button className='resume' onClick={() => handleViewResume(employee.employeeId)}> Resume </button> </p>




        </div>
      ))}



    </React.Fragment>
  );
};

export default AssignProjects;

