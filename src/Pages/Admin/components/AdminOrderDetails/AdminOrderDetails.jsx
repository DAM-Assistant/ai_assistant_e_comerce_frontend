import React, { useContext, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { PreduContext } from "../../../../PreduContext"

const AdminOrderDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { api_path, getAccessToken } = useContext(PreduContext)

  const [ order, setOrder ] = useState(location.state.order)

  const goBack = async() => {
    const orders_api = api_path + "/api/orders/"
    const response = await axios.get(orders_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
    navigate('/Admin/Orders', {
      state : {
        orders: response.data
      }
    })
  }

  const cancelOrder = async() => {
    if (window.confirm("Отменить заказ?")) {
      const cancel_api = api_path + "/api/orders/cancel-order/" + String(order.id)
      try {
        const response = await axios.patch(cancel_api, {}, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        window.alert(response.data.message)
      } catch(e){
        window.alert(e.response.data.detail)
      }
    }

    refresh()
  }

  const completeOrder = async() => {
    if (window.confirm("Завершить заказ?")) {
      const complete_api = api_path + "/api/orders/complete-order/" + String(order.id)
      try {
        const response = await axios.patch(complete_api, {}, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        window.alert(response.data.message)
      } catch(e){
        window.alert(e.response.data.detail)
      }
    }
    refresh()
  }

  const refresh = async() => {
    const order_api = api_path + "/api/orders/" + String(order.id)
    const response = await axios.get(order_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
    setOrder(response.data)
  }
  
  return(
    <div className="admin-order-details">
      <div className="container">
        <h1>ДЕТАЛИ ЗАКАЗА</h1>

        <div className="seperator"></div>

        <h2>Информация о заказе</h2>

        <table className="order-status">
          <tbody>
            <tr>
              <th>ID ЗАКАЗА</th>
              <td className="id">{order.id}</td>
            </tr>
            <tr>
              <th>СТАТУС</th>
              <td className={`status ${order.status === "processing" ? "processing" : order.status === "canceled" ? "canceled" : order.status === "completed" ? "completed" : ""}`}>
                {order.status === "processing" ? "в обработке" : order.status === "canceled" ? "отменен" : order.status === "completed" ? "завершен" : order.status}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="seperator"></div>

        <h2>Контактная информация</h2>

        <table className="user-info">
          <tbody>
            <tr>
              <th>ID пользователя</th>
              <td>{order.user_id}</td>
            </tr>
            <tr>
              <th>Имя</th>
              <td>{order.user_firstname} {order.user_lastname}</td>
            </tr>
            <tr>
              <th>Телефон</th>
              <td>{order.user_phone}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{order.user_email}</td>
            </tr>
            <tr>
              <th>Адрес</th>
              <td>{order.user_location}</td>
            </tr>
          </tbody>
        </table>

        <div className="seperator"></div>

        <h2>Товары</h2>

        <table className="order-info">
          <tbody>
            <tr>
              <th>ID</th>
              <th className="product-name">Товар</th>
              <th className="product-quantity">Количество</th>
              <th className="product-cost">Стоимость (₸)</th>
            </tr>
            {order.ordered_products.map((ordered_product) => (
              <tr key={ordered_product.id}>
                <td className="center">{ordered_product.id}</td>
                <td className="left">{ordered_product.name}</td>
                <td className="right">{ordered_product.quantity}</td>
                <td className="right">{(ordered_product.total_cost).toLocaleString("en-US")} ₸</td>
              </tr>
            ))}
            <tr>
              <th colSpan={2} className="total-left">Итого:</th>
              <th colSpan={2} className="total-right">{order.raw_total_cost.toLocaleString("en-US")} ₸</th>
            </tr>
          </tbody>
        </table>

        <h2>Купон</h2>

        <table className="coupon-info">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{order.used_coupon.coupon_id}</td>
            </tr>
            <tr>
              <th>Код</th>
              <td>{order.used_coupon.code}</td>
            </tr>
            <tr>
              <th>Значение</th>
              <td>{order.used_coupon ?  "0 ₸" : order.used_coupon.applied_value.toLocaleString("en-US") + " ₸"}</td>
            </tr>
          </tbody>
        </table>

        <div className="seperator"></div>

        <div className="final">
          <h1>ИТОГО :</h1>
          <h1>{order.final_total_cost.toLocaleString("en-US")} ₸</h1>
        </div>

        <div className="seperator"></div>

        {(order.status === "processing") && (
          <div className="btns-container">
            <button className="cancel-btn" onClick={cancelOrder}>ОТМЕНИТЬ ЗАКАЗ</button>
            <button className="complete-btn" onClick={completeOrder}>ЗАВЕРШИТЬ ЗАКАЗ</button>
          </div>
          
        )}

        <button className="back-btn" onClick={goBack}>НАЗАД</button>


        
      </div>
    </div>
  )
}

export default AdminOrderDetails