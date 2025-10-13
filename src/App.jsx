import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home/home";
import AboutMe from "./components/aboutMe/aboutMe";
import Background from "./components/background/background";
import Certificates from "./components/certificates/certicates";
import Game from "./components/game/game";
import Header from "./components/header/header"; 
import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/game/game" element={<Game />} />
          <Route path="*" element={
            <>
              <Background />
              <div className="content-wrapper">
                <Header /> 
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/aboutme/aboutme" element={<AboutMe />} />
                  <Route path="/certificates/certificates" element={<Certificates />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;