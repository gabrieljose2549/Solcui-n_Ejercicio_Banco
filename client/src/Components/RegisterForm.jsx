import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterForm = (props) => {
    const { setToken } = props;
    const [personName, setPersonName] = useState("");
    const [personLastname, setPersonLastname] = useState("");
    const [personDNI, setPersonDNI] = useState("");
    const [personMail, setPersonMail] = useState("");
    const [personAddress, setPersonAddress] = useState("");
    const [password, setPassword] = useState("");
    
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    let navigate = useNavigate();
    const onSubmitRegisterHandler = async (e) => {
        e.preventDefault();
        //Manejador de registro (Crear nuevo usuario)
        var respuesta = "";
        var error = "";
        await axios.post("http://localhost:8000/api/user/new", { personName, personLastname, personDNI, personMail, personAddress, password })
            .then(res => respuesta = res.data)
            .catch(err => error = err);
        if (respuesta !== "") {
            alert("Usuario Agregado Correctamente");
            setPersonName("");
            setPersonLastname("");
            setPersonDNI("");
            setPersonMail("");
            setPersonAddress("");
            setPassword("");
            console.log("Respuesta:", respuesta);
            setToken(respuesta.token);
        }
        else {
            alert("El usuario no fue agregado porque " + error.response.data.message);
        }
    }

    const onSubmitLoginHandler = async(e) => {
        e.preventDefault();
        //Manejador de inicio de sesión (Login)
        var respuesta = "";
        var error = "";
        await axios.post("http://localhost:8000/api/login", { personMail: loginEmail, password: loginPassword })
            .then(res => {
                console.log("Response data:", res.data); 
                respuesta = res.data;
              })
            .catch(err => error = err);
        if (respuesta !== "") {
            //alert("Usuario Logeado Correctamente");
            setLoginEmail("");
            setLoginPassword("");
            console.log("Usuario Logeado:", respuesta);
            await setToken(respuesta.token);
            navigate(`/api/accounts/user/${respuesta.id}`);
        }
        else {
            alert(error.response.data.message);
        }

    }

    return (
        <div className="Container">
            <div className="Header">
                <h1>Welcome...</h1>
            </div>
            <div className="BodyLogin">
                <div className="Register block">
                    <h2>Register</h2>
                    <form onSubmit={onSubmitRegisterHandler} >
                        <label>Firstname: </label><br />
                        <input type="text" onChange={(e) => setPersonName(e.target.value)} value={personName} /><br />
                        <label>Lastname: </label><br />
                        <input type="text" onChange={(e) => setPersonLastname(e.target.value)} value={personLastname} /><br />
                        <label>DNI: </label><br />
                        <input type="text" onChange={(e) => setPersonDNI(e.target.value)} value={personDNI} /><br />
                        <label>Address: </label><br />
                        <input type="text" onChange={(e) => setPersonAddress(e.target.value)} value={personAddress} /><br />
                        <label>Email: </label><br />
                        <input type="text" onChange={(e) => setPersonMail(e.target.value)} value={personMail} /><br />
                        <label>Password: </label><br />
                        <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} /><br />
                        <input type="submit" value={"Register"} className="btn" />
                    </form>
                </div>
                <div className="Login block">
                    <h2>Login</h2>
                    <form onSubmit={onSubmitLoginHandler} >
                        <label>Email: </label><br />
                        <input type="text" onChange={(e) => setLoginEmail(e.target.value)} value={loginEmail} /><br />
                        <label>Password: </label><br />
                        <input type="password" onChange={(e) => setLoginPassword(e.target.value)} value={loginPassword} /><br />
                        <input type="submit" value={"Login"} className="btn" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterForm;
