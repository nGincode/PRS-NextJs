import React, { useEffect } from "react";
import Button from "@/Components/Button";
import Guest from "@/Layouts/Guest";
import Input from "@/Components/Input";
import InputError from "@/Components/InputError";
import Label from "@/Components/Label";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
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

    const username = (event) => {
        console.log(event);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("register"));
    };

    return (
        <Guest>
            <Head title="Register" />
            <div className="authincation h-100">
                <div className="container h-100  mt-4">
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
                                                Sign up your account
                                            </h4>
                                            <form onSubmit={submit}>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="username"
                                                        value="Username"
                                                    />

                                                    <Input
                                                        type="text"
                                                        name="username"
                                                        value={data.username}
                                                        className="form-control"
                                                        pleaceholder="Fembi19"
                                                        autoComplete="username"
                                                        maxLength="20"
                                                        isFocused={true}
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                        onChange={() => {
                                                            username(1);
                                                        }}
                                                        required
                                                    />

                                                    <InputError
                                                        message={
                                                            errors.username
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="email"
                                                        value="Email"
                                                    />

                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={data.email}
                                                        className="form-control"
                                                        pleaceholder="abcd123@gmail.com"
                                                        autoComplete="email"
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                        required
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
                                                        value={data.password}
                                                        className="form-control"
                                                        pleaceholder="********"
                                                        autoComplete="new-password"
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                        required
                                                    />

                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <Label
                                                        forInput="password_confirmation"
                                                        value="Confirm Password"
                                                    />

                                                    <Input
                                                        type="password"
                                                        name="password_confirmation"
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        className="form-control"
                                                        pleaceholder="Confirm Password"
                                                        autoComplete="password_confirmation"
                                                        handleChange={
                                                            onHandleChange
                                                        }
                                                        required
                                                    />

                                                    <InputError
                                                        message={
                                                            errors.password_confirmation
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>
                                                <div className="text-center mt-4">
                                                    <Button
                                                        className="btn btn-primary btn-block"
                                                        processing={processing}
                                                    >
                                                        Register
                                                    </Button>
                                                </div>
                                            </form>
                                            <div className="new-account mt-3">
                                                <p>
                                                    Already have an account?{" "}
                                                    <Link
                                                        href={route("login")}
                                                        className="text-primary"
                                                    >
                                                        Sign in
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
