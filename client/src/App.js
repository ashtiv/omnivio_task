import './App.css';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Home from './Home';
import Plot from './Plot';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/plot" element={<Plot />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
