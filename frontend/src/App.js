import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import Login from "./components/Login";
import { useEffect, useState } from "react";

function App() {
  // const [access, setAccess] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  useEffect(() => {
    console.log("authentication: ", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            exact
            path="/"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route
            exact
            path="/home"
            element={<Homepage />}
            // element={isAuthenticated ? <Homepage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
