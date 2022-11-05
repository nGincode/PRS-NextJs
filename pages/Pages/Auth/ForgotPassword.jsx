import React from "react";
import Button from "@/Components/Button";
import Guest from "@/Layouts/Guest";
import Input from "@/Components/Input";
import InputError from "@/Components/InputError";
import Label from "@/Components/Label";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <Guest>
            <Head title="Forgot Password" />

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
                                                Forgot Password
                                            </h4>
                                            <p>
                                                Forgot your password? No
                                                problem. Just let us know your
                                                email address and we will email
                                                you a password reset link that
                                                will allow you to choose a new
                                                one.
                                            </p>
                                            <form onSubmit={submit}>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="email"
                                                        value="Email"
                                                    />
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        pleaceholder="Email"
                                                        className="form-control"
                                                        isFocused={true}
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                        className="mt-2"
                                                    />
                                                    {status && (
                                                        <div className="text-success">
                                                            {status}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <Button
                                                        className="btn btn-primary btn-block"
                                                        processing={processing}
                                                    >
                                                        Email Password Reset
                                                        Link
                                                    </Button>
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
