import React, { useContext } from "react"
import { Context } from "../../context"

const ContactInfo = ({ props }) => {
    const [{ contactInfo }, dispatch] = useContext(Context)
    // bind inputs
    const handleInfoInput = e => {
        const { name, value } = e.target
        dispatch({
            type: "setContactInfo",
            data: { ...contactInfo, [name]: value },
        })
    }

    return (
        <div className="contact-info">
            <div className="contact-info__info__item flying-label-item">
                <input
                    className="flying-label-item__input contact-info__input"
                    type="text"
                    name="user-name"
                    id="user-name"
                    value={contactInfo["user-name"]}
                    onChange={handleInfoInput}
                    required
                />
                <label
                    className="flying-label-item__label contact-info__label"
                    htmlFor="user-name">
                    Name
                </label>
            </div>
            <div className="contact-info__info__item flying-label-item">
                <input
                    className="flying-label-item__input contact-info__input"
                    type="email"
                    name="user-email"
                    id="user-email"
                    value={contactInfo["user-email"]}
                    onChange={handleInfoInput}
                    required
                />
                <label
                    className="flying-label-item__label contact-info__label"
                    htmlFor="user-email">
                    Email
                </label>
            </div>
            <div className="contact-info__info__item flying-label-item">
                <input
                    className="flying-label-item__input contact-info__input"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    name="user-cell"
                    id="user-cell"
                    value={contactInfo["user-cell"]}
                    onChange={handleInfoInput}
                    required
                />
                <label
                    className="flying-label-item__label contact-info__label"
                    htmlFor="user-cell">
                    Phone
                </label>
            </div>
        </div>
    )
}

export default ContactInfo
