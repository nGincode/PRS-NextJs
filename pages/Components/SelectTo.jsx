import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";

import Select from "react-select";
import SelectCreate from "react-select/creatable";
import AsyncSelect from "react-select/async";

export default function SelectTo({
    search,
    create,
    multi,
    id,
    name,
    data,
    defaultValue,
    className,
    csrf_token,
    api,
    post,
}) {
    if (defaultValue && multi) {
        var dataSelect = [...defaultValue].concat(data);
    } else {
        var dataSelect = data;
    }

    // const [options, setoptions] = useState(dataSelect);

    // const handleChange = (val) => {
    //     if (val.__isNew__) {
    //         setoptions((options) => [
    //             ...options,
    //             { value: val.value, label: val.label },
    //         ]);
    //         console.log("oke");
    //     }
    // };

    // const loadOptions = (inputValue) => {
    //     return new Promise((resolve, reject) => {
    //         axios({
    //             method: "POST",
    //             url: api,
    //             data: post,
    //             headers: {
    //                 "Content-Type": "multipart/form-data",
    //                 "X-CSRF-TOKEN": csrf_token,
    //             },
    //         }).then((res) => {
    //             if (defaultValue) {
    //                 resolve(
    //                     filter(
    //                         inputValue,
    //                         [...defaultValue].concat(res.data.data)
    //                     )
    //                 );
    //             } else {
    //                 resolve(filter(inputValue, res.data.data));
    //             }
    //         });
    //     });
    // };

    // const filter = (inputValue, valOption) =>
    //     valOption.filter((val) =>
    //         val.label.toLowerCase().includes(inputValue.toLowerCase())
    //     );

    const [value, setvalue] = useState();
    useEffect(() => {
        setvalue(defaultValue);
    }, [defaultValue]);

    const handleOnChangeReactSelect = (val) => {
        setvalue(val);
    };

    const handleOnChangeDefault = (val) => {
        setvalue(val.target.value);
    };
    return (
        <>
            {search && create ? (
                <SelectCreate
                    name={name}
                    placeholder="Choose..."
                    onChange={handleOnChangeReactSelect}
                    options={dataSelect}
                    createOptionPosition="first"
                    className="form-control"
                    classNamePrefix="react-select"
                    id={id}
                />
            ) : search ? (
                <Select
                    options={dataSelect}
                    name={name}
                    value={value}
                    onChange={handleOnChangeReactSelect}
                    className="form-control"
                    classNamePrefix="react-select"
                    id={id}
                />
            ) : multi ? (
                <Select
                    id={id}
                    className="form-control"
                    classNamePrefix="react-select"
                    name={name}
                    isMulti
                    options={dataSelect}
                    value={value}
                    onChange={handleOnChangeReactSelect}
                />
            ) : (
                <select
                    name={name}
                    id={id}
                    value={value}
                    onChange={handleOnChangeDefault}
                    className={`form-control ` + (className ?? "")}
                >
                    <option value="" disabled>
                        Choose...
                    </option>
                    {data.map((val, i) => {
                        return (
                            <option key={i} value={val.value}>
                                {val.label}
                            </option>
                        );
                    })}
                </select>
            )}
        </>
    );
}
