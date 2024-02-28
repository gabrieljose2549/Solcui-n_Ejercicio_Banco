import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const Users = (props) =>{
    const {token} = props;
    const [ userList, setUserList ] = useState([]);
    let navigation = useNavigate();
    useEffect(()=>{
        console.log(token);
        axios.get("http://localhost:8000/api/users", {headers: { Authorization: "Bearer " + token },})
        .then((users) => setUserList(users.data))
        .catch((err) => console.log(err))
    }, []);

    const updateUserDom = (userId) =>{
        setUserList(userList.filter(user => user._id !== userId));
    }

    const deleteHandler = (userId) =>{
        axios.delete('http://localhost:8000/api/user/' + userId, {headers: { Authorization: "Bearer " + token },})
            .then( res => {
                console.log(res);
                updateUserDom(userId);
            })
            .catch( err => console.log(err))
    }

    return(
        <div>
            <h1>Lista de usuarios</h1>
            
            {
                userList.map((user, i) =>{
                    return <p key={i}>
                        <Link to={'/api/user/' + user._id}>{user.userName}</Link>
                        <button onClick={(e)=>deleteHandler(user._id)}>Borrar</button>
                    </p> 
                })
            }
            <button onClick={(e)=>{navigation('/api/user/new')}}>Nuevo</button>
            
        </div>
    );
}


export default Users;