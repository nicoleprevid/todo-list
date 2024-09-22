// src/TodoList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [message, setMessage] = useState('');

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:25000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  };

  const addTodo = async () => {
    if (!task) return;

    try {
      const response = await axios.post('http://localhost:25000/api/todos', { 
        task, 
        completed: false // Garantindo que completed seja false ao adicionar
      });
      setTodos([...todos, response.data]);
      setTask('');
      setMessage('Tarefa adicionada com sucesso!'); // Mensagem de sucesso
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setMessage('Erro ao adicionar tarefa. Tente novamente.'); // Mensagem de erro
    }
  };

  const completeTodo = async (id) => {
    try {
      await axios.put(`http://localhost:25000/api/todos/${id}`);
      setTodos(todos.map(todo => (todo._id === id ? { ...todo, completed: true } : todo)));
    } catch (error) {
      console.error('Erro ao concluir tarefa:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:25000/api/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">To Do List</h1>
      <div className="flex mb-4">
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Adicionar nova tarefa"
          className="flex-1 border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          onClick={addTodo}
          className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 transition duration-200"
        >
          Adicionar
        </button>
      </div>
      {message && (
        <div className="mb-4 text-center text-red-500">
          {message}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-2">Tarefas Existentes:</h2>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex justify-between items-center p-2 border-b border-gray-200">
            <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.task}
            </span>
            <div>
              <button 
                onClick={() => completeTodo(todo._id)}
                className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition duration-200"
              >
                Concluir
              </button>
              <button 
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition duration-200 ml-2"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
