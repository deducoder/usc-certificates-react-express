import express, { Application } from "express";

//importing routes
import userRoutes from "../routes/users";
import adminRoutes from "../routes/administrators";
import studentRoutes from "../routes/students";
import studentCareerRoutes from "../routes/students-careers";
import careerRoutes from "../routes/careers";
import subjectRoutes from "../routes/subjects";
import scoreRoutes from "../routes/scores";

//main class to set up and run the server
class Server {
  private app: Application; //Express application instance
  private port: string; //port number
  private apiRoutes = {
    //API route paths
    users: "/api/users", //passed Postman test
    admins: "/api/admins", //passed Postman test
    students: "/api/students", //passed Postman test
    studentsCareers: "/api/studentsCareers", //passed Postman test
    careers: "/api/careers", //passed Postman test
    subjects: "/api/subjects", //passed Postman test
    scores: "/api/scores", //passed Postman test
  };

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8000";
    this.routes();
  }

  //method to set up API routes
  routes() {
    this.app.use(this.apiRoutes.users, userRoutes); //users related routes
    this.app.use(this.apiRoutes.admins, adminRoutes); //admins related routes
    this.app.use(this.apiRoutes.students, studentRoutes); //studets related routes
    this.app.use(this.apiRoutes.studentsCareers, studentCareerRoutes); //studentsCareers related routes
    this.app.use(this.apiRoutes.careers, careerRoutes); //careers related routes
    this.app.use(this.apiRoutes.subjects, subjectRoutes); //subjects related routes
    this.app.use(this.apiRoutes.scores, scoreRoutes); //scores related routes
  }

  //method to start the server and lsiten for requests
  listen() {
    this.app.listen(this.port, () => {
      console.log("server running on port: " + this.port);
    });
  }
}

export default Server;
