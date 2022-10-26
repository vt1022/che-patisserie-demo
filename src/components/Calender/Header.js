import React from 'react'

export default function Header({ currMonth, currPage, setCurrPage, maxPages }) {
    
    const changePage = direction => {
        if (direction === 'next' && currPage < maxPages) setCurrPage(++currPage)
        if (direction === 'prev' && currPage > 0) setCurrPage(--currPage)
    }

    return (
        <div className='calendar__header'>
            <button
                className={`calendar__header__button ${currPage === 0 ? 'calendar__disabled' : ''}`}
                onClick={e => changePage('prev')}>{`<<`}</button>
            <h3>{currMonth}</h3>
            <button
                className={`calendar__header__button ${currPage === maxPages ? 'calendar__disabled' : ''}`}
                onClick={e => changePage('next')}>{`>>`}</button>
        </div>
    )
}
