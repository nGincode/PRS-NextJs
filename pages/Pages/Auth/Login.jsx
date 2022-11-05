import React, { useEffect } from "react";
import Button from "@/Components/Button";
import Checkbox from "@/Components/Checkbox";
import Guest from "@/Layouts/Guest";
import Input from "@/Components/Input";
import InputError from "@/Components/InputError";
import Label from "@/Components/Label";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const onHandleChange = (event) => {
        setData(
            event.target.name,
            event.target.type === "checkbox"
                ? event.target.checked
                : event.target.value
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <Guest>
            <Head title="Login" />
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
                                                            src="./assets/logo/prs.png"
                                                            alt=""
                                                            width="150px"
                                                            className="img-fluid"
                                                        />
                                                    </center>
                                                </Link>
                                            </div>
                                            <h4 className="text-center mb-4">
                                                Sign in your account
                                            </h4>
                                            {status && (
                                                <p className="text-success">
                                                    {status}
                                                </p>
                                            )}
                                            <form onSubmit={submit}>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="email"
                                                        value="Email"
                                                    />
                                                    <Input
                                                        type="text"
                                                        name="email"
                                                        value={data.email}
                                                        className="form-control"
                                                        autoComplete="username"
                                                        pleaceholder="Email"
                                                        isFocused={true}
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                    />
                                                    <InputError
                                                        message={errors.email}
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="password"
                                                        value="Password"
                                                    />
                                                    <Input
                                                        type="password"
                                                        name="password"
                                                        pleaceholder="Password"
                                                        value={data.password}
                                                        className="form-control"
                                                        autoComplete="current-password"
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                    />

                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="row d-flex justify-content-between mt-4 mb-2">
                                                    <div className="mb-3">
                                                        <div className="form-check custom-checkbox ms-1">
                                                            <Checkbox
                                                                name="remember"
                                                                value={
                                                                    data.remember
                                                                }
                                                                handleChange={
                                                                    onHandleChange
                                                                }
                                                                className="form-check-input"
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor="basic_checkbox_1"
                                                            >
                                                                Remember my
                                                                preference
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {canResetPassword && (
                                                        <Link
                                                            href={route(
                                                                "password.request"
                                                            )}
                                                        >
                                                            Forgot your
                                                            password?
                                                        </Link>
                                                    )}
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="btn btn-primary btn-block"
                                                    processing={processing}
                                                >
                                                    Sign In
                                                </Button>
                                            </form>
                                            <div className="new-account mt-3">
                                                <p>
                                                    Don't have an account?{" "}
                                                    <Link
                                                        className="text-primary"
                                                        href={route("register")}
                                                    >
                                                        Sign up
                                                    </Link>
                                                </p>
                                            </div>
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
