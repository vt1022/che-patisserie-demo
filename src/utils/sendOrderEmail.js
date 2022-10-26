import emailjs from "emailjs-com"
import { EMAILJS_USER_ID } from "./configs"

const sendOrderEmail = e => {
    emailjs
        .sendForm(
            "cpgmail", // serviceID
            "template_wymwgmp", // email templateID
            e.target, // my form
            EMAILJS_USER_ID // userID
        )
        .then(
            result => console.log("sent", result.text),
            error => console.log("failed--", 'emailjs is not hooked up to the public version of this website')
        )
}

export default sendOrderEmail
