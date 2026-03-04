import { useNavigate } from "react-router-dom"

export function Homepage()
{
    const navigate=useNavigate()

    function redirectStudent()
    {
        navigate("/UserLogin")
    }

    function redirectAdmin()
    {
        navigate("/AdminLogin")
    }

    return(
        <div>
            <button onClick={redirectStudent}>Student Login</button> 
            <button onClick={redirectAdmin}>Admin Login </button>               
        </div>
    )
}