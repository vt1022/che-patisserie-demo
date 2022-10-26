const Footer = () => {
    const handleEmailClick = e => {
        navigator.clipboard.writeText(e.target.innerText)
    }
    return (
        <footer className="footer">
            <div className="wrapper">
                <div className="footer__links">
                    <a
                        className="footer__links__social link"
                        href="https://www.instagram.com/che.macarons/"
                        target="_blank"
                        rel="noreferrer">
                        Instagram
                    </a>
                    <a
                        className="footer__links__social link"
                        href="https://www.facebook.com/Che%CC%81-Macarons-103907881854600"
                        target="_blank"
                        rel="noreferrer">
                        Facebook
                    </a>
                    <p className="footer__email" onClick={handleEmailClick}>
                        macarons@chepatisserie.com <i className="far fa-copy" aria-hidden="true"></i>
                    </p>
                </div>

                <div className="footer__delivery">
                    <p className="delivery-options__p">
                        $7 delivery within this{" "}
                        <a
                            className="footer__links__social link"
                            href="https://www.google.com/maps/d/u/0/edit?mid=1aUrtlRxe7HBX87pm3d9JTY_7e7IcCDJq&usp=sharing"
                            target="_blank"
                            rel="noreferrer">
                            MAP
                        </a>
                    </p>
                    <p className="delivery-options__p">
                        <a
                            className="footer__links__social link"
                            href="https://www.instagram.com/che.macarons/"
                            target="_blank"
                            rel="noreferrer">
                            DM
                        </a>{" "}
                        for quote outside our area
                    </p>
                </div>
                <div className="footer__pickup">
                    <p className="delivery-options__p">Pickup Location: </p>
                    <a
                        className="form__method__link link"
                        href="https://goo.gl/maps/1V6Gfqj2T31BUfjWA"
                        target="_blank"
                        rel="noreferrer">
                        First Markham Place
                    </a>
                </div>
            </div>

            <div className="footer__credit">
                <p className="footer__credit__text">
                    © 2021,{" "}
                    <a className="link" target="_blank" rel="noreferrer" href="https://twitter.com/vinccimantsui">
                        Vincci T
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default Footer
