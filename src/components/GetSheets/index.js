import React, { useContext, useEffect } from 'react'
import { Context } from '../context'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import {
    CLIENT_EMAIL,
    PRIVATE_KEY,
    SPREADSHEET_ID,
    MAC_FLAVOURS_SHEET_ID,
    WEEKLY_FLAVOURS_SHEET_ID,
    GOOGLE_PRICES_SHEET_ID,
    GOOGLE_DELIVERY_ID,
    GOOGLE_ORDERS_ID,
    GOOGLE_COUPONS_ID,
    GOOGLE_BULK_CALENDAR_ID
} from '../../utils/configs'
import { nextOrderDates } from '../../utils/getDates'

function GetSheets({ setCheckout }) {
    const [{ loading, flavours, cart }, dispatch] = useContext(Context)

    useEffect(() => {
        // set a default image for flavours
        flavours.all.forEach(item => {
            const validExtensions = ['jpg', 'png']
            const extension = (item['Image'] && item['Image'].split('.').reverse()[0]) || ''

            if (!Boolean(item['Image']) || !validExtensions.includes(extension.toLowerCase())) {
                item['Image'] = 'https://imgur.com/hY9uaS2.jpg'
            }
        })

        if (Object.keys(cart).length === 0) {
            const initialCart = () => {
                const weeklyCart = {
                    'Box of 5': [],
                    'MAC-A-GRAM': [],
                    'Batch of 12': [],
                    'Catering + Bulk': []
                }

                const result = nextOrderDates(flavours.weekly).reduce((acc, curr) => {
                    if (!acc[curr]) acc[curr] = weeklyCart
                    return acc
                }, {})

                return result
            }

            dispatch({ type: 'setCart', data: initialCart() })
            setCheckout(initialCart())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flavours])

    useEffect(() => {
        const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
        let isCancel = false
        const getGoogleSheets = async () => {
            try {
                dispatch({ type: 'loading', data: true })

                await doc.useServiceAccountAuth({
                    client_email: CLIENT_EMAIL,
                    private_key: PRIVATE_KEY
                })
                // loads document properties and worksheets
                await doc.loadInfo()
                // get data in each row as objects in an array
                const weekly = await doc.sheetsById[WEEKLY_FLAVOURS_SHEET_ID].getRows()
                if (!isCancel) {
                    dispatch({
                        type: 'setFlavours',
                        data: {
                            all: await doc.sheetsById[MAC_FLAVOURS_SHEET_ID].getRows(),
                            weekly: weekly
                        }
                    })

                    dispatch({
                        type: 'setPrices',
                        data: await doc.sheetsById[GOOGLE_PRICES_SHEET_ID].getRows()
                    })

                    dispatch({
                        type: 'setPickupOptions',
                        data: await doc.sheetsById[GOOGLE_DELIVERY_ID].getRows()
                    })

                    dispatch({
                        type: 'setCouponList',
                        data: await doc.sheetsById[GOOGLE_COUPONS_ID].getRows()
                    })

                    dispatch({
                        type: 'setBulkCalendar',
                        data: (await doc.sheetsById[GOOGLE_BULK_CALENDAR_ID].getRows()).reduce((acc, curr) => {
                            const monthToInteger = month => {
                                const translator = [
                                    'january',
                                    'feburary',
                                    'march',
                                    'april',
                                    'may',
                                    'june',
                                    'july',
                                    'august',
                                    'september',
                                    'october',
                                    'november',
                                    'december'
                                ]
                                for (let i = 0; i < translator.length; i++) {
                                    if (month.toLowerCase() === translator[i]) return i + 1
                                }
                            }
                            const monthYear = curr._rawData.shift()
                            const month = monthToInteger(monthYear.split(' ')[0].toLowerCase()).toLocaleString('en-US', {
                                minimumIntegerDigits: 2
                            })
                            const year = `20${monthYear.split(' ')[1]}`

                            const formattedDate = `${year}-${month}-01`

                            acc[formattedDate] = curr._rawData
                            return acc
                        }, {})
                    })

                    dispatch({
                        type: 'setOrderCount',
                        data: (await doc.sheetsById[GOOGLE_ORDERS_ID].getRows()).reduce((acc, curr) => {
                            // count the number of orders per date
                            if (
                                curr['Date'] === '' ||
                                curr['Date'] === undefined ||
                                curr['Name'].toLowerCase() === 'total:' ||
                                curr['Name'].toLowerCase() === 'total' ||
                                curr['Name'] === undefined
                            ) {
                                return acc
                            } else if (acc[curr['Date']] === undefined) {
                                acc[curr['Date']] = 1
                            } else if (acc[curr['Date']] > 0) {
                                acc[curr['Date']] += 1
                            }
                            return acc
                        }, {})
                    })

                    dispatch({
                        type: 'setDate',
                        data: nextOrderDates(weekly)[0]
                    })
                }
            } catch (e) {
                if (!isCancel) {
                    console.error('Error: ', e)
                }
            } finally {
                dispatch({ type: 'loading', data: false })
            }
        }
        getGoogleSheets()

        return () => {
            isCancel = true
        }
    }, [dispatch])

    return (
        <div className={loading ? 'overlay--loading' : 'hide'}>
            <div className={loading ? 'loading' : 'hide'} aria-label='site is loading' />
        </div>
    )
}

export default GetSheets
