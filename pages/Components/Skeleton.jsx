import { useEffect, useState } from "react";

import "skeleton-screen-css";

export default function Skeleton() {
    const [loadPage, setloadPage] = useState(false);

    useEffect(() => {
        setloadPage(true);
        $("html").css("overflow", "hidden");
        $("#content").hide();
    }, []);

    if (loadPage) {
        setTimeout(function () {
            $("#skeleton").hide();
            $("html").css("overflow", "auto");
            $("#content").fadeIn();
        }, 300);
    } else {
        $("html").css("overflow", "hidden");
    }
    return (
        <div id="skeleton">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body d-flex">
                            <div
                                className="ssc-circle"
                                style={{ marginTop: "10px", width: "55px" }}
                            ></div>
                            <div
                                className="w-100 mbs"
                                style={{ margin: "8px" }}
                            >
                                <div
                                    className="ssc-head-line mbs  w-80"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="mbs ssc-line mb w-50"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="mbs ssc-line w-30"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="mbs ssc-line mb w-30"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-3 col-xxl-6 col-sm-6">
                    <div className="card">
                        <div className="card-body d-flex">
                            <div
                                className="ssc-circle"
                                style={{ marginTop: "10px", width: "60px" }}
                            ></div>
                            <div className="w-100 mr" style={{ margin: "8px" }}>
                                <div
                                    className="ssc-head-line mr  w-80"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line mb w-50"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line w-90"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line w-30"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-xxl-6 col-sm-6">
                    <div className="card">
                        <div className="card-body d-flex">
                            <div
                                className="ssc-circle"
                                style={{ marginTop: "10px", width: "60px" }}
                            ></div>
                            <div className="w-100 mr" style={{ margin: "8px" }}>
                                <div
                                    className="ssc-head-line mr  w-80"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line mb w-50"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line w-90"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                                <div
                                    className="ssc-line w-30"
                                    style={{ marginBottom: "8px" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body d-flex">
                            <div className="w-100 mr">
                                <div className="ssc-head-line"></div> <br />
                                <div
                                    className="ssc-square"
                                    style={{ borderRadius: "20px" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
