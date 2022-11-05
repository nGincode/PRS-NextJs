import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";

import urlOpen from "@/Components/urlOpen";

export default function Guest({ auth, header, children }) {
    urlOpen("Guest");
    return (
        <>
            <Helmet>
                <link rel="stylesheet" href="/assets/css/style.css" />
            </Helmet>
            {children}
        </>
    );
}
