import React, { useContext, useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import './OrderDetails.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { QRCodeCanvas } from 'qrcode.react';

import { PreduContext } from "../../PreduContext"

const OrderDetails = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { api_path, getAccessToken, getOrderHistory } = useContext(PreduContext)

  const [order, setOrder] = useState(location.state.order)
  const [cancelModal, setCancelModal] = useState(false)
  const [showQR, setShowQR] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (order?.id && order?.created_at && window.JsBarcode && canvasRef.current) {
      const value = `${order.id}_${order.created_at}`;
      window.JsBarcode(canvasRef.current, value, {
        format: "CODE128",
        lineColor: "#111",
        width: 2,
        height: 48,
        displayValue: true,
        fontSize: 12,
        margin: 4,
        background: "#fff"
      });
    }
  }, [order?.id, order?.created_at]);

  const goBack = async() => {
    window.scrollTo(0, 0);
    navigate('/User')
  }

  const cancelOrder = async() => {
    if (window.confirm("Отменить ваш заказ?")) {
      try {
        const cancel_order_api = api_path + "/api/orders/cancel-order/" + String(order.id)
        const response = await axios.patch(cancel_order_api, {}, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        if (response.status === 200) {
          try {
            const order_api = api_path + "/api/orders/" + String(order.id)
            const order_response = await axios.get(order_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
            setCancelModal(true)
            setOrder(order_response.data)
            getOrderHistory()
            window.scrollTo(0, 0)
          } catch (e){
            window.alert(e.response.data.detail)
          }
        }
      } catch(e) {
        window.alert(e.response.data.detail)
      }
    }
    }

  // PDF export
  const handleDownloadPDF = async () => {
    const input = document.getElementById('order-details-pdf');
    if (!input) return;
    input.classList.add('pdf-export');
    await new Promise(resolve => setTimeout(resolve, 100)); // Дать время примениться стилям
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [595, 1400] });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 40;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
    pdf.save(`order_${order.id}.pdf`);
    input.classList.remove('pdf-export');
  };

  return (
    <main className="order-details">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h1>ДЕТАЛИ ЗАКАЗА</h1>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="back-btn" style={{padding: '8px 16px'}} onClick={handleDownloadPDF}>Скачать PDF</button>
            <button className="back-btn" style={{padding: '8px 16px'}} onClick={() => setShowQR(q => !q)}>{showQR ? 'Скрыть QR' : 'Показать QR'}</button>
          </div>
        </div>
        {showQR && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <QRCodeCanvas value={window.location.href} size={120} bgColor="#23243a" fgColor="#1de9b6" />
          </div>
        )}
        <div id="order-details-pdf">
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
                <th className="product-name">Товар</th>
                <th className="product-quantity">Количество</th>
                <th className="product-cost">Стоимость</th>
              </tr>
              {order.ordered_products.map((ordered_product) => (
                <tr key={ordered_product.id}>
                  <td className="product-name">{ordered_product.name}</td>
                  <td className="product-quantity">{ordered_product.quantity}</td>
                  <td className="product-cost">{(ordered_product.total_cost).toLocaleString("en-US")} ₸</td>
                </tr>
              ))}
              <tr>
                <th colSpan={2} className="total-left">Итого:</th>
                <th className="total-right">{order.raw_total_cost.toLocaleString("en-US")} ₸</th>
              </tr>
            </tbody>
          </table>

          <h2>Купон</h2>

          <table className="coupon-info">
            <tbody>
              <tr>
                <th>Код</th>
                <td>{order.used_coupon.code}</td>
              </tr>
              <tr>
                <th>Значение</th>
                <td>{order.used_coupon.applied_value ?  order.used_coupon.applied_value.toLocaleString("en-US") : "0"} ₸</td>
              </tr>
            </tbody>
          </table>

          <div className="seperator"></div>

          <div className="final">
            <h1>ИТОГО :</h1>
            <h1>{order.final_total_cost.toLocaleString("en-US")} ₸</h1>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
            <canvas ref={canvasRef} width={400} height={60} style={{maxWidth: '100%', background: '#fff'}} />
          </div>

          <div className="seperator"></div>

          <div className="order-actions">
            {(order.status === "processing") && (
              <button className="cancel-btn" onClick={cancelOrder}>ОТМЕНИТЬ ЗАКАЗ</button>
            )}
            <button className="back-btn" onClick={goBack}>НАЗАД</button>
          </div>
        </div>
      </div>

      {cancelModal && (
        <div className="modal">
          <div className="overlay" onClick={()=>{setCancelModal(false)}}></div>
          <div className="modal-content">
            <h2>Сообщение</h2>
            <h1>Заказ отменен</h1>
            <p>Ваш заказ был отменен.</p>
            <div className="buttons">
              <button className="ok-btn" onClick={()=>{setCancelModal(false)}}>ОК</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default OrderDetails