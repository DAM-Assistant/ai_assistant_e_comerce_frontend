import React, { useContext, useState } from "react"
import { PreduContext } from "../../PreduContext"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Order = () => {
  const navigate = useNavigate()
  const { api_path, getAccessToken, currentUser, shop, cart, costTotal, costFinal, coupon, couponValue, reset } = useContext(PreduContext)
  const [ orderSuccessModal, setOrderSuccessModal ] = useState(false)
  const [ newOrderId, setNewOrderId ] = useState(0)


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
  
  return (
    <main className="order">
      <div className="container">
        <h1>ЗАКАЗ</h1>

        <div className="seperator"></div>

        <h2>Контактная информация</h2>

        <table className="user-info">
          <tbody>
            <tr>
              <th>Имя</th>
              <td>{currentUser.firstname} {currentUser.lastname}</td>
            </tr>
            <tr>
              <th>Телефон</th>
              <td>{currentUser.phone}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{currentUser.email}</td>
            </tr>
            <tr>
              <th>Адрес</th>
              <td>{currentUser.location}</td>
            </tr>
          </tbody>
        </table>
        
        <div className="seperator"></div>

        <h2>Товары</h2>

        <table className="order-info">
          <tbody>
            <tr>
              <th className="product-name">Товар</th>
              <th className="product-quantity">Количество</th>
              <th className="product-cost">Стоимость</th>
            </tr>
            {shop.map((product) => {
                if (cart[product.id] !== 0) {
                  return (
                    <tr key={product.name}>
                      <td className="product-name">{product.name}</td>
                      <td className="product-quantity">{cart[product.id]}</td>
                      <td className="product-cost">{(product.cost_per_unit * cart[product.id]).toLocaleString("en-US")} ₸</td>
                    </tr>
                  )
                }
            })}
            <tr>
              <th colSpan={2} className="total-left">Итого:</th>
              <th className="total-right">{costTotal.toLocaleString("en-US")} ₸</th>
            </tr>
          </tbody>
        </table>

        <h2>Купон</h2>

        <table className="coupon-info">
          <tbody>
            <tr>
              <th>Код</th>
              <td>{coupon.code}</td>
            </tr>
            <tr>
              <th>Значение</th>
              <td>{couponValue.toLocaleString("en-US")} ₸</td>
            </tr>
          </tbody>
        </table>

        <div className="seperator"></div>

        <div className="final">
          <h1>ИТОГО :</h1>
          <h1>{costFinal.toLocaleString("en-US")} ₸</h1>
        </div>

        <div className="seperator"></div>

        <button className="buy-btn" onClick={makeOrder}>ЗАКАЗАТЬ СЕЙЧАС</button>
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