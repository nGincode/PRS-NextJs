import React, { useState, useRef, useEffect, useCallback } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import Webcam from "react-webcam";
import { useGeolocated } from "react-geolocated";
import Swal from "sweetalert2";

import Skeleton from "@/Components/Skeleton";
import urlOpen from "@/Components/urlOpen";
import DataTables from "@/Components/DataTables";
import SelectTo from "@/Components/SelectTo";
import Toastr from "@/Components/Toastr";
import Button from "@/Components/Button";
import Validate from "@/Components/Validate";

export default function Absent(props) {
    const namePage = "Absent";

    const [processing, setprocessing] = useState(false);
    const [dataEmploye, setdataEmploye] = useState([]);
    const [deviceId, setDeviceId] = useState();
    const [devices, setDevices] = useState([]);
    const [myLocation, setmyLocation] = useState({});

    const webcamRef = useRef(null);
    const interval = useRef(null);

    urlOpen("Auth");

    const handleAsync = async (tipe) => {
        if (tipe === "create") {
            var data = new FormData($("#createForm")[0]);
            try {
                await axios({
                    method: "POST",
                    url: "/api/store/create",
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
                Toastr("error", error.message);
                setTimeout(() => {
                    setprocessing(false);
                }, 5000);
            }
        } else if (tipe === "view") {
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

    const handleDataEmploye = (res) => {
        if (res.data.message !== "Nothing") {
            setdataEmploye(res.data.data);
        }
    };

    const submit = (e) => {
        setprocessing(true);
        e.preventDefault();

        var img = webcamRef.current.getScreenshot();
        var times = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
        if (coords) {
            if (img) {
                Swal.fire({
                    title: "<b>Submit this data ?</b>",
                    html: `<b><div>${dataEmploye?.name}</div><div>${times}</div></b> <img src="${img}" />  <iframe width="100%"height="210px" src="https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed"/>`,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Submit",
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            "Deleted!",
                            "Your file has been deleted.",
                            "success"
                        );
                        setprocessing(false);
                    } else {
                        setprocessing(false);
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Your image is not detected!",
                    showConfirmButton: false,
                    timer: 1500,
                });
                setprocessing(false);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Your location is not detected!",
                showConfirmButton: false,
                timer: 1500,
            });
            setprocessing(false);
        }
        // if (Validate("#createForm", setValidate)) {
        //     handleAsync("create");
        // } else {
        // }
    };

    const handleDevices = useCallback(
        (mediaDevices) => {
            var mediaDevicess = [];
            mediaDevices.map((val, i) => {
                if (val.kind === "videoinput") {
                    mediaDevicess.push({
                        id: val.deviceId,
                        label: val.label,
                    });
                }
            });
            setDevices(mediaDevicess);
        },
        [setDevices]
    );

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
            watchPosition: true,
        });

    const videoConstraints = {
        width: 1280,
        height: 720,
        deviceId: deviceId,
    };

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
        $("#main-wrapper").removeClass("menu-toggle");
        $(".hamburger ").removeClass("is-active");
        handleAsync("view");
    }, [handleDevices]);

    const time = () => {
        setInterval(() => {
            if (document.getElementById("time")) {
                var e = document.getElementById("time"),
                    d = new Date(),
                    h,
                    m,
                    s;
                h = d.getHours();
                m = set(d.getMinutes());
                s = set(d.getSeconds());

                e.innerHTML = h + ":" + m + ":" + s;
            }
        }, 1000);
    };

    function set(e) {
        e = e < 10 ? "0" + e : e;
        return e;
    }

    return (
        <>
            <Head title={namePage} />
            <div className="row page-titles">
                <div className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a>Presence</a>
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
                                    <div className="mb-3 col-md-12 text-4xl text-center font-extrabold">
                                        {dataEmploye?.name ??
                                            "Data Employe Not Found"}
                                    </div>
                                    <div className="mb-3 col-md-12 text-2xl text-center">
                                        {dataEmploye?.store?.label}
                                        <br />
                                        {`${dataEmploye?.position ?? ""} ${
                                            dataEmploye?.division ?? ""
                                        }`}
                                        <br />
                                        {time()}
                                        <div
                                            className="mt-3 text-4xl font-bold bg-slate-600 text-slate-100 rounded py-1"
                                            id="time"
                                        ></div>
                                    </div>
                                    <div className="mb-3 col-md-12">
                                        <label className="form-label">
                                            Camera :
                                        </label>
                                        <br />
                                        {devices.map((val, i) => {
                                            if (val.id) {
                                                return (
                                                    <button
                                                        key={i}
                                                        className="btn btn-sm btn-primary ml-3 mb-2 "
                                                        onClick={() => {
                                                            setDeviceId(val.id);
                                                        }}
                                                    >
                                                        {val.label}
                                                    </button>
                                                );
                                            } else {
                                                return (
                                                    <div className="text-red-600">
                                                        !!! Camera not detected,
                                                        Please turn on your
                                                        camera
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                    <form id="createForm" onSubmit={submit}>
                                        <div className="row">
                                            <div className="mb-4 col-md-6">
                                                <Webcam
                                                    audio={false}
                                                    ref={webcamRef}
                                                    screenshotFormat="image/jpeg"
                                                    imageSmoothing={true}
                                                    mirrored={true}
                                                    screenshotQuality={1}
                                                    videoConstraints={
                                                        videoConstraints
                                                    }
                                                    style={{
                                                        borderRadius: "30px",
                                                    }}
                                                />
                                            </div>
                                            <div className="mb-4 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Your Location :
                                                    </label>
                                                    {!isGeolocationAvailable ? (
                                                        <div className="text-red-600">
                                                            !!! Your browser
                                                            does not support
                                                            Geolocation
                                                        </div>
                                                    ) : !isGeolocationAvailable ? (
                                                        <div className="text-red-600">
                                                            !!! Geolocation is
                                                            not enabled
                                                        </div>
                                                    ) : !isGeolocationEnabled ? (
                                                        <div className="text-red-600">
                                                            !!! Browser turn off
                                                            location, please
                                                            turn on
                                                        </div>
                                                    ) : coords ? (
                                                        <div>
                                                            {coords.latitude && (
                                                                <span>
                                                                    latitude :{" "}
                                                                    {
                                                                        coords.latitude
                                                                    }
                                                                    <br />
                                                                </span>
                                                            )}
                                                            {coords.longitude && (
                                                                <span>
                                                                    longitude :{" "}
                                                                    {
                                                                        coords.longitude
                                                                    }
                                                                    <br />
                                                                </span>
                                                            )}
                                                            {coords.heading && (
                                                                <span>
                                                                    heading :{" "}
                                                                    {
                                                                        coords.heading
                                                                    }
                                                                    <br />
                                                                </span>
                                                            )}
                                                            {coords.speed && (
                                                                <span>
                                                                    speed :{" "}
                                                                    {
                                                                        coords.speed
                                                                    }
                                                                </span>
                                                            )}
                                                            <input
                                                                type="hidden"
                                                                name="location"
                                                                value={`{latitude: ${coords.latitude},longitude: ${coords.longitude},altitude: ${coords.altitude},heading: ${coords.heading},speed: ${coords.speed},}`}
                                                            />
                                                            <iframe
                                                                width="100%"
                                                                height="210px"
                                                                style={{
                                                                    borderRadius:
                                                                        "20px",
                                                                }}
                                                                src={`https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            Something went wrong
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                        <Button
                                            type="submit"
                                            className="btn btn-primary"
                                            processing={processing}
                                        >
                                            Capture
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
                            {/* <div className="card-body">
                                <div className="table-responsive">
                                    <DataTables
                                        columns={[
                                            {
                                                data: "img",
                                                title: "#",
                                            },
                                            {
                                                data: "name",
                                                title: "Nama",
                                            },
                                            {
                                                data: "whatsapp",
                                                title: "Whatsapp",
                                            },
                                            {
                                                data: "status",
                                                title: "Status",
                                            },
                                            {
                                                data: "action",
                                                title: "Action",
                                                orderable: false,
                                                width: 50,
                                                className: "text-right",
                                            },
                                        ]}
                                        API="/api/store"
                                        Method="POST"
                                        Subject="Store"
                                        Action={dataAction()}
                                        csrf_token={props.csrf_token}
                                    />
                                </div>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
