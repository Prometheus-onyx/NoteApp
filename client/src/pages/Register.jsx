import React from "react";
import Form from "./Form";

export default function Register() {
    return (
        <div>
            <Form route="/api/user/register/" method="register" />
        </div>
    );
}