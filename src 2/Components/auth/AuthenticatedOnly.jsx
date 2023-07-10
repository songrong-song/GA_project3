import {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import { DateTime } from 'luxon'
import {AuthContext} from './AuthProvider'

function Authenticated(props) {

    const {getUserFromToken, logoutSuccess} = useContext(AuthContext)

    const user = getUserFromToken()

    if (!user) {
        return (
            <Navigate to={'/login'} />
        )
    }

    const now = DateTime.now().toUnixInteger()

    if (user.exp && user.exp < now) {
        logoutSuccess()
        return (
            <Navigate to={'/login'} />
        )
    }

    return (
        <props.component></props.component>
    )

}

export default Authenticated