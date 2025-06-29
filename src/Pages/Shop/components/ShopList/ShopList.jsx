import React, { useContext } from "react"
import { PreduContext } from "../../../../PreduContext"
import {ReactComponent as ArrowUpIcon } from '../../../../Resources/Icons/arrow_upward.svg'
import {ReactComponent as ArrowDownIcon } from '../../../../Resources/Icons/arrow_downward.svg'
import ShopProduct from "../ShopProduct/ShopProduct"

const ShopList = () => {
  const { shop, updateShop, selectCategory, selectBrand, productSearchQuery} = useContext(PreduContext);

  const sortNameAsc = () => {
    let products = shop 
    updateShop(products.slice().sort((a, b) => a.name.localeCompare(b.name)))
  }

  const sortNameDesc = () => {
    let products = shop 
    updateShop(products.slice().sort((a, b) => b.name.localeCompare(a.name)))
  }

  const sortPriceAsc = () => {
    let products = shop
    updateShop(products.slice().sort((a, b) => a.cost_per_unit - b.cost_per_unit));
  }
  
  const sortPriceDesc = () => {
    let products = shop
    updateShop(products.slice().sort((a, b) => b.cost_per_unit - a.cost_per_unit));
  }


  return (
    <div className="shop-list">
      <h3 className="shop-list_title">
        {productSearchQuery === "" && selectBrand === "all" && selectCategory === "all" ? (
          "Все товары"
        ) : productSearchQuery === "" ? (
          `Фильтр: ${selectCategory} - ${selectBrand}`
        ) : (
          <span className="search-title">Поиск: {productSearchQuery}</span>
        )}
      </h3>
      
      <div className="sort-btns">
        <button onClick={sortNameAsc}>Название <ArrowUpIcon className="icon"/></button>
        <button onClick={sortNameDesc}>Название <ArrowDownIcon className="icon"/></button>
        <button onClick={sortPriceAsc}>Цена <ArrowUpIcon className="icon"/></button>
        <button onClick={sortPriceDesc}>Цена <ArrowDownIcon className="icon"/></button>
      </div>

      <div className="shop-list_products">
        {shop.length === 0 ? (
          <div className="empty-shop-message">Нет товаров для отображения.</div>
        ) : (
          shop.map((product) => {
            if (productSearchQuery !== "") {
              if ((String(product.name) + " " +
                String(product.brand) + " " +
                String(product.category) + " " +
                String(product.cost_per_unit)).toLowerCase().includes(productSearchQuery)) {
                  return <ShopProduct data={product} key={product.id}/>
                }
            }
            else{
              if (selectCategory === "all" && selectBrand === "all") {
                return <ShopProduct data={product} key={product.id}/>
              }
              else {
                if (selectCategory === product.category && selectBrand === product.brand) {
                  return <ShopProduct data={product} key={product.id}/>
                }
              }
            }
          })
        )}
      </div>
    </div>
  )
}

export default ShopList