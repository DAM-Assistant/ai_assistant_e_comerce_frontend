import React, { useEffect, useRef } from "react"
import HomeMainTitle from "./components/HomeMainTitle/HomeMainTitle"
import GlassBoxes from "./components/GlassBoxes/GlassBoxes"
import { BannerSwiper } from "./components/BannerSwiper/BannerSwiper"
import HomeMainIcons from "./components/HomeMainIcons/HomeMainIcons"
import Selections from "./components/Selections/Selections"
import chatbot_img from "../../Resources/friendly-chatbot.jpg"

const Home = () => {
  const titleRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    titleRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="home">
      <style jsx>{`
        .home {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
          padding-top: 100px;
        }

        /* Анимированный фон */
        .home::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 0, 110, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 245, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(131, 56, 236, 0.1) 0%, transparent 50%);
          animation: backgroundPulse 20s ease-in-out infinite;
          z-index: -1;
        }

        @keyframes backgroundPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(120deg); }
          66% { transform: scale(0.9) rotate(240deg); }
        }

        /* Плавающие частицы */
        .particles {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 190, 11, 0.8);
          border-radius: 50%;
          animation: float-up 15s linear infinite;
        }

        @keyframes float-up {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(100px);
            opacity: 0;
          }
        }

        /* Разделители */
        .divider {
          width: 80%;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 190, 11, 0.5) 20%, 
            rgba(255, 0, 110, 0.5) 50%, 
            rgba(0, 245, 255, 0.5) 80%, 
            transparent
          );
          margin: 40px 0;
          position: relative;
          overflow: hidden;
        }

        .divider::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            transparent, 
            rgba(255, 255, 255, 0.8), 
            transparent
          );
          animation: divider-shine 3s linear infinite;
        }

        @keyframes divider-shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Заголовки секций */
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: calc(20px + 3vw);
          gap: 2vw;
          padding: 40px 20px;
          position: relative;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s ease-out;
        }

        .title.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .title_white {
          color: white;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.5),
            0 0 20px rgba(255, 255, 255, 0.3),
            0 0 30px rgba(255, 255, 255, 0.1);
          animation: glow-white 2s ease-in-out infinite alternate;
        }

        @keyframes glow-white {
          from {
            text-shadow: 
              0 0 10px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(255, 255, 255, 0.3),
              0 0 30px rgba(255, 255, 255, 0.1);
          }
          to {
            text-shadow: 
              0 0 20px rgba(255, 255, 255, 0.8),
              0 0 30px rgba(255, 255, 255, 0.6),
              0 0 40px rgba(255, 255, 255, 0.3);
          }
        }

        .title_orange {
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: linear-gradient(45deg, 
            #ff6b00, 
            #ff006e, 
            #ffbe0b, 
            #ff6b00
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-move 3s ease infinite;
          filter: drop-shadow(0 0 20px rgba(255, 107, 0, 0.6));
        }

        @keyframes gradient-move {
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

        /* Декоративные элементы для заголовков */
        .title::before,
        .title::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 190, 11, 0.8));
          transform: translateY(-50%);
        }

        .title::before {
          left: -120px;
          background: linear-gradient(90deg, transparent, rgba(255, 190, 11, 0.8));
        }

        .title::after {
          right: -120px;
          background: linear-gradient(90deg, rgba(255, 190, 11, 0.8), transparent);
        }

        /* Изображение чат-бота */
        .chatbot-wrapper {
          position: relative;
          padding: 20px;
          margin: 40px 0;
          opacity: 0;
          transform: translateY(50px) scale(0.9);
          transition: all 1s ease-out;
        }

        .chatbot-wrapper.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .chatbot-img {
          width: min(90vw, 500px);
          border-radius: 20px;
          border: 3px solid transparent;
          background: linear-gradient(#0a0a0a, #0a0a0a) padding-box,
                      linear-gradient(45deg, #ff006e, #ffbe0b, #00f5ff) border-box;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 
            0 0 50px rgba(255, 107, 0, 0.3),
            0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .chatbot-img:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 0 80px rgba(255, 107, 0, 0.5),
            0 20px 60px rgba(0, 0, 0, 0.7);
        }

        /* Светящиеся точки вокруг изображения */
        .glow-dots {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
        }

        .glow-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #ffbe0b;
          border-radius: 50%;
          box-shadow: 0 0 10px #ffbe0b;
          animation: orbit 10s linear infinite;
        }

        .glow-dot:nth-child(1) {
          top: 0;
          left: 50%;
          animation-delay: 0s;
        }

        .glow-dot:nth-child(2) {
          top: 50%;
          right: 0;
          animation-delay: 2.5s;
        }

        .glow-dot:nth-child(3) {
          bottom: 0;
          left: 50%;
          animation-delay: 5s;
        }

        .glow-dot:nth-child(4) {
          top: 50%;
          left: 0;
          animation-delay: 7.5s;
        }

        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }

        /* Компоненты с эффектами появления */
        :global(.home > *:not(.divider):not(.title):not(.chatbot-wrapper)) {
          position: relative;
          z-index: 1;
        }

        /* Мобильная адаптация */
        @media (max-width: 768px) {
          .title {
            font-size: calc(16px + 4vw);
            padding: 30px 15px;
          }

          .title::before,
          .title::after {
            display: none;
          }

          .divider {
            width: 90%;
            margin: 30px 0;
          }

          .chatbot-img {
            width: min(95vw, 400px);
          }
        }
      `}</style>

      {/* Плавающие частицы */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      <HomeMainTitle/>
      <div className="divider"></div>

      <BannerSwiper/>
      <div className="divider"></div>
      
      <div className="title" ref={el => titleRefs.current[0] = el}>
        <h1 className="title_white">КАЧЕСТВЕННЫЕ</h1>
        <h1 className="title_orange">СЕРВИСЫ</h1>
      </div>
      <GlassBoxes/>
      <div className="divider"></div>

      <HomeMainIcons/>
      <div className="divider"></div>

      <div className="title" ref={el => titleRefs.current[1] = el}>
        <h1 className="title_white">РАЗНООБРАЗИЕ</h1>
        <h1 className="title_orange">ВЫБОРА</h1>
      </div>
      <Selections/>
      <div className="divider"></div>
      
      <div className="title" ref={el => titleRefs.current[2] = el}>
        <h1 className="title_white">ДРУЖЕЛЮБНЫЙ</h1>
        <h1 className="title_orange">ЧАТ-БОТ</h1>
      </div>
      <div className="chatbot-wrapper" ref={el => titleRefs.current[3] = el}>
        <img className="chatbot-img" src={chatbot_img} alt="Изображение чат-бота"/>
        <div className="glow-dots">
          <div className="glow-dot"></div>
          <div className="glow-dot"></div>
          <div className="glow-dot"></div>
          <div className="glow-dot"></div>
        </div>
      </div>
      
    </main>
  )
}

export default Home