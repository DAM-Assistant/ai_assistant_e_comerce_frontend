import React, { useEffect, useState } from "react";

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="about-us">
      <style jsx>{`
        .about-us {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          overflow: hidden;
          padding: 20px;
        }

        /* Анимированный фон */
        .background-animation {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          animation: float 15s infinite ease-in-out;
        }

        .orb1 {
          width: 600px;
          height: 600px;
          background: linear-gradient(45deg, #ff006e, #8338ec);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .orb2 {
          width: 400px;
          height: 400px;
          background: linear-gradient(45deg, #00f5ff, #00ff88);
          bottom: -150px;
          right: -150px;
          animation-delay: 5s;
        }

        .orb3 {
          width: 500px;
          height: 500px;
          background: linear-gradient(45deg, #ffbe0b, #fb5607);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 10s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        /* Контент */
        .content-wrapper {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1200px;
          width: 100%;
        }

        .main-title {
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 900;
          margin-bottom: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          line-height: 0.9;
          position: relative;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          opacity: ${isVisible ? 1 : 0};
          transform: ${isVisible ? 'translateY(0)' : 'translateY(50px)'};
          transition: all 1s ease-out;
        }

        .gradient-text {
          background: linear-gradient(
            45deg,
            #ff006e,
            #ffbe0b,
            #00f5ff,
            #00ff88,
            #ff006e
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
          filter: drop-shadow(0 0 30px rgba(255, 0, 110, 0.5));
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .subtitle {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 300;
          margin-bottom: 3rem;
          color: #ffffff;
          opacity: 0.8;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          opacity: ${isVisible ? 0.8 : 0};
          transform: ${isVisible ? 'translateY(0)' : 'translateY(30px)'};
          transition: all 1s ease-out 0.3s;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 1rem 2rem;
          background: rgba(255, 190, 11, 0.1);
          border: 2px solid #ffbe0b;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffbe0b;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          position: relative;
          overflow: hidden;
          opacity: ${isVisible ? 1 : 0};
          transform: ${isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)'};
          transition: all 1s ease-out 0.6s;
        }

        .status-badge::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 190, 11, 0.4), transparent);
          transform: translateY(-50%);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        .pulse-dot {
          width: 12px;
          height: 12px;
          background: #ffbe0b;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Карточки с информацией */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 5rem;
          opacity: ${isVisible ? 1 : 0};
          transform: ${isVisible ? 'translateY(0)' : 'translateY(50px)'};
          transition: all 1s ease-out 0.9s;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #ff006e, #00f5ff);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 0, 110, 0.3);
          box-shadow: 0 20px 40px rgba(255, 0, 110, 0.2);
        }

        .info-card:hover::before {
          transform: scaleX(1);
        }

        .card-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #ff006e, #00f5ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.6;
        }

        /* Декоративные элементы */
        .decorative-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .line {
          position: absolute;
          background: linear-gradient(90deg, transparent, rgba(255, 190, 11, 0.3), transparent);
          animation: line-move 10s linear infinite;
        }

        .line1 {
          width: 1px;
          height: 100%;
          left: 10%;
          animation-delay: 0s;
        }

        .line2 {
          width: 1px;
          height: 100%;
          right: 10%;
          animation-delay: 5s;
        }

        .line3 {
          width: 100%;
          height: 1px;
          top: 20%;
          animation-delay: 2.5s;
        }

        @keyframes line-move {
          0% {
            opacity: 0;
            transform: translateY(-100%);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100%);
          }
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .main-title {
            font-size: 3rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 3rem;
          }

          .orb1, .orb2, .orb3 {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>

      {/* Анимированный фон */}
      <div className="background-animation">
        <div className="gradient-orb orb1"></div>
        <div className="gradient-orb orb2"></div>
        <div className="gradient-orb orb3"></div>
      </div>

      {/* Декоративные линии */}
      <div className="decorative-lines">
        <div className="line line1"></div>
        <div className="line line2"></div>
        <div className="line line3"></div>
      </div>

      {/* Основной контент */}
      <div className="content-wrapper">
        <h1 className="main-title">
          <span className="gradient-text">О НАС</span>
        </h1>
        
        <p className="subtitle">Создаем будущее сегодня</p>
        
        <div className="status-badge">
          <span className="pulse-dot"></span>
          <span>В активной разработке</span>
        </div>

        {/* Информационные карточки */}
        <div className="info-grid">
          <div className="info-card">
            <div className="card-icon">🚀</div>
            <h3 className="card-title">Инновации</h3>
            <p className="card-description">
              Мы работаем над революционными решениями, которые изменят ваше представление о возможном
            </p>
          </div>
          
          <div className="info-card">
            <div className="card-icon">💡</div>
            <h3 className="card-title">Технологии</h3>
            <p className="card-description">
              Используем самые передовые технологии для создания продуктов будущего
            </p>
          </div>
          
          <div className="info-card">
            <div className="card-icon">⚡</div>
            <h3 className="card-title">Скорость</h3>
            <p className="card-description">
              Наша команда работает на максимальной скорости, чтобы вы получили результат быстрее
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;