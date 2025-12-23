import { useNavigate } from "react";
import React, { useEffect } from 'react';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("jwt-token");
        navigate("/", { replace: true });
    }, [])
    return (
        <>
        </>
    )
}

export default Logout