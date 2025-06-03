import React from "react";
import { ReactComponent as FacebookIcon } from '../Resources/Icons/facebook.svg'
import { ReactComponent as InstagramIcon } from '../Resources/Icons/instagram.svg'
import { ReactComponent as TwitterIcon } from '../Resources/Icons/twitter.svg'

function Footer() {
  return (
    <footer className="footer">
      <div className="tech-pattern"></div>
      <div className="container">
        <div className="footer-content">
          <div className="brand-section">
            <div className="logo">DAM</div>
            <p className="description">
              Мы команда на переднем крае цифровой трансформации, объединяющая возможности искусственного интеллекта и силу маркетплейсов. Наша миссия - сделать бизнес умнее, продажи эффективнее, а клиентский опыт персонализированным и удобным.
            </p>
            <div className="author">— Айту, Разработчик</div>
          </div>
          
          <div className="contact-section">
            <h3>Контакты</h3>
            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              Астана
            </div>
            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              +7 (702) 31 05
            </div>
            <div className="contact-item">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              support@dam.kz
            </div>
          </div>
          
          <div className="follow-section">
            <h3>Следите за нами</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <FacebookIcon className="social-icon"/>
              </a>
              <a href="#" className="social-link">
                <InstagramIcon className="social-icon"/>
              </a>
              <a href="#" className="social-link">
                <TwitterIcon className="social-icon"/>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            © 2024 DAM. Все права защищены.
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">Политика конфиденциальности</a>
            <a href="#" className="footer-link">Условия использования</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;