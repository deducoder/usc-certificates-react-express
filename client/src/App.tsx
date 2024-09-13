import { BrowserRouter } from "react-router-dom";
//importing pages
import Router from "./routes/router";

function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
