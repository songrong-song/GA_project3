import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

export default function() {
    // create state to store form data
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
    })

    const {itemID} = useParams()

    useEffect(() => {
        axios.get('http://localhost:3000/api/menu-items/' + itemID)
            .then(response => {
                // store result in form state
                setFormData(response.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleFormChange = (e, fieldName) => {
        console.log(e.target.value)
        setFormData({...formData, [fieldName]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // TODO: FE data validation

        // make and API call to backend menu item update endpoint
        axios.patch('http://localhost:3000/api/menu-items/' + itemID, formData)
            .then(response => {
                console.log(response)
            })
            .catch(err => {
                console.log(err)
            })

        // handle the api response:
        //  - successful: console.log success
        //  - failure: console.log failure
    }

    return (
        <div className="container">
            <h2>Update Item</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={ (e) => { handleFormChange(e, 'name') } } />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={ (e) => { handleFormChange(e, 'price') } } />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
 