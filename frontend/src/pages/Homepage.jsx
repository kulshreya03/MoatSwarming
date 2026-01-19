import { useNavigate } from "react-router-dom"

export function Homepage()
{
    const navigate=useNavigate()

    function handleClick()
    {
        navigate("/UserLogin")
    }

    return(
        <div>
            <button onClick={handleClick}>Student Login</button>                
        </div>
    )
}