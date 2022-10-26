import React, { useContext, useEffect, useMemo } from 'react'
import { Context } from '../../context/index'
import { formatString } from '../../../utils/formatString'
import { thisSaturday, nextSaturday, nextOrderDates } from '../../../utils/getDates'
import { Link } from 'react-router-dom'
import Flavours from '../Flavours'
import moment from 'moment'

const FlavourInfo = () => {
    const [{ selectedFlavour, flavours }, dispatch] = useContext(Context)
    const currFlavour = useMemo(
        () => flavours.all.find(item => item['Flavour'].includes(selectedFlavour)) || {},
        [flavours.all, selectedFlavour]
    )
    const className = formatString(selectedFlavour, 'kebab')

    const getNames = (acc, curr) => {
        acc.push(curr['Flavour'])
        return acc
    }
    const [flavourNamesThisWeek, flavourNamesNextWeek] = [
        flavours.weekly.filter(entry => entry['Date'] === thisSaturday('MM/DD/YYYY')).reduce(getNames, []),
        flavours.weekly.filter(entry => entry['Date'] === nextSaturday('MM/DD/YYYY')).reduce(getNames, [])
    ]
    const upcomingFlavours = () => {
        const result = []

        nextOrderDates(flavours.weekly).forEach(week => {
            result.push(flavours.weekly.filter(entry => entry['Date'] === week))
        })

        return result
    }

    useEffect(() => {
        dispatch({ type: 'selectedFlavour', data: currFlavour['Flavour'] })
    }, [currFlavour, dispatch])

    return (
        <div className={`flavour-info flavour-info--${className} page`}>
            <div className='wrapper'>
                <div className='flavour-info__grid'>
                    <div className='flavour-info__image-container'>
                        <img src={currFlavour['Image']} alt={`${currFlavour['Flavour'] || ''} macaron`} />
                    </div>
                    <div className='flavour-info__description'>
                        <h2>{selectedFlavour}</h2>
                        <p className='flavour-info__p'>
                            {currFlavour['Description'] ||
                                'Sorry.. We are still thinking of the perfect way to describe this flavour. Please check back later!'}
                        </p>
                        <Link className='flavour-info__btn flavour-info__btn--question btn' to='/shop'>
                            {' '}
                            Shop Now
                        </Link>
                    </div>
                    {upcomingFlavours().map((flavoursArr, i) => (
                        <Flavours
                            key={i}
                            className={`${i}`}
                            h2={`${moment(nextOrderDates(flavours.weekly)[i]).format('MMM Do')} Flavours`}
                            weeklyFlavours={flavoursArr}
                        />
                    ))}
                    {!flavourNamesThisWeek.includes(selectedFlavour) && !flavourNamesNextWeek.includes(selectedFlavour) && (
                        <Flavours className='flavour-info' h2='Other Flavours' allFlavours={flavours.all} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default FlavourInfo
