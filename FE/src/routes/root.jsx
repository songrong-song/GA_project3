import { useEffect, useState } from "react";
import axios from "axios";
import {Outlet} from "react-router-dom";

export default function Root() {
    const [menuItems, setMenuItems] = useState([])

    useEffect(() => {
        // make api call
        axios.get('http://localhost:3000/api/menu-items')
            .then(response => {
                console.log(response.data)
                setMenuItems(response.data)
            })
            .catch(err => {
                console.log('failed to fetch menu items')
            })
    }, [])

    return (
        <div className="page-root">
            <div className="container">
                <header className="site-header">

                    <h1 className="page-title">
                        Menu Items
                    </h1>

                </header>

                {menuItems.length > 0 ? (
                    <ul>
                        {menuItems.map(item => {
                            return (
                                <li>
                                    <h2>Name: {item.name}</h2>
                                    <p>Price: {item.price}</p>
                                    {item.image ? (
                                        <figure>
                                            <img src={item.image} className="img-fluid" style={{maxWidth: '250px'}} />
                                        </figure>
                                    ) : ''}
                                </li>
                            )
                        })}
                    </ul>
                ) : '' }

            </div>
        </div>
    );
}