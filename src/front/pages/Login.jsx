import { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resultado, setResultado] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate();

    const loginUser = async () => {
        var resi = backendUrl + "/api/token"
        const resp = await fetch(resi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, username })
        })
        //if(!resp.ok) throw Error("There was a problem in the login request")
        if (resp.status === 401) {
            setResultado("Error!, No exite el usuario ingresado");
            limpiarCampos();
            return false;
            //throw("Invalid credentials")
        } else if (resp.status === 400) {
            setResultado("Error!, No es posible validar el usuario");
            limpiarCampos();
            return false;
            //throw ("Invalid email or password format")
        }

        const data = await resp.json()
        if (data.token) {
            localStorage.setItem("jwt-token", data.token);
            navigate("/private", { replace: true });

        }
    }
    const limpiarCampos = () => {
        setUsername("");
        setPassword("");
    }

    return (
        <>
            <div className="container my-5">
                <div className='row'>
                    <div className='col-md-4 offset-md-2'>
                        <img src="https://www.yunbitsoftware.com/blog/wp-content/uploads/2020/03/364146-PB1OW0-666.jpg" alt="Programador" className='img-fluid' />
                    </div>
                    <div className='col-md-4'>
                        <h1 className="display-4 text-center">Login</h1>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" value={username} onInput={(e) => { setUsername(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" value={password} onInput={(e) => { setPassword(e.target.value) }} />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={loginUser}>Enviar</button>
                        </form>
                        <p className="my-5"> No tienes cuenta? puede registrate <Link to={"/signup"} className="fw-bold text-decoration-none">Aqui</Link></p>
                        {resultado ? <div className="alert alert-danger my-5" role="alert"> {resultado}</div> : ""}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
