import React, { useContext } from "react"
import { nextOrderDates } from "../../../utils/getDates"
import Flavours from "../Flavours"
import { Context } from "../../context/index"
import moment from "moment"

const AllFlavours = props => {
    const [{ flavours }] = useContext(Context)

    const getNames = (acc, curr) => {
        acc.push(curr["Flavour"])
        return acc
    }

    const upcomingFlavours = () => {
        const result = []

        nextOrderDates(flavours.weekly).forEach(week => {
            result.push(flavours.weekly.filter(entry => entry["Date"] === week))
        })

        return result
    }

    const allFlavourNames = flavours.all.reduce(getNames, [])

    const weeklyFlavourNames = upcomingFlavours().reduce((acc, curr) => {
        acc.push(curr.reduce(getNames, []))
        return acc
    }, [])

    const otherFlavourNames = allFlavourNames.filter(item => !weeklyFlavourNames.includes(item))

    const otherFlavours = flavours.all.filter(item => otherFlavourNames.includes(item["Flavour"])).reverse()

    return (
        <>
            <section className="all-flavours">
                <div className="wrapper">
                    <h2>Our Flavours</h2>
                    <div className="all-flavours__gallery">
                        {upcomingFlavours().map((flavoursArr, i) => (
                            <Flavours
                                key={i}
                                className={`${i}`}
                                h2={`${moment(nextOrderDates(flavours.weekly)[i]).format("MMM Do")}`}
                                weeklyFlavours={flavoursArr}
                            />
                        ))}
                        <Flavours h2="All Others" allFlavours={otherFlavours} />
                    </div>
                </div>
            </section>
        </>
    )
}

export default AllFlavours
