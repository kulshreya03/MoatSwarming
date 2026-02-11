import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Homepage } from './pages/Homepage';
import { UserPage } from './pages/UserPage';
import { UserLogin } from './pages/Userlogin';
import { TasksPage } from './pages/TasksPage';

function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<Homepage/>}></Route>
              <Route path="/UserLogin" element={<UserLogin/>}></Route>
              <Route path="/UserPage" element={<UserPage/>}></Route>
              <Route path="/TasksPage" element={<TasksPage/>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
