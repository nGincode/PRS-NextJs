import React from "react";
import Button from "@/Components/Button";
import Guest from "@/Layouts/Guest";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm();

    const submit = (e) => {
        e.preventDefault();

        post(route("verification.send"));
    };

    return (
        <Guest>
            <Head title="Email Verification" />

            <div className="authincation h-100">
                <div className="container h-100 mt-4">
                    <div className="row justify-content-center h-100 align-items-center">
                        <div className="col-md-6">
                            <div className="authincation-content">
                                <div className="row no-gutters">
                                    <div className="col-xl-12">
                                        <div className="auth-form">
                                            <div className="text-center mb-3">
                                                <Link href="/">
                                                    <center>
                                                        <img
                                                            src="/assets/logo/prs.png"
                                                            alt=""
                                                            width="150px"
                                                            className="img-fluid"
                                                        />
                                                    </center>
                                                </Link>
                                            </div>
                                            <h4 className="text-center mb-4">
                                                Verification Email
                                            </h4>
                                            <p>
                                                Thanks for signing up! Before
                                                getting started, could you
                                                verify your email address by
                                                clicking on the link we just
                                                emailed to you? If you didn't
                                                receive the email, we will
                                                gladly send you another.
                                                <br />
                                            </p>
                                            {status ===
                                                "verification-link-sent" && (
                                                <div className="text-success">
                                                    A new verification link has
                                                    been sent to the email
                                                    address you provided during
                                                    registration.
                                                    <br />
                                                </div>
                                            )}
                                            <form onSubmit={submit}>
                                                <div className="text-center">
                                                    <Button
                                                        className="btn btn-primary btn-block"
                                                        processing={processing}
                                                    >
                                                        Resend Verification
                                                        Email
                                                    </Button>
                                                    <br />
                                                    <Link
                                                        href={route("logout")}
                                                        method="GET"
                                                        as="button"
                                                        className="btn btn-danger btn-block "
                                                    >
                                                        Log Out
                                                    </Link>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Guest>
    );
}
