import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import Navbar from './Navbar';

export default function Country(props) {

    const [countryfield, setCountryfield] = useState("");
    const [country, setCountry] = useState([]);
    const [id, setId] = useState(null);

    const authToken=localStorage.getItem("jwt");


    useEffect(() => {
        document.title = props.heading;
        fetchData();
    }, [props.heading]);

    const fetchData = () => {

        fetch("http://localhost:5000/countrydata", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `${authToken}` },

            body:JSON.stringify({authToken:authToken,}),
        })
            .then((res) => res.json())
            .then((data) => {
                setCountry(data.country);
            });
    };

    const fetchCountryData = async (id) => {
        let result = await fetch(`http://localhost:5000/country/${id}`,{
            headers: {"Authorization": `${authToken}`}
        });
        if (result) {
            let data = await result.json();
            setCountryfield(data.country.country);
            setId(data.country._id);
        } else {
            setCountryfield("");
            setId(null);
        }
    };

    const resetdata = () => {
        setCountryfield("");
        setId(null);
    }

    const submitCountry = async (e) => {
        console.log(authToken);
        try {
            let countryData = {
                country: countryfield
            }
            e.preventDefault();
            const response = await fetch("http://localhost:5000/country", {
                method: 'POST',
                body: JSON.stringify(countryData),
                headers: { "Content-Type": "application/json", "Authorization": `${authToken}` }
            });
            const data = await response.json();
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message,
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#008000"
                })
                fetchData();
                resetdata();
                document.getElementById("closeButton").click();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#FF0000"
                })
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err,
                confirmButtonText: "Okay",
                confirmButtonColor: "#FF0000"
            })
        }
    }

    const updateCountry = async (e) => {
        e.preventDefault();
        try {
            const countryData = {
                country: countryfield
            }
            const result = await fetch(`http://localhost:5000/country/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${authToken}`
                },
                body: JSON.stringify(countryData)
            });
            const data = await result.json();
            if (result.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: data.message,
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#008000"
                })
                fetchData();
                document.getElementById("closeButton").click();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.message,
                    confirmButtonText: "Okay",
                    confirmButtonColor: "#FF0000"
                })
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err,
                confirmButtonText: "Okay",
                confirmButtonColor: "#FF0000"
            })
        }
    }

    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:5000/api/state/${id}`, {
            method: "GET",
            headers: {"Authorization": `${authToken}`}
        });

        const stateData = await res.json();
        if (stateData.state.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "This country belongs to any state",
                confirmButtonText: "Okay",
                confirmButtonColor: "#FF0000"
            })
        } else {
            await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await fetch(`http://localhost:5000/country/${id}`, {
                        method: "DELETE",
                        headers: {"Authorization": `${authToken}`}
                    });
                    const data = await response.json();
                    if (response.ok) {
                        Swal.fire({
                            icon: "success",
                            title: "Success",
                            text: data.message,
                            confirmButtonText: "Okay",
                            confirmButtonColor: "#008000"
                        });
                        fetchData();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: data.message,
                            confirmButtonText: "Okay",
                            confirmButtonColor: "#FF0000"
                        })
                    }
                }
            });
        }
    }

    return (
        <>
            <Navbar />

            <div className="modal fade" id="countryModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="countryModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="countryModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="countryForm" onSubmit={id ? updateCountry : submitCountry}>
                                <div className="mb-3">
                                    <label htmlFor="countryName" className="form-label">Country:</label>
                                    <input
                                        type="text"
                                        className="form-control outline-none"
                                        name="countryName"
                                        id="countryName"
                                        value={countryfield}
                                        onChange={e => setCountryfield(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Submit
                                </button>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" id='closeButton' data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="modalButton text-end">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#countryModal" onClick={resetdata}>
                        Add
                    </button>
                </div>

                <div
                    className="table-responsive mt-3"
                    style={{ clear: "both" }}
                >
                    <table
                        className="table table-bordered"
                    >
                        <thead>
                            <tr>
                                <th scope="col">Sr. No</th>
                                <th scope="col">Country</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                country?.map((i, k) => {
                                    return (
                                        <tr key={i._id}>
                                            <td>{k + 1}</td>
                                            <td>{i.country}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#countryModal" onClick={() => fetchCountryData(i._id)}>
                                                    Update
                                                </button>

                                                <button type="button" className='btn btn-danger ms-2' onClick={() => handleDelete(i._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}
