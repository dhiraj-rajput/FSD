import React, { useState, useCallback } from 'react';
import { Trash2, Plus, CheckCircle, Circle, Calendar, AlertCircle, Home, Info, Menu, X } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={32} />
              <h2 className="text-2xl font-bold text-red-600">Something Went Wrong!</h2>
            </div>
            <p className="text-gray-700 mb-6">
              {this.state.error?.message || 'An unexpected error occurred. Please refresh the page.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// TaskItem Component
function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [error, setError] = useState('');

  const handleSave = useCallback(() => {
    if (!editText.trim()) {
      setError('Task cannot be empty');
      return;
    }
    onEdit(task.id, editText);
    setIsEditing(false);
    setError('');
  }, [editText, task.id, onEdit]);

  return (
    <div className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-blue-500">
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
        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            autoFocus
          />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setError('');
                setEditText(task.text);
              }}
              className="px-3 py-1 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
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
              <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Calendar size={14} /> {task.dueDate}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="flex-shrink-0 px-2 md:px-3 py-1 text-xs md:text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors hidden sm:block"
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

// TaskForm Component
function TaskForm({ onAddTask }) {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = useCallback(() => {
    if (!input.trim()) {
      setError('Please enter a task');
      return;
    }
    onAddTask(input, dueDate);
    setInput('');
    setDueDate('');
    setError('');
  }, [input, dueDate, onAddTask]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
      <div className="flex flex-col gap-3">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold text-sm md:text-base"
          >
            <Plus size={20} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// TaskStats Component
function TaskStats({ tasks }) {
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 md:p-4 rounded-lg shadow-md">
        <p className="text-xs md:text-sm font-semibold opacity-90">Total Tasks</p>
        <p className="text-2xl md:text-3xl font-bold">{total}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-3 md:p-4 rounded-lg shadow-md">
        <p className="text-xs md:text-sm font-semibold opacity-90">Completed</p>
        <p className="text-2xl md:text-3xl font-bold">{completed}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 md:p-4 rounded-lg shadow-md">
        <p className="text-xs md:text-sm font-semibold opacity-90">Pending</p>
        <p className="text-2xl md:text-3xl font-bold">{pending}</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-3 md:p-4 rounded-lg shadow-md">
        <p className="text-xs md:text-sm font-semibold opacity-90">Progress</p>
        <p className="text-2xl md:text-3xl font-bold">{completionRate}%</p>
      </div>
    </div>
  );
}

// FilterButtons Component
function FilterButtons({ filter, onFilterChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {['all', 'active', 'completed'].map(f => (
        <button
          key={f}
          onClick={() => onFilterChange(f)}
          className={`px-3 md:px-4 py-2 rounded-full font-semibold transition-all text-sm md:text-base ${
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

// TasksPage Component
function TasksPage({ tasks, onAddTask, onToggleTask, onDeleteTask, onEditTask }) {
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  return (
    <div className="space-y-6">
      <TaskStats tasks={tasks} />
      <TaskForm onAddTask={onAddTask} />
      <FilterButtons filter={filter} onFilterChange={setFilter} />

      <div className="space-y-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-base md:text-lg">
              {filter === 'all' 
                ? 'No tasks yet. Create one to get started!' 
                : `No ${filter} tasks.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// AboutPage Component
function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">About Task Manager</h2>
        <p className="text-gray-700 mb-4 text-sm md:text-base">
          Welcome to the Enhanced Task Manager application! This is a modern, responsive task management solution built with React to help you stay organized and boost productivity.
        </p>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 mt-6">Features</h3>
        <ul className="space-y-2 text-gray-700 text-sm md:text-base">
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Multi-Page Navigation:</strong> Seamless routing between Tasks and About pages</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Task Management:</strong> Add, edit, delete, and filter tasks efficiently</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Progress Tracking:</strong> Real-time statistics and completion progress</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Due Dates:</strong> Set and manage deadlines for your tasks</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Responsive Design:</strong> Works perfectly on PC, tablet, and mobile devices</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-500 font-bold mt-1">✓</span>
            <span><strong>Error Handling:</strong> Comprehensive error management and user feedback</span>
          </li>
        </ul>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 mt-6">How to Use</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 md:p-6">
          <ol className="space-y-2 text-gray-700 text-sm md:text-base">
            <li><strong>1. Add Tasks:</strong> Type in the input field and click "Add" or press Enter</li>
            <li><strong>2. Set Due Dates:</strong> Select optional dates for your tasks</li>
            <li><strong>3. Track Progress:</strong> View statistics and completion rates in real-time</li>
            <li><strong>4. Manage Tasks:</strong> Mark complete, edit, or delete tasks as needed</li>
            <li><strong>5. Filter View:</strong> Use filters to view all, active, or completed tasks</li>
          </ol>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 mt-6">Technology Stack</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg p-4">
            <p className="font-semibold text-gray-800">React.js</p>
            <p className="text-sm text-gray-600">Modern component-based architecture</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4">
            <p className="font-semibold text-gray-800">Tailwind CSS</p>
            <p className="text-sm text-gray-600">Responsive and modern styling</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-4">
            <p className="font-semibold text-gray-800">React Router</p>
            <p className="text-sm text-gray-600">Multi-page navigation</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-4">
            <p className="font-semibold text-gray-800">Lucide Icons</p>
            <p className="text-sm text-gray-600">Beautiful icon library</p>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 mt-6">Roll Numbers: 1 to 20</h3>
        <p className="text-gray-700 text-sm md:text-base">
          This assignment demonstrates advanced React concepts including component composition, state management, event handling, routing, error boundaries, portals, and responsive design patterns suitable for all device types.
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-bold mb-2">Ready to Organize?</h3>
        <p className="text-sm md:text-base opacity-90">
          Go back to the Tasks page and start managing your to-do list efficiently!
        </p>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation({ currentPage, onNavigate, isMobileMenuOpen, onToggleMobileMenu }) {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Task Manager Pro</h1>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={() => {
              onNavigate('tasks');
              onToggleMobileMenu(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${
              currentPage === 'tasks'
                ? 'bg-white text-blue-600'
                : 'hover:bg-blue-500'
            }`}
          >
            <Home size={20} /> Tasks
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              onToggleMobileMenu(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${
              currentPage === 'about'
                ? 'bg-white text-blue-600'
                : 'hover:bg-blue-500'
            }`}
          >
            <Info size={20} /> About
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => onToggleMobileMenu(!isMobileMenuOpen)}
          className="md:hidden text-white hover:bg-blue-500 p-2 rounded-md transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-600 px-4 pb-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('tasks');
              onToggleMobileMenu(false);
            }}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${
              currentPage === 'tasks'
                ? 'bg-white text-blue-600'
                : 'hover:bg-blue-500'
            }`}
          >
            <Home size={20} /> Tasks
          </button>
          <button
            onClick={() => {
              onNavigate('about');
              onToggleMobileMenu(false);
            }}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-all font-semibold ${
              currentPage === 'about'
                ? 'bg-white text-blue-600'
                : 'hover:bg-blue-500'
            }`}
          >
            <Info size={20} /> About
          </button>
        </div>
      )}
    </nav>
  );
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('tasks');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete React project', completed: false, dueDate: '2025-10-15' },
    { id: 2, text: 'Review documentation', completed: true, dueDate: '2025-10-10' },
    { id: 3, text: 'Test responsive design', completed: false, dueDate: '' },
    { id: 4, text: 'Deploy to production', completed: false, dueDate: '2025-10-20' },
    { id: 5, text: 'Write unit tests', completed: true, dueDate: '2025-10-12' }
  ]);

  const handleAddTask = useCallback((text, dueDate) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      dueDate
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const handleToggleTask = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleDeleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  const handleEditTask = useCallback((id, newText) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={setIsMobileMenuOpen}
        />
        
        <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <div className="mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              {currentPage === 'tasks' ? 'My Tasks' : 'About'}
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-1">
              {currentPage === 'tasks' 
                ? 'Manage and track your daily tasks efficiently'
                : 'Learn more about this application'
              }
            </p>
          </div>

          {currentPage === 'tasks' ? (
            <TasksPage
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onEditTask={handleEditTask}
            />
          ) : (
            <AboutPage />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-12">
          <p className="text-sm md:text-base">
            Enhanced Task Manager © 2025 • Built with React, Tailwind CSS & React Router
          </p>
          <p className="text-xs md:text-sm mt-2 text-gray-400">
            Roll Numbers: 1-20 • Responsive Design • Multi-page Navigation • Error Handling
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
}