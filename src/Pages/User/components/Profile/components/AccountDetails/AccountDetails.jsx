import React, { useContext, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

import { PreduContext } from "../../../../../../PreduContext";
import { ReactComponent as UserIcon } from '../../../../../../Resources/Icons/person_fill.svg'
import { ReactComponent as PhoneIcon } from '../../../../../../Resources/Icons/phone.svg'
import { ReactComponent as MailIcon } from '../../../../../../Resources/Icons/mail.svg'
import { ReactComponent as PinIcon } from '../../../../../../Resources/Icons/pin_drop.svg'
import { ReactComponent as EditIcon } from '../../../../../../Resources/Icons/edit.svg'
import { ReactComponent as PersonIcon } from '../../../../../../Resources/Icons/person_fill.svg'
import { ReactComponent as LockIcon } from '../../../../../../Resources/Icons/lock_fill.svg'

const AccountDetails = () => {

  const { api_path, getAccessToken, currentUser, setCurrentUser, setAuthenticated } = useContext(PreduContext)
  
  const [firstname, setFirstname] = useState(currentUser.firstname)
  const [lastname, setLastname] = useState(currentUser.lastname)
  const [phone, setPhone] = useState(currentUser.phone)
  const [email, setEmail] = useState(currentUser.email)
  const [location, setLocation] = useState(currentUser.location)

  const [newUsername, setNewUsername] = useState(currentUser.username)
  const [currentPassword, setCurrentPassword] = useState(currentUser.password)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")


  const [emptyInputModal, setEmptyInputModal] = useState(false)
  const [updateSuccessModal, setUpdateSuccessModal] = useState(false)
  const [updateUsernameModal, setUpdateUsernameModal] = useState(false)
  const [updatePasswordModal, setUpdatePasswordModal] = useState(false)

  const closeUpdateModal = () => {
    setCurrentPassword(currentUser.password)
    setUpdateUsernameModal(false)
    setUpdatePasswordModal(false)
  }

  const handleInputPhone = (event) => {
    let newValue = event.target.value;
    if (newValue.length > 10) {
      newValue = newValue.slice(0, 10); 
    }
    setPhone(newValue);
  };

  const notEmpty = () => {
    return [firstname, lastname, email, phone, location].every(value => value !== '');
  }

  const logout = () => {
    Cookies.remove('access_token', { secure: true, sameSite: 'strict' });
    setCurrentUser({})
    setAuthenticated(false)
  }

  const updateProfile = async() => {
    if (notEmpty()) {
      const user_update_api = api_path + "/api/users/update-user"
      const profile_api_path = api_path + "/api/auth/me"
      const userUpdate = {
        firstname: firstname,
        lastname: lastname,
        phone: phone,
        email: email,
        location: location
      }
      const response = await axios.patch(user_update_api, userUpdate, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
      if (response.status === 200) {
        const me_response = await axios.get(profile_api_path, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}});
        const user = me_response.data
        user.password = currentUser.password
        setCurrentUser(user)
        setUpdateSuccessModal(true)
      }
    }
    else {
      setEmptyInputModal(true)
    }

  }

  const updateUsername = async() => {
    if (currentUser.username === newUsername) {
      window.alert("Имя пользователя должно отличаться от текущего")
    }
    else {
      const usernameUpdated = {
        new_username: newUsername,
        password: currentPassword
      }
      try {
        const name_api = api_path + "/api/auth/change-username"
        const response = await axios.patch(name_api, usernameUpdated, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        Cookies.set('access_token', response.data.access_token, { secure: true, sameSite: 'strict' });
        window.alert(response.data.message)
        const newCurrentUser = currentUser
        newCurrentUser.username = newUsername
        setCurrentUser(newCurrentUser)
        setUpdateUsernameModal(false)
      } catch(e) {
        window.alert(e.response.data.detail)
      }
    }
    
  } 

  const updatePassword = async() => {
    const passwordUpdated = {
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    }
    try {
      const password_api = api_path + "/api/auth/change-password"
      const response = await axios.patch(password_api, passwordUpdated, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
      const newCurrentUser = currentUser
      const masked_password = newPassword.slice(0, -2).replace(/./g, "*") + newPassword.slice(-2);
      newCurrentUser.password = masked_password
      setCurrentUser(newCurrentUser)
      window.alert(response.data.message)
    } catch(e) {
      window.alert(e.response.data.detail)
    }
  }

  return (
    <div className="account-details">
      <div className="profile-card">
        <div className="profile-header">
          <UserIcon className="user-icon"/>
          <div className="username-section">
            <div className="username-row">
              <PersonIcon className="field-icon"/>
              <span className="username">{currentUser.username}</span>
              <button className="edit-btn" onClick={() => setUpdateUsernameModal(true)}>
                <EditIcon className="icon"/>
              </button>
            </div>
            <div className="password-row">
              <LockIcon className="field-icon"/>
              <span className="password">{currentUser.password}</span>
              <button className="edit-btn" onClick={() => setUpdatePasswordModal(true)}>
                <EditIcon className="icon"/>
              </button>
            </div>
          </div>
        </div>

        <div className="profile-fields">
          <div className="field-group">
            <div className="field">
              <PersonIcon className="field-icon"/>
              <input 
                type="text" 
                value={firstname}
                placeholder={currentUser.firstname} 
                onChange={(e) => setFirstname(e.target.value)}
              />
            </div>
            <div className="field">
              <PersonIcon className="field-icon"/>
              <input 
                type="text" 
                value={lastname}
                placeholder={currentUser.lastname} 
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="field">
              <PhoneIcon className="field-icon"/>
              <input 
                type="number" 
                value={phone}
                maxLength={10}
                onWheel={(e) => e.target.blur()}
                placeholder={currentUser.phone}
                onChange={handleInputPhone}
              />
            </div>
            <div className="field">
              <MailIcon className="field-icon"/>
              <input 
                type="email" 
                value={email}
                placeholder={currentUser.email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <PinIcon className="field-icon"/>
            <textarea 
              value={location}
              placeholder={currentUser.location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="profile-actions">
          <button className="update-btn" onClick={updateProfile}>Обновить</button>
          <button className="logout-btn" onClick={logout}>Выйти</button>
        </div>
      </div>

      {emptyInputModal && (
        <div className="modal">
          <div className="overlay" onClick={() => setEmptyInputModal(false)}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Пустые поля</h1>
            <p>Пожалуйста, заполните все поля для обновления.</p>
            <div className="buttons">
              <button className="ok-btn" onClick={() => setEmptyInputModal(false)}>ОК</button>
            </div>
          </div>
        </div>
      )}

      {updateSuccessModal && (
        <div className="modal">
          <div className="overlay" onClick={() => setUpdateSuccessModal(false)}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Успешно</h1>
            <p>Профиль обновлен</p>
            <div className="buttons">
              <button className="ok-btn" onClick={() => setUpdateSuccessModal(false)}>ОК</button>
            </div>
          </div>
        </div>
      )}

      {updateUsernameModal && (
        <div className="update-modal">
          <div className="overlay" onClick={closeUpdateModal}></div>
          <div className="modal-content">
            <UserIcon className="modal-icon"/>
            <form>
              <div className="field">
                <PersonIcon className="field-icon"/>
                <input 
                  type="text" 
                  id="new-username" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder={currentUser.username}
                />
              </div>
              <div className="field">
                <LockIcon className="field-icon"/>
                <input 
                  type="password" 
                  id="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Текущий пароль"
                />
              </div>
            </form>
            <button className="modal-update-btn" onClick={updateUsername}>Обновить</button>
          </div>
        </div>
      )}

      {updatePasswordModal && (
        <div className="update-modal">
          <div className="overlay" onClick={closeUpdateModal}></div>
          <div className="modal-content">
            <UserIcon className="modal-icon"/>
            <form>
              <div className="field">
                <LockIcon className="field-icon"/>
                <input 
                  type="password" 
                  id="current-password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Текущий пароль"
                />
              </div>
              <div className="field">
                <LockIcon className="field-icon"/>
                <input 
                  type="password" 
                  id="new-password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Новый пароль"
                />
              </div>
              <div className="field">
                <LockIcon className="field-icon"/>
                <input 
                  type="password" 
                  id="confirm-password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Подтвердите пароль"
                />
              </div>
            </form>
            <button className="modal-update-btn" onClick={updatePassword}>Обновить</button>
          </div>
        </div>
      )}      
    </div>
  )
}

export default AccountDetails