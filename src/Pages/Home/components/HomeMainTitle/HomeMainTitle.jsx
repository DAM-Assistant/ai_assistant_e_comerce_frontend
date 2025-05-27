import React from "react"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HomeMainTitle = () => {
  const [hacktext, setHackText] = useState("АККАУНТЫ");
  const navigate = useNavigate()
  const letters = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ";
  const text1 = "СЕРВИСЫ";
  const text2 = "АККАУНТЫ";

  function mouseOverHack() {    
    let iterations = 0;
    const interval = setInterval(() => {
      setHackText(
        text2.split("").map((letter, index) => {
          if(index < iterations) {
            return text1[index];
          }
          return letters[Math.floor(Math.random()*33)]
        }).join("")
        );
      if (iterations >= text1.length) {
        clearInterval(interval);
      }
      iterations += 1/3;
    }, 30)
  }
  
  function mouseLeaveHack() {
    let iterations = 0;
    const interval = setInterval(() => {
      setHackText(
        text1.split("").map((letter, index) => {
          if(index < iterations) {
            return text2[index];
          }
          return letters[Math.floor(Math.random()*33)]
        }).join("")
        );
      if (iterations >= text1.length) {
        clearInterval(interval);
      }
      iterations += 1/3;
    }, 30)
  }

  function toShop() {
    window.scrollTo(0, 0)
    navigate('/Shop')
  }


  return (
    <div className="home-main-title">
      {/* Unlock Icon */}
      <div className="unlock-icon"></div>

      {/* Text Content */}
      <div className="text">
        <h1>РАЗБЛОКИРУЙТЕ <b>ПРЕМИУМ</b></h1>
        <h1 className="hack-text" onMouseOver={mouseOverHack} onMouseLeave={mouseLeaveHack}>{hacktext}</h1>
      </div>

      {/* Description */}
      <p className="unlock-description">
        Получите неограниченный доступ ко всем возможностям платформы и откройте новый уровень возможностей
      </p>

      {/* Features Section */}
      <div className="features">
        <div className="feature">
          <div className="feature-icon">⚡</div>
          <div className="feature-title">Мгновенный доступ</div>
          <div className="feature-text">Без ограничений по времени и количеству использований</div>
        </div>
        <div className="feature">
          <div className="feature-icon">🎯</div>
          <div className="feature-title">Эксклюзивные функции</div>
          <div className="feature-text">Доступ к расширенным возможностям и инструментам</div>
        </div>
        <div className="feature">
          <div className="feature-icon">🛡️</div>
          <div className="feature-title">Приоритетная поддержка</div>
          <div className="feature-text">Быстрая помощь от команды специалистов 24/7</div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="cta-buttons">
        <button className="btn-primary" onClick={toShop}>Разблокировать сейчас</button>
        <a href="#" className="btn-secondary">Узнать больше</a>
      </div>
    </div>
  )
}

export default HomeMainTitle