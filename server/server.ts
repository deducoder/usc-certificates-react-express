import express, { Application } from "express";
import cors from "cors";

// Importing routes
import userRoutes from "./routes/users";
import adminRoutes from "./routes/administrators";
import studentRoutes from "./routes/students";
import studentCareerRoutes from "./routes/students-careers";
import careerRoutes from "./routes/careers";
import subjectRoutes from "./routes/subjects";
import scoreRoutes from "./routes/scores";
import peopleRoutes from "./routes/people";
import certificateFieldRoutes from "./routes/certificate-fields";

// Importing db
import db from "./database/connection";

// Main class to set up and run the server
class Server {
  private app: Application; // Express application instance
  private port: number; // Port number
  private apiRoutes = {
    users: "/api/users",
    admins: "/api/admins",
    students: "/api/students",
    studentsCareers: "/api/students-careers",
    careers: "/api/careers",
    subjects: "/api/subjects",
    scores: "/api/scores",
    people: "/api/people",
    certificateFields: "/api/certificate-fields",
  };

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 8000; // Convert port to number
    this.dbConnection(); // Calling db connection
    this.middlewares(); // Calling middlewares
    this.routes(); // Calling routes
  }

  // Method db connection
  async dbConnection() {
    try {
      await db.authenticate();
      console.log("Database connected");
    } catch (error) {
      console.error("Database failed to connect", error);
      throw error;
    }
  }

  // Method to set middlewares
  middlewares() {
    this.app.use(cors({
      origin: "*", // Permitir acceso desde cualquier origen (puedes restringirlo si es necesario)
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }));
    
    this.app.use(express.json()); // Parse JSON
    this.app.use(express.static("public")); // Serve static files
  }

  // Method to set up API routes
  routes() {
    this.app.use(this.apiRoutes.users, userRoutes);
    this.app.use(this.apiRoutes.admins, adminRoutes);
    this.app.use(this.apiRoutes.students, studentRoutes);
    this.app.use(this.apiRoutes.studentsCareers, studentCareerRoutes);
    this.app.use(this.apiRoutes.careers, careerRoutes);
    this.app.use(this.apiRoutes.subjects, subjectRoutes);
    this.app.use(this.apiRoutes.scores, scoreRoutes);
    this.app.use(this.apiRoutes.people, peopleRoutes);
    this.app.use(this.apiRoutes.certificateFields, certificateFieldRoutes);
  }

  // Method to start the server and listen for requests
  listen() {
    this.app.listen(this.port, "0.0.0.0", () => {
      console.log(`Server running on http://0.0.0.0:${this.port}`);
    });
  }
}

export default Server;
