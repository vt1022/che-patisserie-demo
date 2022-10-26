import React from "react"
import { reducer, initialState } from "./reducer"

export const Context = React.createContext([initialState, function dispatch() {}])

export const Provider = ({ children, key, initCart }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    return <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
}
