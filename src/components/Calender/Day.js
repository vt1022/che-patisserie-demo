import React from 'react'
import { Link } from 'react-router-dom'

export default function Day({ day, disabledDays }) {
    const disabled = disabledDays?.includes(day) ? 'calendar__disabled' : ''

    return (
        <Link to={{ pathname: '/bulk-form', day: day }} className='nav__links__item'>
            <button className={`calendar__day ${disabled}`}>{day.format('D')}</button>
        </Link>
    )
}
