import { routerType } from "../types/router.types";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import AdministratePage from "./AdministratePage";
import AdministrateStudents from "./AdministrateStudents";

const pagesData: routerType[] = [
  {
    path: "/",
    element: <HomePage />,
    title: "inicio",
  },
  {
    path: "registrar",
    element: <RegisterPage />,
    title: "registrar",
  },
  {
    path: "administrar",
    element: <AdministratePage />,
    title: "administrar",
  },
  {
    path: "estudiantes",
    element: <AdministrateStudents />,
    title: "estudiantes",
  },
];

export default pagesData;
