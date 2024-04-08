const express=require('express')
const app=express()
const bodyParser = require('body-parser');
const cors=require('cors')
const {config}=require('dotenv');
config()
const multer = require('multer');
const mongoose=require('mongoose')
const cookieParser = require('cookie-parser'); 
const adminRoutes = require('./routes/adminRoutes');
const projectManagerRoutes = require('./routes/projectManagerRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const projectRoutes=require('./routes/ProjectRoute')
const projectRequestRoutes=require('./routes/projRequestRoute')
const referRoutes = require('./routes/referRoute');
app.use(cors())
app.use("/uploads",express.static("uploads"))
app.use(express.json())
app.use(cookieParser());
//mongoose.connect('mongodb+srv://balemisreevarsha:sree2907@projectfit.abyjm97.mongodb.net/?retryWrites=true&w=majority&appName=ProjectFit');
mongoose.connect(process.env.Mongo);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(adminRoutes);
app.use(projectManagerRoutes);
app.use(employeeRoutes);
app.use(projectRoutes);
app.use(projectRequestRoutes);
app.use(referRoutes);



// app.post('/calculate-score', async (req, res) => {
//   console.log("1-------------------------------");
//   try {
//     console.log("1.1-------------------------------");
//     const { department, title } = req.query;
// console.log("1-.2------------------------------");
//     // Retrieve project and employee files based on the received data
//     const projectFile = await fetchProjectFile(title); // Implement this function
//     const employeeFiles = await fetchEmployeeFiles(department); // Implement this function
//     console.log("2-------------------------------");
//     if (!projectFile) {
//       console.error('Project file not found');
//       return res.status(404).json({ error: 'Project file not found' });
//     }console.log("3-------------------------------");

//     if (!employeeFiles || employeeFiles.length === 0) {
//       console.error('Employee files not found');
//       return res.status(404).json({ error: 'Employee files not found' });
//     }
//     console.log("4-------------------------------");
//     // Perform scoring calculations for each employee
//     const scores = [];
//     for (const employeeFile of employeeFiles) {
//       const filename = employeeFile.resume;
//       const employeeId = employeeFile.employeeId;
//       const score = await euclideanDistance(projectFile, filename);
//       scores.push({ employeeId, score });
//     }

//     console.log('Scores:', scores);
//     res.json({ scores });
//   } catch (error) {
//     console.error('Error calculating scores:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });





const http=require("http");
const {Server}=require("socket.io");
const server=http.createServer(app)


const io=new Server(server,{
  cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
  },
})

io.on("connection",(socket)=>{
  let num = 0;
  // console.log(`User Connected:${socket.id}`);
  socket.on("resource_message",(data)=>{
    // console.log(data);
    num++;
    socket.broadcast.emit("project-message",num,data)
  })

  socket.on("project_message",(data)=>{
    // console.log(data);
    num++;
    socket.broadcast.emit("resource-message",num,data)
  })
})


server.listen(process.env.Backend_Port,()=>{
    console.log("Server is running");
})















































