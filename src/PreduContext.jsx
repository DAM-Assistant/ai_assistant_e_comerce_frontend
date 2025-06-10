import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const PreduContext = createContext(null);

export const PreduContextProvider = (props) => {

  const api_path = process.env.REACT_APP_API_URL.replace(/\/+$/, '')

  const [authenticated, setAuthenticated] = useState(false)
  const [onSignupPage, setOnSignupPage] = useState(false)
  const [currentUser, setCurrentUser] = useState({})
  const [categories, updateCategories] = useState([])
  const [brands, updateBrands] = useState([])
  const [shop, updateShop] = useState([])
  const [cart, updateCart] = useState({})
  
  const [numCartItems, updateNumCartItems] = useState(0)
  const [productSearchQuery, updateProductSearchQuery] = useState("")
  const [ menuState, setMenuState] = useState([])
  
  // ===== КУПОНЫ ===== //
  const [coupon, setCoupon] = useState({
    "code": "",
    "min_order_required": 0,
    "max_discount_applicable": 0,
    "is_active": true,
    "type": "fixed",
    "value": 0
  })
  const [couponValue, setCouponValue] = useState(0)
  const [couponMessage, setCouponMessage] = useState("Купон не применен")
  const [usedCoupons, setUsedCoupons] = useState([])

  const applyCoupon = (totalCost, coupon) => {
    let value = 0
    let couponValid = false

    if (coupon.code === "") {
      setCouponMessage("Купон не применен")
    }
    else if (!coupon.is_active) {
      setCouponMessage("Этот код купона больше не активен.")
    }
    else if (totalCost < coupon.min_order_required) {
      setCouponMessage("Минимальная сумма заказа не достигнута.")
    }
    else {
      couponValid = true
      setCouponMessage("Купон применен")
    }
    
    if (couponValid) {
      if (coupon.type === "fixed") {
        value = coupon.value
      }
      else if (coupon.type === "percentage") {
        value = totalCost / 100 * coupon.value
        if (value >= coupon.max_discount_applicable) {
          value = coupon.max_discount_applicable
        }
      }
      if (value >= totalCost) {
        value = totalCost
      }
    }
    else {
      value = 0
    }

    setCouponValue(value)
    updateCostFinal(totalCost - value)
  }

  const getUsedCoupons = async() => {
    const used_coupon_api = api_path + "/api/users/coupon-history";
    const response = await axios.get(used_coupon_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
    setUsedCoupons(response.data)
  }

  const removeAppliedCoupon = () => {
    setCoupon({
      "code": "",
      "min_order_required": 0,
      "max_discount_applicable": 0,
      "is_active": true,
      "type": "fixed",
      "value": 0
    });
    setCouponValue(0);
    setCouponMessage("Купон не применен");
    // Пересчитываем итоговую стоимость без купона
    applyCoupon(costTotal, { code: "", min_order_required: 0, max_discount_applicable: 0, is_active: true, type: "fixed", value: 0 });
  };

  // ===== Корзина ===== //
  const [costTotal, updateCostTotal] = useState(0)
  const [costFinal, updateCostFinal] = useState(0)

  async function getInitialShopData() {
    const brands_result = await (await axios.get(api_path + "/api/brands/")).data

    const categories_result = await (await axios.get(api_path + "/api/categories/")).data
    for (let i in categories_result) {
      let brand_ids = await (await axios.get(api_path + "/api/categories/" + String(categories_result[i]["id"]) + "/brands")).data;
      categories_result[i]["brand_ids"] = brand_ids
      let brands = []
      for (let n in brand_ids) {
        brands.push(_getNameByID(brands_result, brand_ids[n]))
      }
      categories_result[i]["brands"] = brands
    }

    const products_result = await (await axios.get(api_path + "/api/products/")).data
    for (let i in products_result) {
      products_result[i]["category"] = _getNameByID(categories_result, products_result[i]["category_id"]);
      products_result[i]["brand"] = _getNameByID(brands_result, products_result[i]["brand_id"])
    }

    updateCategories(categories_result)
    updateBrands(brands_result)
    updateShop(products_result)
    const new_cart = {}
    for (let i=0; i<products_result.length; i++) {
      new_cart[products_result[i]["id"]] = 0
    }
    updateCart(new_cart);
    
    const newMenuState = []
    for (let i=0; i<categories_result.length; i++) {
      newMenuState.push(false)
    }
    setMenuState(newMenuState)

    if (Cookies.get('access_token')) {
      const profile_api_path = api_path + "/api/auth/me"
      const me_response = await axios.get(profile_api_path, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}});
      const user = me_response.data
      const masked_password = "********";
      user.password = masked_password
      setCurrentUser(user)
      setAuthenticated(true)
      
      getOrderHistory()
      getUsedCoupons()
      
    }
  }
  
  useEffect(() => {
    getInitialShopData();
  }, []);

  // Добавляем useEffect для пересчета costTotal при изменении cart
  useEffect(() => {
    let total = 0;
    for (const itemId in cart) {
      if (cart[itemId] > 0) {
        const product = shop.find(p => p.id === parseInt(itemId));
        if (product) {
          total += product.cost_per_unit * cart[itemId];
        }
      }
    }
    updateCostTotal(total);
    applyCoupon(total, coupon); // Пересчитываем скидку купона с новой общей стоимостью
  }, [cart, shop, coupon]); // Зависимости: cart, shop, coupon

  // ====== Access Token ===== //
  const getAccessToken = () => {
    return (Cookies.get('access_token'));
  }

  // ====== UTIL ===== //
  const _getNameByID = (array, id) => {
    for (let i in array) {
      if (array[i]["id"] === id) {
        return array[i]["name"]
      }
    }
    return ""
  }
  
  // ====== Боковое меню категорий ===== //
  const [categoryMenuStatus, setCategoryMenuStatus] = useState(false)

  const changeCategoryMenuStatus = () => {
    setCategoryMenuStatus(!categoryMenuStatus)
  }

  const [selectCategory, updateSelectCategory] = useState("all")
  const [selectBrand, updateSelectBrand] = useState("all")

  const changeSelectFilter = (new_category, new_brand) => {
    window.scrollTo(0, 0);
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    updateProductSearchQuery("")
    updateSelectCategory(new_category);
    updateSelectBrand(new_brand)
  }

  const searchProduct = (user_input) => {
    window.scrollTo(0, 0);
    if (categoryMenuStatus) {
      changeCategoryMenuStatus();
    }
    updateProductSearchQuery(user_input);
    if (user_input === "") {
      updateSelectCategory("all")
      updateSelectBrand("all")
    }
  }

  // ===== ЗАКАЗЫ ===== //
  const [ orderHistory, setOrderHistory ] = useState([])
  
  const getOrderHistory = async() => {
    const orders_api = api_path + "/api/users/order-history"
    const response = await axios.get(orders_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
    setOrderHistory(response.data)
  }

  const getCost = (id) => {
    for (let i=0; i<shop.length; i++) {
      if (shop[i]["id"] === id) {
        return shop[i]["cost_per_unit"]
      }
    }
  }
  
  const setCartProductQuantity = (productID, quantity) => {
    // Update quantity in cart
    const prevQuantity = cart[productID];
    const newCart = { ...cart }; // Создаем копию объекта корзины
    newCart[productID] = quantity;
    
    // Update total cost
    const new_cost = costTotal - prevQuantity*getCost(productID) + quantity*getCost(productID)
    
    // Change number of cart items alerts
    let count = 0
    for (let i in Object.values(cart)) {
      if (Object.values(cart)[i] !== 0) {
        count += 1
      }
    }
    updateNumCartItems(count)

    applyCoupon(new_cost, coupon)

    // UPDATE STATE
    updateCart(newCart)
    updateCostTotal(new_cost)
    updateNumCartItems(count)
  }

  const isCartEmpty = () => {
    if (Object.keys(cart).length === 0) {
      return true
    }
    const cartEmpty = Object.values(cart).every(value => value === 0);
    return cartEmpty
  }

  const reset = () => {
    const new_cart = {}
    for (let i=0; i<shop.length; i++) {
      new_cart[shop[i]["id"]] = 0
    }
    updateCart(new_cart);
    setCoupon({
      "code": "",
      "min_order_required": 0,
      "max_discount_applicable": 0
    })
    setCouponValue(0)
    updateCostFinal(0)
    updateCostTotal(0)
    updateNumCartItems(0)
    setCouponMessage("Купон не применен")
    getOrderHistory()
  }

  // ===== ЧАТ-БОТ ===== //
  const [ chatHistory, setChatHistory ] = useState([
    {
      message: "Привет! Я чат-бот PreDu, готов помочь вам с любыми вопросами о PreDu. Чем я могу вам помочь?",
      sender: "PreDu ChatBot",
      direction: "incoming"
    }
  ])

  const addChatMessage = (newMessage) => {
    setChatHistory(prevHistory => [...prevHistory, newMessage]);
  };

  const contextValue = { 
    api_path, getAccessToken,
    currentUser, setCurrentUser,
    authenticated, setAuthenticated,
    onSignupPage, setOnSignupPage,
    categories, updateCategories, brands, updateBrands,
    shop, cart, updateCart, numCartItems, updateNumCartItems, costTotal, costFinal, setCartProductQuantity, isCartEmpty, updateShop,
    coupon, couponValue, couponMessage, setCoupon, applyCoupon, usedCoupons, getUsedCoupons,
    categoryMenuStatus, changeCategoryMenuStatus, 
    selectCategory, selectBrand, changeSelectFilter,
    productSearchQuery, searchProduct,
    menuState, setMenuState,
    orderHistory, getOrderHistory,
    chatHistory, addChatMessage,
    reset,
    removeAppliedCoupon
  }
  return (
    <PreduContext.Provider value={contextValue}>
      {props.children}
    </PreduContext.Provider>
  )
}