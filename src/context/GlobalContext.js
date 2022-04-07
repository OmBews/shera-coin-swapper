import { createContext, useReducer } from "react";
import { AppReducer } from './AppReducer'

const initialState = {
    account: null, 
    blockchainData: null, 
    network: null,
}

export const GlobalContext = createContext(initialState)

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState)

    const delAccount = () => {
        dispatch({
            type: 'DELETE_ACCOUNT'
        })
    }

    const addAccount = (account) => {
        dispatch({
            type: 'ADD_ACCOUNT',
            payload: account.id
        })
    }

    const addNetwork = (network) => {
        dispatch({
            type: 'NETWORK', 
            payload: network
        })
    }

    const addBlockchain = (blockchainData) => {
        dispatch({
            type: 'LOAD_OLD_TOKENS', 
            payload: blockchainData
        })
    }

    return (
        <GlobalContext.Provider value={
            {
                account: state.account, 
                blockchainData: state.blockchainData,
                network: state.network,
                delAccount, 
                addAccount,
                addNetwork,
                addBlockchain
            }
        }
        >
            {children}
        </GlobalContext.Provider>
    )
}