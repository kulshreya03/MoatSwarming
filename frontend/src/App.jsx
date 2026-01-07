import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Homepage } from './pages/Homepage'
import { Userlogin } from './pages/Userlogin';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Homepage/>}></Route>
              <Route path="/loginUser" element={<Userlogin/>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
