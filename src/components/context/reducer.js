export const reducer = (state, action) => {
    const pushToLocalState = () => {
        const getCircularReplacer = () => {
            const seen = new WeakSet()
            return (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return
                    }
                    seen.add(value)
                }
                return value
            }
        }
        sessionStorage.setItem('state', JSON.stringify(state, getCircularReplacer()))
    }

    const newState = []
    switch (action.type) {
        case 'setOrderCount':
            newState.push({
                ...state,
                orderCount: action.data
            })
            break
        case 'setDate':
            newState.push({
                ...state,
                date: action.data
            })
            pushToLocalState()
            break
        case 'setMatchedCoupon':
            newState.push({
                ...state,
                matchedCoupon: action.data
            })
            pushToLocalState()
            break
        case 'setCoupon':
            newState.push({
                ...state,
                couponCode: action.data
            })
            pushToLocalState()
            break
        case 'setContactInfo':
            newState.push({
                ...state,
                contactInfo: action.data
            })
            pushToLocalState()
            break
        case 'setPickup':
            newState.push({
                ...state,
                pickup: action.data
            })
            pushToLocalState()
            break
        case 'setAddress':
            newState.push({
                ...state,
                deliveryAddress: action.data
            })
            pushToLocalState()
            break
        case 'setPickupOptions':
            newState.push({
                ...state,
                pickupOptions: action.data
            })
            pushToLocalState()
            break
        case 'setDelivery':
            newState.push({
                ...state,
                delivery: action.data
            })
            pushToLocalState()
            break
        case 'setTotal':
            newState.push({
                ...state,
                total: action.data
            })
            pushToLocalState()
            break
        case 'setPrices':
            newState.push({
                ...state,
                prices: action.data
            })
            pushToLocalState()
            break
        case 'selectedFlavour':
            newState.push({
                ...state,
                selectedFlavour: action.data
            })
            pushToLocalState()
            break
        case 'loading':
            newState.push({
                ...state,
                loading: action.data
            })
            break
        case 'toggleNav':
            newState.push({
                ...state,
                showHamburger: !state.showHamburger
            })
            break
        case 'setCouponList':
            newState.push({
                ...state,
                couponList: action.data
            })
            break
        case 'setBulkCalendar':
            newState.push({
                ...state,
                bulkCalendar: action.data
            })
            break
        case 'setCart':
            newState.push({
                ...state,
                cart: action.data
            })
            pushToLocalState()
            break
        case 'setCheckout':
            newState.push({
                ...state,
                checkout: action.data
            })
            break
        case 'setFlavours':
            newState.push({
                ...state,
                flavours: action.data
            })
            pushToLocalState()
            break
        default:
            newState.push(null)
            break
    }
    return newState[0]
}

// const initialCart = state => {
//     const weeklyCart = {
//         'Box of 5': [],
//         'MAC-A-GRAM': [],
//         'Batch of 12': [],
//         'Catering + Bulk': []
//     }

//     const result = nextOrderDates(state.flavours.weekly).reduce((acc, curr) => {
//         if (!acc[curr]) acc[curr] = weeklyCart
//         return acc
//     }, {})

//     return result
// }

const localStateOverride = () => {
    // const localState = JSON.parse(sessionStorage.getItem('state'))
    // const cart = { ...localState.cart }

    // if (!localState.cart[thisSaturday()]) {
    //     cart[thisSaturday()] = {
    //         "Box of 5": [],
    //         "MAC-A-GRAM": [],
    //         "Batch of 12": [],
    //         "Catering + Bulk": []
    //     }
    // }
    // if (!localState.cart[nextSaturday()]) {
    //     cart[nextSaturday()] = {
    //         "Box of 5": [],
    //         "MAC-A-GRAM": [],
    //         "Batch of 12": [],
    //         "Catering + Bulk": []
    //     }
    // }

    return {
        loading: false,
        showHamburger: false
    }
}
// maybe sessionStorage --sensei Hairbear
export const initialState = sessionStorage.getItem('state')
    ? {
          ...JSON.parse(sessionStorage.getItem('state')),
          ...localStateOverride()
      }
    : {
          loading: false,
          showHamburger: false,
          flavours: { all: [], weekly: [] },
          selectedFlavour: '',
          cart: {
              //   [thisSaturday()]: {
              //       "Box of 5": [],
              //       "MAC-A-GRAM": [],
              //       "Batch of 12": [],
              //       "Catering + Bulk": []
              //   },
              //   [nextSaturday()]: {
              //       "Box of 5": [],
              //       "MAC-A-GRAM": [],
              //       "Batch of 12": [],
              //       "Catering + Bulk": []
              //   }
          },
          prices: [],
          total: 0,
          delivery: 'delivery',
          pickupOptions: [],
          bulkCalendar: [],
          deliveryAddress: '',
          pickup: {},
          contactInfo: {
              'user-name': '',
              'user-email': '',
              'user-cell': ''
          },
          couponCode: '',
          couponList: [],
          matchedCoupon: { Code: '', Amount: '', Type: '' },
          date: '00/00/00',
          orderCount: {}
      }
