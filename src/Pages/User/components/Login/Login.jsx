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

  const { api_path, getAccessToken, setOnSignupPage, setCurrentUser, setAuthenticated, 
    categoryMenuStatus, changeCategoryMenuStatus, getOrderHistory, getUsedCoupons } = useContext(PreduContext)

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
    setIsLoading(true);
    
    const newLogin = {
      username: username,
      password: password
    };
    
    const login_api_path = api_path + "/api/auth/login";
    const profile_api_path = api_path + "/api/auth/me";

    console.log("Отправка запроса авторизации на:", login_api_path);
    
    try {
      const login_response = await axios.post(login_api_path, newLogin);
      console.log("Ответ авторизации:", login_response);

      // Проверяем наличие ответа и доступа к данным
      if (login_response && login_response.status === 200) {
        // Проверяем наличие токена в ответе
        if (login_response.data && login_response.data.access_token) {
          // Сохраняем токен
          const token = login_response.data.access_token;
          Cookies.set('access_token', token);
          console.log("Токен сохранен в cookie");
          
          try {
            // Получаем профиль пользователя
            console.log("Запрос профиля пользователя:", profile_api_path);
            const accessToken = getAccessToken();
            console.log("Используем токен для запроса профиля:", accessToken ? "Токен получен" : "Токен не найден");
            
            const me_response = await axios.get(profile_api_path, {
              headers: {"Authorization": `Bearer ${accessToken}`}
            });
            
            console.log("Ответ профиля:", me_response);
            
            if (me_response && me_response.data) {
              const user = me_response.data;
              // Маскируем пароль для безопасности
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
                  // Можно продолжить даже при ошибке получения истории
                }
                
                navigate('/Home');
              }
            } else {
              console.error("Ответ профиля не содержит данных");
              window.alert("Ошибка получения профиля пользователя");
            }
          } catch (profileError) {
            console.error("Ошибка получения профиля:", profileError);
            
            // Показываем пользователю сообщение об ошибке
            if (profileError.response && profileError.response.data && profileError.response.data.detail) {
              window.alert(profileError.response.data.detail);
            } else {
              window.alert("Ошибка получения профиля пользователя");
            }
            
            // Несмотря на ошибку, считаем пользователя авторизованным
            setAuthenticated(true);
            navigate('/Home');
          }
        } else {
          console.error("Ответ не содержит токен доступа:", login_response.data);
          window.alert("Сервер вернул неверный формат ответа");
        }
      } else {
        console.error("Неожиданный ответ:", login_response);
        window.alert("Ошибка авторизации");
      }
    } catch (loginError) {
      console.error("Ошибка авторизации:", loginError);
      
      // Показываем пользователю понятное сообщение об ошибке
      if (loginError.response && loginError.response.data && loginError.response.data.detail) {
        window.alert(loginError.response.data.detail);
      } else if (loginError.message === "Network Error") {
        window.alert("Ошибка соединения с сервером. Проверьте подключение к интернету.");
      } else {
        window.alert("Ошибка авторизации. Проверьте имя пользователя и пароль.");
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
                  <input type="text" name="signin_username" id="signin_username" 
                    onChange={(e)=>setUsername(e.target.value)} value={username}/>
                </td>
              </tr>

              <tr>
                <th rowSpan="2"><LockIcon className="icon"/></th>
                <td><label htmlFor="signin_password">Пароль</label></td>
              </tr>
              <tr>
                <td>
                  <input type="password" name="signin_password" id="signin_password" 
                    onChange={(e)=>setPassword(e.target.value)} value={password}/>
                </td>
              </tr>
            </tbody>
          </table>

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