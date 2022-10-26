import React, { useState, useEffect, useCallback } from "react"
import { useEmblaCarousel } from "embla-carousel/react"
import { PrevButton, NextButton } from "./EmblaCarouselButtons"
import { horizontalMediaByIndex, verticalMediaByIndex } from "../../assets/carousel/index"

const PARALLAX_FACTOR = 1.2

const EmblaCarousel = ({ slides }) => {
    const [viewportRef, embla] = useEmblaCarousel({
        loop: true,
        dragFree: false
    })
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
    const [parallaxValues, setParallaxValues] = useState([])
    const [width, setWidth] = useState(0)

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])

    const onSelect = useCallback(() => {
        if (!embla) return
        setPrevBtnEnabled(embla.canScrollPrev())
        setNextBtnEnabled(embla.canScrollNext())
    }, [embla])

    const onScroll = useCallback(() => {
        if (!embla) return

        const engine = embla.dangerouslyGetEngine()
        const scrollProgress = embla.scrollProgress()

        const styles = embla.scrollSnapList().map((scrollSnap, index) => {
            if (!embla.slidesInView().includes(index)) return 0
            let diffToTarget = scrollSnap - scrollProgress

            if (engine.options.loop) {
                engine.slideLooper.loopPoints.forEach(loopItem => {
                    const target = loopItem.getTarget()
                    if (index === loopItem.index && target !== 0) {
                        const sign = Math.sign(target)
                        if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress)
                        if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress)
                    }
                })
            }
            return diffToTarget * (-1 / PARALLAX_FACTOR) * 100
        })
        setParallaxValues(styles)
    }, [embla, setParallaxValues])

    useEffect(() => {
        if (!embla) return
        onSelect()
        onScroll()
        embla.on("select", onSelect)
        embla.on("scroll", onScroll)
        embla.on("resize", onScroll)
    }, [embla, onSelect, onScroll])

    useEffect(() => {
        setWidth(window.innerWidth)
        window.addEventListener("resize", () => setWidth(window.innerWidth))
    }, [])

    return (
        <div className="embla">
            <div className="embla__viewport" ref={viewportRef}>
                <div className="embla__container">
                    {slides.map(index => (
                        <div className="embla__slide" key={index}>
                            <div className="embla__slide__inner">
                                <div
                                    className="embla__slide__parallax"
                                    style={{ transform: `translateX(${parallaxValues[index]}%)` }}>
                                    <img
                                        className="embla__slide__img"
                                        src={width > 800 ? horizontalMediaByIndex(index) : verticalMediaByIndex(index)}
                                        alt="A cool cat."
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
            <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />
        </div>
    )
}
export default EmblaCarousel
