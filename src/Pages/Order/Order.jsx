import React, { useContext, useState, useEffect } from "react"
import { PreduContext } from "../../PreduContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Order.css"

const Order = () => {
  const navigate = useNavigate()
  const { api_path, getAccessToken, currentUser, shop, cart, costTotal, costFinal, coupon, couponValue, reset } = useContext(PreduContext)
  const [ orderSuccessModal, setOrderSuccessModal ] = useState(false)
  const [ newOrderId, setNewOrderId ] = useState(0)

  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Новое: состояния ошибок и touched
  const [errors, setErrors] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    general: ""
  })
  const [touched, setTouched] = useState({
    cardNumber: false,
    cardName: false,
    expiry: false,
    cvv: false
  })

  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    const items = Object.keys(cart)
      .filter(itemId => cart[itemId] > 0)
      .map(itemId => {
        const product = shop.find(p => p.id === parseInt(itemId))
        if (product) {
          return {
            ...product,
            quantity: cart[itemId],
            total: product.cost_per_unit * cart[itemId]
          }
        }
        return null
      })
      .filter(item => item !== null)
    setOrderItems(items)
  }, [cart, shop])

  const makeOrder = async() => {
    const order_api = api_path + "/api/orders/"
    const newOrder = {
      cart: cart,
      coupon_code: coupon.code
    }

    try {
      const response = await axios.post(order_api, newOrder, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
      if (response.status === 200) {
        setNewOrderId(response.data.order_id)
        setOrderSuccessModal(true)
      }
    } catch(e) {
      window.alert(e.response.data.detail)
    }
  }

  const closeModal = async() => {
    reset()
    setOrderSuccessModal(false)
    try {
      const order_api = api_path + "/api/orders/" + String(newOrderId)
      const order_response = await axios.get(order_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
      navigate('/OrderDetails', {
        state : {
          order: order_response.data
        }
      })
    }catch(e){
      window.alert(e.response.data.detail)
    }
  }

  // --- Форматирование и обработчики ввода ---

  // Форматирование номера карты (XXXX XXXX XXXX XXXX)
  const formatCardNumber = (value) => {
    const v = value.replace(/\s/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/.{1,4}/g);
    return matches ? matches.join(" ") : v;
  };

  // Форматирование даты (ММ/ГГ)
  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? "/" + v.substring(2, 4) : "");
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
    if (touched.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formattedValue) }))
    }
  };

  const handleCardNameChange = (e) => {
    const cleanedValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardName(cleanedValue);
    if (touched.cardName) {
      setErrors(prev => ({ ...prev, cardName: validateCardName(cleanedValue) }))
    }
  };

  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiry(e.target.value);
    setExpiry(formattedValue);
    if (touched.expiry) {
      setErrors(prev => ({ ...prev, expiry: validateExpiry(formattedValue) }))
    }
  };

  const handleCvvChange = (e) => {
    const cleanedValue = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    setCvv(cleanedValue);
    if (touched.cvv) {
      setErrors(prev => ({ ...prev, cvv: validateCvv(cleanedValue) }))
    }
  };

  // --- Blur обработчики для touched и ошибок ---
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }))
    switch (name) {
      case 'cardNumber':
        setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(cardNumber) }))
        break;
      case 'cardName':
        setErrors(prev => ({ ...prev, cardName: validateCardName(cardName) }))
        break;
      case 'expiry':
        setErrors(prev => ({ ...prev, expiry: validateExpiry(expiry) }))
        break;
      case 'cvv':
        setErrors(prev => ({ ...prev, cvv: validateCvv(cvv) }))
        break;
      default:
        break;
    }
  }

  // --- Валидация ---

  // Валидация номера карты (16 цифр)
  const validateCardNumber = (number) => {
    const cleanedNumber = number.replace(/\s/g, '');
    if (!/^[0-9]{16}$/.test(cleanedNumber)) {
      return "Номер карты должен содержать 16 цифр.";
    }
    return "";
  };

  // Валидация имени на карте (не пустое, только буквы и пробелы)
  const validateCardName = (name) => {
    if (name.trim() === "") {
      return "Пожалуйста, введите имя на карте.";
    }
    if (/[^a-zA-Z\s]/.test(name)) {
        return "Имя на карте должно содержать только буквы и пробелы.";
    }
    return "";
  };

  // Валидация даты истечения (формат ММ/ГГ и дата в будущем)
  const validateExpiry = (date) => {
    const parts = date.split('/');
    if (parts.length !== 2 || parts[1].length !== 2) { // Проверяем наличие слеша и 2 цифр после него
      return "Неверный формат даты (ММ/ГГ).";
    }
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return "Неверный месяц.";
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1; // Месяцы начинаются с 0

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return "Срок действия карты истек.";
    }

    return "";
  };

  // Валидация CVV (3 цифры)
  const validateCvv = (cvv) => {
    if (!/^[0-9]{3}$/.test(cvv)) {
      return "CVV должен содержать 3 цифры.";
    }
    return "";
  };

  const handlePayment = () => {
    const cardNumberError = validateCardNumber(cardNumber);
    const cardNameError = validateCardName(cardName);
    const expiryError = validateExpiry(expiry);
    const cvvError = validateCvv(cvv);

    setErrors({
      cardNumber: cardNumberError,
      cardName: cardNameError,
      expiry: expiryError,
      cvv: cvvError,
      general: ""
    })
    setTouched({
      cardNumber: true,
      cardName: true,
      expiry: true,
      cvv: true
    })

    if (cardNumberError || cardNameError || expiryError || cvvError) {
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      //makeOrder(); // Можно вызвать makeOrder здесь для реального создания заказа
      navigate("/User"); // Или перенаправить пользователя после успешной симуляции
    }, 2000);
  };

  return (
    <main className="order">
      <div className="container">
        <div className="main-content">
          <div className="payment-section">
            <div className="section-title">Данные карты</div>
            <div className="card-form">
              <input
                type="text"
                className={`form-input${touched.cardNumber && errors.cardNumber ? ' error' : ''}`}
                placeholder="Номер карты"
                maxLength="19"
                value={cardNumber}
                name="cardNumber"
                onChange={handleCardNumberChange}
                onBlur={handleBlur}
              />
              {touched.cardNumber && errors.cardNumber && (
                <div className="error-message">{errors.cardNumber}</div>
              )}
              <input
                type="text"
                className={`form-input${touched.cardName && errors.cardName ? ' error' : ''}`}
                placeholder="Имя на карте"
                value={cardName}
                name="cardName"
                onChange={handleCardNameChange}
                onBlur={handleBlur}
              />
              {touched.cardName && errors.cardName && (
                <div className="error-message">{errors.cardName}</div>
              )}
              <div className="expiry-cvv">
                <input
                  type="text"
                  className={`form-input${touched.expiry && errors.expiry ? ' error' : ''}`}
                  placeholder="ММ/ГГ"
                  maxLength="5"
                  value={expiry}
                  name="expiry"
                  onChange={handleExpiryChange}
                  onBlur={handleBlur}
                />
                <input
                  type="text"
                  className={`form-input${touched.cvv && errors.cvv ? ' error' : ''}`}
                  placeholder="CVV"
                  maxLength="3"
                  value={cvv}
                  name="cvv"
                  onChange={handleCvvChange}
                  onBlur={handleBlur}
                />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                {touched.expiry && errors.expiry && (
                  <div className="error-message" style={{ flex: 1 }}>{errors.expiry}</div>
                )}
                {touched.cvv && errors.cvv && (
                  <div className="error-message" style={{ flex: 1 }}>{errors.cvv}</div>
                )}
              </div>
              <button
                className={`pay-btn ${isProcessing ? 'processing' : ''}`}
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? 'Обрабатывается...' : 'Оплатить'}
              </button>
            </div>
          </div>

          <div className="sidebar">
            <div className="sidebar-section">
              <div className="section-title">Сводка заказа</div>
              <div className="order-summary">
                {orderItems.map(item => (
                  <div className="summary-item" key={item.id}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{(item.total)?.toLocaleString()} ₸</span>
                  </div>
                ))}
              </div>
              <div className="summary-row">
                <span>Корзина:</span>
                <span>{costTotal?.toLocaleString()} ₸</span>
              </div>
              <div className="summary-row">
                <span>Купон ({coupon.code}):</span>
                <span>-{couponValue?.toLocaleString()} ₸</span>
              </div>
              <div className="summary-total">
                <span>Итого к оплате:</span>
                <span>{costFinal?.toLocaleString()} ₸</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {orderSuccessModal && (
        <div className="modal">
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Заказ успешно создан</h1>
            <p>Ваш заказ обрабатывается.</p>
            <div className="buttons">
              <button className="ok-btn" onClick={closeModal}>ОК</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default Order