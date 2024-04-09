import React from 'react';
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
// import Login from './Components/Login';
import AdminLogin from './Components/AdminLogin';

import  ManageEmployee  from './Components/ResourceManager/ManageEmployee';
import AddEmployee from './Components/ResourceManager/AddEmployee';

import SkillGap from './Components/SkillGap';
import AllProjects from './Components/ProjectManager/AllProjects';
import AddProjects from './Components/ProjectManager/AddProjects';
import AssignProjects from './Components/ResourceManager/AssignProjects';

import Admin from './Components/Admin';

import Pmregister from './Components/ProjectManager/Pmregister';
import PmLogin from './Components/ProjectManager/PmLogin';
import PmDashboard from './Components/ProjectManager/PmDashboard';

import RmDashboard from './Components/ResourceManager/RmDashboard';
import Select from './Components/Select';

import ViewProject from './Components/ResourceManager/ViewProject';
import Request from './Components/ResourceManager/Request'
import SentRequest from './Components/ProjectManager/SentRequest';
import DashB from './Components/ProjectManager/DashB';
import EditProject from './Components/ProjectManager/EditProject'
import EditEmp from './Components/ResourceManager/EditEmp';
// import Referrals from './Components/ProjectManager/Referrals';
import RDashB from './Components/ResourceManager/RDashB';
import Create from './Components/Create';
import EmpLogin from './Components/Employee/EmpLogin'
import Employee from './Components/Employee/Employee';
import EmpDashB from './Components/Employee/EmpDashB';
// import Dashdummy from './Components/Dashdummy';
// function App(){
//   return(
//     <><Login/></>
//   )
// }


const App=()=> {
  let routes;
 
  routes=(
    <Routes>
       <Route path="/" element={<Select />} />
       <Route path="/create" element={<Create />} />
      
      

       
       <Route path="/projectmanagercreation" element={<Pmregister/>} />
       <Route path="/projectmanagerlogin" element={<PmLogin/>} />
       <Route path="/pmdashboard" element={<PmDashboard />} />
       <Route path="/pmdashboard" element={<PmDashboard />} />
       <Route path="/projectmanager" element={<DashB />} />
       <Route path="/all-projects" element={<AllProjects />} />
       <Route path="/update-project/:projectId" element={<EditProject />} />
       <Route path="/add-projects" element={<AddProjects />} />
       <Route path="/send-request" element={<SentRequest />} />
      
{/* 
       ---------------------------------------------------Resource Manager---------------------------------------------------------------------- */}
       <Route path="/admincreation" element={<Admin/>} />
       <Route path="/adminlogin" element={<AdminLogin />} />
       <Route path="/rmdashboard" element={<RmDashboard />} />
       <Route path="/manage-employees" element={<ManageEmployee />} />
       <Route path="/addEmployee" element={<AddEmployee />} />
       <Route path="/viewprojects" element={<ViewProject />} />
       <Route path="/skill-gap" element={<SkillGap />} />
      <Route path="/assign-projects" element={<AssignProjects />} />
      <Route path="/projectmanagerRequest" element={<Request/>} />
      <Route path="/update-employee/:employeeId" element={<EditEmp />} />
      <Route path="/resourcemanager" element={<RDashB />} />
      
       {/* -------------------------------------Employeeee---------------------------------------- */}
       <Route path="/employeelogin" element={<EmpLogin />} />
       <Route path="/employee/dashboard/:employeeId" element={<Employee />} />
       <Route path="/employee" element={<EmpDashB />} />

     </Routes>
    
  );
  return (
  <Router>
    
      {/* // <MainNav/> */}
      <main>{routes}</main>
     </Router>  
  )
}

export default App;
