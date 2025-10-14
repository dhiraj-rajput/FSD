import React, { useState } from 'react';
import { Trash2, Plus, CheckCircle, Circle, Calendar } from 'lucide-react';

// TaskItem Component - Displays individual task
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(task.id, editText);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500">
      <button
        onClick={() => onToggle(task.id)}
        className="flex-shrink-0 text-blue-500 hover:text-blue-700 transition-colors"
        aria-label="Toggle task"
      >
        {task.completed ? (
          <CheckCircle size={24} className="fill-blue-500" />
        ) : (
          <Circle size={24} />
        )}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm md:text-base truncate ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {task.text}
            </p>
            {task.dueDate && (
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={14} /> {task.dueDate}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors hidden sm:block"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={20} />
          </button>
        </>
      )}
    </div>
  );
}

// TaskForm Component - Form to add new tasks
function TaskForm({ onAddTask }) {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onAddTask(input, dueDate);
      setInput('');
      setDueDate('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold"
        >
          <Plus size={20} /> Add
        </button>
      </div>
    </div>
  );
}

// TaskStats Component - Shows task statistics
function TaskStats({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pending = total - completed;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
        <p className="text-sm font-semibold opacity-90">Total Tasks</p>
        <p className="text-3xl font-bold">{total}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
        <p className="text-sm font-semibold opacity-90">Completed</p>
        <p className="text-3xl font-bold">{completed}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
        <p className="text-sm font-semibold opacity-90">Pending</p>
        <p className="text-3xl font-bold">{pending}</p>
      </div>
    </div>
  );
}

// Filter Component - Filter tasks by status
function FilterButtons({ filter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {['all', 'active', 'completed'].map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-4 py-2 rounded-full font-semibold transition-all ${
            filter === f
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}

// Main TaskManager Component
export default function TaskManager() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete React project', completed: false, dueDate: '2025-10-15' },
    { id: 2, text: 'Review documentation', completed: true, dueDate: '2025-10-10' },
    { id: 3, text: 'Test responsive design', completed: false, dueDate: '' }
  ]);
  const [filter, setFilter] = useState('all');

  // Add new task
  const handleAddTask = (text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      dueDate
    };
    setTasks([newTask, ...tasks]);
  };

  // Toggle task completion
  const handleToggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Edit task
  const handleEditTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Stay organized and boost your productivity</p>
        </div>

        {/* Task Stats */}
        <TaskStats tasks={tasks} />

        {/* Task Form */}
        <TaskForm onAddTask={handleAddTask} />

        {/* Filter Buttons */}
        <FilterButtons filter={filter} onFilterChange={setFilter} />

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">
                {filter === 'all' 
                  ? 'No tasks yet. Create one to get started!' 
                  : `No ${filter} tasks.`}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Made with React • Responsive Design for All Devices</p>
        </div>
      </div>
    </div>
  );
}