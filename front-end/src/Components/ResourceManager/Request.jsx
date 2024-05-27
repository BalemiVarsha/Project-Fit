import RmDashboard from './RmDashboard';
import { URL } from '../../data';
import React, { useState, useEffect } from 'react';
import './Request.css';


const Request = () => {
  const [projectRequest, setProjectRequest] = useState([]);
  const [projects, setProjects] = useState([]);
  const fetchProjData = async () => {
    try {
      const response = await fetch(`${URL}/Project-data`);
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };
  const fetchProjectData = async () => {
    try {
      // const response = await fetch(`${URL}/api/send-request`);
      const response = await fetch('http://demo.darwinboxlocal.com/projectRequest/GetProjectRequests');
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      const data = await response.json();
      // setProjectRequest(data);
      if (data.success) {
        setProjectRequest(data.projects); // Extract projects array from response
      } else {
        console.error('Failed to fetch project requests:', data);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchProjData ();
  }, []);

  const viewProjectPdf = async (projectId) => {

    try {
      // window.open(`${URL}/Project-data/${projectId}/pdf`, '_blank');
      window.open(`http://demo.darwinboxlocal.com/project/getprojectpdf?projectId=${projectId}`,'_blank')
    } catch (error) {
      console.error('Error viewing project PDF:', error);
    }
  };
  const handleDelete = async (projectId) => {
    try {
      const response = await fetch(`${URL}/send-request/${projectId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete request project');
      }
      // Remove the deleted project from the state
      setProjects(projects.filter(project => project._id !== projectId));
      console.log('Requested Project deleted successfully');
    } catch (error) {
      console.error('Error deleting requestend project:', error);
    }
  };
  const splitDateByT = (date) => {
    return date.split('T')[0];
};

  return (
    <React.Fragment>
      <RmDashboard />
      {/* <RmNavbar/> */}
      <div className="conntainer">
        <h2>Request Sent</h2>
        <div className="prooject-container">
        {Array.isArray(projectRequest) && projectRequest.map((projectreq) => {
            const matchingProject = projects.find(project => project.title === projectreq.title);
            return matchingProject && (
              <div key={projectreq._id} className="prooject-box">
                <div className="prooject-details">
                  <h3>{projectreq.title}</h3>
                  <div className="vieew-pdf-button">
                    <button onClick={() => viewProjectPdf(matchingProject.projectId)}>View PDF</button>
                  </div>
                  <p><strong>Start Date:</strong> {splitDateByT(projectreq.startDate)}</p>
                  <p><strong>End Date:</strong> {splitDateByT(projectreq.endDate)}</p>
                  <p><strong>Department:</strong> {projectreq.department}</p>
                  <p><strong>Description:</strong> {projectreq.description}</p>
                </div>
                <div className="opttions">
                  <button className="btn btn-outline-success bb"onClick={() => handleDelete(projectreq._id)}>Delete</button><br></br>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
};

export default Request;