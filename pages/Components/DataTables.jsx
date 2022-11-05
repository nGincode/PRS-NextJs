import React, { useState, useRef, useEffect } from "react";

import Model from "@/Components/Model";
import Toastr from "@/Components/Toastr";

export default function DataTables({
    columns,
    API,
    Method,
    Action,
    Subject,
    setValidate,
    setValidate2,
    csrf_token,
}) {
    const [modelHeader, setmodelHeader] = useState();
    const [modelData, setmodelData] = useState();

    const handleAsync = async (id) => {
        if (id) {
            try {
                await axios({
                    method: "POST",
                    url: API + "/view",
                    data: {
                        id: id,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-CSRF-TOKEN": csrf_token,
                    },
                }).then((res) => {
                    setmodelData(res.data);
                });
            } catch (error) {
                Toastr("error", error.message);
            }
        } else {
            try {
                var jmlcolm = "";
                var cells =
                    document
                        .getElementById("DataTables")
                        .getElementsByTagName("th").length - 1;

                for (let index = 0; index < cells; index++) {
                    if (cells - 1 == index) {
                        jmlcolm += index;
                    } else {
                        jmlcolm += index + ",";
                    }
                }

                var table = await $("#DataTables").DataTable({
                    processing: true,
                    columns: columns,
                    ajax: {
                        url: API + "/all",
                        type: Method,
                        data: {
                            Action: Action,
                        },
                        headers: {
                            "X-CSRF-TOKEN": csrf_token,
                        },
                    },
                    aaSorting: [],
                    language: {
                        loadingRecords: "&nbsp;",
                        // processing: '<div class="spinner"></div>',
                        paginate: {
                            next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                            previous:
                                '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
                        },
                    },
                });

                $("#DataTables tbody").on("click", "a", function () {
                    const button = table.row($(this).parents("tr")).selector
                        .rows.prevObject[0].id;

                    const id = table.row($(this).parents("tr")).data()["id"];
                    $("#modelForm")[0].reset();
                    handleAsync(id);

                    if (button === "view") {
                        setmodelHeader("View");
                    }

                    if (button === "update") {
                        setmodelHeader("Update");
                    }

                    if (button === "delete") {
                        setmodelHeader("Delete");
                    }
                });
            } catch (error) {
                Toastr("error", error.message);
            }
        }
    };

    useEffect(() => {
        handleAsync();
    }, []);

    return (
        <>
            <table
                id="DataTables"
                className="display"
                style={{ minWidth: "845px", width: "100%" }}
            ></table>

            <Model
                header={modelHeader}
                modelData={modelData}
                subject={Subject}
                Api={API}
                setValidate={setValidate}
                setValidate2={setValidate2}
                csrf_token={csrf_token}
            />
        </>
    );
}
