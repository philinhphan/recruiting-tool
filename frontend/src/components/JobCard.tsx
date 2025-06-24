import React, { useState } from 'react';
import { Jobs } from '../types';

interface JobCardProps {
  job: Jobs;
  onApply: (jobTitle: string) => void; // Or pass full job object if needed
  initiallyExpanded?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, initiallyExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-blue-700 mb-1">{job.title}</h3>
          {job.locations && job.locations.length > 0 && (
            <p className="text-sm text-gray-500 mb-2">
              Locations: {job.locations.join(', ')}
            </p>
          )}
        </div>
        <button
          onClick={() => onApply(job.title)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          Apply
        </button>
      </div>
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 focus:outline-none"
        >
          {isExpanded ? 'Show less' : 'Show more details...'}
        </button>
        {isExpanded && (
          <div className="prose prose-sm max-w-none text-gray-700 mt-2">
            {/* Using a simple paragraph for description, but could use dangerouslySetInnerHTML if description contains HTML */}
            <p>{job.description || "No description available."}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
