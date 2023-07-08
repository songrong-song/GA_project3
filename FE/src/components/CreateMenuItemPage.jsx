import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function() {

    // create state to store form data

    const handleSubmit = (e) => {
        e.preventDefault()

        // TODO: FE data validation

        // make and API call to backend menu item create endpoint

        // handle the api response:
        //  - successful: console.log success
        //  - failure: console.log failure

        console.log(123)
    }

    return (
        <div className="container">
            <h2>Create Item</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            
        </div>
    )
}
 