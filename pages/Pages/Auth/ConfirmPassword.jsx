import React, { useEffect } from "react";
import Button from "@/Components/Button";
import Guest from "@/Layouts/Guest";
import Input from "@/Components/Input";
import InputError from "@/Components/InputError";
import Label from "@/Components/Label";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("password.confirm"));
    };

    return (
        <Guest>
            <Head title="Confirm Password" />
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
                                                            src="/assets/logo/prs.png"
                                                            alt=""
                                                            width="150px"
                                                            className="img-fluid"
                                                        />
                                                    </center>
                                                </Link>
                                            </div>
                                            <h4 className="text-center mb-4">
                                                Account security
                                            </h4>
                                            <p>
                                                This is a secure area of the
                                                application. Please confirm your
                                                password before continuing.
                                            </p>
                                            <form onSubmit={submit}>
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
                                                <div className="text-center mt-4">
                                                    <Button
                                                        className="btn btn-primary btn-block"
                                                        processing={processing}
                                                    >
                                                        Confirm
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
