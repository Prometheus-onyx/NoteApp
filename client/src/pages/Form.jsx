import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "../components/LoadingIndicator";
import NotFound from "../pages/NotFound"



 const Form = ({ route, method }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const res = await api.post(route, { username, password });
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/");
            } else {
                navigate("/login");
            }
        } catch (error) {
            <NotFound />
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">{method === "login" ? "Login" : "Register"}</h2>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-300">Name</label>
                    <input
                        required
                        type="text"
                        id="name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-zinc-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name..."
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-300">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-zinc-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password..."
                    />
                </div>
                {loading && <LoadingIndicator />}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {method === "login" ? "Login" : "Register"}
                </button>
                <p className="mt-9 text-gray-300">
                    {method === "login"
                        ? "Don't have an account? "
                        : "Already have an account? "}
                    <Link to={method === "login" ? "/register" : "/login"} className="text-blue-500 hover:underline">
                        {method === "login" ? "Register!" : "Login"}
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Form;
