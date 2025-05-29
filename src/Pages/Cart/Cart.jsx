import React, { useContext, useState, useEffect } from "react";
import { PreduContext } from "../../PreduContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css"; // Импорт стилей

const Cart = () => {
  const { cart, shop, updateCart, updateNumCartItems, applyCouponCode, removeAppliedCoupon, coupon, costTotal, costFinal, getOrderHistory, getUsedCoupons } = useContext(PreduContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [couponInput, setCouponInput] = useState("");

  useEffect(() => {
    // При изменении корзины в контексте, обновляем состояние компонента
    const items = Object.keys(cart)
      .filter(itemId => cart[itemId] > 0)
      .map(itemId => {
        const product = shop.find(p => p.id === parseInt(itemId));
        if (product) {
          return {
            ...product,
            quantity: cart[itemId],
            total: product.cost_per_unit * cart[itemId]
          };
        }
        return null;
      })
      .filter(item => item !== null);
    setCartItems(items);
  }, [cart, shop]);

  const updateQuantity = (itemId, change) => {
    const newCart = { ...cart };
    newCart[itemId] = Math.max(1, newCart[itemId] + change);
    updateCart(newCart);
    updateNumCartItems(Object.values(newCart).reduce((sum, quantity) => sum + quantity, 0));
  };

  const removeItem = (itemId) => {
    if (window.confirm('Удалить товар из корзины?')) {
      const newCart = { ...cart };
      delete newCart[itemId];
      updateCart(newCart);
      updateNumCartItems(Object.values(newCart).reduce((sum, quantity) => sum + quantity, 0));
    }
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) {
      alert('Введите код купона');
      return;
    }
    // Логика применения купона будет реализована в PreduContext
    await applyCouponCode(couponInput);
    setCouponInput("");
  };

  const removeCoupon = async () => {
    // Логика удаления купона будет реализована в PreduContext
    await removeAppliedCoupon();
  };

  const checkout = async () => {
    if (cartItems.length === 0) {
      alert('Ваша корзина пуста!');
      return;
    }
    // Логика оформления заказа будет реализована в PreduContext и роутере
    // console.log("Симуляция: Добавление карты Visa для оплаты.");
    navigate('/Order'); // Предполагаем, что есть роут для оформления заказа
  };

  // Анимация при загрузке (адаптирована под React)
  useEffect(() => {
    const items = document.querySelectorAll('.cart-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);
    });
  }, [cartItems]); // Запускаем анимацию при изменении cartItems


  return (
    <main className="cart">
      {/* Header assumed to be a separate component */}
      <div className="container">
        <div className="main-content">
          <div className="cart-section">
            <div className="cart-header">
              <div className="cart-title">Ваша корзина</div>
            </div>
            <div className="cart-items" id="cart-items">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-image">
                        {item.category?.name === "entertainment" ? "🎵" : item.category?.name === "education" ? "📚" : "💼"}
                      </div>
                      <div className="item-details">
                        <div className="item-brand">{item.brand?.name}</div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">{item.description}</div>
                      </div>
                      <div className="item-price">{item.cost_per_unit?.toLocaleString()} ₸</div>
                      <div className="quantity-controls">
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>−</button>
                        <span className="quantity">{item.quantity}</span>
                        <button className="quantity-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      </div>
                      <div className="item-total">{(item.cost_per_unit * item.quantity)?.toLocaleString()} ₸</div>
                      <button className="remove-btn" onClick={() => removeItem(item.id)}>✕</button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <div className="empty-cart-text">Ваша корзина пуста</div>
                    <div className="empty-cart-subtext">Добавьте товары, чтобы продолжить покупки</div>
                    <button className="continue-shopping" onClick={() => navigate('/')}>Продолжить покупки</button>
                </div>
              )}
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-section">
              <div className="section-title">Купон</div>
              <div className="coupon-form">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    className="coupon-input"
                    placeholder="Ваш купон"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <button className="apply-btn" onClick={applyCoupon} disabled={!couponInput.trim()}>→</button>
                </div>
                <button className="delete-btn" onClick={removeCoupon} disabled={!coupon}>Удалить</button>
              </div>
              <div className="coupon-info">
                  <div className="coupon-info-row">
                      <span className="coupon-label">Купон:</span>
                      <span className="coupon-value" id="coupon-discount">{coupon ? `${coupon.applied_value?.toLocaleString()} ₸` : '0 ₸'}</span>
                  </div>
                  <div className="coupon-info-row">
                      <span className="coupon-label">Мин. сумма:</span>
                      <span className="coupon-value">{coupon ? `${coupon.min_order_required?.toLocaleString()} ₸` : '0 ₸'}</span>
                  </div>
                  <div className="coupon-info-row">
                      <span className="coupon-label">Макс. скидка:</span>
                      <span className="coupon-value">{coupon ? `${coupon.max_discount_applicable?.toLocaleString()} ₸` : '0 ₸'}</span>
                  </div>
                  <div className="coupon-info-row">
                      <span className="coupon-label">Статус:</span>
                      <span className="coupon-value" id="coupon-status">{coupon ? `Применен (${coupon.code})` : 'Купон не применен'}</span>
                  </div>
              </div>
            </div>

            <div className="sidebar-section">
              <div className="section-title">Итого к оплате</div>
              <div className="summary-row">
                <span className="summary-label">Корзина:</span>
                <span className="summary-value" id="cart-subtotal">{costTotal?.toLocaleString()} ₸</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Купон:</span>
                <span className="summary-value" id="coupon-amount">{coupon ? `${coupon.applied_value?.toLocaleString()} ₸` : '0 ₸'}</span>
              </div>
              <div className="summary-total">
                <span className="total-label">Итого:</span>
                <span className="total-value" id="final-total">{costFinal?.toLocaleString()} ₸</span>
              </div>
              <button className="checkout-btn" onClick={checkout} disabled={cartItems.length === 0}>🛒 перейти оплатить</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;