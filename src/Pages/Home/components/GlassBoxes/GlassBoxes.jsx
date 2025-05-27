import React from "react"
import { ReactComponent as QuiltIcon } from '../../../../Resources/Icons/history_edu.svg'
import { ReactComponent as CheckCircleIcon } from "../../../../Resources/Icons/check_circle.svg"

const GlassBoxes = () => {
  // Тексты для карточек
  const subtitles = [
    "Быстрая активация",
    "Гарантия качества",
    "Низкие цены"
  ];

  const titles = [
    "МГНОВЕННЫЙ ДОСТУП",
    "НАДЕЖНЫЕ АККАУНТЫ",
    "ВЫГОДНЫЕ ПРЕДЛОЖЕНИЯ"
  ];

  const descriptions = [
    "Получите доступ к приобретенным аккаунтам и сервисам сразу после оплаты. Больше не нужно ждать!",
    "Мы гарантируем работоспособность всех аккаунтов. В случае проблем - быстрая замена или возврат средств.",
    "Мы предлагаем лучшие цены на рынке за счет прямых поставок и оптимизации расходов."
  ];

  const checklists = [
    ["Автоматическая выдача", "Работаем 24/7", "Без задержек и проверок"],
    ["Проверенные источники", "Гарантия на каждый товар", "Легкий процесс обмена/возврата"],
    ["Конкурентные цены", "Регулярные скидки и акции", "Программа лояльности"]
  ];


  return (
    <div className="glass-boxes">
      {/* 1 */}
      <div className="box">
        <div className="box_header">
          <h3 className="box_subtitle">{subtitles[0]}</h3>
          <QuiltIcon className="icon"/>
        </div>

        <h2 className="box_title">{titles[0]}</h2>

        <p className="box_description">{descriptions[0]}</p>

        <div className="box_linebreak"></div>

        <table className="box_checklist">
          <tbody>
            {checklists[0].map((item, index) => (
              <tr className="box_checkitem" key={index}>
                <th>
                  <CheckCircleIcon className="icon"/>
                </th>
                <td>
                  <p>{item}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 2 */}
      <div className="box">
        <div className="box_header">
          <h3 className="box_subtitle">{subtitles[1]}</h3>
          <QuiltIcon className="icon"/>
        </div>

        <h2 className="box_title">{titles[1]}</h2>

        <p className="box_description">{descriptions[1]}</p>

        <div className="box_linebreak"></div>

        <table className="box_checklist">
          <tbody>
             {checklists[1].map((item, index) => (
              <tr className="box_checkitem" key={index}>
                <th>
                  <CheckCircleIcon className="icon"/>
                </th>
                <td>
                  <p>{item}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 3 */}
      <div className="box">
        <div className="box_header">
          <h3 className="box_subtitle">{subtitles[2]}</h3>
          <QuiltIcon className="icon"/>
        </div>

        <h2 className="box_title">{titles[2]}</h2>

        <p className="box_description">{descriptions[2]}</p>

        <div className="box_linebreak"></div>

        <table className="box_checklist">
          <tbody>
             {checklists[2].map((item, index) => (
              <tr className="box_checkitem" key={index}>
                <th>
                  <CheckCircleIcon className="icon"/>
                </th>
                <td>
                  <p>{item}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default GlassBoxes