import { routerType } from "../types/router.types";
import HomePage from "./HomePage";
import RegisterPage from "./RegisterPage";
import AdministratePage from "./AdministratePage";

const pagesData: routerType[] = [
  {
    path: "/",
    element: <HomePage />,
    title: "home",
  },
  {
    path: "register",
    element: <RegisterPage />,
    title: "register",
  },
  {
    path: "administrate",
    element: <AdministratePage />,
    title: "administrate",
  },
];

export default pagesData;
