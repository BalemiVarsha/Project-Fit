import React, { useState, useEffect } from 'react';
import PmDashboard from './PmDashboard';
import './DashB.css'
import { URL } from '../../data';

const DashB = () => {
    const [employeeCount, setEmployeeCount] = useState(0);
    const [projectCount, setProjectCount] = useState(0);
    const [reqestCount, setRequestCount] = useState(0);
    const [projects, setProjects] = useState([]);
    useEffect(() => {
        // Fetch employee count from MongoDB collection
        const fetchEmployeeCount = async () => {
            try {
                // const response = await fetch(`${URL}/employee-count`);
                const response=await fetch(`http://demo.darwinboxlocal.com/employee/countemployees`)
                if (!response.ok) {
                    throw new Error('Failed to fetch employee count');
                }
                const data = await response.json();
                //   console.log('Fetched projects:', data); // Debugging line
                setEmployeeCount(data.count);
            } catch (error) {
                console.error('Error fetching employee count:', error);
            }
        };

        // Fetch project count from MongoDB collection
        const fetchProjectCount = async () => {
            try {
                // const response = await fetch(`${URL}/project-count`);
                const response=await fetch(`http://demo.darwinboxlocal.com/project/projectcount`)
                if (!response.ok) {
                    throw new Error('Failed to fetch project count');
                }
                const data = await response.json();
                setProjectCount(data.count);
            } catch (error) {
                console.error('Error fetching project count:', error);
            }
        };
        const fetchRequestCount = async () => {
            try {
                // const response = await fetch(`${URL}/request-count`);
                const response=await fetch(`http://demo.darwinboxlocal.com/projectrequest/getrequestcount`)
                if (!response.ok) {
                    throw new Error('Failed to fetch project count');
                }
                const data = await response.json();
                setRequestCount(data.count);
            } catch (error) {
                console.error('Error fetching project count:', error);
            }
        };
        const fetchProjects = async () => {
            try {
                // const response = await fetch(`${URL}/Project-data`);
                const response=await fetch(`http://demo.darwinboxlocal.com/project/displayprojects`)
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();
                console.log('Fetched projects:', data); // Debugging line
                // setProjects(data);
                if (data.projects && Array.isArray(data.projects)) {
                    setProjects(data.projects);
                } else {
                    console.error('Invalid projects data format:', data);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchEmployeeCount();
        fetchProjectCount();
        fetchRequestCount();
        fetchProjects();
    }, []);
    const viewProjectPdf = async (projectId) => {

        try {
          window.open(`${URL}/Project-data/${projectId}/pdf`, '_blank');
        } catch (error) {
          console.error('Error viewing project PDF:', error);
        }
      };
      const splitDateByT = (date) => {
        if (date) {
            const dateObj = new Date(date);
            // if (!isNaN(dateObj)) {
                return dateObj.toISOString().split('T')[0];
            // }
        }
        // return 'N/A';
    };
    return (
        <React.Fragment>
            <PmDashboard />

            <div className='dashboard-container '>
                <div className='dash'>
                    <div className="box1">
                        <h4>Employee Count</h4>
                        <p>{employeeCount}</p>

                    </div>
                    <div className="box2">
                        <h4>Project Count</h4>
                        <p>{projectCount}</p>
                    </div>
                    <div className="box1">
                        <h4>Request Count</h4>
                        <p>{reqestCount}</p>
                    </div>
                </div>
            </div>
            <div>
                {/* <h2 className='dashB'>Projects</h2> */}
                <div className="table-container">
                    <table className="project-table">
                        <thead>
                            <tr>
                                {/* <th>ID</th> */}
                                <th>Title</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Department</th>
                                <th>Description</th>
                                <th>Status</th>
                                {/* <th>Document</th> */}
                                {/* Add more columns as needed */}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(project => (
                                <tr key={project.projectId}>
                                    {/* <td>{project.projectId}</td> */}
                                    <td>{project.title}</td>
                                    <td>{splitDateByT(project.startDate)}</td> {/* Splitting and displaying start date */}
                                    <td>{splitDateByT(project.endDate)}</td> {/* Splitting and displaying end date */}
                                    <td>{project.department}</td>
                                    <td>{project.description}</td>
                                    <td>{project.referredEmployees && project.referredEmployees.length > 0 ? "Referred" : "Not Referred"}</td>
                                    
                                    {/* <tb><button className="pdf" onClick={() => viewProjectPdf(project.projectId)}>View PDF</button></tb> */}
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </React.Fragment>
    );
};


export default DashB;


