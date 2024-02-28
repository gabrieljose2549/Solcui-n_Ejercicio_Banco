// Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Dashboard = ({ token }) => {
  const [accountType, setAccountType] = useState("");
  const [accountStatus, setAccountStatus] = useState("");
  const [accountFunds, setAccountFunds] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [accounts, setAccounts] = useState([]);

  // Utilizamos useParams para obtener el userId desde la URL
  const { userId } = useParams();
  console.log("userId:", userId);

  useEffect(() => {
    // Verifica si userId es undefined o tiene un valor válido
    if (userId) {
      // Al cargar el componente, obtener la lista de cuentas del usuario
      fetchAccounts();
    }
  }, [userId, token]); // Asegúrate de incluir userId en las dependencias

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/accounts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const createAccount = async () => {
    console.log("userId in createAccount:", userId);
    try {
      const response = await axios.post(
        `http://localhost:8000/api/accounts/user/new/${userId.toString()}`,
        {
          accountType,
          accountStatus,
          accountFunds,
          accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Account created successfully");
      // Actualizar la lista de cuentas después de la creación
      fetchAccounts();
    } catch (error) {
      //alert("Error creating account: " + error.response.data.message);
      alert("Error creating account: " + JSON.stringify(error.response.data));
    }
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form>
        <label>Account Type: </label>
        <input
          type="text"
          onChange={(e) => setAccountType(e.target.value)}
          value={accountType}
        />
        <br />

        <label>Account Status: </label>
        <input
          type="text"
          onChange={(e) => setAccountStatus(e.target.value)}
          value={accountStatus}
        />
        <br />

        <label>Account Funds: </label>
        <input
          type="number"
          onChange={(e) => setAccountFunds(e.target.value)}
          value={accountFunds}
        />
        <br />

        <label>Account Number: </label>
        <input
          type="text"
          onChange={(e) => setAccountNumber(e.target.value)}
          value={accountNumber}
        />
        <br />

        <button type="button" onClick={createAccount}>
          Create Account
        </button>
      </form>

      <h2>Your Accounts</h2>
      <ul>
        {accounts.map((account) => (
          <li key={account._id}>
            Type: {account.accountType}, Status: {account.accountStatus},{" "}
            Funds: {account.accountFunds}, Number: {account.accountNumber}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;