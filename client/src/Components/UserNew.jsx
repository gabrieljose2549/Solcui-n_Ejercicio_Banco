import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserNew = (props) => {
    const {token} = props;
    const [user, setUser] = useState({userName:'', email: ''});
    const [userNameError, setUserNameError] = useState("");
    let navigation = useNavigate(); 


    const createUserHandler = (e) => {
        //Función para realizar una petición PUT y actualizar un usuario
        e.preventDefault();
        axios.post('http://localhost:8000/api/user/new', {
            userName: user.userName,
            email: user.email,
            password: "12345678"
        })
            .then(res => {
                console.log(res);
                navigation('/api/users')
            })
            .catch(err => {
                console.log(err.response.data);
                const errorResponse = err.response.data.errors;
                if(Object.keys(errorResponse).includes('userName')){
                    setUserNameError(errorResponse['userName'].message)
                }
            })
    }

    return(
        <div>
        <h1>Nuevo usuario:</h1>
        <form onSubmit={createUserHandler}>
            <div>
                <label htmlFor="username" >Username:</label>
                <input type="text" id="username"  onChange={(e) => setUser({...user, 'userName':e.target.value})} />
                <p>{userNameError}</p>
            </div>
            <div>
                <label htmlFor="email" >Email:</label>
                <input type="text" id="email" onChange={(e) => setUser({...user, 'email':e.target.value})} />
            </div>
            <input type="submit"/>
        </form>
    </div>
    );
}

export default UserNew;