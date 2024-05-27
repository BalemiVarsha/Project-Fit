import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Link, useLocation } from 'react-router-dom';
import PmDashboard from './PmDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AllProjects.css';

const socket = io.connect("http://localhost:5000");

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const highlightedContentRef = useRef(null);

  useEffect(() => {
    fetchProjectData();
  }, []);

  useEffect(() => {
    fetchProjectData();
    const params = new URLSearchParams(location.search);
    const query = params.get('searchQuery');
    setSearchQuery(query || '');
  }, [location.search]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`http://demo.darwinboxlocal.com/project/displayprojects`);
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      const data = await response.json();
      if (data.projects && Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        console.error('Invalid projects data format:', data);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const splitDateByT = (date) => date.split('T')[0];

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredProjects = () => {
    let filtered = projects;
    if (filter === 'referred') {
      filtered = projects.filter(project => project.referredEmployees && project.referredEmployees.length > 0);
    } else if (filter === 'nonReferred') {
      filtered = projects.filter(project => !project.referredEmployees || project.referredEmployees.length === 0);
    }
    if (searchQuery) {
      const regex = new RegExp(`(${searchQuery})`, 'gi');
      filtered = filtered.map(project => ({
        ...project,
        title: project.title.replace(regex, '<mark>$1</mark>')
      }));
    }
    return filtered;
  };

  const scrollToHighlightedContent = () => {
    if (searchQuery) {
      const highlightedContent = document.querySelector('.highlighted-content');
      if (highlightedContent) {
        highlightedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const viewProjectPdf = async (projectId) => {
    try {
      // window.open(`http://localhost:5000/Project-data/${projectId}/pdf`, '_blank');
      window.open(`http://demo.darwinboxlocal.com/project/getprojectpdf?projectId=${projectId}`,'_blank')
    } catch (error) {
      console.error('Error viewing project PDF:', error);
    }
  };

  useEffect(() => {
    scrollToHighlightedContent();
  }, [projects, searchQuery]);

  const handleSendRequest = async (project) => {
    const token = localStorage.getItem('token');
    try {
      // const response = await fetch('http://localhost:5000/api/send-request', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: JSON.stringify(project)
      // });
      const response = await fetch('http://demo.darwinboxlocal.com/projectRequest/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });
      if (!response.ok) {
        throw new Error('Failed to send request');
      }
      toast.success('Request Sent Successfully.');
    } catch (error) {
      toast.error('Failed to send request.');
    }
  };

  const handleDelete = async (projectId) => {
    try {
      // const response = await fetch(`http://localhost:5000/Project-data/${projectId}`, {
      //   method: 'DELETE'
      // });
      const response = await fetch(`http://demo.darwinboxlocal.com/project/deleteproject?id=${projectId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      setProjects(projects.filter(project => project._id !== projectId));
      toast.success('Project deleted successfully.');
    } catch (error) {
      toast.error('Failed to delete project.');
    }
  };

  const notify = (projectTitle) => {
    socket.emit("send_message", { message: `You have a new employee request for the project: ${projectTitle}` });
  };

  return (
    <React.Fragment>
      <PmDashboard />
      <ToastContainer />
      <div className="filter-container">
        <div className='filt'>
          <label htmlFor="filter">Filter:</label>
          <select id="filter" value={filter} onChange={handleFilterChange}>
            <option value="all">All Projects</option>
            <option value="referred">Referred Projects</option>
            <option value="nonReferred">Non-Referred Projects</option>
          </select>
        </div>
      </div>
      <div className="container">
        <h2>Project List</h2>
        <div className="project-container">
          {filteredProjects().map((project) => (
            <div key={project._id} className={`project-box ${searchQuery && project.title.includes(searchQuery) ? 'highlighted-content' : ''}`}>
              <div className="project-details">
                <h3 dangerouslySetInnerHTML={{ __html: project.title }}></h3>
                <div className="view-pdf-button">
                  <button onClick={() => viewProjectPdf(project.projectId)}>View PDF</button>
                </div>
                <p><strong>Start Date:</strong> {splitDateByT(project.startDate)}</p>
                <p><strong>End Date:</strong> {splitDateByT(project.endDate)}</p>
                <p><strong>Department:</strong> {project.department}</p>
                <p><strong>Description:</strong> {project.description}</p>
                <ul>
                  {project.referredEmployees && project.referredEmployees.map((employeeId, index) => (
                    <div key={`${employeeId}-${index}`}>
                      <EmployeeDetails employeeId={employeeId} />
                    </div>
                  ))}
                </ul>
              </div>
              <div className="optionss">
                <Link to={`/update-project/${project.projectId}`}>
                  <button className="btn btn-outline-success editbtnn">Edit</button>
                </Link><br />
                <button className="btn btn-outline-success deltt" onClick={() => handleDelete(project.projectId)}>Delete</button><br />
                <button className="btn btn-outline-success request" onClick={() => { handleSendRequest(project); notify(project.title); }}>Send Request</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const EmployeeDetails = ({ employeeId }) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`http://demo.darwinboxlocal.com/employee/getemployeebyid?id=${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch employee details');
        }
        const details = await response.json();
        if (details.employeeDetails && Array.isArray(details.employeeDetails)) {
          setEmployeeDetails(details.employeeDetails[0]);
        } else {
          console.error('Invalid employee details format:', details);
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchDetails();
  }, [employeeId]);

  if (!employeeDetails) {
    return <div>Loading employee details...</div>;
  }

  const handleViewResume = async () => {
    try {
      window.open(`http://localhost:5000/employee-data/${employeeId}/pdf`, '_blank');
    } catch (error) {
      console.error('Error viewing employee resume:', error);
    }
  };

  return (
    <div className='employee'>
      <strong>Name:</strong> {employeeDetails.name}<br />
      <strong>Email:</strong> {employeeDetails.email}<br />
      <strong>Phone:</strong> {employeeDetails.phone}<br />
      <strong>Designation:</strong> {employeeDetails.designation}<br />
      <strong>Department:</strong> {employeeDetails.department}<br />
      <strong>Category:</strong> {employeeDetails.selectedOption}<br />
      <strong>Status:</strong> {employeeDetails.status}<br />
      <p><button className='resumee' onClick={handleViewResume}> Resume </button></p>
    </div>
  );
};

export default AllProjects;
