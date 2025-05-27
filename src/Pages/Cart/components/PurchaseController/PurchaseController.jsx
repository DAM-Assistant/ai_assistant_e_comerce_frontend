import React, { useContext, useState } from "react"
import { ReactComponent as InputIcon } from '../../../../Resources/Icons/input.svg'
import { ReactComponent as CheckoutIcon } from '../../../../Resources/Icons/shopping_cart_checkout.svg'
import { PreduContext } from "../../../../PreduContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const PurchaseController = () => {
  const navigate = useNavigate()
  const { api_path, costTotal, costFinal, coupon, couponValue, couponMessage, setCoupon, applyCoupon, 
    isCartEmpty, authenticated } = useContext(PreduContext)
  const [ couponCode, setCouponCode ] = useState("")
  const [ modal, setModal ] = useState(false)
  const [ emptyCartModal, setEmptyCartModal ] = useState(false)

  const checkout = () => {
    if (isCartEmpty()) {
      setEmptyCartModal(true)
    }
    else if (!authenticated) {
      setModal(true)
    }
    else {
      navigate('/Order')
    }
  }


  const getCoupon = async() => {
    var couponAPI = api_path + "/api/coupons/" + couponCode
    try {
      const response = await axios.get(couponAPI)
      setCoupon(response.data)
      applyCoupon(costTotal, response.data)
    } catch(e) {
      window.alert(e.response.data.detail)
    }
  }

  const removeCoupon = () => {
    const new_coupon = {
      "code": "",
      "min_order_required": 0,
      "max_discount_applicable": 0
    }
    setCoupon(new_coupon)
    applyCoupon(costTotal, new_coupon)
  }

  const toLogin = () => {
    navigate('/User')
  }

  return (
    <div className="purchase-controller">

      <h1>Купить сейчас!</h1>

      <div className="divider"></div>
      
      <div className="coupon-container">
        <form>
          <input type="text" placeholder="Ваш купон" onChange={(e)=>setCouponCode(e.target.value)} value={couponCode}></input>
          <button type="button" onClick={()=>{getCoupon()}}>
            <InputIcon className="icon"/>
          </button>
        </form>
        <div className="coupon-value">
          <h4>Купон:</h4>
          <p>{coupon.code}</p>
        </div>
        <div className="coupon-value">
          <h4>Мин. сумма:</h4>
          <p>{coupon.min_order_required.toLocaleString("en-US")} ₸</p>
        </div>
        <div className="coupon-value">
          <h4>Макс. скидка:</h4>
          <p>{coupon.max_discount_applicable.toLocaleString("en-US")} ₸</p>
        </div>
        <div className="coupon-value">
          <h4>Статус: </h4>
          <p>{couponMessage}</p>
        </div>
        
        <button className="remove-button" onClick={removeCoupon}>Удалить</button>
      </div>

      <div className="divider"></div>

      <div className="checkout-container">
        <div className="cost">
          <h4>Корзина:</h4>
          <p>{costTotal.toLocaleString("en-US")} ₸</p>
        </div>
        <div className="cost">
          <h4>Купон:</h4>
          <p>{couponValue.toLocaleString("en-US")} ₸</p>
        </div>
        <div className="cost">
          <h3>Итого:</h3>
          <p>{costFinal.toLocaleString("en-US")} ₸</p>
        </div>
      </div>

      <button type="button" className="checkout-button" onClick={checkout}>
        <CheckoutIcon className="icon"/>
        <b>Оформить заказ</b>
      </button>

      {modal && (
        <div className="modal">
          <div className="overlay" onClick={()=>{setModal(false)}}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Требуется авторизация</h1>
            <p>Пожалуйста, войдите в систему, чтобы продолжить.</p>
            <div className="buttons">
              <button className="back-btn" onClick={()=>{setModal(false)}}>Назад</button>
              <button className="to-login-btn" onClick={toLogin}>Войти</button>
            </div>
          </div>
        </div>
      )}

      {emptyCartModal && (
        <div className="modal">
          <div className="overlay" onClick={()=>{setEmptyCartModal(false)}}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Ваша корзина пуста</h1>
            <p>Пожалуйста, добавьте хотя бы 1 товар, чтобы продолжить.</p>
            <div className="buttons">
              <button className="back-btn" onClick={()=>{setEmptyCartModal(false)}}>Назад</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseController