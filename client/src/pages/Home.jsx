import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";


export default function Home() {
    const [notes, SetNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => SetNotes(res.data))
            .catch((err) => {
                alert(err);
            });
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204){
                    // alert or console.log("Note deleted");
                    getNotes();
                }
                else {
                    alert("Failed to delete note..");
                }
            })
            .catch(() => alert("You'd wanna refresh this page!!!"));
        //getNotes();    
    };

    const createNote = (e) => {
        e.preventDefault()
        api
            .post("/api/notes/", { content, title})
            .then((res) => {
                if (res.status === 201){
                    //console.log("Note created!!");
                    getNotes();
                }
                else {
                    alert("Failed to create note.");
                }
            })
            .catch((err) => alert(err));
        //getNotes();
    };

    useEffect(() => {
        getNotes();
    }, []);

    return (
        <div className="py-24 text-center">
            <div>
                <h2 className="text-6xl md:text-7xl font-extrabold bg-clip-text">Notes</h2>
                <h2 className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)}
                </h2>
            </div>
            <h2 className="text-2xl font-bold mb-4">Create a Note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-zinc-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <br />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-zinc-800 text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <br />
                <button type="submit" value="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Submit
                </button>
            </form>
        </div>
    );
}

