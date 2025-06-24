import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../AllProducts.css";

const AllTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTodos(response.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
        setError("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [token, navigate]);

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));

      toast.success("Todo deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo");

      toast.error("Failed to delete todo!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.id);
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
  };

  const handleEditTodo = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/todos/${id}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? response.data : todo))
      );
      setEditingTodo(null);
      toast.success("Todo updated successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.error("Error updating todo:", err);
      toast.error("Failed to update todo!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  if (loading) return <p>Loading todos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="todos-container">
      <h1>All Todos</h1>
      <Link to="/dashboard/add-product" className="add-todo-btn">➕ Add New Todo</Link>

      {todos.length === 0 ? (
        <p>No todos found!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {editingTodo === todo.id ? (
                <>
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                  />
                  <button onClick={() => handleEditTodo(todo.id)}>💾 Save</button>
                  <button onClick={() => setEditingTodo(null)}>❌ Cancel</button>
                </>
              ) : (
                <>
                  <strong>{todo.title}</strong>: {todo.description}
                  <button onClick={() => startEditing(todo)}>✏️ Edit</button>
                  <button onClick={() => handleDeleteTodo(todo.id)}>❌ Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllTodos;