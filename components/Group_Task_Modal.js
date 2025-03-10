import React, { useState } from 'react';

const SimpleModal = ({ isOpen, onClose, communities, onSubmit, community_id }) => {
  // Skip rendering if not open
  if (!isOpen) return null;
  
  // Simple state management
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState(1);
  const [selectedCommunity, setSelectedCommunity] = useState(community_id || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newTask = {
      title,
      description,
      dueDate,
      priority,
      community_id: selectedCommunity,
      completed: false,
      users_completed: []
    };
    
    if (onSubmit) {
      onSubmit(newTask);
    }
    
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Group Task</h2>
          <button 
            className="close-button" 
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs to be done"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority Level (1-5)</label>
              <input
                id="priority"
                type="number"
                min="1"
                max="5"
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10))}
              />
              <small>Higher number means higher priority</small>
            </div>

            {Array.isArray(communities) && communities.length > 0 && (
              <div className="form-group">
                <label htmlFor="community">Assign to Community *</label>
                <select
                  id="community"
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  required
                >
                  <option value="">Select community</option>
                  {communities.map(community => (
                    community && community._id ? (
                      <option key={community._id} value={community._id}>
                        {community.name || 'Unnamed Community'}
                      </option>
                    ) : null
                  ))}
                </select>
                <small>All members of this community will need to complete this task</small>
              </div>
            )}

            <div className="modal-footer">
              <button 
                type="button" 
                className="button button-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button button-primary"
                disabled={!title || !dueDate || !selectedCommunity}
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SimpleModal;