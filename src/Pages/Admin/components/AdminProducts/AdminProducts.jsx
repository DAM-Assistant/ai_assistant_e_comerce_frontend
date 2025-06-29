import React, { useContext, useState } from "react";
import {ReactComponent as RefreshIcon } from '../../../../Resources/Icons/refresh.svg'
import {ReactComponent as EditIcon } from '../../../../Resources/Icons/edit.svg'
import {ReactComponent as AddIcon } from '../../../../Resources/Icons/add.svg'
import {ReactComponent as ArrowUpIcon } from '../../../../Resources/Icons/arrow_upward.svg'
import {ReactComponent as ArrowDownIcon } from '../../../../Resources/Icons/arrow_downward.svg'

import { PreduContext } from "../../../../PreduContext";
import axios from "axios";

const AdminProducts = () => {
  const { api_path, categories, updateCategories, brands, updateBrands, shop, updateShop, getAccessToken } = useContext(PreduContext)

  const [ categorySearch, setCategorySearch ] = useState("")
  const [ brandSearch, setBrandSearch ] = useState("")
  const [ productSearch, setProductSearch ] = useState("")

  const [ currentSelect, setCurrentSelect ] = useState(null)
  const [ currentType, setCurrentType ] = useState("")
  const [ modalAdd, setModalAdd ] = useState(false)
  const [ modalEdit, setModalEdit ] = useState(false)
  const [ modalEditProduct, setModalEditProduct ] = useState(false)
  const [ modalAddProduct, setModalAddProduct ] = useState(false)  

  const [ name, setName ] = useState("")
  const [ description, setDescription ] = useState("")
  const [ categoryID, setCategoryID ] = useState(0)
  const [ brandID, setBrandID ] = useState(0)
  const [ imageLink, setImageLink ] = useState("")
  const [ cost, setCost ] = useState(0)
  const [ stock, setStock ] = useState(0)


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

  const sortStockAsc = () => {
    let products = shop
    updateShop(products.slice().sort((a, b) => a.stock_quantity - b.stock_quantity));
  }
  
  const sortStockDesc = () => {
    let products = shop
    updateShop(products.slice().sort((a, b) => b.stock_quantity - a.stock_quantity));
  }

  function selectEditCategory(object) {
    setCurrentSelect(object)
    setCurrentType("category")
    setName(object.name)
    setDescription(object.description)
    setModalEdit(true)
  }

  function selectEditBrand(object) {
    setCurrentSelect(object)
    setCurrentType("brand")
    setName(object.name)
    setDescription(object.description)
    setModalEdit(true)
  }

  function selectEditProduct(object) {
    setCurrentSelect(object)
    setCurrentType("product")
    setName(object.name)
    setDescription(object.description)
    setCategoryID(object.category_id)
    setBrandID(object.brand_id)
    setImageLink(object.image)
    setCost(object.cost_per_unit)
    setStock(object.stock_quantity)
    setModalEditProduct(true)
  }

  function selectAddCategory() {
    setCurrentType("category")
    setModalAdd(true)
  }

  function selectAddBrand() {
    setCurrentType("brand")
    setModalAdd(true)
  }

  function selectAddProduct() {
    setCurrentType("product")
    setModalAddProduct(true)
  }

  function closeModal() {
    setCurrentSelect(null)
    setCurrentType("")
    setName("")
    setDescription("")
    setCategoryID(0)
    setBrandID(0)
    setImageLink("")
    setCost(0)
    setStock(0)
    setModalEdit(false)
    setModalAdd(false)
    setModalEditProduct(false)
    setModalAddProduct(false)
  }

  const update = async() => {
    if (currentSelect !== null) {
      if (currentType === "category") {
        const update_api = api_path + "/api/categories/" + String(currentSelect.id)
        try {
          const updated_select = {
            name: name,
            description: description
          }
          const response = await axios.put(update_api, updated_select, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
          window.alert(response.data.message)
        } catch (e)  {
          window.alert(e.response.data.detail)
        }
      }
      else if (currentType === "brand") {
        const update_api = api_path + "/api/brands/" + String(currentSelect.id)
        try {
          const updated_select = {
            name: name,
            description: description
          }
          const response = await axios.put(update_api, updated_select, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
          window.alert(response.data.message)
        } catch (e)  {
          window.alert(e.response.data.detail)
        }
      }
      else if (currentType === "product") {
        const update_api = api_path + "/api/products/" + String(currentSelect.id)
        try {
          const updated_select = {
            name: name,
            description: description,
            category_id: parseInt(categoryID),
            brand_id: parseInt(brandID),
            image: imageLink,
            cost_per_unit: parseFloat(cost),
            stock_quantity: parseInt(stock)
          }
          const response = await axios.put(update_api, updated_select, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
          window.alert(response.data.message)
        } catch (e)  {
          window.alert(e.response.data.detail)
        }
      }
      refresh()
      closeModal()
    }
  }

  const add = async() => {
    if (currentType === "category") {
      const add_api = api_path + "/api/categories/"
      try {
        const new_category = {
          name: name,
          description: description
        }
        const response = await axios.post(add_api, new_category, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        window.alert(response.data.message)
      } catch (e)  {
        window.alert(e.response.data.detail)
      }
    }
    else if (currentType === "brand") {
      const add_api = api_path + "/api/brands/"
      try {
        const new_brand = {
          name: name,
          description: description
        }
        const response = await axios.post(add_api, new_brand, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        window.alert(response.data.message)
      } catch (e)  {
        window.alert(e.response.data.detail)
      }
    }
    else if (currentType === "product") {
      const add_api = api_path + "/api/products/"
      try {
        const new_product = {
          name: name,
          description: description,
          category_id: parseInt(categoryID),
          brand_id: parseInt(brandID),
          image: imageLink,
          cost_per_unit: parseFloat(cost),
          stock_quantity: parseInt(stock)
        }
        const response = await axios.post(add_api, new_product, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
        window.alert(response.data.message)
      }catch (e)  {
        window.alert(e.response.data.detail)
      }
    }
    refresh()
    closeModal()
  }

  const deleteSelected = async() => {
    if (window.confirm("Удалить?")) {
      if (currentSelect !== null) {
        if (currentType === "category") {
          const delete_api = api_path + "/api/categories/" + String(currentSelect.id)
          try {
            const response = await axios.delete(delete_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
            window.alert(response.data.message)
          } catch (e)  {
            window.alert(e.response.data.detail)
          }
        }
        else if (currentType === "brand") {
          const delete_api = api_path + "/api/brands/" + String(currentSelect.id)
          try {
            const response = await axios.delete(delete_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
            window.alert(response.data.message)
          } catch (e)  {
            window.alert(e.response.data.detail)
          }
        }
        else if (currentType === "product") {
          const delete_api = api_path + "/api/products/" + String(currentSelect.id)
          try {
            const response = await axios.delete(delete_api, {headers: {"Authorization" : `Bearer ${getAccessToken()}`}})
            window.alert(response.data.message)
          } catch (e)  {
            window.alert(e.response.data.detail)
          }
        }
      }
    }

    refresh()
    closeModal()
    
    
  }

  function formatDate(dateString) {
    if (dateString === null) {
      return "Н/Д";
    }

    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // Add leading zero if day is a single digit
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if month is a single digit
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  const _getNameByID = (array, id) => {
    for (let i in array) {
      if (array[i]["id"] === id) {
        return array[i]["name"]
      }
    }
    return ""
  }

  const refresh = async() => {
    const categories_refresh = await (await axios.get(api_path + "/api/categories/")).data
    const brands_refresh = await (await axios.get(api_path + "/api/brands/")).data
    const products_refresh = await (await axios.get(api_path + "/api/products/")).data

    for (let i in categories_refresh) {
      let brand_ids = await (await axios.get(api_path + "/api/categories/" + String(categories_refresh[i]["id"]) + "/brands")).data;
      categories_refresh[i]["brand_ids"] = brand_ids
      let brands = []
      for (let n in brand_ids) {
        brands.push(_getNameByID(brands_refresh, brand_ids[n]))
      }
      categories_refresh[i]["brands"] = brands    
    }

    for (let i in products_refresh) {
      products_refresh[i]["category"] = _getNameByID(categories_refresh, products_refresh[i]["category_id"]);
      products_refresh[i]["brand"] = _getNameByID(brands_refresh, products_refresh[i]["brand_id"])
    }

    updateCategories(categories_refresh)
    updateBrands(brands_refresh)
    updateShop(products_refresh)
  }

  return (
    <div className="admin-products">
      <div className="categories">
        <h1>КАТЕГОРИИ ({categories.length})</h1>

        <input type="text" className="search-bar" placeholder="Поиск ..." value={categorySearch} onChange={(e)=>{setCategorySearch(e.target.value)}}/>
      
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th>ID</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Создан</th>
                <th>Обновлен</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category)=>{
                if (("id=" + String(category.id) + " " +
                  "name=" + String(category.name)).toLowerCase().includes(categorySearch.toLowerCase())) {
                    return (
                      <tr key={category.id}>
                        <td className="center">{category.id}</td>
                        <td className="left">{category.name}</td>
                        <td className="left">{category.description}</td>
                        <td className="center">{formatDate(category.created_at)}</td>
                        <td className="center">{formatDate(category.updated_at)}</td>
                        <td className="center">
                          <button onClick={()=>{selectEditCategory(category)}}>
                            <EditIcon className="icon"/>
                          </button>
                        </td>
                      </tr>
                    )
                  }
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="btns-container">
        <button>
          <AddIcon className="icon" onClick={selectAddCategory}/>
        </button>
        <button onClick={refresh}>
          <RefreshIcon className="icon"/>
        </button>
      </div>

      <div className="seperator"></div>

      <div className="brands">
        <h1>БРЕНДЫ ({brands.length})</h1>

        <input type="text" className="search-bar" placeholder="Поиск ..." value={brandSearch} onChange={(e)=>{setBrandSearch(e.target.value)}}/>
      
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th>ID</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Создан</th>
                <th>Обновлен</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {brands.map((brand)=>{
                if (("id="+String(brand.id) + " " +
                  "name="+String(brand.name)).toLowerCase().includes(brandSearch.toLowerCase())) {
                    return (
                      <tr key={brand.id}>
                        <td className="center">{brand.id}</td>
                        <td className="left">{brand.name}</td>
                        <td className="left">{brand.description}</td>
                        <td className="center">{formatDate(brand.created_at)}</td>
                        <td className="center">{formatDate(brand.updated_at)}</td>
                        <td className="center" onClick={()=>{selectEditBrand(brand)}}>
                          <button><EditIcon className="icon"/></button>
                        </td>
                      </tr>
                    )
                  }
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="btns-container">
        <button>
          <AddIcon className="icon" onClick={selectAddBrand}/>
        </button>
        <button onClick={refresh}>
          <RefreshIcon className="icon"/>
        </button>
      </div>

      <div className="seperator"></div>

      <div className="products">
        <h1>ТОВАРЫ ({shop.length})</h1>

        <input type="text" className="search-bar" placeholder="Поиск ..." value={productSearch} onChange={(e)=>{setProductSearch(e.target.value)}}/>
      
        <div className="sort-btns">
          <button onClick={sortNameAsc}>Название <ArrowUpIcon className="icon"/></button>
          <button onClick={sortNameDesc}>Название <ArrowDownIcon className="icon"/></button>
          <button onClick={sortPriceAsc}>Цена <ArrowUpIcon className="icon"/></button>
          <button onClick={sortPriceDesc}>Цена <ArrowDownIcon className="icon"/></button>
          <button onClick={sortStockAsc}>Количество <ArrowUpIcon className="icon"/></button>
          <button onClick={sortStockDesc}>Количество <ArrowDownIcon className="icon"/></button>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr className="table-header">
                <th>ID</th>
                <th>Изображение</th>
                <th>Название</th>
                <th>Категория</th>
                <th>ID категории</th>
                <th>Бренд</th>
                <th>ID бренда</th>
                <th>Описание</th>
                <th>В наличии</th>
                <th>Цена</th>
                <th>Создан</th>
                <th>Обновлен</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {shop.map((product)=>{
                if ("id="+(String(product.id) + " " +
                  "name="+String(product.name) + " " +
                  "category="+String(product.category) + " " +
                  "brand="+String(product.brand) + " " +
                  "description="+String(product.description) + " " +
                  "stock="+String(product.stock) + " " +
                  "cost="+String(product.cost)).toLowerCase().includes(productSearch.toLowerCase())) {
                    return (
                      <tr key={product.id}>
                        <td className="center">{product.id}</td>
                        <td className="center">
                          <img src={product.image} alt="Изображение" />
                        </td>
                        <td className="left">{product.name}</td>
                        <td className="center">{product.category}</td>
                        <td className="center">{product.category_id}</td>
                        <td className="center">{product.brand}</td>
                        <td className="center">{product.brand_id}</td>
                        <td className="left">{product.description}</td>
                        <td className="right">{product.stock_quantity}</td>
                        <td className="right">{product.cost_per_unit.toLocaleString("en-US")} ₸</td>
                        <td className="right">{formatDate(product.created_at)}</td>
                        <td className="right">{formatDate(product.updated_at)}</td>
                        <td className="center" onClick={()=>{selectEditProduct(product)}}>
                          <button><EditIcon className="icon"/></button>
                        </td>
                      </tr>
                    )
                  }
              })}
            </tbody>
          </table>
        </div>
      
      </div>

      <div className="btns-container">
        <button>
          <AddIcon className="icon" onClick={selectAddProduct}/>
        </button>
        <button onClick={refresh}>
          <RefreshIcon className="icon"/>
        </button>
      </div>

      {modalEdit && (
        <div className="modal">
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>Редактировать {currentType === "category" ? "категорию" : currentType === "brand" ? "бренд" : "товар"} {currentSelect.id}</h2>
            
            <form>
              <label htmlFor="name">Название</label>
              <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)}
              placeholder={currentSelect.name}/>
              <label htmlFor="description">Описание</label>
              <input type="text" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}
              placeholder={currentSelect.description}/>
            </form>

            <div className="buttons-container">
              <button className="update" onClick={update}>Обновить</button>
              <button className="delete" onClick={deleteSelected}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {modalAdd && (
        <div className="modal">
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>Добавить {currentType === "category" ? "категорию" : currentType === "brand" ? "бренд" : "товар"}</h2>
            
            <form>
              <label htmlFor="name">Название</label>
              <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
              <label htmlFor="description">Описание</label>
              <input type="text" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
            </form>

            <div className="buttons-container">
              <button className="update" onClick={add}>Создать</button>
            </div>
          </div>
        </div>
      )}

      {modalEditProduct && (
        <div className="modal">
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>Редактировать товар {currentSelect.id}</h2>
            
            <form>
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}><label htmlFor="name">Название</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)}
                      placeholder={currentSelect.name}/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}><label htmlFor="description">Описание</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}
                      placeholder={currentSelect.description}/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}><label htmlFor="image">Ссылка на изображение</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="image" value={imageLink} onChange={(e)=>setImageLink(e.target.value)}
                      placeholder={currentSelect.image}/>
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="category_id">ID категории</label></td>
                    <td><label htmlFor="brand_id">ID бренда</label></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="number" id="category_id" value={categoryID} onChange={(e)=>setCategoryID(e.target.value)}
                      placeholder={currentSelect.category_id}/>
                    </td>
                    <td>
                      <input type="number" id="brand_id" value={brandID} onChange={(e)=>setBrandID(e.target.value)}
                      placeholder={currentSelect.brand_id}/>
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="price">Цена</label></td>
                    <td><label htmlFor="stock">Количество</label></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="number" id="price" value={cost} onChange={(e)=>setCost(e.target.value)}
                      placeholder={currentSelect.cost_per_unit}/>
                    </td>
                    <td>
                      <input type="number" id="stock" value={stock} onChange={(e)=>setStock(e.target.value)}
                      placeholder={currentSelect.stock_quantity}/>
                    </td>
                  </tr>
                </tbody>
              </table>

            </form>

            <div className="buttons-container">
              <button className="update" onClick={update}>Обновить</button>
              <button className="delete" onClick={deleteSelected}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {modalAddProduct && (
        <div className="modal">
          <div className="overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <h2>Новый товар</h2>
            
            <form>
              <table>
                <tbody>
                  <tr>
                    <td colSpan={2}><label htmlFor="name">Название</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="name" value={name} onChange={(e)=>setName(e.target.value)}/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}><label htmlFor="description">Описание</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="description" value={description} onChange={(e)=>setDescription(e.target.value)}/>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}><label htmlFor="image">Ссылка на изображение</label></td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <input type="text" id="image" value={imageLink} onChange={(e)=>setImageLink(e.target.value)}/>
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="category_id">ID категории</label></td>
                    <td><label htmlFor="brand_id">ID бренда</label></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="number" id="category_id" value={categoryID} onChange={(e)=>setCategoryID(e.target.value)}/>
                    </td>
                    <td>
                      <input type="number" id="brand_id" value={brandID} onChange={(e)=>setBrandID(e.target.value)}/>
                    </td>
                  </tr>
                  <tr>
                    <td><label htmlFor="price">Цена</label></td>
                    <td><label htmlFor="stock">Количество</label></td>
                  </tr>
                  <tr>
                    <td>
                      <input type="number" id="price" value={cost} onChange={(e)=>setCost(e.target.value)}/>
                    </td>
                    <td>
                      <input type="number" id="stock" value={stock} onChange={(e)=>setStock(e.target.value)}/>
                    </td>
                  </tr>
                </tbody>
              </table>

            </form>

            <div className="buttons-container">
              <button className="update" onClick={add}>Создать</button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  ) 
}

export default AdminProducts