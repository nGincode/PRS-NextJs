import React, { useState, useRef, useEffect, useCallback } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import Select from "react-select";

import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";

import Skeleton from "@/Components/Skeleton";
import urlOpen from "@/Components/urlOpen";
import DataTables from "@/Components/DataTables";
import SelectTo from "@/Components/SelectTo";
import Toastr from "@/Components/Toastr";
import Button from "@/Components/Button";
import Validate from "@/Components/Validate";
import moment from "moment";

export default function Schedule(props) {
    const namePage = "Schedule";

    const startDate = moment().weekday(7);
    const endDate = moment().weekday(20);

    const [processing, setprocessing] = useState(false);
    const [dataEmploye, setdataEmploye] = useState();
    const [dataStore, setdataStore] = useState();
    const [dataSchedule, setdataSchedule] = useState([]);
    const [valueSelect, setvalueSelect] = useState();
    const [startEndDate, setstartEndDate] = useState([startDate, endDate]);
    const [arrayDate, setarrayDate] = useState();

    urlOpen("Auth");

    const handleAsync = async (tipe, req) => {
        if (tipe === "create") {
            var data = new FormData($("#createForm")[0]);
            try {
                await axios({
                    method: "POST",
                    url: "/api/schedule/create",
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
            if (req) {
                try {
                    await axios({
                        method: "POST",
                        url: "/api/employe/view",
                        data: req,
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-CSRF-TOKEN": props.csrf_token,
                        },
                    }).then((res) => {
                        handleDataEmploye(res);
                        handleDataSchedule(res);
                    });
                } catch (error) {
                    setTimeout(() => {
                        setprocessing(false);
                    }, 5000);
                    console.log(res);
                    Toastr("error", error.message);
                }
            } else {
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
            setdataEmploye(res.data.data.employe);
        } else {
            setdataEmploye([]);
        }
    };

    const handleDataSchedule = (res) => {
        if (res.data.message !== "Nothing") {
            if (res.data.data.schedule[0]) {
                setdataSchedule(res.data.data.schedule);
            } else {
                setdataSchedule([]);
            }
        } else {
            setdataSchedule([]);
        }
    };

    const handleDataStore = (res) => {
        if (res.data.message !== "Nothing") {
            var store = [];
            res.data.data.map((val, i) => {
                store.push({ value: val.id, label: val.name });
            });
            setdataStore(store);
        }
    };

    const setValidate = {
        "in[]": {
            required: true,
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

    useEffect(() => {
        handleAsync("view");
    }, []);

    const selectStore = (val) => {
        setvalueSelect(val);

        getDate(startEndDate[0], startEndDate[1]);
        handleAsync("view", {
            store_id: val.value,
            startdate: moment(startEndDate[0]).format("YYYY-MM-DD"),
            enddate: moment(startEndDate[1]).format("YYYY-MM-DD"),
            schedule: 1,
        });
    };
    const datePicker = (val) => {
        var array = val.target.value.split(" - ");
        getDate(array[0], array[1]);
        if (valueSelect) {
            handleAsync("view", {
                store_id: valueSelect.value,
                startdate: array[0],
                enddate: array[1],
                schedule: 1,
            });
        }
        setstartEndDate(array);
    };

    const getDate = (startDate, stopDate) => {
        var dateArray = [];
        var currentDate = moment(new Date(Date.parse(startDate)));
        var stopDate = moment(new Date(Date.parse(stopDate)));
        while (currentDate <= stopDate) {
            dateArray.push(moment(currentDate).format("YYYY-MM-DD"));
            currentDate = moment(currentDate).add(1, "days");
        }
        setarrayDate(dateArray);
        return dateArray;
    };

    moment.updateLocale("id", {
        weekdays: [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jumat",
            "Sabtu",
        ],
    });
    console.log(dataSchedule);

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
                                    <form id="createForm" onSubmit={submit}>
                                        <div className="row">
                                            <div className="mb-3 col-md-6">
                                                <div className="form-group">
                                                    <label className="form-label">
                                                        Store
                                                    </label>
                                                    <Select
                                                        options={dataStore}
                                                        value={valueSelect}
                                                        onChange={selectStore}
                                                        className="form-control"
                                                        classNamePrefix="react-select"
                                                        name="store"
                                                        id="store"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-4 col-md-6">
                                                <label className="form-label">
                                                    Date Range
                                                </label>
                                                <DateRangePicker
                                                    initialSettings={{
                                                        minDate: startDate,
                                                        maxDate: endDate,
                                                        startDate: startDate,
                                                        endDate: endDate,
                                                    }}
                                                    onHide={datePicker}
                                                >
                                                    <input
                                                        type="text"
                                                        name="daterange"
                                                        className="form-control"
                                                    />
                                                </DateRangePicker>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="card-body">
                                                <div className="table-responsive">
                                                    <table className="table table-responsive-md">
                                                        <thead>
                                                            <tr>
                                                                {dataEmploye ? (
                                                                    dataEmploye.length ? (
                                                                        <>
                                                                            <th>
                                                                                <strong>
                                                                                    Date
                                                                                </strong>
                                                                            </th>
                                                                            <th>
                                                                                <strong>
                                                                                    Ket
                                                                                </strong>
                                                                            </th>
                                                                            {dataEmploye.map(
                                                                                (
                                                                                    val,
                                                                                    i
                                                                                ) => {
                                                                                    return (
                                                                                        <th
                                                                                            key={
                                                                                                i
                                                                                            }
                                                                                            style={{
                                                                                                textAlign:
                                                                                                    "center",
                                                                                            }}
                                                                                        >
                                                                                            <strong>
                                                                                                {
                                                                                                    val.name
                                                                                                }
                                                                                            </strong>
                                                                                        </th>
                                                                                    );
                                                                                }
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <th
                                                                            colSpan={
                                                                                arrayDate
                                                                                    ? arrayDate.length +
                                                                                      1
                                                                                    : 1
                                                                            }
                                                                            style={{
                                                                                background:
                                                                                    "#969ba01f",
                                                                            }}
                                                                        >
                                                                            Employe
                                                                            not
                                                                            found
                                                                        </th>
                                                                    )
                                                                ) : (
                                                                    <th
                                                                        colSpan={
                                                                            arrayDate
                                                                                ? arrayDate.length +
                                                                                  1
                                                                                : 1
                                                                        }
                                                                        style={{
                                                                            background:
                                                                                "#969ba01f",
                                                                        }}
                                                                    >
                                                                        Select
                                                                        Data
                                                                        Above
                                                                    </th>
                                                                )}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {dataEmploye?.length ? (
                                                                arrayDate?.map(
                                                                    (
                                                                        val,
                                                                        i
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    i
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    <strong>
                                                                                        {moment(
                                                                                            val
                                                                                        ).format(
                                                                                            "DD-MM-YYYY"
                                                                                        )}
                                                                                        <br />
                                                                                        {moment(
                                                                                            val
                                                                                        )
                                                                                            .locale(
                                                                                                "en"
                                                                                            )
                                                                                            .format(
                                                                                                "dddd"
                                                                                            )}
                                                                                    </strong>
                                                                                </td>
                                                                                <td>
                                                                                    <strong>
                                                                                        <div className="mb-4">
                                                                                            Start
                                                                                            :
                                                                                        </div>
                                                                                        <div className="mb-4">
                                                                                            Duration
                                                                                            :
                                                                                        </div>
                                                                                        <div className="mb-4">
                                                                                            Off
                                                                                            :
                                                                                        </div>
                                                                                    </strong>
                                                                                </td>
                                                                                {dataSchedule.length
                                                                                    ? dataSchedule.map(
                                                                                          (
                                                                                              vall,
                                                                                              ii
                                                                                          ) => {
                                                                                              return (
                                                                                                  <td
                                                                                                      key={
                                                                                                          ii
                                                                                                      }
                                                                                                      className="col-md-1"
                                                                                                  >
                                                                                                      <input
                                                                                                          type="time"
                                                                                                          name="in[]"
                                                                                                          className="form-control mb-2"
                                                                                                          defaultValue={
                                                                                                              vall[
                                                                                                                  i
                                                                                                              ]
                                                                                                                  .in
                                                                                                          }
                                                                                                      />
                                                                                                      <SelectTo
                                                                                                          name="out[]"
                                                                                                          data={[
                                                                                                              {
                                                                                                                  value: 1,
                                                                                                                  label: "1 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 2,
                                                                                                                  label: "2 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 3,
                                                                                                                  label: "3 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 8,
                                                                                                                  label: "8 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 16,
                                                                                                                  label: "16 Hours",
                                                                                                              },
                                                                                                          ]}
                                                                                                          defaultValue="8"
                                                                                                      />
                                                                                                      <div className="text-center mt-2">
                                                                                                          <input
                                                                                                              type="checkbox"
                                                                                                              value={
                                                                                                                  val +
                                                                                                                  "_" +
                                                                                                                  vall[
                                                                                                                      i
                                                                                                                  ]
                                                                                                                      .employe_id
                                                                                                              }
                                                                                                              name={`off[]`}
                                                                                                              className="w-full h-10 rounded	"
                                                                                                          />
                                                                                                      </div>
                                                                                                      <input
                                                                                                          type="hidden"
                                                                                                          value={
                                                                                                              vall[
                                                                                                                  i
                                                                                                              ]
                                                                                                                  .employe_id
                                                                                                          }
                                                                                                          name="employe[]"
                                                                                                      />
                                                                                                      <input
                                                                                                          type="hidden"
                                                                                                          value={
                                                                                                              vall[
                                                                                                                  i
                                                                                                              ]
                                                                                                                  .date
                                                                                                          }
                                                                                                          name="date[]"
                                                                                                      />
                                                                                                  </td>
                                                                                              );
                                                                                          }
                                                                                      )
                                                                                    : dataEmploye.map(
                                                                                          (
                                                                                              vall,
                                                                                              ii
                                                                                          ) => {
                                                                                              return (
                                                                                                  <td
                                                                                                      key={
                                                                                                          ii
                                                                                                      }
                                                                                                      className="col-md-1"
                                                                                                  >
                                                                                                      <input
                                                                                                          type="time"
                                                                                                          name="in[]"
                                                                                                          className="form-control mb-2"
                                                                                                          defaultValue="10:00:00"
                                                                                                      />
                                                                                                      <SelectTo
                                                                                                          name="out[]"
                                                                                                          data={[
                                                                                                              {
                                                                                                                  value: 1,
                                                                                                                  label: "1 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 2,
                                                                                                                  label: "2 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 3,
                                                                                                                  label: "3 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 8,
                                                                                                                  label: "8 Hours",
                                                                                                              },
                                                                                                              {
                                                                                                                  value: 16,
                                                                                                                  label: "16 Hours",
                                                                                                              },
                                                                                                          ]}
                                                                                                          defaultValue="8"
                                                                                                      />
                                                                                                      <div className="text-center mt-2">
                                                                                                          <input
                                                                                                              type="checkbox"
                                                                                                              value={
                                                                                                                  val +
                                                                                                                  "_" +
                                                                                                                  vall.id
                                                                                                              }
                                                                                                              name={`off[]`}
                                                                                                              className="w-full h-10 rounded	"
                                                                                                          />
                                                                                                      </div>
                                                                                                      <input
                                                                                                          type="hidden"
                                                                                                          value={
                                                                                                              vall.id
                                                                                                          }
                                                                                                          name="employe[]"
                                                                                                      />
                                                                                                      <input
                                                                                                          type="hidden"
                                                                                                          value={
                                                                                                              val
                                                                                                          }
                                                                                                          name="date[]"
                                                                                                      />
                                                                                                  </td>
                                                                                              );
                                                                                          }
                                                                                      )}
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )
                                                            ) : (
                                                                <tr></tr>
                                                            )}
                                                        </tbody>
                                                    </table>
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
