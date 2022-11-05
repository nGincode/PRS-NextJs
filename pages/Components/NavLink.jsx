import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function NavLink({ href, active, activeInf, children }) {
    return (
        <Link href={href} className={active == activeInf ? "m-active" : ""}>
            {children}
        </Link>
    );
}
