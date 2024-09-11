import dotenv from "dotenv";
import Server from "./server";

//dot.env configuration
dotenv.config();

const server = new Server();

server.listen();
