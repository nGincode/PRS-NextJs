import React, { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import Skeleton from "@/Components/Skeleton";
import urlOpen from "@/Components/urlOpen";
import DataTables from "@/Components/DataTables";
import SelectTo from "@/Components/SelectTo";
import Button from "@/Components/Button";
import Toastr from "@/Components/Toastr";
import Validate from "@/Components/Validate";

export default function Users(props) {
    const namePage = "Users";
    const [processing, setprocessing] = useState(false);
    const [dataUsers, setdataUsers] = useState([]);

    urlOpen("Auth");

    const handleAsync = async (tipe) => {
        if (tipe === "create") {
            var data = new FormData($("#createForm")[0]);
            try {
                await axios({
                    method: "POST",
                    url: "/api/users/create",
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
                        $("#createForm")[0].reset();
                        $(".is-valid").removeClass("is-valid");
                    }
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
                    url: "/api/users/view",
                    data: {
                        id: props.auth.user.id,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    handleDataUsers(res);
                });
            } catch (error) {
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
                Toastr("error", error.message);
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

    const handleDataUsers = (res) => {
        if (res.data.data) {
            setdataUsers(res.data.data);
        }
    };

    const setValidate = {
        username: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
            minlength: 8,
        },
        password_confirmation: {
            required: true,
            minlength: 8,
            equalTo: "#password",
        },
    };

    const setValidateUpdate = {
        usernameUpdate: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        emailUpdate: {
            required: true,
            email: true,
        },
        passwordUpdate: {
            required: true,
            minlength: 8,
        },
        passwordUpdateNew: {
            required: true,
            minlength: 8,
        },
        passwordUpdateNew_confirmation: {
            required: true,
            minlength: 8,
            equalTo: "#passwordUpdateNew",
        },
    };

    const submit = (e) => {
        setprocessing(true);
        e.preventDefault();
        if (Validate("#createForm", setValidate)) {
            handleAsync("create");
        } else {
            setprocessing(false);
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
                                    <form id="createForm" onSubmit={submit}>
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
                                                        name="username"
                                                        id="username"
                                                        className="form-control"
                                                        placeholder="Username"
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
                                                        name="email"
                                                        id="email"
                                                        className="form-control"
                                                        placeholder="abc123@gmail.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label
                                                        className="form-label"
                                                        htmlFor="password"
                                                    >
                                                        Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        className="form-control"
                                                        placeholder="*********"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Confirm Password
                                                    </label>
                                                    <input
                                                        type="password"
                                                        name="password_confirmation"
                                                        id="password_confirmation"
                                                        className="form-control"
                                                        placeholder="**********"
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

                {permission("view") && (
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
                                                data: "username",
                                                title: "Username",
                                            },
                                            {
                                                data: "email",
                                                title: "Email",
                                            },
                                            {
                                                data: "last_login_at",
                                                title: "Last Login",
                                            },
                                            {
                                                data: "last_login_ip",
                                                title: "Last Login IP",
                                            },
                                            {
                                                data: "action",
                                                title: "Action",
                                                orderable: false,
                                                width: 50,
                                                className: "text-right",
                                            },
                                        ]}
                                        API="/api/users"
                                        Method="POST"
                                        Subject="Users"
                                        setValidate={setValidateUpdate}
                                        Action={dataAction()}
                                        csrf_token={props.csrf_token}
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
