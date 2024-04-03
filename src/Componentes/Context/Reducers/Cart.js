import axios from "axios";
import { toast } from "react-toastify"
import ApiConnection from "../../Api/ApiConfig";
const URLConnection = ApiConnection()

export let cartInitialState = JSON.parse(localStorage.getItem('Cart')) || []; // Obtener el carrito del localStorage al cargar la página
let userId;
export const CART_ACTION_TYPES = {
    SET_CART: "SET_CART",
    ADD_TO_CART: "ADD_TO_CART",
    REMOVE_FROM_CART: "REMOVE_FROM_CART",
    CLEAR_CART: "CLEAR_CART"
}

export const updateLocalStorage = (state) => {
    localStorage.setItem(`Cart`, JSON.stringify(state))
}

const UPDATE_STATE_BY_ACTION = {
    [CART_ACTION_TYPES.SET_CART]: (state, action) => {
        const  data  = action.payload; // Actualiza el estado local (localStorage)
        updateLocalStorage(data)
    },
    [CART_ACTION_TYPES.ADD_TO_CART]: (state, action) => {
        const { id, amount } = action.payload
        const productInCartIndex = state.findIndex(item => item.id === id)
        if (productInCartIndex >= 0) {
            if (state[productInCartIndex].quantify + 1 > amount) {
                toast.warn("No hay suficiente stock disponible", {
                    className: 'mt-5 bottom-center'
                });
                return state;
            }
            const newState = structuredClone(state)
            newState[productInCartIndex].quantify += 1
            updateLocalStorage(newState)
            return newState
        }

        if (1 > amount) {
            toast.warn("No hay suficiente stock disponible", {
                className: 'mt-5 bottom-center'
            });
            return state;
        }

        const newState = [
            ...state, {
                ...action.payload,
                quantify: 1
            }
        ]
        updateLocalStorage(newState)
        return newState;

    },
    [CART_ACTION_TYPES.REMOVE_FROM_CART]: (state, action) => {
        const { id } = action.payload
        const newState = state.filter(item => item.id !== id)
        updateLocalStorage(newState)
        return newState
    },
    [CART_ACTION_TYPES.CLEAR_CART]: () => {
        return []
    }
}

export const cartReducer = (state, action) => {
    const { type: actionType } = action
    const updateState = UPDATE_STATE_BY_ACTION[actionType]
    return updateState ? updateState(state, action) : state
}


