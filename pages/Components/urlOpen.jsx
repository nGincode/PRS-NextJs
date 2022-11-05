import { useEffect } from "react";

const urlOpen = (id) => {
    useEffect(() => {
        if (id === "Auth")
            if (
                localStorage.getItem("urlOpen") === "/" ||
                localStorage.getItem("urlOpen") === "/login" ||
                localStorage.getItem("urlOpen") === "/register" ||
                localStorage.getItem("urlOpen") === "/forgot-password"
            ) {
                window.location.reload();
                localStorage.setItem("urlOpen", props.url);
                console.log(localStorage.getItem("urlOpen"));
            }

        if (id === "Guest") {
            if (
                localStorage.getItem("urlOpen") === "/" ||
                localStorage.getItem("urlOpen") === "/login" ||
                localStorage.getItem("urlOpen") === "/register" ||
                localStorage.getItem("urlOpen") === "/forgot-password" ||
                localStorage.getItem("urlOpen") === "/verify-email"
            ) {
            } else {
                window.location.reload();
                localStorage.setItem("urlOpen", props.url);
                console.log(localStorage.getItem("urlOpen"));
            }
        }
    }, []);
};

export default urlOpen;
