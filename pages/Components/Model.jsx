import React, { useEffect, useRef, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

import SelectTo from "@/Components/SelectTo";
import Button from "@/Components/Button";
import Toastr from "@/Components/Toastr";
import Validate from "@/Components/Validate";

export default function Model({
    header,
    modelData,
    subject,
    Api,
    setValidate,
    setValidate2,
    csrf_token,
}) {
    const [processing, setprocessing] = useState(false);
    const [dataUsers, setdataUsers] = useState([]);
    const [dataStore, setdataStore] = useState([]);

    const handleAsync = async (tipe) => {
        if (tipe === "update") {
            var data = new FormData($("#modelForm")[0]);
            data.append("id", modelData?.data.id);
            try {
                await axios({
                    method: "POST",
                    url: Api + "/update",
                    data: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrf_token,
                    },
                }).then((res) => {
                    if (res.status === 200) {
                        if (res.data.response === "success") {
                            $("#close").trigger("click");
                            Toastr(res.data.response, res.data.message);
                            $("#DataTables").DataTable().ajax.reload();
                            $("#modelForm")[0].reset();
                            $(".is-valid").removeClass("is-valid");

                            setTimeout(() => {
                                setprocessing(false);
                            }, 5000);
                        } else {
                            Toastr(res.data.response, res.data.message);
                            setTimeout(() => {
                                setprocessing(false);
                            }, 5000);
                        }
                    } else {
                        Toastr(res.data.response, res.data.message);
                        setTimeout(() => {
                            setprocessing(false);
                        }, 5000);
                    }
                });
            } catch (error) {
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
                Toastr("error", error.message);
            }
        } else if (tipe === "delete") {
            try {
                await axios({
                    method: "POST",
                    url: Api + "/delete",
                    data: {
                        id: modelData?.data.id,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrf_token,
                    },
                }).then((res) => {
                    $("#close").trigger("click");
                    Toastr(res.data.response, res.data.message);
                    $("#DataTables").DataTable().ajax.reload();
                    setTimeout(() => {
                        setprocessing(false);
                    }, 5000);
                });
            } catch (error) {
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
                Toastr("error", error.message);
            }
        } else if (tipe === "view") {
            try {
                await axios({
                    method: "POST",
                    url: "api/store/all",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrf_token,
                    },
                }).then((res) => {
                    handleDataStore(res);
                });
            } catch (error) {
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        } else if (tipe === "uniquegroups") {
            try {
                await axios({
                    method: "POST",
                    url: "api/users/view",
                    data: {
                        uniquegroups: true,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrf_token,
                    },
                }).then((res) => {
                    handleDataUsers(res);
                });
            } catch (error) {
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        }
    };

    useEffect(() => {
        if (subject === "Groups") {
            handleAsync("uniquegroups");
            if (modelData) {
                modelData?.data.permission.map((val, i) => {
                    $(`#${val}Update`).prop("checked", true);
                });
            }
        }

        if (subject === "Employe") {
            handleAsync("view");
        }
    }, [modelData]);

    const handleDataUsers = (res) => {
        if (res.data) {
            setdataUsers(res.data.data);
        }
    };

    const handleDataStore = (res) => {
        let resData = [];
        res.data?.data.map((val, i) => {
            resData.push({
                value: val.id,
                label: val.name,
            });
        });
        setdataStore(resData);
    };

    const submit = (e) => {
        setprocessing(true);
        e.preventDefault();
        if (header === "Update") {
            if (Validate("#modelForm", setValidate, setValidate2)) {
                handleAsync("update");
            } else {
                setprocessing(false);
            }
        } else if (header === "Delete") {
            handleAsync("delete");
        }
    };

    const dataActive = [
        { value: "True", label: "Active" },
        { value: "False", label: "Non Active" },
    ];

    const dataTipe = [
        { value: "Office", label: "Office" },
        { value: "Outlet", label: "Outlet" },
        { value: "Dapur Produksi", label: "Dapur Produksi" },
        { value: "Logistik", label: "Logistik" },
        { value: "Khusus", label: "Khusus" },
    ];

    const selectReligion = [
        { value: "Islam", label: "Islam" },
        { value: "Kristen", label: "Kristen" },
        { value: "Katholik", label: "Katholik" },
    ];

    const selectGender = [
        { value: "Female", label: "Female" },
        { value: "Male", label: "Male" },
    ];

    const selectDivision = [
        { value: "Founder", label: "Founder" },
        { value: "Head Manager", label: "Head Manager" },
        { value: "Accounting", label: "Accounting" },
        { value: "Technology", label: "Technology" },
        {
            value: "Human Resource Development",
            label: "Human Resource Development",
        },
        { value: "Logistics", label: "Logistics" },
        { value: "Production Kitchen", label: "Production Kitchen" },
        { value: "Chief Leader", label: "Chief Leader" },
        { value: "Cashier", label: "Cashier" },
        { value: "Bartender", label: "Bartender" },
        { value: "Kitchen", label: "Kitchen" },
        { value: "Service Crew", label: "Service Crew" },
        { value: "Music", label: "Music" },
        { value: "Parking", label: "Parking" },
        ,
    ];

    const selectPosition = [
        { value: "Owner", label: "Owner" },
        {
            value: "CEO (Chief Executive Office) ",
            label: "CEO (Chief Executive Office) ",
        },
        {
            value: "COO (Chief Operating Officer) ",
            label: "COO (Chief Operating Officer) ",
        },
        {
            value: "CMO (Chief Marketing Officer)",
            label: "CMO (Chief Marketing Officer)",
        },
        {
            value: "CTO (Chief Technology Officer)",
            label: "CTO (Chief Technology Officer)",
        },
        {
            value: "CFO (Chief Financial Officer)",
            label: "CFO (Chief Financial Officer)",
        },
        { value: "Manager", label: "Manager" },
        { value: "Supervisor", label: "Supervisor" },
        { value: "Leader", label: "Leader" },
        { value: "Staf", label: "Staf" },
        { value: "Freelance", label: "Freelance" },
    ];

    const selectStatus = [
        { value: "True", label: "Active" },
        { value: "False", label: "Resign" },
    ];

    const setPermission = [
        {
            subject: "Accounts",
            data: ["users", "store", "groups", "employe"],
        },
        {
            subject: "Presence",
            data: ["absent", "schedule", "work_permit"],
        },
    ];

    return (
        <div
            id="modal"
            className="modal fade bd-modal-lg"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
            data-bs-keyboard="false"
            data-bs-backdrop="static"
        >
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <b>{header + " " + subject}</b>
                        </h5>
                        <button
                            type="button"
                            id="close"
                            className="btn-close color-red"
                            data-bs-dismiss="modal"
                        ></button>
                    </div>
                    <form id="modelForm" onSubmit={submit}>
                        {header === "Update" ? (
                            <div className="modal-body">
                                {subject === "Store" ? (
                                    <div>
                                        <center>
                                            <img
                                                src={modelData?.data.img}
                                                width="100px"
                                            />
                                        </center>
                                        <br />

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="name"
                                                    >
                                                        Name Store
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="nameUpdate"
                                                        id="nameUpdate"
                                                        className="form-control"
                                                        placeholder="Name Store"
                                                        defaultValue={
                                                            modelData?.data.name
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Address
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="addressUpdate"
                                                        id="addressUpdate"
                                                        className="form-control"
                                                        placeholder="Jl. Jend xxx"
                                                        defaultValue={
                                                            modelData?.data
                                                                .address
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Status
                                                    </label>
                                                    <SelectTo
                                                        name="statusUpdate"
                                                        id="statusUpdate"
                                                        data={dataActive}
                                                        defaultValue={
                                                            modelData?.data
                                                                .active ===
                                                            "True"
                                                                ? "Active"
                                                                : modelData.data
                                                                      .active ===
                                                                  "False"
                                                                ? "False"
                                                                : ""
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Tipe
                                                    </label>
                                                    <SelectTo
                                                        name="tipeUpdate"
                                                        id="tipeUpdate"
                                                        data={dataTipe}
                                                        defaultValue={
                                                            modelData?.data.tipe
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Whatsapp
                                                    </label>
                                                    <input
                                                        type="number"
                                                        name="whatsappUpdate"
                                                        id="whatsappUpdate"
                                                        className="form-control"
                                                        placeholder="0822XXX"
                                                        defaultValue={
                                                            modelData?.data
                                                                .whatsapp
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Logo
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="img"
                                                        accept="image/*"
                                                        className="form-file-input form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ) : subject === "Employe" ? (
                                    <div>
                                        <center>
                                            <img
                                                src={modelData?.data.img}
                                                width="100px"
                                            />
                                        </center>
                                        <br />

                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Full Name (KTP)
                                                    </label>
                                                    <input
                                                        name="nameUpdate"
                                                        id="nameUpdate"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Adi Saxxx"
                                                        defaultValue={
                                                            modelData?.data.name
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Date of Birth
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="date_of_birthUpdate"
                                                        id="date_of_birthUpdate"
                                                        className="form-control"
                                                        defaultValue={
                                                            modelData?.data
                                                                .date_of_birth
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Birth of Place
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="birth_of_placeUpdate"
                                                        id="birth_of_placeUpdate"
                                                        className="form-control"
                                                        placeholder="Bengkxx"
                                                        defaultValue={
                                                            modelData?.data
                                                                .birth_of_place
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Date of Entry
                                                    </label>
                                                    <input
                                                        type="date"
                                                        id="date_of_entryUpdate"
                                                        name="date_of_entryUpdate"
                                                        className="form-control"
                                                        defaultValue={
                                                            modelData?.data
                                                                .date_of_entry
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Religion
                                                    </label>
                                                    <SelectTo
                                                        name="religionUpdate"
                                                        id="religionUpdate"
                                                        data={selectReligion}
                                                        defaultValue={
                                                            modelData?.data
                                                                .religion
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Gender
                                                    </label>
                                                    <SelectTo
                                                        name="genderUpdate"
                                                        id="genderUpdate"
                                                        data={selectGender}
                                                        defaultValue={
                                                            modelData?.data
                                                                .gender
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Address
                                                    </label>
                                                    <input
                                                        name="addressUpdate"
                                                        id="addressUpdate"
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Jl. Jend Besar xxx"
                                                        defaultValue={
                                                            modelData?.data
                                                                .address
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Whatsapp
                                                    </label>
                                                    <input
                                                        name="whatsappUpdate"
                                                        id="whatsappUpdate"
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="0853xxxx"
                                                        defaultValue={
                                                            modelData?.data
                                                                .whatsapp
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Position
                                                    </label>
                                                    <SelectTo
                                                        name="positionUpdate"
                                                        id="positionUpdate"
                                                        data={selectPosition}
                                                        defaultValue={
                                                            modelData?.data
                                                                .position
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Division
                                                    </label>
                                                    <SelectTo
                                                        name="divisionUpdate"
                                                        id="divisionUpdate"
                                                        data={selectDivision}
                                                        defaultValue={
                                                            modelData?.data
                                                                .division
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Store
                                                    </label>
                                                    <SelectTo
                                                        name="storeUpdate"
                                                        id="storeUpdate"
                                                        data={dataStore}
                                                        search={true}
                                                        defaultValue={
                                                            modelData?.data
                                                                .store
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            Status
                                                        </label>
                                                        <SelectTo
                                                            name="activeUpdate"
                                                            id="activeUpdate"
                                                            data={selectStatus}
                                                            defaultValue={
                                                                modelData?.data
                                                                    .active ===
                                                                "True"
                                                                    ? "Active"
                                                                    : modelData
                                                                          ?.data
                                                                          .active ===
                                                                      "False"
                                                                    ? "False"
                                                                    : ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Foto
                                                    </label>
                                                    <input
                                                        type="file"
                                                        name="img"
                                                        accept="image/*"
                                                        className="form-file-input form-control"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                ) : subject === "Users" ? (
                                    <div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="name"
                                                    >
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="usernameUpdate"
                                                        id="usernameUpdate"
                                                        className="form-control"
                                                        placeholder="Username"
                                                        defaultValue={
                                                            modelData?.data
                                                                .username
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="emailUpdate"
                                                        id="emailUpdate"
                                                        className="form-control"
                                                        placeholder="abc123@gmail.com"
                                                        defaultValue={
                                                            modelData?.data
                                                                .email
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-12">
                                                <div className="form-group">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="password"
                                                    >
                                                        Password Old
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="passwordUpdate"
                                                        id="passwordUpdate"
                                                        className="form-control"
                                                        placeholder="*********"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Password New
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="passwordUpdateNew"
                                                        id="passwordUpdateNew"
                                                        className="form-control"
                                                        placeholder="**********"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Confirm Password New
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="passwordUpdateNew_confirmation"
                                                        id="passwordUpdateNew_confirmation"
                                                        className="form-control"
                                                        placeholder="**********"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : subject === "Groups" ? (
                                    <div>
                                        <div className="mb-6 col-md-12">
                                            <div className="form-group">
                                                <label htmlFor="nama">
                                                    Name Group
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nameUpdate"
                                                    name="nameUpdate"
                                                    placeholder="Name Group"
                                                    defaultValue={
                                                        modelData?.data.name
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-6 col-md-12">
                                            <div className="form-group">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">
                                                                <b>
                                                                    Permission
                                                                </b>
                                                            </th>
                                                            <th scope="col">
                                                                <center>
                                                                    <span className="badge badge-primary">
                                                                        <i className="fa fa-eye"></i>
                                                                    </span>
                                                                </center>
                                                            </th>
                                                            <th scope="col">
                                                                <center>
                                                                    <span className="badge badge-success">
                                                                        <i className="fa fa-plus"></i>
                                                                    </span>
                                                                </center>
                                                            </th>
                                                            <th scope="col">
                                                                <center>
                                                                    <span className="badge badge-warning">
                                                                        <i className="fa fa-pencil"></i>
                                                                    </span>
                                                                </center>
                                                            </th>
                                                            <th scope="col">
                                                                <center>
                                                                    <span className="badge badge-danger">
                                                                        <i className="fa fa-trash"></i>
                                                                    </span>
                                                                </center>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    {setPermission.map(
                                                        (val, i) => {
                                                            return (
                                                                <tbody key={i}>
                                                                    <tr>
                                                                        <td>
                                                                            <b>
                                                                                {
                                                                                    val.subject
                                                                                }
                                                                            </b>
                                                                        </td>
                                                                    </tr>

                                                                    {val.data.map(
                                                                        (
                                                                            val1,
                                                                            ii
                                                                        ) => {
                                                                            return (
                                                                                <tr
                                                                                    key={
                                                                                        ii
                                                                                    }
                                                                                >
                                                                                    <td
                                                                                        style={{
                                                                                            textTransform:
                                                                                                "capitalize",
                                                                                            paddingLeft:
                                                                                                "20px",
                                                                                        }}
                                                                                    >
                                                                                        {`${
                                                                                            ii +
                                                                                            1
                                                                                        }) ${val1.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )} `}
                                                                                    </td>
                                                                                    <td>
                                                                                        <center>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                name="permissionUpdate[]"
                                                                                                value={`view${val1}`}
                                                                                                className="minimal"
                                                                                                id={`view${val1}Update`}
                                                                                            />
                                                                                        </center>
                                                                                    </td>
                                                                                    <td>
                                                                                        <center>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                name="permissionUpdate[]"
                                                                                                value={`create${val1}`}
                                                                                                className="minimal"
                                                                                                id={`create${val1}Update`}
                                                                                            />
                                                                                        </center>
                                                                                    </td>
                                                                                    <td>
                                                                                        <center>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                name="permissionUpdate[]"
                                                                                                value={`update${val1}`}
                                                                                                className="minimal"
                                                                                                id={`update${val1}Update`}
                                                                                            />
                                                                                        </center>
                                                                                    </td>
                                                                                    <td>
                                                                                        <center>
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                name="permissionUpdate[]"
                                                                                                value={`delete${val1}`}
                                                                                                className="minimal"
                                                                                                id={`delete${val1}Update`}
                                                                                            />
                                                                                        </center>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        }
                                                                    )}
                                                                </tbody>
                                                            );
                                                        }
                                                    )}
                                                </table>
                                            </div>
                                        </div>
                                        <div className="mb-6 col-md-12">
                                            <div className="form-group">
                                                <label className="form-label">
                                                    Target Users : (
                                                    {modelData?.data.users.map(
                                                        (val, i) => {
                                                            return ` ${val.label}, `;
                                                        }
                                                    )}
                                                    )
                                                </label>
                                                <SelectTo
                                                    id="targetUpdate"
                                                    name="targetUpdate[]"
                                                    data={dataUsers}
                                                    multi={true}
                                                    defaultValue={
                                                        modelData?.data.users
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    "Gagal Mengambil Data"
                                )}
                            </div>
                        ) : header === "Delete" ? (
                            <div className="modal-body">
                                <div>Yakin Ingin Menghapus</div>
                            </div>
                        ) : header === "View" ? (
                            <div className="modal-body">
                                <div>View</div>
                            </div>
                        ) : (
                            <div className="modal-body color-danger">
                                Gagal Mengambil Data
                            </div>
                        )}
                        <div className="modal-footer">
                            <Button
                                type="submit"
                                className={
                                    header == "Delete"
                                        ? "btn btn-danger btn-block"
                                        : "btn btn-primary btn-block"
                                }
                                processing={processing}
                            >
                                {header == "Delete" ? "Delete" : "Save"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
