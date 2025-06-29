import React, { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ReactComponent as AddIcon} from '../../../../Resources/Icons/add.svg'
import { ReactComponent as RemoveIcon} from '../../../../Resources/Icons/remove.svg'
import { ReactComponent as InfoIcon} from '../../../../Resources/Icons/info.svg'
import { ReactComponent as AddCartIcon} from '../../../../Resources/Icons/add_shopping_cart.svg'
import { PreduContext } from "../../../../PreduContext"


const ShopProduct = (props) => {
  let navigate = useNavigate();
  const { cart, setCartProductQuantity } = useContext(PreduContext)
  const [ quantity, setQuantity] = useState(props.data ? cart[props.data.id] : 0)

  if (!props.data) {
    return null; // Return null if data is not yet available
  }

  const { id, name, brand, brand_id, category, category_id, description, image, stock_quantity, cost_per_unit } = props.data;

  const handleChange = event => {
    if (isNaN(event.target.value)) {
      setQuantity(0)
    }
    else if (event.target.value >= 0) {
      setQuantity(event.target.value);
    }
  }

  const minus = () => {
    if (isNaN(quantity)) {
      setQuantity(0)
    }
    if (quantity > 0) {
      setQuantity(parseInt(quantity) - 1)
    }
  }

  const plus = () => {
    if (isNaN(quantity)) {
      setQuantity(0)
    }
    setQuantity(parseInt(quantity) + 1)
  }

  const toProductDetails = () => {
    window.scrollTo(0, 0)
    navigate('/Product', {
      state : {
          id: id,
          name: name,
          brand: brand,
          brand_id: brand_id,
          category: category,
          category_id: category_id,
          description: description,
          image: image,
          stock_quantity: stock_quantity,
          cost_per_unit: cost_per_unit
      },
  });
  }
  
  return (
    <div className="shop-product">
      <img src={image} alt="изображение товара" />
      <div className="product_title">
        <h3>
          <b>{brand}</b>
        </h3>
        <h4>
          <b>{name}</b>
        </h4>
      </div> 
      <h4 className="product_price">
        <i><b>{cost_per_unit.toLocaleString("en-US")} ₸</b></i>
      </h4>
      <p className="desc">{description}</p>
      <div className="product_counter">
        <button className="minus" onClick={minus}>
          <RemoveIcon className="icon"/>
        </button>
        <input type="number" placeholder={quantity} min={0} value={quantity} onChange={handleChange}/>
        <button className="plus" onClick={plus}>
          <AddIcon className="icon"/>
        </button>
      </div>
      
      <div className="buttons">
        <button className="product-detail-button" onClick={toProductDetails} title="Подробнее">
          <InfoIcon className="icon"/>
        </button>
        <button className="add-cart-button" onClick={() => {setCartProductQuantity(id, quantity)}} title="В корзину">
          <AddCartIcon className="icon"/>
        </button>
      </div>
    </div>
  )
}

export default ShopProduct