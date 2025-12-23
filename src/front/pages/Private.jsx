import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Private() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate();
    var resi = backendUrl + "/api/protected"
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            fetch(resi, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json", 'Authorization': 'Bearer ' + token // ⬅⬅⬅ authorization token
                }
            })
                .then(response => {
                    if (response.status != 200) {
                        navigate("/", { replace: true });
                    }
                    return response.json()
                })
                .then(data => {
                    setName(data.name);
                })
        } else {
            console.log("no se validado usuario");
            navigate("/login", { replace: true });
        }
    }, [])
    const closeUser = () => {
        localStorage.removeItem("jwt-token");
    }
    return (
        <>
            <div className="container my-5">
                <div className='row'>
                    <div className='col-md-4 offset-md-2'>
                        <img src="https://www.yunbitsoftware.com/blog/wp-content/uploads/2020/03/364146-PB1OW0-666.jpg" alt="Programador" className='img-fluid' />
                    </div>
                    <div className='col-md-4'>
                        <h1 className="display-4 text-center">Private</h1>
                        <h3>Hola,   {name}!</h3>
                        <Link to={"/"}>
                            <button className="btn btn-primary" onClick={closeUser}>Cerrar Sessión</button>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Private
