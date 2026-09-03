import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, removeTask, updateTask, toggleComplete } from '../Taskslice/Taskslice.js';

function Taskgivesredux() {
  const tasks = useSelector((state) => state.tasks.items);
  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAdd = () => {
    if (text.trim() === '') return;
    dispatch(addTask(text));
    setText('');
  };

  const handleRemove = (id) => {
    dispatch(removeTask(id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.title);
  };

  const handleUpdate = () => {
    if (editText.trim() === '') return;
    dispatch(updateTask({ id: editingId, newTitle: editText }));
    setEditingId(null);
    setEditText('');
  };

  const handleToggle = (id) => {
    dispatch(toggleComplete(id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md font-sans">
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-5">
        Task List
      </h2>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Add Task
        </button>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-md mb-2"
        >
          {editingId === task.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 mr-2 px-2 py-1 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={handleUpdate}
                className="text-green-600 text-sm hover:text-green-800 mr-2"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span
                onClick={() => handleToggle(task.id)}
                className={`cursor-pointer ${
                  task.completed ? 'line-through text-gray-400' : 'text-gray-800'
                }`}
              >
                {task.title}
              </span>
              <div>
                <button
                  onClick={() => startEdit(task)}
                  className="text-blue-500 text-sm hover:text-blue-700 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRemove(task.id)}
                  className="text-red-500 text-sm hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Taskgivesredux;