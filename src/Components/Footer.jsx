import React from "react";
import { ReactComponent as FacebookIcon } from '../Resources/Icons/facebook.svg'
import { ReactComponent as InstagramIcon } from '../Resources/Icons/instagram.svg'
import { ReactComponent as TwitterIcon } from '../Resources/Icons/twitter.svg'

function Footer() {
  return (
    <footer className="footer">
      <div className="upper_footer">
        <div className="upper_footer_info">
          <div className="upper_footer_info_title">DAM</div>
          <div className="upper_footer_info_content">We are a team at the forefront of digital transformation, combining the capabilities of artificial intelligence and the power of marketplaces. Our mission is to make business smarter, sales more efficient, and the customer experience personalized and convenient..</div>
          <div className="upper_footer_info_signature">-Aitu, Разработчик</div>
        </div>
        <div className="upper_footer_contacts">
          <div className="upper_footer_contacts_title">КОНТАКТЫ</div>
          <div className="upper_footer_contacts_content">
            <div className="upper_footer_contacts_content_item">
              <i className="ri-map-pin-2-line upper_footer_contacts_content_item_icon"></i>
              <div className="upper_footer_contacts_content_item_title">Адрес:</div>
              <div className="upper_footer_contacts_content_item_content">Астана</div>
            </div>
            <div className="upper_footer_contacts_content_item">
              <i className="ri-phone-fill upper_footer_contacts_content_item_icon"></i>
              <div className="upper_footer_contacts_content_item_title">Горячая линия:</div>
              <div className="upper_footer_contacts_content_item_content">+7 702 625 31 05</div>
            </div>
            <div className="upper_footer_contacts_content_item">
              <i className="ri-mail-line upper_footer_contacts_content_item_icon"></i>
              <div className="upper_footer_contacts_content_item_title">E-Mail:</div>
              <div className="upper_footer_contacts_content_item_content">support@dam.kz</div>
            </div>
          </div>
        </div>
        <div className="upper_footer_media">
          <div className="upper_footer_media_title">СЛЕДИТЕ ЗА НАМИ</div>
          <div className="upper_footer_media_content">
            <a href="#" className="upper_footer_media_content_link">
              <FacebookIcon className="upper_footer_media_content_link_icon"/>
            </a>
            <a href="#" className="upper_footer_media_content_link">
              <InstagramIcon className="upper_footer_media_content_link_icon"/> 
            </a>
            <a href="#" className="upper_footer_media_content_link">
              <TwitterIcon className="upper_footer_media_content_link_icon"/>
            </a>
          </div>
        </div>
      </div>
      <div className="lower_footer">
        <div className="lower_footer_copyrights">
          <i className="ri-copyright-line lower_footer_copyrights_icon"></i>
        </div>
        <div className="lower_footer_termcond">
          <a className="lower_footer_termcond_link" href="#">Политика конфиденциальности</a>
          <div className="lower_footer_termcond_separate"></div>
          <a className="lower_footer_termcond_link" href="#">Условия использования</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;