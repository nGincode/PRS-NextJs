import React, { useState, useRef, useEffect } from "react";

const Validate = (id, array, selectArray) => {
    $(id).validate({
        errorElement: "span",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            element.closest(".form-group").append(error);
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid");
            $(element).removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass("is-invalid");
        },
        success: function (validClass, element) {
            $(element).addClass("is-valid");
        },
        rules: array,
    });
    let selectError = true;
    if (selectArray) {
        selectArray.map((value, i) => {
            if (
                $(`input[name='${value}[]']`).val() ||
                $(`input[name='${value}']`).val()
            ) {
                $(`#${value}`).removeClass("is-invalid");
                $(`#${value}`).addClass("is-valid");
                $(".invalid-feedback-select")
                    .html("")
                    .removeClass("invalid-feedback-select");
            } else {
                selectError = false;
                $(`#${value}`).removeClass("is-valid");
                $(`#${value}`).addClass("is-invalid");
                if (!$(`#invalid${value}`).length) {
                    $(`#${value}`).after(
                        `<span class='invalid-feedback-select' id='invalid${value}'>This field is required.</span>`
                    );
                }
            }
        });
    }

    if ($(id).valid() && selectError) {
        return true;
    } else {
        return false;
    }
};

export default Validate;
