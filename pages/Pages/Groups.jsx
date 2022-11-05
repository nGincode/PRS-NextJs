import React, { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import Skeleton from "@/Components/Skeleton";
import urlOpen from "@/Components/urlOpen";
import DataTables from "@/Components/DataTables";
import Button from "@/Components/Button";
import SelectTo from "@/Components/SelectTo";
import Toastr from "@/Components/Toastr";
import Validate from "@/Components/Validate";

export default function Groups(props) {
    const namePage = "Groups";
    const [processing, setprocessing] = useState(false);
    const [dataUsers, setdataUsers] = useState([]);

    urlOpen("Auth");

    const handleAsync = async (tipe) => {
        if (tipe === "create") {
            var data = new FormData($("#createForm")[0]);
            try {
                await axios({
                    method: "POST",
                    url: "/api/groups/create",
                    data: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
                    },
                }).then((res) => {
                    setTimeout(() => {
                        setprocessing(false);
                    }, 5000);
                    handleAsync("view");
                    Toastr(res.data.response, res.data.message);
                    if (res.data.response === "success") {
                        $("#DataTables").DataTable().ajax.reload();
                        $("#createForm")[0].reset();
                        $(".is-valid").removeClass("is-valid");

                        for (
                            let i = 0;
                            i < $(`input[name='${setValidate2[0]}[]']`).length;
                            i++
                        ) {
                            setTimeout(() => {
                                $(".react-select__multi-value__remove").trigger(
                                    "click"
                                );
                            }, 1);
                        }

                        handleAsync("view");
                    }
                });
            } catch (error) {
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        } else if (tipe === "view") {
            try {
                await axios({
                    method: "POST",
                    url: "/api/users/view",
                    data: {
                        uniquegroups: true,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": props.csrf_token,
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

    const handleDataUsers = (res) => {
        if (res.data.data) {
            setdataUsers(res.data.data);
        }
    };

    useEffect(() => {
        $("#main-wrapper").removeClass("menu-toggle");
        $(".hamburger ").removeClass("is-active");
        handleAsync("view");
    }, []);

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

    const setValidate = {
        name: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        "permission[]": {
            required: true,
        },
    };
    const setValidate2 = ["target"];

    const setValidateUpdate = {
        nameUpdate: {
            required: true,
            minlength: 3,
            maxlength: 50,
        },
        "permissionUpdate[]": {
            required: true,
        },
    };
    const setValidateUpdate2 = ["targetUpdate"];

    const submit = (e) => {
        setprocessing(true);
        e.preventDefault();

        if (Validate("#createForm", setValidate, setValidate2)) {
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
                                            <div className="mb-6 col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="nama">
                                                        Name Group
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="name"
                                                        name="name"
                                                        placeholder="Name Group"
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
                                                                    <tbody
                                                                        key={i}
                                                                    >
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
                                                                                                    name="permission[]"
                                                                                                    value={
                                                                                                        "view" +
                                                                                                        val1
                                                                                                    }
                                                                                                    className="minimal"
                                                                                                />
                                                                                            </center>
                                                                                        </td>
                                                                                        <td>
                                                                                            <center>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="permission[]"
                                                                                                    value={
                                                                                                        "create" +
                                                                                                        val1
                                                                                                    }
                                                                                                    className="minimal"
                                                                                                />
                                                                                            </center>
                                                                                        </td>
                                                                                        <td>
                                                                                            <center>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="permission[]"
                                                                                                    value={
                                                                                                        "update" +
                                                                                                        val1
                                                                                                    }
                                                                                                    className="minimal"
                                                                                                />
                                                                                            </center>
                                                                                        </td>
                                                                                        <td>
                                                                                            <center>
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    name="permission[]"
                                                                                                    value={
                                                                                                        "delete" +
                                                                                                        val1
                                                                                                    }
                                                                                                    className="minimal"
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
                                                        Target Users
                                                    </label>
                                                    <SelectTo
                                                        id="target"
                                                        name="target[]"
                                                        data={dataUsers}
                                                        multi={true}
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
                                                data: "name",
                                                title: "Name",
                                            },
                                            {
                                                data: "permission",
                                                title: "Permission",
                                            },
                                            {
                                                data: "users",
                                                title: "Users",
                                            },
                                            {
                                                data: "action",
                                                title: "Action",
                                                orderable: false,
                                                width: 50,
                                                className: "text-right",
                                            },
                                        ]}
                                        API="/api/groups"
                                        Method="POST"
                                        Subject="Groups"
                                        setValidate={setValidateUpdate}
                                        setValidate2={setValidateUpdate2}
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
