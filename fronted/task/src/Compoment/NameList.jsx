
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  addName,
  removeName,
  updateName,
  fetchNames
} from '../Slice/Slice.js';

export default function NameList() {

  const names = useSelector((state) => state.names.items);

  const dispatch = useDispatch();

  const [text, setText] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [editText, setEditText] = useState('');


  // Fetch names from API when component loads
  useEffect(() => {
    dispatch(fetchNames());
  }, [dispatch]);


  const handleAdd = () => {
    if (text.trim() === '') return;

    dispatch(addName(text));

    setText('');
  };


  const handleRemove = (name) => {
    dispatch(removeName(name));
  };


  const startEdit = (name) => {
    setEditingName(name);
    setEditText(name);
  };


  const handleUpdate = () => {
    if (editText.trim() === '') return;

    dispatch(
      updateName({
        oldName: editingName,
        newName: editText
      })
    );

    setEditingName(null);
    setEditText('');
  };


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md font-sans">

      <h2 className="text-center text-xl font-semibold text-gray-800 mb-5">
        Name List
      </h2>


      <div className="flex gap-2 mb-5">

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a name"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
        >
          Add Name
        </button>

      </div>


      {names.map((name, index) => (

        <div
          key={index}
          className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-md mb-2"
        >

          {editingName === name ? (

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
              <span>{name}</span>

              <div>

                <button
                  onClick={() => startEdit(name)}
                  className="text-blue-500 text-sm hover:text-blue-700 mr-3"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleRemove(name)}
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