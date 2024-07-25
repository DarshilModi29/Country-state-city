import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';
import Navbar from './Navbar';

export default function State(props) {

    const [statefield, setStatefield] = useState("");
    const [countryfield, setCountryfield] = useState("");
    const [country, setCountry] = useState([]);
    const [state, setState] = useState([]);
    const [id, setId] = useState(null);
    const authToken=localStorage.getItem("jwt");

    useEffect(() => {
        document.title = props.heading;
        fetchData();
        fetchCountryData();
    }, [props.heading]);

    const fetchData = () => {
        fetch("http://localhost:5000/stateData", {
            method: "POST",
            headers: {"Authorization": `${authToken}`}
        })
            .then((res) => res.json())
            .then((data) => {
                setState(data.state);
                console.log(data.state);
            });
    };

    const fetchStateData = async (id) => {
        let result = await fetch(`http://localhost:5000/state/${id}`, {
            headers: {"Authorization": `${authToken}`}
        });
        if (result) {
            let data = await result.json();
            console.log(data);
            setStatefield(data.state.state);
            setCountryfield(data.state.country);
            setId(data.state._id);
        } else {
            setStatefield("");
            setCountryfield("");
            setId(null);
        }
    };

    const resetdata = () => {
        setStatefield("");
        setCountryfield("");
        setId(null);
    }

    const submitState = async (e) => {
        try {
            let stateData = {
                country: countryfield,
                state: statefield
            }
            e.preventDefault();
            const response = await fetch("http://localhost:5000/state", {
                method: 'POST',
                body: JSON.stringify(stateData),
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
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err,
                confirmButtonText: "Okay",
                confirmButtonColor: "#FF0000"
            })
        }
    }

    const updateState = async (e) => {
        e.preventDefault();
        try {
            const stateData = {
                country: countryfield,
                state: statefield
            }
            const result = await fetch(`http://localhost:5000/state/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    headers: {"Authorization": `${authToken}`}
                },
                body: JSON.stringify(stateData)
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

    const fetchCountryData = () => {
        fetch("http://localhost:5000/countrydata", {
            method: "POST",
            headers: {"Authorization": `${authToken}`}
        })
            .then((res) => res.json())
            .then((data) => {
                setCountry(data.country);
            });
    };

    const handleDelete = async (id) => {
        const res = await fetch(`http://localhost:5000/api/city/${id}`, {
            headers: {"Authorization": `${authToken}`}
        });

        const cityData = await res.json();
        if (cityData.city.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "This State is belonging to any city",
                confirmButtonText: "Okay",
                confirmButtonColor: "#FF0000"
            });
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
                    const response = await fetch(`http://localhost:5000/state/${id}`, {
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
                            <form onSubmit={id ? updateState : submitState}>
                                <div className="mb-3">
                                    <label htmlFor="cDropdown" className="form-label">Country</label>
                                    <select
                                        className="form-select outline-none"
                                        name="cDropdown"
                                        id="cDropdown"
                                        value={countryfield}
                                        onChange={(e) => setCountryfield(e.target.value)}
                                    >
                                        <option> Select One </option>
                                        {
                                            country?.map((i) => {
                                                return (
                                                    <option key={i._id} value={i._id}>{i.country}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="stateName" className="form-label">State:</label>
                                    <input
                                        type="text"
                                        className="form-control outline-none"
                                        name="stateName"
                                        id="stateName"
                                        value={statefield}
                                        onChange={e => setStatefield(e.target.value)}
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
                                <th scope="col">State</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {

                                state?.map((i, k) => {
                                    return (
                                        <tr key={i._id}>
                                            <td>{k + 1}</td>
                                            <td>{i.countryData[0] && i.countryData[0].country ? i.countryData[0].country : "Unknown"}</td>
                                            <td>{i.state}</td>
                                            <td>
                                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#countryModal" onClick={() => fetchStateData(i._id)}>
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
