import { useState } from "react";
import TaskForm from "./TaskForm";

export default function TaskList({ tasks, onEdit, onDelete }) {
  const [editingTask, setEditingTask] = useState(null);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleUpdate = async (updatedTask) => {
    await onEdit(editingTask._id, updatedTask);
    setEditingTask(null);
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          {editingTask && editingTask._id === task._id ? (
            <TaskForm onSubmit={handleUpdate} initialData={task} />
          ) : (
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {task.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {task.description}
              </p>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {task.status}
                  </span>
                  <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.priority}
                  </span>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(task._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
