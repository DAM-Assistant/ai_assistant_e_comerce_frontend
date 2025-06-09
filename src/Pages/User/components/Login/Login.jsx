import React, { useContext, useState } from "react"
import { PreduContext } from "../../../../PreduContext"
import { ReactComponent as UserIcon } from "../../../../Resources/Icons/person_fill.svg"
import { ReactComponent as LockIcon } from "../../../../Resources/Icons/lock_fill.svg"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"

const Login = () => {
  const navigate = useNavigate()
  const [ username, setUsername ] = useState("")
  const [ password, setPassword ] = useState("")
  const [ isLoading, setIsLoading ] = useState(false)
  const [ errors, setErrors ] = useState({
    username: "",
    password: "",
    general: ""
  })
  const [ touched, setTouched ] = useState({
    username: false,
    password: false
  })

  const { api_path, getAccessToken, setOnSignupPage, setCurrentUser, setAuthenticated, 
    categoryMenuStatus, changeCategoryMenuStatus, getOrderHistory, getUsedCoupons } = useContext(PreduContext)

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return value.trim() === '' ? 'Имя пользователя обязательно' : ''
      case 'password':
        return value.trim() === '' ? 'Пароль обязателен' : ''
      default:
        return ''
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'username') setUsername(value)
    if (name === 'password') setPassword(value)
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  function toHome() {
    window.scrollTo(0, 0);
    if (categoryMenuStatus === true) {
      changeCategoryMenuStatus()
    }
    navigate('/Home')
  }

  function toSignup() {
    setOnSignupPage(true)
  }

  async function handleLogin(e) {
    e.preventDefault();
    
    // Валидация всех полей перед отправкой
    const usernameError = validateField('username', username)
    const passwordError = validateField('password', password)
    
    if (usernameError || passwordError) {
      setErrors({
        username: usernameError,
        password: passwordError,
        general: ''
      })
      setTouched({
        username: true,
        password: true
      })
      return
    }

    setIsLoading(true);
    setErrors(prev => ({ ...prev, general: '' }))
    
    const newLogin = {
      username: username,
      password: password
    };
    
    const login_api_path = api_path + "/api/auth/login";
    const profile_api_path = api_path + "/api/auth/me";
    
    try {
      const login_response = await axios.post(login_api_path, newLogin);

      if (login_response && login_response.status === 200) {
        if (login_response.data && login_response.data.access_token) {
          const token = login_response.data.access_token;
          Cookies.set('access_token', token);
          
          try {
            const accessToken = getAccessToken();
            const me_response = await axios.get(profile_api_path, {
              headers: {"Authorization": `Bearer ${accessToken}`}
            });
            
            if (me_response && me_response.data) {
              const user = me_response.data;
              const masked_password = password.length > 2 
                ? password.slice(0, -2).replace(/./g, "*") + password.slice(-2) 
                : "****";
              user.password = masked_password;
              setCurrentUser(user);
        
              if (user.role === "admin") {
                window.scrollTo(0, 0);
                setAuthenticated(true);
                navigate('/Admin');
              } else {
                setAuthenticated(true);
                
                try {
                  getOrderHistory();
                  getUsedCoupons();
                } catch (historyError) {
                  console.error("Ошибка при получении истории:", historyError);
                }
                
                navigate('/Home');
              }
            } else {
              setErrors(prev => ({ ...prev, general: "Ошибка получения профиля пользователя" }))
            }
          } catch (profileError) {
            console.error("Ошибка получения профиля:", profileError);
            
            if (profileError.response?.data?.detail) {
              setErrors(prev => ({ ...prev, general: profileError.response.data.detail }))
            } else {
              setErrors(prev => ({ ...prev, general: "Ошибка получения профиля пользователя" }))
            }
            
            setAuthenticated(true);
            navigate('/Home');
          }
        } else {
          setErrors(prev => ({ ...prev, general: "Сервер вернул неверный формат ответа" }))
        }
      } else {
        setErrors(prev => ({ ...prev, general: "Ошибка авторизации" }))
      }
    } catch (loginError) {
      console.error("Ошибка авторизации:", loginError);
      
      if (loginError.response?.data?.detail) {
        setErrors(prev => ({ ...prev, general: loginError.response.data.detail }))
      } else if (loginError.message === "Network Error") {
        setErrors(prev => ({ ...prev, general: "Ошибка соединения с сервером. Проверьте подключение к интернету." }))
      } else {
        setErrors(prev => ({ ...prev, general: "Ошибка авторизации. Проверьте имя пользователя и пароль." }))
      }
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <main className="login">
      <div className="container">
        <h1 onClick={toHome}>DAM</h1>
        <div className="signin_form">
          <table>
            <tbody>
              <tr>
                <th rowSpan="2"><UserIcon className="icon"/></th>
                <td><label htmlFor="signin_username">Имя пользователя</label></td>
              </tr>
              <tr>
                <td>
                  <input 
                    type="text" 
                    name="username" 
                    id="signin_username" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={username}
                    className={touched.username && errors.username ? 'error' : ''}
                  />
                  {touched.username && errors.username && (
                    <div className="error-message">{errors.username}</div>
                  )}
                </td>
              </tr>

              <tr>
                <th rowSpan="2"><LockIcon className="icon"/></th>
                <td><label htmlFor="signin_password">Пароль</label></td>
              </tr>
              <tr>
                <td>
                  <input 
                    type="password" 
                    name="password" 
                    id="signin_password" 
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={password}
                    className={touched.password && errors.password ? 'error' : ''}
                  />
                  {touched.password && errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}

          <button onClick={handleLogin} disabled={isLoading}>
            {isLoading ? "Выполняется вход..." : "Войти"}
          </button>

          <div className="to-signup-text">
            <p>Нет аккаунта?</p>
            <p>Зарегистрируйтесь <a onClick={toSignup}>здесь!</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Login