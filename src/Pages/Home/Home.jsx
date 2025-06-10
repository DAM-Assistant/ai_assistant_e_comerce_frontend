import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BannerSwiper } from "./components/BannerSwiper/BannerSwiper";
import ShopProduct from "../Shop/components/ShopProduct/ShopProduct";
import chatbot_img from "../../Resources/friendly-chatbot.jpg";
import './_home.scss';
import { PreduContext } from '../../PreduContext';
import { ReactComponent as SupportAgentIcon } from '../../Resources/Icons/support_agent.svg';
import { ReactComponent as ShoppingCartIcon } from '../../Resources/Icons/shopping_cart.svg';
import { ReactComponent as LockFillIcon } from '../../Resources/Icons/lock_fill.svg';

const Home = () => {
  const { categories, shop } = useContext(PreduContext);

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
          <div className="feature-icon"><SupportAgentIcon /></div>
          <h3 className="feature-title">Мгновенный Доступ</h3>
          <p className="feature-description">
            Получите ваши премиум аккаунты и подписки сразу после покупки. Без задержек!
          </p>
        </div>
        <div className="feature-card animate-on-scroll">
          <div className="feature-icon"><ShoppingCartIcon /></div>
          <h3 className="feature-title">Широкий Выбор</h3>
          <p className="feature-description">
            Найдите аккаунты и подписки для всех популярных сервисов: от стриминга до образования.
          </p>
        </div>
        <div className="feature-card animate-on-scroll">
          <div className="feature-icon"><LockFillIcon /></div>
          <h3 className="feature-title">Безопасные Транзакции</h3>
          <p className="feature-description">
            Мы используем надежные системы оплаты для защиты ваших данных и средств.
          </p>
        </div>
      </section>

      <section className="banner-section animate-on-scroll">
        <BannerSwiper/>
      </section>

      <section className="variety-section animate-on-scroll">
        <h2 className="section-title">Широкий Ассортимент</h2>
        <div className="categories-grid">
          {categories && categories.length > 0 ? (
            categories.map((cat, idx) => (
              <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-card" key={cat.id}>
                <div className="category-icon">{String.fromCodePoint(0x1F4E6 + (idx % 10))}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-desc">{cat.description || 'Категория товаров'}</div>
              </Link>
            ))
          ) : (
            <div style={{ color: '#b3c5d1', textAlign: 'center', width: '100%' }}>Категории не найдены</div>
          )}
        </div>
      </section>

      <section className="products-section animate-on-scroll">
        <h2 className="section-title">Избранные Товары</h2>
        <div className="products-grid">
          {shop && shop.length > 0 ? (
            shop.slice(0, 4).map(product => (
              <ShopProduct key={product.id} data={product} />
            ))
          ) : (
            <div style={{ color: '#b3c5d1', textAlign: 'center', width: '100%' }}>Нет товаров для отображения</div>
          )}
        </div>
      </section>

      <section className="chatbot-section animate-on-scroll">
        <h2 className="section-title">Наш Дружелюбный Чат-Бот</h2>
        <div className="chatbot-description compact">
          <div className="chatbot-features">
            <div className="feature-item"><SupportAgentIcon className="svg-icon" /> Мультиязычный: RU, EN, KZ</div>
            <div className="feature-item"><LockFillIcon className="svg-icon" /> Персональные рекомендации</div>
            <div className="feature-item"><ShoppingCartIcon className="svg-icon" /> Помощь с подписками и купонами</div>
            <div className="feature-item"><svg className="svg-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#64ffda" strokeWidth="2"/><path d="M8 12l2 2 4-4" stroke="#64ffda" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Мгновенные ответы 24/7</div>
          </div>
          <div className="chatbot-wrapper">
            <img className="chatbot-img" src={chatbot_img} alt="Изображение чат-бота"/>
          </div>
          <div className="chatbot-bubbles">
            <span className="bubble">Какие подписки Netflix доступны?</span>
            <span className="bubble">Какой купон лучше для заказа?</span>
            <span className="bubble">Сравни тарифы Spotify</span>
            <span className="bubble">Какие скидки сейчас действуют?</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;