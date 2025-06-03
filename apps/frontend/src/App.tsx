import "./App.css";
import Sheet from "./components/sheet/sheet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/:id" element={<Sheet />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
