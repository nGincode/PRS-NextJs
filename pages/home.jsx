import React from "react";
import { Link, Head } from "@inertiajs/inertia-react";
import Guest from "@/Layouts/Guest";
import ApplicationLogo from "@/Components/ApplicationLogo";

import { FaSignInAlt } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { FaList } from "react-icons/fa";

export default function Welcome(props) {
    return (
        <>
            <Guest auth={props.auth} header={<b>Home</b>}>
                <Head title="Home" />
                <div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900  sm:items-center">
                    <div className="fixed top-0 right-0 px-6 py-4 sm:block">
                        {props.auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="text-sm text-gray-700 dark:text-white "
                            >
                                <FaHome /> Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="text-sm text-gray-700 dark:text-white"
                                >
                                    <FaSignInAlt /> Log in
                                </Link>

                                <Link
                                    href={route("register")}
                                    className="ml-4 text-sm text-gray-700 dark:text-white"
                                >
                                    <FaList /> Register
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-center mt-20 sm:items-center sm:justify-between">
                            <ApplicationLogo width="150px" />
                        </div>
                    </div>
                </div>
            </Guest>
        </>
    );
}
