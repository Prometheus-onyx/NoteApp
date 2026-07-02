import Form from "./Form";

export default function Login() {
    return (
        <div>
            <Form route="/api/token/" method="login" />
        </div>
    );//<Form route="/api/token/" method="login" />
}