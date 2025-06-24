import React, { useState, useEffect } from "react";
import axios from "axios";

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTtile] = useState("");
    const [description, setDescription]  = useState("");
    // just for testing
    const user_id = 1; 

    useEffect(()=> {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try{
            const response = await axios.get(`https://technians-backend.onrender.com/api/todos/${user_id}`);
            setTodos(response.data);
        } catch (err) {
            console.error("Error fetching todos", err);
        }
    }
};

const handleAddTodo = async (e) => {
    e.preventDefault();
    if(!title.trim()) return alert ("Title is required");

    try{
        await axios.post("https://technians-backend.onrender.com/api/todos", {
            user_id, title, description,
        });

        setTitle("");
        setDescription("");
        fetchTodos();
    } catch (err) {
        console.error("Error adding todos", err);
    }
};

const handleToggleStatus = async (id, currentStatus) => {
    try{
        await axios.put(`https://technians-backend.onrender.com/api/todos/${id}`, {
            status: !currentStatus,
        });
    } catch (err) {
        console.error("Error updating todo", err)
    }
};

const handleDeleteTodo = async (id) => {
    try{
        await axios.delete(`https://technians-backend.onrender.com/api/todos/${id}`);
        fetchTodos();
    } catch (err) {
        console.error("Error deleteing todo:", err);
    }
};

return(
    <div className="container">
        <h2>Todo List</h2>

        <form onSubmit={handleAddTodo}>
            <input type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
            <input type="text" 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
            <button type="submit">Add Todo</button>

        </form>
    </div>
);

export default TodoList