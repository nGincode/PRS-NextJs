import React, { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import Swal from "sweetalert2";

import Skeleton from "@/Components/Skeleton";
import urlOpen from "@/Components/urlOpen";
import DataTables from "@/Components/DataTables";
import SelectTo from "@/Components/SelectTo";
import Button from "@/Components/Button";
import Toastr from "@/Components/Toastr";
import Validate from "@/Components/Validate";

export default function Employe(props) {
    const namePage = "Employe";
    const [processing, setprocessing] = useState(false);
    const [dataEmploye, setdataEmploye] = useState([]);
    const [dataStore, setdataStore] = useState([]);
    urlOpen("Auth");

    const handleAsync = async (tipe) => {
        if (tipe === "view") {
            try {
                await axios({
                    method: "POST",
                    url: "/api/employe/view",
                    data: {
                        users_id: props.auth.user.id,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    handleDataEmploye(res);
                });
            } catch (error) {
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
                Toastr("error", error.message);
            }

            try {
                await axios({
                    method: "POST",
                    url: "/api/store/all",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    handleDataStore(res);
                });
            } catch (error) {
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
                Toastr("error", error.message);
            }
        } else if (tipe === "create") {
            var data = new FormData($("#createForm")[0]);
            if (!permission("update")) {
                data.append("users_id", props.auth.user.id);
            }
            try {
                await axios({
                    method: "POST",
                    url: "/api/employe/create",
                    data: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    setTimeout(() => {
                        setprocessing(false);
                    }, 5000);
                    if (res.data.response === "success") {
                        Toastr(res.data.response, res.data.message);
                        handleAsync("view");
                        $("#DataTables").DataTable().ajax.reload();
                        if (permission("update")) {
                            $("#createForm")[0].reset();
                        }
                        $(".is-valid").removeClass("is-valid");
                    } else if (res.data.data) {
                        Swal.fire({
                            title: `<b>Name Detected</b>`,
                            text: ` Are You Right With The Name ${res.data.data.name} ?`,
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes",
                        }).then((result) => {
                            if (result.isConfirmed) {
                                axios({
                                    method: "POST",
                                    url: "/api/employe/create",
                                    data: {
                                        users_id: props.auth.user.id,
                                        id: res.data.data.id,
                                    },
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                        "X-CSRF-TOKEN": props.csrf_token,
                                    },
                                }).then((res) => {
                                    handleDataEmploye(res);
                                    Toastr(res.data.response, res.data.message);
                                });
                            }
                        });
                    } else {
                        Toastr(res.data.response, res.data.message);
                    }
                });
            } catch (error) {
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        } else if (tipe === "update") {
            var data = new FormData($("#createForm")[0]);
            data.append("id", dataEmploye?.id);
            data.append("activeUpdate", dataEmploye?.active);
            data.append("date_of_entryUpdate", dataEmploye?.date_of_entry);
            try {
                await axios({
                    method: "POST",
                    url: "/api/employe/update",
                    data: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    setTimeout(() => {
                        setprocessing(false);
                    }, 5000);
                    Toastr(res.data.response, res.data.message);
                    if (res.data.response === "success") {
                        $("#DataTables").DataTable().ajax.reload();
                        if (!dataEmploye?.id) {
                            $("#createForm")[0].reset();
                            $(".is-valid").removeClass("is-valid");
                        }
                    }
                });
            } catch (error) {
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        }
    };

    const permission = (tipe) => {
        if (tipe === "view") {
            if (props.permission.includes(`view${namePage.toLowerCase()}`)) {
                return true;
            } else {
                return false;
            }
        } else if (tipe === "update") {
            if (props.permission.includes(`update${namePage.toLowerCase()}`)) {
                return true;
            } else {
                return false;
            }
        } else if (tipe === "delete") {
            if (props.permission.includes(`delete${namePage.toLowerCase()}`)) {
                return true;
            } else {
                return false;
            }
        } else if (tipe === "create") {
            if (props.permission.includes(`create${namePage.toLowerCase()}`)) {
                return true;
            } else {
                return false;
            }
        }
    };

    const dataAction = () => {
        var actionData = [];
        if (permission("update")) {
            actionData.push("Update");
        }

        if (permission("delete")) {
            actionData.push("Delete");
        }
        return actionData;
    };

    if (!permission("view")) {
        Toastr("error", "You don't have permission");
        setTimeout(() => {
            window.location.replace("/dashboard");
        }, 2000);
    }

    useEffect(() => {
        $("#main-wrapper").removeClass("menu-toggle");
        $(".hamburger ").removeClass("is-active");

        handleAsync("view");
    }, []);

    const handleDataEmploye = (res) => {
        if (res.data.message !== "Nothing" && !permission("update")) {
            $("#date_of_entry").prop("disabled", true);
            $("#active").prop("disabled", true);
            setdataEmploye(res.data.data);
        }
    };

    const handleDataStore = (res) => {
        if (res.data.data !== "Nothing") {
            var dataStores = [];
            res.data.data.map((val, i) => {
                dataStores.push({ value: val.id, label: val.name });
            });
            setdataStore(dataStores);
        }
    };

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
        { value: "Head Outlet", label: "Head Outlet" },
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

    const setValidate = {
        name: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        date_of_birth: {
            required: true,
        },
        birth_of_place: {
            required: true,
        },
        date_of_entry: {
            required: true,
        },
        religion: {
            required: true,
        },
        gender: {
            required: true,
        },
        address: {
            required: true,
            minlength: 3,
            maxlength: 191,
        },
        status: {
            required: true,
        },
        whatsapp: {
            required: true,
            minlength: 12,
            maxlength: 15,
        },
        position: {
            required: true,
        },
        division: {
            required: true,
        },
        active: {
            required: true,
        },
    };

    const setValidateUpdate = {
        nameUpdate: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        date_of_birthUpdate: {
            required: true,
        },
        birth_of_placeUpdate: {
            required: true,
        },
        date_of_entryUpdate: {
            required: true,
        },
        religionUpdate: {
            required: true,
        },
        genderUpdate: {
            required: true,
        },
        addressUpdate: {
            required: true,
            minlength: 3,
            maxlength: 191,
        },
        statusUpdate: {
            required: true,
        },
        whatsappUpdate: {
            required: true,
            minlength: 12,
            maxlength: 15,
        },
        positionUpdate: {
            required: true,
        },
        divisionUpdate: {
            required: true,
        },
        activeUpdate: {
            required: true,
        },
    };

    const setValidateUpdate2 = ["storeUpdate"];

    const submit = (e) => {
        setprocessing(true);
        e.preventDefault();

        if (dataEmploye?.id && !permission("update")) {
            if (Validate("#createForm", setValidateUpdate, ["storeUpdate"])) {
                handleAsync("update");
            } else {
                setprocessing(false);
            }
        } else {
            if (Validate("#createForm", setValidate, ["store"])) {
                handleAsync("create");
            } else {
                setprocessing(false);
            }
        }
    };

    return (
        <>
            <Head title={namePage} />
            <div className="row page-titles">
                <div className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a>Accounts</a>
                    </li>
                    <li className="breadcrumb-item  active">
                        <Link href={route(namePage.toLowerCase())}>
                            {namePage}
                        </Link>
                    </li>
                </div>
            </div>
            <Skeleton />

            <div id="content">
                {permission("create") && (
                    <div className="col-xl-12 ">
                        <div className="card">
                            <div className="card-header coin-card">
                                <h4 className="card-title text-white">
                                    <b>{namePage}</b>
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="basic-form">
                                    {dataEmploye?.img ? (
                                        <center>
                                            <img
                                                src={dataEmploye?.img}
                                                width="100px"
                                            />
                                            <br />
                                        </center>
                                    ) : (
                                        ""
                                    )}
                                    <form id="createForm" onSubmit={submit}>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Full Name (KTP)
                                                    </label>
                                                    {dataEmploye.name ? (
                                                        <input
                                                            name="nameUpdate"
                                                            id="nameUpdate"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Adi Saxxx"
                                                            defaultValue={
                                                                dataEmploye.name ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            name="name"
                                                            id="name"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Adi Saxxx"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Date of Birth
                                                    </label>
                                                    {dataEmploye.date_of_birth ? (
                                                        <input
                                                            type="date"
                                                            name="date_of_birthUpdate"
                                                            id="date_of_birthUpdate"
                                                            className="form-control"
                                                            defaultValue={
                                                                dataEmploye.date_of_birth ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            type="date"
                                                            name="date_of_birth"
                                                            id="date_of_birth"
                                                            className="form-control"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Birth of Place
                                                    </label>
                                                    {dataEmploye.birth_of_place ? (
                                                        <input
                                                            type="text"
                                                            name="birth_of_placeUpdate"
                                                            id="birth_of_placeUpdate"
                                                            className="form-control"
                                                            placeholder="Bengkxx"
                                                            defaultValue={
                                                                dataEmploye.birth_of_place ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            name="birth_of_place"
                                                            id="birth_of_place"
                                                            className="form-control"
                                                            placeholder="Bengkxx"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Date of Entry
                                                    </label>

                                                    {dataEmploye.date_of_entry ? (
                                                        <input
                                                            type="date"
                                                            id="date_of_entryUpdate"
                                                            name="date_of_entryUpdate"
                                                            className="form-control"
                                                            defaultValue={
                                                                dataEmploye.date_of_entry ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            type="date"
                                                            id="date_of_entry"
                                                            name="date_of_entry"
                                                            className="form-control"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Religion
                                                    </label>

                                                    {dataEmploye.religion ? (
                                                        <SelectTo
                                                            name="religionUpdate"
                                                            id="religionUpdate"
                                                            data={
                                                                selectReligion
                                                            }
                                                            defaultValue={
                                                                dataEmploye.religion ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <SelectTo
                                                            name="religion"
                                                            id="religion"
                                                            data={
                                                                selectReligion
                                                            }
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Gender
                                                    </label>

                                                    {dataEmploye.gender ? (
                                                        <SelectTo
                                                            name="genderUpdate"
                                                            id="genderUpdate"
                                                            data={selectGender}
                                                            defaultValue={
                                                                dataEmploye.gender ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <SelectTo
                                                            name="gender"
                                                            id="gender"
                                                            data={selectGender}
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Address
                                                    </label>
                                                    {dataEmploye.address ? (
                                                        <input
                                                            name="addressUpdate"
                                                            id="addressUpdate"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Jl. Jend Besar xxx"
                                                            defaultValue={
                                                                dataEmploye.address ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            name="address"
                                                            id="address"
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Jl. Jend Besar xxx"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Whatsapp
                                                    </label>
                                                    {dataEmploye.whatsapp ? (
                                                        <input
                                                            name="whatsappUpdate"
                                                            id="whatsappUpdate"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="0853xxxx"
                                                            defaultValue={
                                                                dataEmploye.whatsapp ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <input
                                                            name="whatsapp"
                                                            id="whatsapp"
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="0853xxxx"
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Position
                                                    </label>
                                                    {dataEmploye.position ? (
                                                        <SelectTo
                                                            name="positionUpdate"
                                                            id="positionUpdate"
                                                            data={
                                                                selectPosition
                                                            }
                                                            defaultValue={
                                                                dataEmploye.position ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <SelectTo
                                                            name="position"
                                                            id="position"
                                                            data={
                                                                selectPosition
                                                            }
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Division
                                                    </label>
                                                    {dataEmploye.division ? (
                                                        <SelectTo
                                                            name="divisionUpdate"
                                                            id="divisionUpdate"
                                                            data={
                                                                selectDivision
                                                            }
                                                            defaultValue={
                                                                dataEmploye.division ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <SelectTo
                                                            name="division"
                                                            id="division"
                                                            data={
                                                                selectDivision
                                                            }
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Store
                                                    </label>
                                                    {dataEmploye.store ? (
                                                        <SelectTo
                                                            name="storeUpdate"
                                                            id="storeUpdate"
                                                            data={dataStore}
                                                            search={true}
                                                            api={{
                                                                method: "POST",
                                                                url: "/api/store/all",
                                                                data: {},
                                                                csrf_token:
                                                                    props.csrf_token,
                                                            }}
                                                            defaultValue={
                                                                dataEmploye.store ??
                                                                ""
                                                            }
                                                        />
                                                    ) : (
                                                        <SelectTo
                                                            name="store"
                                                            id="store"
                                                            data={dataStore}
                                                            search={true}
                                                            defaultValue=""
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <div className="form-group">
                                                        <label className="form-label">
                                                            Status
                                                        </label>
                                                        {dataEmploye.active ? (
                                                            <SelectTo
                                                                name="activeUpdate"
                                                                id="activeUpdate"
                                                                data={
                                                                    selectStatus
                                                                }
                                                                defaultValue={
                                                                    dataEmploye.active ===
                                                                    "True"
                                                                        ? "Active"
                                                                        : dataEmploye.active ===
                                                                          "False"
                                                                        ? "False"
                                                                        : ""
                                                                }
                                                            />
                                                        ) : (
                                                            <SelectTo
                                                                name="active"
                                                                id="active"
                                                                data={
                                                                    selectStatus
                                                                }
                                                                defaultValue=""
                                                            />
                                                        )}
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
                                        <Button
                                            type="submit"
                                            className="btn btn-primary"
                                            processing={processing}
                                        >
                                            Submit
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {permission("view") &&
                    (permission("update") || permission("delete")) && (
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header bg-secondary">
                                    <h4 className="card-title  text-white">
                                        <b>Data {namePage}</b>
                                    </h4>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <DataTables
                                            columns={[
                                                {
                                                    data: "img",
                                                    title: "#",
                                                },
                                                {
                                                    data: "name",
                                                    title: "Name",
                                                },
                                                {
                                                    data: "position",
                                                    title: "Position",
                                                },
                                                {
                                                    data: "whatsapp",
                                                    title: "Whatsapp",
                                                },
                                                {
                                                    data: "entry",
                                                    title: "Date Of Entry",
                                                },
                                                {
                                                    data: "action",
                                                    title: "Action",
                                                    orderable: false,
                                                    width: 50,
                                                    className: "text-right",
                                                },
                                            ]}
                                            API="/api/employe"
                                            Method="POST"
                                            Subject="Employe"
                                            setValidate={setValidateUpdate}
                                            setValidate2={setValidateUpdate2}
                                            csrf_token={props.csrf_token}
                                            Action={dataAction()}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </>
    );
}
