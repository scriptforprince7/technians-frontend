import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../src/AddProduct.css";

const TodoList = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.warn("Title is required");

    try {
      await axios.post(
        "https://technians-backend.onrender.com/api/todos",
        { title, description },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("Todo added successfully!");
      setTitle("");
      setDescription("");
      navigate("/dashboard/all-products");
    } catch (err) {
      console.error("Error adding todo:", err.response?.data || err.message);
      toast.error("❌ Failed to add todo");
    }
  };

  return (
    <div className="container">
      <h2>Add New Todo</h2>

      <form onSubmit={handleAddTodo}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
};

export default TodoList;
