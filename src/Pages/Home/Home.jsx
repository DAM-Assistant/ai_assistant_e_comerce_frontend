import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BannerSwiper } from "./components/BannerSwiper/BannerSwiper";
import ShopProduct from "../Shop/components/ShopProduct/ShopProduct";
import chatbot_img from "../../Resources/friendly-chatbot.jpg";
import './_home.scss';

const Home = () => {
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

    document.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el));
    document.querySelectorAll('.title').forEach((el) => observer.observe(el));
    document.querySelectorAll('.chatbot-wrapper').forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const dummyProducts = [
      { id: 1, name: 'Пример Товара 1', price: '1000 ₽', description: 'Краткое описание товара 1.', imageUrl: 'https://via.placeholder.com/300x200' },
      { id: 2, name: 'Пример Товара 2', price: '1500 ₽', description: 'Краткое описание товара 2.', imageUrl: 'https://via.placeholder.com/300x200' },
      { id: 3, name: 'Пример Товара 3', price: '2000 ₽', description: 'Краткое описание товара 3.', imageUrl: 'https://via.placeholder.com/300x200' },
      { id: 4, name: 'Пример Товара 4', price: '2500 ₽', description: 'Краткое описание товара 4.', imageUrl: 'https://via.placeholder.com/300x200' },
  ];

  return (
    <div className="home">
      <section className="hero-section animate-on-scroll">
        <h1 className="hero-title">Добро пожаловать в Наш Магазин</h1>
        <p className="hero-subtitle">
          Откройте для себя удивительные товары по лучшим ценам и качеству
        </p>
        <div className="hero-buttons">
          <Link to="/shop" className="btn btn-primary">
            Перейти в Магазин
          </Link>
          <Link to="/help" className="btn btn-outline">
            Узнать Больше
          </Link>
        </div>
      </section>

      <section className="features-section animate-on-scroll">
        {/* <h2 className="section-title">Наши Преимущества</h2> */}
        <div className="feature-card animate-on-scroll">
          <div className="feature-icon">⚡</div>
          <h3 className="feature-title">Мгновенный Доступ</h3>
          <p className="feature-description">
            Получите ваши премиум аккаунты и подписки сразу после покупки. Без задержек!
          </p>
        </div>
        <div className="feature-card animate-on-scroll">
          <div className="feature-icon">🌟</div>
          <h3 className="feature-title">Широкий Выбор</h3>
          <p className="feature-description">
            Найдите аккаунты и подписки для всех популярных сервисов: от стриминга до образования.
          </p>
        </div>
        <div className="feature-card animate-on-scroll">
          <div className="feature-icon">🔒</div>
          <h3 className="feature-title">Безопасные Транзакции</h3>
          <p className="feature-description">
            Мы используем надежные системы оплаты для защиты ваших данных и средств.
          </p>
        </div>
      </section>
      <div className="divider"></div>

      <section className="banner-section animate-on-scroll">
        <BannerSwiper/>
      </section>
      <div className="divider"></div>

      <section className="variety-section animate-on-scroll">
        <h2 className="section-title">Широкий Ассортимент</h2>
        <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#b3c5d1', borderRadius: '12px', border: '1px solid rgba(100, 255, 218, 0.2)', width: '100%', maxWidth: '1200px' }}>
          Placeholder для Ассортимента (можно заменить на реальные иконки/ссылки категорий)
        </div>
      </section>
      <div className="divider"></div>

      <section className="products-section animate-on-scroll">
        <h2 className="section-title">Избранные Товары</h2>
        <div className="products-grid">
          {dummyProducts.map(product => (
            <ShopProduct key={product.id} product={product} />
          ))}
        </div>
      </section>
      <div className="divider"></div>

      <section className="chatbot-section animate-on-scroll">
        <h2 className="section-title">Наш Дружелюбный Чат-Бот</h2>
        <div className="chatbot-wrapper">
          <img className="chatbot-img" src={chatbot_img} alt="Изображение чат-бота"/>
        </div>
      </section>
    </div>
  );
};

export default Home;