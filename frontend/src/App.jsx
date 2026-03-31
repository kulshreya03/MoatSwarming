import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { HomePage } from './pages/Homepage';
import { UserPage } from './pages/UserPage';
import { UserLogin } from './pages/Userlogin';
import { TasksPage } from './pages/TasksPage';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPage } from './pages/AdminPage';
import { AdminDashboard } from './pages/AdminDashboard';


function App() {
  return (
    <>
        <BrowserRouter>
          <Routes>
              <Route path="/" element={<HomePage/>}></Route>
              <Route path="/UserLogin" element={<UserLogin/>}></Route>
              <Route path="/UserPage" element={<UserPage/>}></Route>
              <Route path="/TasksPage" element={<TasksPage/>}></Route>
              <Route path="/AdminLogin" element={<AdminLogin/>}> </Route>
              <Route path="/AdminPage" element={<AdminPage/>}></Route>
              <Route path="/AdminDashboard" element={<AdminDashboard/>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
