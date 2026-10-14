import axios from "axios"
import { useUserStore } from "../store/useUserStore"

const apiInstance = axios.create({
    baseURL: "https://api.kitek-pg.ru/api/marketplace/",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
})
apiInstance.interceptors.request.use((config) => {
    const { session } = useUserStore.getState()
    if (session?.token) {
        config.headers.Authorization = `bearer ${session.token}`
    }
     return config
})

apiInstance.interceptors.request.use((config) => {
    const { session } = useUserStore.getState()

    if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`
    }

    return config
})

const registerUser = async (dtn) => {
    const res = await apiInstance.post("/auth/register", dtn)
    return res
}

const loginUser = async (dtn) => {
    const res = await apiInstance.post("/auth/login", dtn)
    return res
}

const sendItems = async (item) => {
    const res = await apiInstance.post("/items", item)
    return res.data
}
const getItems = async () => {
    const res = await apiInstance.get('/items')
    return res.data
}
export const api = {
    registerUser,
    loginUser,
    sendItems,
    getItems,
}