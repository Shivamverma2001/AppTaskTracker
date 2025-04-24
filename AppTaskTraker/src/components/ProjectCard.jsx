import React from 'react';

const ProjectCard = ({ project, onDelete, onClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{project.description}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project._id);
          }}
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
      <button
        onClick={onClick}
        className="w-full mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
      >
        View Tasks →
      </button>
    </div>
  );
};

export default ProjectCard; 