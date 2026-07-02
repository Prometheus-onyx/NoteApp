export default function Note({ note, onDelete }) {
    // Assuming note.created_at is in ISO format, e.g., "2023-03-14T15:09:03.000Z"
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

    return (
        <div className="bg-zinc-800 p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
            <p className="text-gray-300">{note.content}</p>
            <p className="text-gray-400 mt-2">{formattedDate}</p>
            <button className="hover:text-pink-500" onClick={() => onDelete(note.id)}>
                Delete!
            </button>
        </div>
    );
}