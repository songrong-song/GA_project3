import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import {AuthContext} from './AuthProvider'

function Guest(props) {

    const {getUserFromToken} = useContext(AuthContext)

    const user = getUserFromToken()

    if (user) {
        return (
            <Navigate to={'/profile'} />
        )
    }

    return (
        <props.component></props.component>
    )

}

export default Guest