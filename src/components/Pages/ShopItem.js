import React from "react"
import { Link } from "react-router-dom"
import { formatString } from "../../utils/formatString"

const ShopItem = ({ image, name, altText }) => (
    <Link className="shop-item" to={`/shop/${formatString(name, "kebab")}`}>
        <div className="shop-item__image-container">
            <img className="shop-item__image" src={image} alt={altText} />
            <h3 className="shop-item__name">{name}</h3>
        </div>
    </Link>
)

export default ShopItem
