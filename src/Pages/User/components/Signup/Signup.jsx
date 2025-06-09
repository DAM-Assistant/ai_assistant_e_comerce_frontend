import React, { useContext, useState } from "react"
import { PreduContext } from "../../../../PreduContext"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import './Signup.scss';

const Signup = () => {
  const { setOnSignupPage, api_path, getAccessToken, setCurrentUser, setAuthenticated } = useContext(PreduContext)
  const navigate = useNavigate()

  const [ formData, setFormData ] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirm_password: "",
    phone: "",
    email: "",
    location: ""
  })

  const [ errors, setErrors ] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    confirm_password: "",
    phone: "",
    email: "",
    location: "",
    general: ""
  })

  const [ touched, setTouched ] = useState({
    firstname: false,
    lastname: false,
    username: false,
    password: false,
    confirm_password: false,
    phone: false,
    email: false,
    location: false
  })

  const [ isLoading, setIsLoading ] = useState(false)

  const validateField = (name, value) => {
    switch (name) {
      case 'firstname':
        return value.trim() === '' ? 'Имя обязательно' : ''
      case 'lastname':
        return value.trim() === '' ? 'Фамилия обязательна' : ''
      case 'username':
        return value.trim() === '' ? 'Имя пользователя обязательно' : ''
      case 'password':
        if (value.trim() === '') return 'Пароль обязателен'
        if (value.length < 6) return 'Пароль должен быть не менее 6 символов'
        return ''
      case 'confirm_password':
        if (value.trim() === '') return 'Подтверждение пароля обязательно'
        if (value !== formData.password) return 'Пароли не совпадают'
        return ''
      case 'phone':
        if (value.trim() === '') return 'Телефон обязателен'
        if (!/^\+?[0-9]{10,15}$/.test(value)) return 'Некорректный формат телефона'
        return ''
      case 'email':
        if (value.trim() === '') return 'Email обязателен'
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Некорректный формат email'
        return ''
      case 'location':
        return value.trim() === '' ? 'Адрес обязателен' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  function toHome() {
    window.scrollTo(0, 0);
    navigate('/Home')
  }

  function toSignin() {
    setOnSignupPage(false)
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key])
      newErrors[key] = error
      if (error) isValid = false
    })

    setErrors(prev => ({ ...prev, ...newErrors }))
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    
    return isValid
  }

  async function signup() {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors(prev => ({ ...prev, general: '' }))

    const signup_api = api_path + "/api/users/"
    const login_api = api_path + "/api/auth/login"
    const user_api = api_path + "/api/auth/me"

    try {
      const signup_response = await axios.post(signup_api, formData)
      
      if (signup_response.status === 200) {
        const new_login = {
          username: formData.username,
          password: formData.password
        }
        
        try {
          const login_response = await axios.post(login_api, new_login)
          Cookies.set('access_token', login_response.data.access_token)
          
          const accessToken = getAccessToken()
          if (accessToken) {
            const me_response = await axios.get(user_api, {
              headers: {"Authorization": `Bearer ${accessToken}`}
            })
            
            const user = me_response.data
            const masked_password = formData.password.length > 2 
              ? formData.password.slice(0, -2).replace(/./g, "*") + formData.password.slice(-2) 
              : "****"
            user.password = masked_password
            setCurrentUser(user)
            window.scrollTo(0, 0)
            setAuthenticated(true)
            navigate('/Home')
          }
        } catch (loginError) {
          if (loginError.response?.data?.detail) {
            setErrors(prev => ({ ...prev, general: loginError.response.data.detail }))
          } else {
            setErrors(prev => ({ ...prev, general: "Ошибка при входе после регистрации" }))
          }
        }
      }
    } catch (signupError) {
      if (signupError.response?.data?.detail) {
        setErrors(prev => ({ ...prev, general: signupError.response.data.detail }))
      } else if (signupError.message === "Network Error") {
        setErrors(prev => ({ ...prev, general: "Ошибка соединения с сервером. Проверьте подключение к интернету." }))
      } else {
        setErrors(prev => ({ ...prev, general: "Ошибка при регистрации" }))
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <main className="signup">
      <div className="container">
        <h1 onClick={toHome}>DAM</h1>

        <form className="signup_form">
          <table className="name">
            <tbody>
              <tr>
                <td colSpan={2}>
                  <div className="separator">
                    <h2>ДАННЫЕ АККАУНТА</h2>
                    <div className="line"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <th><label htmlFor="signup_firstname">Имя:</label></th>
                <th><label htmlFor="signup_lastname">Фамилия:</label></th>
              </tr>
              <tr>
                <td>
                  <input 
                    type="text" 
                    name="firstname" 
                    id="signup_firstname" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.firstname}
                    className={touched.firstname && errors.firstname ? 'error' : ''}
                  />
                  {touched.firstname && errors.firstname && (
                    <div className="error-message">{errors.firstname}</div>
                  )}
                </td>
                <td>
                  <input 
                    type="text" 
                    name="lastname" 
                    id="signup_lastname"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.lastname}
                    className={touched.lastname && errors.lastname ? 'error' : ''}
                  />
                  {touched.lastname && errors.lastname && (
                    <div className="error-message">{errors.lastname}</div>
                  )}
                </td>
              </tr>
              <tr>
                <th><label htmlFor="signup_username">Имя пользователя</label></th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <input 
                    type="text" 
                    name="username" 
                    id="signup_username" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.username}
                    className={touched.username && errors.username ? 'error' : ''}
                  />
                  {touched.username && errors.username && (
                    <div className="error-message">{errors.username}</div>
                  )}
                </td>
              </tr>
              <tr>
                <th><label htmlFor="signup_password">Пароль</label></th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <input 
                    type="password" 
                    name="password" 
                    id="signup_password" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.password}
                    className={touched.password && errors.password ? 'error' : ''}
                  />
                  {touched.password && errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </td>
              </tr>
              <tr>
                <th colSpan={2}><label htmlFor="signup_confirm_password">Подтвердите пароль</label></th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <input 
                    type="password" 
                    name="confirm_password" 
                    id="signup_confirm_password" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.confirm_password}
                    className={touched.confirm_password && errors.confirm_password ? 'error' : ''}
                  />
                  {touched.confirm_password && errors.confirm_password && (
                    <div className="error-message">{errors.confirm_password}</div>
                  )}
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <div className="separator">
                    <h2>КОНТАКТНАЯ ИНФОРМАЦИЯ</h2>
                    <div className="line"></div>
                  </div>
                </td>
              </tr>
              <tr>
                <th><label htmlFor="signup_phone">Телефон</label></th>
                <th><label htmlFor="signup_email">Email</label></th>
              </tr>
              <tr>
                <td>
                  <input 
                    type="tel" 
                    name="phone" 
                    id="signup_phone" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.phone}
                    className={touched.phone && errors.phone ? 'error' : ''}
                  />
                  {touched.phone && errors.phone && (
                    <div className="error-message">{errors.phone}</div>
                  )}
                </td>
                <td>
                  <input 
                    type="email" 
                    name="email" 
                    id="signup_email" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.email}
                    className={touched.email && errors.email ? 'error' : ''}
                  />
                  {touched.email && errors.email && (
                    <div className="error-message">{errors.email}</div>
                  )}
                </td>
              </tr>
              <tr>
                <th><label htmlFor="signup_location">Адрес</label></th>
              </tr>
              <tr>
                <td colSpan={2}>
                  <textarea 
                    name="location" 
                    id="signup_location"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={formData.location}
                    className={touched.location && errors.location ? 'error' : ''}
                  />
                  {touched.location && errors.location && (
                    <div className="error-message">{errors.location}</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          
          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}
        </form>
        
        <div className="buttons">
          <button 
            className="signup-button" 
            onClick={signup}
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Регистрация"}
          </button>

          <div className="btn-divider">
            <div className="line-"></div>
            <h4>Или</h4>
            <div className="line-"></div>          
          </div>

          <button className="login-button" onClick={toSignin}>
            Вход
          </button>
        </div>
      </div>
    </main>
  )
}

export default Signup