import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/useUserStore'

const Logout = () => {

    const clrSession = useUserStore((state) => state.clearSession)

    const navigate = useNavigate()
    useEffect(() => {
        clrSession()
        navigate('/')
    }, [])
    return <></>
}

export default Logout
