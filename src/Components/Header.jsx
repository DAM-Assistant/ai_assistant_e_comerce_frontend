import React, { useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PreduContext } from '../PreduContext';
import { ReactComponent as AccountCircleIcon } from '../Resources/Icons/account_circle.svg';
import { ReactComponent as ShoppingCartIcon } from '../Resources/Icons/shopping_cart.svg';
import { ReactComponent as MenuIcon } from '../Resources/Icons/menu.svg';
import { ReactComponent as CloseIcon } from '../Resources/Icons/close.svg';
import { ReactComponent as CategoryMenuIcon } from '../Resources/Icons/keyboard_double_arrow_down.svg';

const Header = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setOpen] = useState(false);
  const {categoryMenuStatus, changeCategoryMenuStatus, numCartItems} = useContext(PreduContext);

  function toggleMenu() {
    setOpen(!isOpen);
  }

  // НАВИГАЦИЯ
  function toHome() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/Home');
  }
  
  function toShop() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/Shop');
  }

  function toCart() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/Cart');
  }

  function toUser() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/User');
  }

  function toHelp() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/Help');
  }

  function toAboutUs() {
    window.scrollTo(0, 0);
    if (isOpen) {
      setOpen(false);
    }
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    navigate('/AboutUs');
  }

  // ПРИЛИПАЮЩИЙ СКРОЛЛ
  React.useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (header) {
        header.classList.toggle("sticky", window.scrollY > 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isOpen ? 'mobile-menu-open' : ''}`}>
      <div className="container">
        <div className="logo">
          <h1 onClick={toHome}>DAM</h1>
        </div>

        <nav className="navigation">
          <ul className="menu-list">
            <li className="menu-item" onClick={toShop}>
              <h2>Магазин</h2>
            </li>
            <li className="menu-item" onClick={toAboutUs}>
              <h2>О нас</h2>
            </li>
            <li className="menu-item" onClick={toHelp}>
              <h2>Помощь</h2>
            </li>
          </ul>
        </nav>

        <div className="buttons">
          <button className="cart-button" type="button" onClick={toCart}>
            <ShoppingCartIcon className="icon"/>
            <h2>Корзина</h2>
            {numCartItems > 0 && (
              <div className="cart-alert">{numCartItems}</div>
            )}
          </button>
          <button className="account-button" type="button" onClick={toUser}>
            <AccountCircleIcon className="icon"/>
          </button>
        </div>

        <div className="responsive-buttons">
          {(location.pathname === '/Shop') && (
            <button 
              className={`category-menu-button ${categoryMenuStatus ? "open" : ""}`} 
              onClick={changeCategoryMenuStatus} 
              type="button"
            >
              <CategoryMenuIcon className="icon"/>
            </button>
          )}

          <button 
            className={`menu-button ${isOpen ? "open" : ""}`} 
            onClick={toggleMenu} 
            type="button"
          >
            <MenuIcon className="menu-icon"/>
            <CloseIcon className="close-icon"/>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header;