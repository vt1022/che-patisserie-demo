import React, { useContext, useState } from 'react'
import moment from 'moment'
import { Context } from '../context/index'
import Header from './Header'
import Day from './Day'

export default function Calendar() {
    const [{ bulkCalendar }, dispatch] = useContext(Context)
    const [currPage, setCurrPage] = useState(0)

    const formattedDates = Object.keys(bulkCalendar)
    const firstDateOfCurrMonth = formattedDates[currPage]

    const startDay = moment(firstDateOfCurrMonth).clone().startOf('month').startOf('week')
    const endDay = moment(firstDateOfCurrMonth).clone().endOf('month').endOf('week')
    const iteratorDay = startDay.clone().subtract(1, 'day')
    const calendar = []

    while (iteratorDay.isBefore(endDay, 'day')) {
        calendar.push(
            Array(7)
                .fill(0)
                .map(() => iteratorDay.add(1, 'day').clone())
        )
    }

    return formattedDates.length < 1 ? (
        <div>Sorry, we are currently not taking bulk orders</div>
    ) : (
        <div className='calendar'>
            <Header
                currMonth={moment(firstDateOfCurrMonth).clone().format('MMMM YYYY')}
                maxPages={formattedDates.length - 1}
                setCurrPage={setCurrPage}
                currPage={currPage}
            />
            <div className='calendar__month'>
                {calendar.map(week =>
                    week.map((day, i) => <Day key={i} day={day} disabledDays={bulkCalendar[firstDateOfCurrMonth]} />)
                )}
            </div>
        </div>
    )

    // 0: "2022-11-01"
    // ​
    // 1: "2022-12-01"
    // ​
    // 2: "2023-01-01"

    // const startDays = () => {
    //     const result = []
    //     for (let i = 0; i < formattedDates.length; i++) {
    //         result.push(moment(formattedDates[i]).clone().startOf('month').startOf('week'))
    //     }
    //     return result
    // }
    // const endDays = () => {
    //     const result = []
    //     for (let i = 0; i < formattedDates.length; i++) {
    //         result.push(moment(formattedDates[i]).clone().endOf('month').endOf('week'))
    //     }
    //     return result
    // }
    // const iteratorDays = () => {
    //     const result = []
    //     for (let i = 0; i < startDays().length; i++) {
    //         result.push(startDays()[i].clone().subtract(1, 'day'))
    //     }
    //     return result
    // }
}
