import { useContext } from "react"
import {AuthContext} from '../components/auth/AuthProvider'

export default function ProfilePage() {
    const {logoutSuccess} = useContext(AuthContext)

    return (
        <div className="container">
            <h2>Profile Page</h2>

            <p>Can only see if logged in</p>

            <button className="btn btn-danger" onClick={logoutSuccess}>Logout</button>
        </div>
    )
}
 