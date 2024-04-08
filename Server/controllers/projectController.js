
const Project = require('../models/Project');
const Employee = require('../models/Employee');
const { fetchProjectFile, fetchEmployeeFiles} = require('./files');
const { euclideanDistance } = require('../helper/pdfComparisonFunctions');
const {uploadToS3,retrieveFromS3}=require('../middlewares/aws_s3')
const addProject = async (req, res) => {
  try {
    const { projectId, title, startDate, endDate, department, description, status } = req.body;
    const file = req.file;

    if (!file || !file.mimetype || !file.mimetype.includes('pdf')) {
      throw new Error('Invalid file format. Please upload a PDF file.');
    }

    const s3file = await uploadToS3(file, projectId); // Assuming uploadToS3 is a function to upload files to S3
    const newProject = new Project({
      projectId,
      title,
      startDate,
      endDate,
      department,
      description,
      status,
      filePath: {
        local: file.path,
        s3: s3file // Assuming s3file contains the S3 file path
      }
    });
    
    await newProject.save();

    res.status(201).json({ message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to add project' });
  }
};

const getProjectData = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching project data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getProjectCount = async (req, res) => {
  try {
    const count = await Project.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching project count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const path = require('path');

const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const { title, startDate, endDate, department, description } = req.body;
 // const filePath = req.file ? req.file.path : null;
  try {
      // Find the project by projectId
      let project = await Project.findOne({projectId});
      
      // If project doesn't exist, return 404
      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Update project fields
      project.title = title;
      project.startDate = startDate;
      project.endDate = endDate;
      project.department = department;
      project.description = description;
      // if (req.file) {
      //     const file = project.file; // Get the current file path
      //     if (filePath) {
      //         // If there's a previous file, delete it
      //         fs.unlinkSync(file);
      //     }
      //     // Save the new file path
      //     project.file = req.file.path;
      // }


    //  Save the updated project
      await project.save();

      res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ message: 'Failed to update project' });
  }
};

const getProjectDetails = async (req, res) => {
  const {projectId } = req.params;
 // console.log(req.params);
  try {
    const project = await Project.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Failed to fetch project details' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const {projectId} = req.params; // Extract project ID from request parameters
    const project = await Project.findOneAndDelete({projectId});
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getProjectByTitle = async (req, res) => {
  const title = req.query.title;

  try {
    const projectDetails = await Project.findOne({ title });
    if (!projectDetails) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(projectDetails);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
};

const postSearch = async (req, res) => {
  try {
    const searchQuery = req.body.search;
    console.log('Search Query:', searchQuery); 
    const agg = [
      {
          $search: {
              "index": "searchProject",
              "autocomplete": {
                  "query": searchQuery,
                  "path": "title",
                  "score": { "boost": { "value": 2 } }
              }
          }
      },
      {
          $match: {
              "title": {
                  $regex: `.*${searchQuery}.*`,
                  $options: "i" // Case-insensitive search
              }
          }
      }
  ];
  
      console.log('Aggregation Pipeline:', JSON.stringify(agg, null, 2)); // Log the aggregation pipeline

      const search_results = await Project.aggregate(agg);
      console.log('Search results:', search_results);
      res.status(200).json(search_results);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching' });
  }
};



const calculateScoreController = async (req, res) => {
  try {
    const { department, title } = req.query;

    // Retrieve project and employee files based on the received data
    const projectFile = await fetchProjectFile(title);
    const employeeFiles = await fetchEmployeeFiles(department);

    if (!projectFile) {
      console.error('Project file not found');
      return res.status(404).json({ error: 'Project file not found' });
    }

    if (!employeeFiles || employeeFiles.length === 0) {
      console.error('Employee files not found');
      return res.status(404).json({ error: 'Employee files not found' });
    }

    // Perform scoring calculations for each employee
    const scores = [];
    for (const employeeFile of employeeFiles) {
      const filename = employeeFile.resume;
      const employeeId = employeeFile.employeeId;
      const score = await euclideanDistance(projectFile, filename);
      scores.push({ employeeId, score });
    }

    console.log('Scores:', scores);
    res.json({ scores });
  } catch (error) {
    console.error('Error calculating scores:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
async function getProjectPdf(req, res) {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findOne({ projectId });

    if (!project || !project.filePath || !project.filePath.s3) {
      return res.status(404).json({ message: 'Project not found or file path missing' });
    }
   
    console.log("1----")
    const fileData = await retrieveFromS3(projectId);

    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
    console.log("2----")
    // Send the file data
    res.write(fileData);
    res.end();
  } catch (error) {
   // console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = { addProject,getProjectCount,getProjectData ,getProjectDetails,deleteProject,updateProject ,getProjectByTitle,postSearch,calculateScoreController,getProjectPdf};
