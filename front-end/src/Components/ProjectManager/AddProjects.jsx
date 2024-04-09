
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PmDashboard from './PmDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProject.css';
import { URL } from '../../data';

// console.log(URL)

const AddProjects = () => {
  const [project, setProject] = useState({
    projectId: uuidv4(),
    title: '',
    startDate: '',
    endDate: '',
    department: '',
    description: '',
    file:null
  });

  const [errors, setErrors] = useState({
    title: '',
    startDate: '',
    endDate: '',
    department: '',
    description: '',
    file:null
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedValue = value;
    let error = '';
  
    switch (name) {
      case 'title':
        error = value.trim() === '' ? 'Title is required' : '';
        break;
        case 'startDate':
          error = value.trim() === '' ? 'Start date is required' : '';
          if (value !== '' && project.endDate !== '') {
            const startDate = new Date(value);
            const endDate = new Date(project.endDate);
            if (startDate >= endDate) {
              error = 'Start date must be before end date';
            }
          }
          break;
        case 'endDate':
          error = value.trim() === '' ? 'End date is required' : '';
          if (value !== '' && project.startDate !== '') {
            const startDate = new Date(project.startDate);
            const endDate = new Date(value);
            if (endDate <= startDate) {
              error = 'End date must be after start date';
            }
          }
          break;
      case 'department':
        error = value === '' ? 'Department is required' : '';
        break;
      case 'status':
        error = value === '' ? 'Status is required' : '';
        break;
      case 'description':
        error = value.trim() === '' ? 'Description is required' : '';
        break;
      case 'file':
        error = files && files.length === 0 ? 'File is required' : '';
        break;
      default:
        break;
    }
  
    setErrors({ ...errors, [name]: error });
    setProject({ ...project, [name]: value, file: files ? files[0] : null });
  };
  
  // const handleChange = (e) => {
  //   const { name, value ,files } = e.target;
  //   let updatedValue = value;

  // if (name === "startDate"|| name === "endDate") {
  //   const date = new Date(value);
  //   updatedValue = date.toISOString().split('T')[0]; // Extract only the date part
  // }

  // setProject({ ...project, [name]: value, file: files ? files[0] : null }); // Update file state if present
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    //console.log(token);
    if (project.file&& !project.file.name.endsWith('.pdf')) {
      toast.error('Please upload a PDF file for the resume.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('projectId', project.projectId); 
      formData.append('file', project.file); // Append the file to FormData
      formData.append('title', project.title);
      formData.append('startDate', project.startDate);
      formData.append('endDate', project.endDate);
      formData.append('department', project.department);
      formData.append('description', project.description);
      formData.append('status', project.status);

      const response = await fetch(`${URL}/api/add-projects`, {
        method: 'POST',
        body: formData, 
        headers:{
         
          'Authorization': `Bearer ${token}`
      },
      });

      if (!response.ok) {
        throw new Error('Failed to add project');
      }
      toast.success('Project added successfully.');
      console.log('Project added successfully.');
      // Redirect to dashboard or other appropriate page after successful submission
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('Failed to add project.');
      // Handle error appropriately (e.g., display error message)
    }
  };

 

  return (
    <React.Fragment>
      <PmDashboard />
      <ToastContainer />
{/* <PmNavbar/> */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <div className="p-3 rounded w-50 border set">
          <h3 className="text-center">Add Project</h3>
          <form className="row g-1" onSubmit={handleSubmit}>
            <div className="col-12">
              <label htmlFor="inputName" className="form-label">
                Project Title:
              </label>
              <input
                type="text"
                className="form-control rounded-0"
                id="inputName"
                placeholder="Enter Name"
                name="title"
                value={project.title}
                onChange={handleChange}
                 />{errors.title && <p className="text-danger">{errors.title}</p>}
                </div>
            <div className="col-12">
              <label htmlFor="startDate" className="form-label">
                Start Date:
              </label>
              <input
                type="date"
                className="form-control rounded-0"
                id="startDate"
                name="startDate"
                value={project.startDate}
                onChange={handleChange}
              />{errors.startDate && <p className="text-danger">{errors.startDate}</p>}
            </div>
            <div className="col-12">
              <label htmlFor="endDate" className="form-label">
                End Date:
              </label>
              <input
                type="date"
                className="form-control rounded-0"
                id="endDate"
                name="endDate"
                value={project.endDate}
                onChange={handleChange}
              />{errors.endDate && <p className="text-danger">{errors.endDate}</p>}
            </div>
            <div className="col-12">
              <label htmlFor="inputDepartment" className="form-label">
                Department:
              </label>
              <select
                className="form-control rounded-0"
                name="department"
                value={project.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Finance">Finance</option>
                <option value="CustomerService">Customer Service</option>
                <option value="AccountManagement">Account Management</option>
              </select>{errors.department && <p className="text-danger">{errors.department}</p>}
            </div> 
            {/* <div className="col-12">
              <label htmlFor="inputDepartment" className="form-label">
                Status
              </label>
              <select
                className="form-control rounded-0"
                name="status"
                value={project.status}
                onChange={handleChange}
              >
                <option value="">Set Project Status</option>
                <option value="Assigned">Reffered</option>
                <option value="Not Assigned">Not Reffered</option></select></div> */}
            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Project Description:
              </label>
              <textarea
                className="form-control rounded-0"
                id="description"
                name="description"
                placeholder="Enter project description"
                rows="3"
                value={project.description}
                onChange={handleChange}
              />{errors.description && <p className="text-danger">{errors.description}</p>}
            </div>
            <div className="col-12">
              <label htmlFor="file" className="form-label">
                Project Detail PDF:
              </label>
              <input
                type="file"
                className="form-control rounded-0"
                id="file"
                name="file"
                accept=".pdf"
                onChange={handleChange}
              />{errors.file && <p className="text-danger">{errors.file}</p>}
            </div>
            <div className="col-12">
              <button type="submit" className="editt">
                Add Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddProjects;
























