import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateUser = (props) => {
    const {token} = props;
    const { id } = useParams();
    const [user, setUser] = useState({userName:'', email: ''});
    let navigation = useNavigate();

    useEffect(()=>{
        axios.get("http://localhost:8000/api/user/"+ id,{headers: { Authorization: "Bearer " + token },})
        .then(res => setUser(res.data))
        .catch(err => console.log(err) )
    }, []);

    const updateUserHandler = (e) => {
                //Función para realizar una petición PUT y actualizar un usuario
                e.preventDefault();
                axios.put('http://localhost:8000/api/user/'+ id, {
                    userName: user.userName,
                    email: user.email
                }, {headers: { Authorization: "Bearer " + token },})
                    .then(res => {
                        console.log(res);
                        navigation('/api/users')
                    })
                    .catch(err => console.log(err))
    }

    return(
        <div>
            <h1>Actualización de usuario:</h1>
            <form onSubmit={updateUserHandler}>
                <label htmlFor="username" >Username:</label>
                <input type="text" id="username" value={user.userName} onChange={(e) => setUser({...user, 'userName':e.target.value})} />
                <label htmlFor="email" >Email:</label>
                <input type="text" id="email" value={user.email} onChange={(e) => setUser({...user, 'email':e.target.value})} />
                <input type="submit"/>
            </form>
        </div>
    );

}

export default UpdateUser;