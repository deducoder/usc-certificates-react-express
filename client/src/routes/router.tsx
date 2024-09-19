import { Route, Routes } from "react-router-dom";
import { routerType } from "../types/router.types";
import PagesData from "../pages/PagesData";

const Router = () => {
  const PageRoutes = PagesData.map(({ path, title, element }: routerType) => {
    return <Route key={title} path={`/${path}`} element={element} />;
  });
  return <Routes>{PageRoutes}</Routes>;
};

export default Router;
