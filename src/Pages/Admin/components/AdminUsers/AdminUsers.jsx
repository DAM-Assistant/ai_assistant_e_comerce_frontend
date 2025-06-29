import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import {ReactComponent as RefreshIcon } from '../../../../Resources/Icons/refresh.svg'
import { PreduContext } from "../../../../PreduContext";
import axios from "axios";

const AdminUsers = () => {
  const location = useLocation()
  const { api_path, getAccessToken } = useContext(PreduContext)
  
  const [ users, setUsers ] = useState(location.state.users)
  const [ userSearch, setUserSearch ] = useState("")

  function formatDate(dateString) {
    if (dateString === null) {
      return "Н/Д";
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day is a single digit
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month is a single digit
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  async function refresh() {
    const users_api = api_path + "/api/users/"
    const response = await axios.get(users_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
    setUsers(response.data)
    location.state.users = response.data
  }
  
  return (
    <div className="admin-users">
      <div className="container">
        <h1>ПОЛЬЗОВАТЕЛИ ({users.length})</h1>
        
        <input type="text" className="search-bar" placeholder="Поиск ..." value={userSearch} onChange={(e)=>{setUserSearch(e.target.value)}}/>

        
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th>ID</th>
                <th>Логин</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Адрес</th>
                <th>Создан</th>
                <th>Обновлен</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user)=>{
                if (("id=" + String(user.id) + " " +
                  "username=" + String(user.username) + " " +
                  "firstname=" + String(user.firstname) + " " +
                  "lastname=" + String(user.lastname) + " " +
                  "phone=" + String(user.phone) + " " +
                  "email=" + String(user.email) + " " +
                  "location=" + String(user.location)).toLowerCase().includes(userSearch)) {
                    return (
                      <tr key={user.id}>
                        <td className="user-id">{user.id}</td>
                        <td className="user-username">{user.username}</td>
                        <td className="user-firstname">{user.firstname}</td>
                        <td className="user-lastname">{user.lastname}</td>
                        <td className="user-phone">{user.phone}</td>
                        <td className="user-email">{user.email}</td>
                        <td className="user-location">{user.location}</td>
                        <td className="user-create">{formatDate(user.created_at)}</td>
                        <td className="user-update">{formatDate(user.updated_at)}</td>
                      </tr>
                    )
                  }
              })}
              
            </tbody>
          </table>
        </div>
      </div>

      <button className="refresh-btn" onClick={refresh}>
        <RefreshIcon className="icon"/>
      </button>
    </div>
  )
}

export default AdminUsers