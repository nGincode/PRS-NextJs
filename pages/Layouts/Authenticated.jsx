import React, { useState, useRef, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";
import { Helmet } from "react-helmet";

import NavLink from "@/Components/NavLink";
import ApplicationLogo from "@/Components/ApplicationLogo";
import ScriptCustom from "@/Script/Custom";
import ScriptNav from "@/Script/Nav";
import Toastr from "@/Components/Toastr";

import { MdDashboard } from "react-icons/md";

import $ from "jquery";
import jQuery from "jquery";
window.$ = $;
window.jQuery = jQuery;

import "bootstrap";

import metismenu from "metismenu";
window.metisMenu = metismenu;

import PerfectScrollbar from "perfect-scrollbar";
window.PerfectScrollbar = PerfectScrollbar;

import validate from "jquery-validation";
import valid from "jquery-validation";
window.validate = validate;
window.valid = valid;

import datatables from "datatables.net";
window.DataTable = datatables(window, $);
import "datatables.net-dt/css/jquery.dataTables.min.css";

import toastr from "toastr";
window.toastr = toastr;
import "toastr/build/toastr.min.css";

import moment from "moment/src/moment";
window.moment = moment;

import styleCustom from "../../../public/assets/css/custom.css";
import styleReactSelect from "../../../public/assets/css/react-select.css";

export default function Authenticated({ auth, children }) {
    const [permission, setpermission] = useState([]);

    const handleAsync = async () => {
        try {
            await axios({
                method: "GET",
                url: "/permission",
            }).then((res) => {
                setpermission(res.data.data);
            });
        } catch (error) {
            Toastr("error", error.message);
        }
    };

    const handlePermission = (cek) => {
        if (permission.includes(`view${cek}`)) {
            return true;
        } else {
            return false;
        }
    };

    const dataMenu = {
        dashboard: ["dashboard"],
        users: ["accounts", "users"],
        store: ["accounts", "store"],
        employe: ["accounts", "employe"],
        groups: ["accounts", "groups"],
        absent: ["presence", "absent"],
        schedule: ["presence", "schedule"],
        work_permit: ["presence", "work_permit"],
    };

    const urlToString = () => {
        var query = localStorage.getItem("urlOpen").substr(1);
        var queryLength = localStorage
            .getItem("urlOpen")
            .substr(1)
            .indexOf("?");
        if (queryLength > 0) {
            return query.substr(0, queryLength);
        } else {
            return query;
        }
    };

    const [Menu, setMenu] = useState(dataMenu[urlToString()]);

    useEffect(() => {
        setTimeout(function () {
            $("#main-wrapper").addClass("show");
            $("#main-wrapper").css("opacity", 1);
        }, 500);
        handleAsync();
    }, []);

    const activeMenu = (id) => {
        setMenu(id);
    };

    const mainMenu = [
        {
            menu: { name: "dashboard", icon: "fa fa-dashboard" },
        },
        {
            menu: { name: "accounts", icon: "fa fa-users" },
            submenu: [
                { name: "users", icon: "fa fa-user" },
                { name: "store", icon: "fa fa-home" },
                { name: "employe", icon: "fa fa-address-book" },
                { name: "groups", icon: "fa fa-handshake-o" },
            ],
        },
        {
            menu: { name: "presence", icon: "fa fa-briefcase" },
            submenu: [
                { name: "absent", icon: "fa fa-desktop" },
                { name: "schedule", icon: "fa fa-list-alt" },
                { name: "work_permit", icon: "fa fa-building" },
            ],
        },
    ];

    const in_Array = (value, fix) => {
        var res = false;
        value.map((val, i) => {
            if (fix.includes(val)) {
                res = true;
            }
        });
        return res;
    };

    const unique_Array = (data) => {
        return [...new Set(data)];
    };

    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="/assets/css/style.css" />
            </Helmet>
            <div id="main-wrapper" style={{ opacity: 0 }}>
                <div className="dlabnav">
                    <div className="dlabnav-scroll">
                        <ul className="metismenu" id="menu">
                            <li className="dropdown header-profile">
                                <a
                                    className="nav-link"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {auth.user.img ?? (
                                        <img
                                            src="/assets/unamaed/profil.png"
                                            alt="unamaed"
                                        />
                                    )}
                                    <div className="header-info ms-3">
                                        <span className="font-w600 ">
                                            <b>
                                                {auth.user.username.slice(
                                                    0,
                                                    18
                                                )}
                                            </b>
                                        </span>
                                        <small className="text-end font-w400">
                                            {auth.user.email.slice(0, 25)}
                                        </small>
                                    </div>
                                </a>

                                <div className="dropdown-menu dropdown-menu-end">
                                    <Link
                                        className="dropdown-item ai-icon"
                                        href={route("employe")}
                                        onClick={() => {
                                            activeMenu(["accounts", "employe"]);
                                        }}
                                    >
                                        <svg
                                            id="icon-user1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-primary"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle
                                                cx="12"
                                                cy="7"
                                                r="4"
                                            ></circle>
                                        </svg>
                                        <span className="ms-2">My Profil </span>
                                    </Link>
                                    <a
                                        method="post"
                                        href={route("logout")}
                                        as="button"
                                        className="dropdown-item ai-icon"
                                    >
                                        <svg
                                            id="icon-logout"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-danger"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                            <polyline points="16 17 21 12 16 7"></polyline>
                                            <line
                                                x1="21"
                                                y1="12"
                                                x2="9"
                                                y2="12"
                                            ></line>
                                        </svg>
                                        <span className="ms-2">Logout </span>
                                    </a>
                                </div>
                            </li>
                            {mainMenu.map((val, i) => {
                                var prosPermis = [];
                                permission.map((val, i) => {
                                    prosPermis.push(
                                        val
                                            .replace("create", "")
                                            .replace("update", "")
                                            .replace("delete", "")
                                            .replace("view", "")
                                    );
                                });

                                var prosMenu = [];
                                prosMenu.push(val.menu.name);
                                val.submenu?.map((val, i) => {
                                    prosMenu.push(val.name);
                                });

                                var hiddenMenu = "none";
                                if (
                                    in_Array(
                                        prosMenu,
                                        unique_Array(prosPermis)
                                    ) ||
                                    val.menu.name === "dashboard"
                                ) {
                                    hiddenMenu = "flex";
                                }
                                return (
                                    <li
                                        className={
                                            Menu?.[0] === val.menu.name
                                                ? "mm-active"
                                                : ""
                                        }
                                        style={{ display: hiddenMenu }}
                                        key={i}
                                    >
                                        {val.submenu ? (
                                            Menu?.[0] === val.menu.name ? (
                                                <>
                                                    <a
                                                        className="has-arrow ai-icon mm-active m-active"
                                                        aria-expanded="true"
                                                    >
                                                        <i
                                                            className={
                                                                val.menu.icon
                                                            }
                                                        ></i>
                                                        <span
                                                            className="nav-text"
                                                            style={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {val.menu.name}
                                                        </span>
                                                    </a>

                                                    {val.submenu && (
                                                        <ul
                                                            aria-expanded="true"
                                                            className="mm-collapse mm-show"
                                                        >
                                                            {val.submenu.map(
                                                                (val1, i1) => {
                                                                    return (
                                                                        handlePermission(
                                                                            val1.name
                                                                        ) && (
                                                                            <li
                                                                                className={
                                                                                    Menu?.[1] ===
                                                                                    val1.name
                                                                                        ? "mm-active"
                                                                                        : ""
                                                                                }
                                                                                key={
                                                                                    i1
                                                                                }
                                                                            >
                                                                                {Menu?.[1] ===
                                                                                val1.name ? (
                                                                                    <a
                                                                                        className="ai-icon mm-active -ml-5"
                                                                                        style={{
                                                                                            cursor: "default",
                                                                                            textTransform:
                                                                                                "capitalize",
                                                                                        }}
                                                                                    >
                                                                                        <i
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    "15px",
                                                                                            }}
                                                                                            className={
                                                                                                val1.icon +
                                                                                                "  m-2"
                                                                                            }
                                                                                        ></i>
                                                                                        {val1.name.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )}
                                                                                    </a>
                                                                                ) : (
                                                                                    <Link
                                                                                        className="ai-icon  -ml-5"
                                                                                        href={route(
                                                                                            val1.name.replace(
                                                                                                "_",
                                                                                                ""
                                                                                            )
                                                                                        )}
                                                                                        onClick={() => {
                                                                                            activeMenu(
                                                                                                [
                                                                                                    val
                                                                                                        .menu
                                                                                                        .name,
                                                                                                    val1.name,
                                                                                                ]
                                                                                            );
                                                                                        }}
                                                                                        style={{
                                                                                            textTransform:
                                                                                                "capitalize",
                                                                                        }}
                                                                                    >
                                                                                        <i
                                                                                            className={
                                                                                                val1.icon +
                                                                                                " m-2"
                                                                                            }
                                                                                            style={{
                                                                                                fontSize:
                                                                                                    "15px",
                                                                                            }}
                                                                                        ></i>
                                                                                        {val1.name.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )}
                                                                                    </Link>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    );
                                                                }
                                                            )}
                                                        </ul>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <a
                                                        className="has-arrow ai-icon"
                                                        aria-expanded="false"
                                                    >
                                                        <i
                                                            className={
                                                                val.menu.icon
                                                            }
                                                        ></i>
                                                        <span
                                                            className="nav-text"
                                                            style={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {val.menu.name}
                                                        </span>
                                                    </a>
                                                    {val.submenu && (
                                                        <ul
                                                            aria-expanded="false"
                                                            className="mm-collapse"
                                                            style={{
                                                                height: "16px",
                                                            }}
                                                        >
                                                            {val.submenu.map(
                                                                (val2, i2) => {
                                                                    return (
                                                                        handlePermission(
                                                                            val2.name
                                                                        ) && (
                                                                            <li
                                                                                key={
                                                                                    i2
                                                                                }
                                                                            >
                                                                                <Link
                                                                                    className="ai-icon  -ml-5"
                                                                                    href={route(
                                                                                        val2.name.replace(
                                                                                            "_",
                                                                                            ""
                                                                                        )
                                                                                    )}
                                                                                    onClick={() => {
                                                                                        activeMenu(
                                                                                            [
                                                                                                val
                                                                                                    .menu
                                                                                                    .name,
                                                                                                val2.name,
                                                                                            ]
                                                                                        );
                                                                                    }}
                                                                                    style={{
                                                                                        textTransform:
                                                                                            "capitalize",
                                                                                    }}
                                                                                >
                                                                                    <i
                                                                                        className={
                                                                                            val2.icon +
                                                                                            "  m-2"
                                                                                        }
                                                                                        style={{
                                                                                            fontSize:
                                                                                                "15px",
                                                                                        }}
                                                                                    ></i>
                                                                                    {val2.name.replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )}
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    );
                                                                }
                                                            )}
                                                        </ul>
                                                    )}
                                                </>
                                            )
                                        ) : Menu?.[0] === val.menu.name ? (
                                            <>
                                                <a
                                                    className="ai-icon mm-active m-active"
                                                    aria-expanded="true"
                                                    style={{
                                                        cursor: "default",
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            val.menu.icon
                                                        }
                                                    ></i>
                                                    <span
                                                        className="nav-text"
                                                        style={{
                                                            textTransform:
                                                                "capitalize",
                                                        }}
                                                    >
                                                        {val.menu.name}
                                                    </span>
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <Link
                                                    className="ai-icon"
                                                    href={route(val.menu.name)}
                                                    aria-expanded="false"
                                                    onClick={() => {
                                                        activeMenu([
                                                            val.menu.name,
                                                        ]);
                                                    }}
                                                >
                                                    <i
                                                        className={
                                                            val.menu.icon
                                                        }
                                                    ></i>
                                                    <span
                                                        className="nav-text"
                                                        style={{
                                                            textTransform:
                                                                "capitalize",
                                                        }}
                                                    >
                                                        {val.menu.name}
                                                    </span>
                                                </Link>
                                            </>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="copyright">
                            <p>
                                <strong>PRS System V.3</strong> ©
                                {new Date().getFullYear()} All Rights Reserved
                            </p>
                        </div>
                    </div>
                </div>
                <div className="nav-header">
                    <div className="brand-logo">
                        <ApplicationLogo className="mt-3" width="100px" />
                    </div>
                    <div className="nav-control">
                        <div className="hamburger">
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                        </div>
                    </div>
                </div>
                <div className="chatbox">
                    <div className="chatbox-close"></div>
                    <div className="custom-tab-1">
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    href="#notes"
                                >
                                    Notes
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    data-bs-toggle="tab"
                                    href="#alerts"
                                >
                                    Alerts
                                </a>
                            </li>
                            <li className="nav-item">
                                <a
                                    className="nav-link active"
                                    data-bs-toggle="tab"
                                    href="#chat"
                                >
                                    Chat
                                </a>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div
                                className="tab-pane fade active show"
                                id="chat"
                                role="tabpanel"
                            >
                                <div className="card mb-sm-3 mb-md-0 contacts_card dlab-chat-user-box">
                                    <div className="card-header chat-list-header text-center">
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        fill="#000000"
                                                        x="4"
                                                        y="11"
                                                        width="16"
                                                        height="2"
                                                        rx="1"
                                                    />
                                                    <rect
                                                        fill="#000000"
                                                        opacity="0.3"
                                                        transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
                                                        x="4"
                                                        y="11"
                                                        width="16"
                                                        height="2"
                                                        rx="1"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                        <div>
                                            <h6 className="mb-1">Chat List</h6>
                                            <p className="mb-0">Show All</p>
                                        </div>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        x="0"
                                                        y="0"
                                                        width="24"
                                                        height="24"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="5"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="12"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="19"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                    </div>
                                    <div
                                        className="card-body contacts_body p-0 dlab-scroll  "
                                        id="dlab_W_Contacts_Body"
                                    >
                                        <ul className="contacts">
                                            <li className="name-first-letter">
                                                A
                                            </li>
                                            <li className="active dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/1.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Archie Parker
                                                        </span>
                                                        <p>Kalid is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/2.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>Alfie Mason</span>
                                                        <p>
                                                            Taherah left 7 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/3.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>AharlieKane</span>
                                                        <p>Sami is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/4.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Athan Jacoby
                                                        </span>
                                                        <p>
                                                            Nargis left 30 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                B
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/5.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Bashid Samim
                                                        </span>
                                                        <p>
                                                            Rashid left 50 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/1.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Breddie Ronan
                                                        </span>
                                                        <p>Kalid is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/2.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Ceorge Carson
                                                        </span>
                                                        <p>
                                                            Taherah left 7 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                D
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/3.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Darry Parker
                                                        </span>
                                                        <p>Sami is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/4.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Denry Hunter
                                                        </span>
                                                        <p>
                                                            Nargis left 30 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                J
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/5.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>Jack Ronan</span>
                                                        <p>
                                                            Rashid left 50 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/1.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Jacob Tucker
                                                        </span>
                                                        <p>Kalid is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/2.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>James Logan</span>
                                                        <p>
                                                            Taherah left 7 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/3.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Joshua Weston
                                                        </span>
                                                        <p>Sami is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                O
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/4.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Oliver Acker
                                                        </span>
                                                        <p>
                                                            Nargis left 30 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="dlab-chat-user">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont">
                                                        <img
                                                            src="./assets/images/avatar/5.jpg"
                                                            className="rounded-circle user_img"
                                                            alt=""
                                                        />
                                                        <span className="online_icon offline"></span>
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Oscar Weston
                                                        </span>
                                                        <p>
                                                            Rashid left 50 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card chat dlab-chat-history-box d-none">
                                    <div className="card-header chat-list-header text-center">
                                        <a
                                            href="#"
                                            className="dlab-chat-history-back"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <polygon points="0 0 24 0 24 24 0 24" />
                                                    <rect
                                                        fill="#000000"
                                                        opacity="0.3"
                                                        transform="translate(15.000000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-15.000000, -12.000000) "
                                                        x="14"
                                                        y="7"
                                                        width="2"
                                                        height="10"
                                                        rx="1"
                                                    />
                                                    <path
                                                        d="M3.7071045,15.7071045 C3.3165802,16.0976288 2.68341522,16.0976288 2.29289093,15.7071045 C1.90236664,15.3165802 1.90236664,14.6834152 2.29289093,14.2928909 L8.29289093,8.29289093 C8.67146987,7.914312 9.28105631,7.90106637 9.67572234,8.26284357 L15.6757223,13.7628436 C16.0828413,14.136036 16.1103443,14.7686034 15.7371519,15.1757223 C15.3639594,15.5828413 14.7313921,15.6103443 14.3242731,15.2371519 L9.03007346,10.3841355 L3.7071045,15.7071045 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                        transform="translate(9.000001, 11.999997) scale(-1, -1) rotate(90.000000) translate(-9.000001, -11.999997) "
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                        <div>
                                            <h6 className="mb-1">
                                                Chat with Khelesh
                                            </h6>
                                            <p className="mb-0 text-success">
                                                Online
                                            </p>
                                        </div>
                                        <div className="dropdown">
                                            <a
                                                href="#"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xlink="http://www.w3.org/1999/xlink"
                                                    width="18px"
                                                    height="18px"
                                                    viewBox="0 0 24 24"
                                                    version="1.1"
                                                >
                                                    <g
                                                        stroke="none"
                                                        strokeWidth="1"
                                                        fill="none"
                                                        fillRule="evenodd"
                                                    >
                                                        <rect
                                                            x="0"
                                                            y="0"
                                                            width="24"
                                                            height="24"
                                                        />
                                                        <circle
                                                            fill="#000000"
                                                            cx="5"
                                                            cy="12"
                                                            r="2"
                                                        />
                                                        <circle
                                                            fill="#000000"
                                                            cx="12"
                                                            cy="12"
                                                            r="2"
                                                        />
                                                        <circle
                                                            fill="#000000"
                                                            cx="19"
                                                            cy="12"
                                                            r="2"
                                                        />
                                                    </g>
                                                </svg>
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li className="dropdown-item">
                                                    <i className="fa fa-user-circle text-primary me-2"></i>{" "}
                                                    View profile
                                                </li>
                                                <li className="dropdown-item">
                                                    <i className="fa fa-users text-primary me-2"></i>{" "}
                                                    Add to btn-close friends
                                                </li>
                                                <li className="dropdown-item">
                                                    <i className="fa fa-plus text-primary me-2"></i>{" "}
                                                    Add to group
                                                </li>
                                                <li className="dropdown-item">
                                                    <i className="fa fa-ban text-primary me-2"></i>{" "}
                                                    Block
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div
                                        className="card-body msg_card_body dlab-scroll"
                                        id="dlab_W_Contacts_Body3"
                                    >
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                Hi, how are you samim?
                                                <span className="msg_time">
                                                    8:40 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                Hi Khalid i am good tnx how
                                                about you?
                                                <span className="msg_time_send">
                                                    8:55 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                I am good too, thank you for
                                                your chat template
                                                <span className="msg_time">
                                                    9:00 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                You are welcome
                                                <span className="msg_time_send">
                                                    9:05 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                I am looking for your next
                                                templates
                                                <span className="msg_time">
                                                    9:07 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                Ok, thank you have a good day
                                                <span className="msg_time_send">
                                                    9:10 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                Bye, see you
                                                <span className="msg_time">
                                                    9:12 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                Hi, how are you samim?
                                                <span className="msg_time">
                                                    8:40 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                Hi Khalid i am good tnx how
                                                about you?
                                                <span className="msg_time_send">
                                                    8:55 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                I am good too, thank you for
                                                your chat template
                                                <span className="msg_time">
                                                    9:00 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                You are welcome
                                                <span className="msg_time_send">
                                                    9:05 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                I am looking for your next
                                                templates
                                                <span className="msg_time">
                                                    9:07 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end mb-4">
                                            <div className="msg_cotainer_send">
                                                Ok, thank you have a good day
                                                <span className="msg_time_send">
                                                    9:10 AM, Today
                                                </span>
                                            </div>
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/2.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-start mb-4">
                                            <div className="img_cont_msg">
                                                <img
                                                    src="./assets/images/avatar/1.jpg"
                                                    className="rounded-circle user_img_msg"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="msg_cotainer">
                                                Bye, see you
                                                <span className="msg_time">
                                                    9:12 AM, Today
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer type_msg">
                                        <div className="input-group">
                                            <textarea
                                                className="form-control"
                                                placeholder="Type your message..."
                                            ></textarea>
                                            <div className="input-group-append">
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fa fa-location-arrow"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="alerts"
                                role="tabpanel"
                            >
                                <div className="card mb-sm-3 mb-md-0 contacts_card">
                                    <div className="card-header chat-list-header text-center">
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        x="0"
                                                        y="0"
                                                        width="24"
                                                        height="24"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="5"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="12"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                    <circle
                                                        fill="#000000"
                                                        cx="19"
                                                        cy="12"
                                                        r="2"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                        <div>
                                            <h6 className="mb-1">
                                                Notications
                                            </h6>
                                            <p className="mb-0">Show All</p>
                                        </div>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        x="0"
                                                        y="0"
                                                        width="24"
                                                        height="24"
                                                    />
                                                    <path
                                                        d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                        opacity="0.3"
                                                    />
                                                    <path
                                                        d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                    </div>
                                    <div
                                        className="card-body contacts_body p-0 dlab-scroll"
                                        id="dlab_W_Contacts_Body1"
                                    >
                                        <ul className="contacts">
                                            <li className="name-first-letter">
                                                SEVER STATUS
                                            </li>
                                            <li className="active">
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont primary">
                                                        KK
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            David Nester
                                                            Birthday
                                                        </span>
                                                        <p className="text-primary">
                                                            Today
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                SOCIAL
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont success">
                                                        RU
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Perfection
                                                            Simplified
                                                        </span>
                                                        <p>
                                                            Jame Smith commented
                                                            on your status
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li className="name-first-letter">
                                                SEVER STATUS
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont primary">
                                                        AU
                                                    </div>
                                                    <div className="user_info">
                                                        <span>AharlieKane</span>
                                                        <p>Sami is online</p>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="img_cont info">
                                                        MO
                                                    </div>
                                                    <div className="user_info">
                                                        <span>
                                                            Athan Jacoby
                                                        </span>
                                                        <p>
                                                            Nargis left 30 mins
                                                            ago
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="card-footer"></div>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="notes">
                                <div className="card mb-sm-3 mb-md-0 note_card">
                                    <div className="card-header chat-list-header text-center">
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        fill="#000000"
                                                        x="4"
                                                        y="11"
                                                        width="16"
                                                        height="2"
                                                        rx="1"
                                                    />
                                                    <rect
                                                        fill="#000000"
                                                        opacity="0.3"
                                                        transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "
                                                        x="4"
                                                        y="11"
                                                        width="16"
                                                        height="2"
                                                        rx="1"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                        <div>
                                            <h6 className="mb-1">Notes</h6>
                                            <p className="mb-0">Add New Nots</p>
                                        </div>
                                        <a href="#">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                xlink="http://www.w3.org/1999/xlink"
                                                width="18px"
                                                height="18px"
                                                viewBox="0 0 24 24"
                                                version="1.1"
                                            >
                                                <g
                                                    stroke="none"
                                                    strokeWidth="1"
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <rect
                                                        x="0"
                                                        y="0"
                                                        width="24"
                                                        height="24"
                                                    />
                                                    <path
                                                        d="M14.2928932,16.7071068 C13.9023689,16.3165825 13.9023689,15.6834175 14.2928932,15.2928932 C14.6834175,14.9023689 15.3165825,14.9023689 15.7071068,15.2928932 L19.7071068,19.2928932 C20.0976311,19.6834175 20.0976311,20.3165825 19.7071068,20.7071068 C19.3165825,21.0976311 18.6834175,21.0976311 18.2928932,20.7071068 L14.2928932,16.7071068 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                        opacity="0.3"
                                                    />
                                                    <path
                                                        d="M11,16 C13.7614237,16 16,13.7614237 16,11 C16,8.23857625 13.7614237,6 11,6 C8.23857625,6 6,8.23857625 6,11 C6,13.7614237 8.23857625,16 11,16 Z M11,18 C7.13400675,18 4,14.8659932 4,11 C4,7.13400675 7.13400675,4 11,4 C14.8659932,4 18,7.13400675 18,11 C18,14.8659932 14.8659932,18 11,18 Z"
                                                        fill="#000000"
                                                        fillRule="nonzero"
                                                    />
                                                </g>
                                            </svg>
                                        </a>
                                    </div>
                                    <div
                                        className="card-body contacts_body p-0 dlab-scroll"
                                        id="dlab_W_Contacts_Body2"
                                    >
                                        <ul className="contacts">
                                            <li className="active">
                                                <div className="d-flex bd-highlight">
                                                    <div className="user_info">
                                                        <span>
                                                            New order placed..
                                                        </span>
                                                        <p>10 Aug 2020</p>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <a
                                                            href="#"
                                                            className="btn btn-primary btn-xs sharp me-1"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn btn-danger btn-xs sharp"
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="user_info">
                                                        <span>
                                                            Youtube, a
                                                            video-sharing
                                                            website..
                                                        </span>
                                                        <p>10 Aug 2020</p>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <a
                                                            href="#"
                                                            className="btn btn-primary btn-xs sharp me-1"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn btn-danger btn-xs sharp"
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="user_info">
                                                        <span>
                                                            john just buy your
                                                            product..
                                                        </span>
                                                        <p>10 Aug 2020</p>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <a
                                                            href="#"
                                                            className="btn btn-primary btn-xs sharp me-1"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn btn-danger btn-xs sharp"
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="d-flex bd-highlight">
                                                    <div className="user_info">
                                                        <span>
                                                            Athan Jacoby
                                                        </span>
                                                        <p>10 Aug 2020</p>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <a
                                                            href="#"
                                                            className="btn btn-primary btn-xs sharp me-1"
                                                        >
                                                            <i className="fa fa-pencil"></i>
                                                        </a>
                                                        <a
                                                            href="#"
                                                            className="btn btn-danger btn-xs sharp"
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="header">
                    <div className="header-content">
                        <nav className="navbar navbar-expand">
                            <div className="navbar-collapse justify-content-between">
                                <div className="header-left">
                                    <div
                                        style={{ textTransform: "capitalize" }}
                                        className="dashboard_bar mt-3"
                                    >
                                        <b>
                                            {Menu[1]
                                                ? Menu[1].replace("_", " ")
                                                : Menu[0].replace("_", " ")}
                                        </b>
                                    </div>
                                </div>
                                <ul className="navbar-nav header-right">
                                    <li className="nav-item">
                                        <div className="input-group search-area">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search here..."
                                            ></input>
                                            <span className="input-group-text">
                                                <a>
                                                    <i className="flaticon-381-search-2"></i>
                                                </a>
                                            </span>
                                        </div>
                                    </li>
                                    {/* <li className="nav-item dropdown notification_dropdown">
                                        <a
                                            className="nav-link"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                        >
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                {" "}
                                                <path
                                                    d="M3.88552 6.2921C1.95571 6.54135 0.439911 8.19656 0.439911 10.1896V10.7253C0.439911 12.8874 2.21812 14.6725 4.38019 14.6725H12.7058V24.9768H7.01104C5.77451 24.9768 4.82009 24.0223 4.82009 22.7858V18.4039C4.84523 16.6262 2.16581 16.6262 2.19096 18.4039V22.7858C2.19096 25.4334 4.36345 27.6059 7.01104 27.6059H21.0331C23.6807 27.6059 25.8532 25.4334 25.8532 22.7858V13.9981C26.9064 13.286 27.6042 12.0802 27.6042 10.7253V10.1896C27.6042 8.17115 26.0501 6.50077 24.085 6.28526C24.0053 0.424609 17.6008 -1.28785 13.9827 2.48534C10.3936 -1.60185 3.7545 1.06979 3.88552 6.2921ZM12.7058 5.68103C12.7058 5.86287 12.7033 6.0541 12.7058 6.24246H6.50609C6.55988 2.31413 11.988 1.90765 12.7058 5.68103ZM21.4559 6.24246H15.3383C15.3405 6.05824 15.3538 5.87664 15.3383 5.69473C15.9325 2.04532 21.3535 2.18829 21.4559 6.24246ZM4.38019 8.87502H12.7058V12.0382H4.38019C3.62918 12.0382 3.06562 11.4764 3.06562 10.7253V10.1896C3.06562 9.43859 3.6292 8.87502 4.38019 8.87502ZM15.3383 8.87502H23.6656C24.4166 8.87502 24.9785 9.43859 24.9785 10.1896V10.7253C24.9785 11.4764 24.4167 12.0382 23.6656 12.0382H15.3383V8.87502ZM15.3383 14.6725H23.224V22.7858C23.224 24.0223 22.2696 24.9768 21.0331 24.9768H15.3383V14.6725Z"
                                                    fill="#4f7086"
                                                />
                                            </svg>
                                            <span className="badge light text-white bg-primary rounded-circle">
                                                2
                                            </span>
                                        </a>
                                        <div
                                            className="dropdown-menu dropdown-menu-end"
                                            id="timeLineId"
                                        >
                                            <div
                                                id="dlab_W_TimeLine02"
                                                className="widget-timeline dlab-scroll style-1 ps ps--active-y p-3 height370"
                                            >
                                                <ul className="timeline">
                                                    <li>
                                                        <div className="timeline-badge primary"></div>
                                                        <a className="timeline-panel text-muted">
                                                            <span>
                                                                10 minutes ago
                                                            </span>
                                                            <h6 className="mb-0">
                                                                Youtube, a
                                                                video-sharing
                                                                website, goes
                                                                live{" "}
                                                                <strong className="text-primary">
                                                                    $500
                                                                </strong>
                                                                .
                                                            </h6>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown notification_dropdown">
                                        <a
                                            className="nav-link"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                        >
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12.638 4.9936V2.3C12.638 1.5824 13.2484 1 14.0006 1C14.7513 1 15.3631 1.5824 15.3631 2.3V4.9936C17.3879 5.2718 19.2805 6.1688 20.7438 7.565C22.5329 9.2719 23.5384 11.5872 23.5384 14V18.8932L24.6408 20.9966C25.1681 22.0041 25.1122 23.2001 24.4909 24.1582C23.8709 25.1163 22.774 25.7 21.5941 25.7H15.3631C15.3631 26.4176 14.7513 27 14.0006 27C13.2484 27 12.638 26.4176 12.638 25.7H6.40705C5.22571 25.7 4.12888 25.1163 3.50892 24.1582C2.88759 23.2001 2.83172 22.0041 3.36039 20.9966L4.46268 18.8932V14C4.46268 11.5872 5.46691 9.2719 7.25594 7.565C8.72068 6.1688 10.6119 5.2718 12.638 4.9936ZM14.0006 7.5C12.1924 7.5 10.4607 8.1851 9.18259 9.4045C7.90452 10.6226 7.18779 12.2762 7.18779 14V19.2C7.18779 19.4015 7.13739 19.6004 7.04337 19.7811C7.04337 19.7811 6.43703 20.9381 5.79662 22.1588C5.69171 22.3603 5.70261 22.6008 5.82661 22.7919C5.9506 22.983 6.16996 23.1 6.40705 23.1H21.5941C21.8298 23.1 22.0492 22.983 22.1732 22.7919C22.2972 22.6008 22.3081 22.3603 22.2031 22.1588C21.5627 20.9381 20.9564 19.7811 20.9564 19.7811C20.8624 19.6004 20.8133 19.4015 20.8133 19.2V14C20.8133 12.2762 20.0953 10.6226 18.8172 9.4045C17.5391 8.1851 15.8073 7.5 14.0006 7.5Z"
                                                    fill="#4f7086"
                                                />
                                            </svg>
                                            <span className="badge light text-white bg-primary rounded-circle">
                                                12
                                            </span>
                                        </a>
                                        <div
                                            className="dropdown-menu dropdown-menu-end"
                                            id="notifId"
                                        >
                                            <div
                                                id="dlab_W_Notification1"
                                                className="widget-media dlab-scroll p-3"
                                                style={{ height: "380px" }}
                                            >
                                                <ul className="timeline">
                                                    <li>
                                                        <div className="timeline-panel">
                                                            <div className="media me-2">
                                                                <img
                                                                    alt="image"
                                                                    width="50"
                                                                    src="./assets/images/avatar/1.jpg"
                                                                ></img>
                                                            </div>
                                                            <div className="media-body">
                                                                <h6 className="mb-1">
                                                                    Dr sultads
                                                                    Send you
                                                                    Photo
                                                                </h6>
                                                                <small className="d-block">
                                                                    29 July 2020
                                                                    - 02:26 PM
                                                                </small>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <a className="all-notification">
                                                See all notifications{" "}
                                                <i className="ti-arrow-end"></i>
                                            </a>
                                        </div>
                                    </li> */}
                                    {/* <li className="nav-item dropdown notification_dropdown">
                                        <a className="nav-link bell bell-link">
                                            <svg
                                                width="28"
                                                height="28"
                                                viewBox="0 0 28 28"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M27 7.88883C27 5.18897 24.6717 3 21.8 3C17.4723 3 10.5277 3 6.2 3C3.3283 3 1 5.18897 1 7.88883V23.7776C1 24.2726 1.31721 24.7174 1.80211 24.9069C2.28831 25.0963 2.8473 24.9912 3.2191 24.6417C3.2191 24.6417 5.74629 22.2657 7.27769 20.8272C7.76519 20.3688 8.42561 20.1109 9.11591 20.1109H21.8C24.6717 20.1109 27 17.922 27 15.2221V7.88883ZM24.4 7.88883C24.4 6.53951 23.2365 5.44441 21.8 5.44441C17.4723 5.44441 10.5277 5.44441 6.2 5.44441C4.7648 5.44441 3.6 6.53951 3.6 7.88883V20.8272L5.4382 19.0989C6.4132 18.1823 7.73661 17.6665 9.11591 17.6665H21.8C23.2365 17.6665 24.4 16.5726 24.4 15.2221V7.88883ZM7.5 15.2221H17.9C18.6176 15.2221 19.2 14.6745 19.2 13.9999C19.2 13.3252 18.6176 12.7777 17.9 12.7777H7.5C6.7824 12.7777 6.2 13.3252 6.2 13.9999C6.2 14.6745 6.7824 15.2221 7.5 15.2221ZM7.5 10.3333H20.5C21.2176 10.3333 21.8 9.7857 21.8 9.11104C21.8 8.43638 21.2176 7.88883 20.5 7.88883H7.5C6.7824 7.88883 6.2 8.43638 6.2 9.11104C6.2 9.7857 6.7824 10.3333 7.5 10.3333Z"
                                                    fill="#4f7086"
                                                />
                                            </svg>
                                            <span className="badge light text-white bg-primary rounded-circle">
                                                5
                                            </span>
                                        </a>
                                    </li> */}
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>
                <div className="content-body">
                    <div className="container-fluid">
                        <main>{children}</main>
                    </div>
                </div>
            </div>
            {ScriptCustom()}
            {ScriptNav()}
            {<style>{styleCustom}</style>}
            {<style>{styleReactSelect}</style>}
        </>
    );
}
