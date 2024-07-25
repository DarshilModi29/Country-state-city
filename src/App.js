import './App.css';
import City from './components/City';
import Country from './components/Country';
import State from './components/State';
import Login from './components/Login';
import Home from './components/Home.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home heading="Home" />} />
        <Route path='/country' element={<Country heading="Country" />} />
        <Route path='/state' element={<State heading="State" />} />
        <Route path='/city' element={<City heading="City" />} />
        <Route path='/login' element={<Login heading="Login" />} />
      </Routes>
    </Router>
  );
}

export default App;
