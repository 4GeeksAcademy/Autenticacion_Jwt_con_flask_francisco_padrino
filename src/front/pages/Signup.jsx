import React, { useEffect } from 'react';
import { useState } from "react"
import { Link } from "react-router-dom";



function Signup() {
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resultado, setResultado] = useState("");
    const backendUrl = import.meta.env.VITE_BACKEND_URL


    const createUser = async () => {
        //console.log(username, password, name, lastname);
        var resi = backendUrl + "/api/users"
        const resp = await fetch(resi, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lastname, name, password, username })
        })
        if (!resp.ok) throw Error("There was a problem in the login request")
        if (resp.status === 401) {
            throw ("Invalid credentials")
        } else if (resp.status === 400) {
            throw ("Invalid email or password format")
        }

        const data = await resp.json()
        if (data.estado == "ok") {
            setResultado(data.mensaje);
            limpiarCampos();
        }
    }
    const limpiarCampos = () => {
        setUsername("");
        setPassword("");
        setName("");
        setLastname("");
    }


    return (
        <>
            <div className="container">
                <div className='row my-5'>
                    <div className='col-md-4 offset-md-2'>
                        <img src="https://www.yunbitsoftware.com/blog/wp-content/uploads/2020/03/364146-PB1OW0-666.jpg" alt="Programador" className='img-fluid' />
                    </div>
                    <div className='col-md-4'>
                        <h1 className="display-4 text-center">Sign Up</h1>
                        <form>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" value={name} onInput={(e) => { setName(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Lastname</label>
                                <input type="text" className="form-control" value={lastname} onInput={(e) => { setLastname(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Username</label>
                                <input type="text" className="form-control" value={username} onInput={(e) => { setUsername(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" value={password} onInput={(e) => { setPassword(e.target.value) }} />
                            </div>
                            <div className="d-flex justify-content-between">
                                <button type="button" className="btn btn-primary" onClick={createUser}>Enviar</button>
                                <Link to="/">
                                    <button className="btn btn-primary">Regresar</button>
                                </Link>
                            </div>
                        </form>
                        {resultado ? <div className="alert alert-success" role="alert"> {resultado}</div> : ""}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup
