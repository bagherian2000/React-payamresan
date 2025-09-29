import React, { useState } from 'react';

const ControlPanel = ({ onMessage }) => {
  const [projectId, setProjectId] = useState('');

  const handleControlAction = (action) => {
    onMessage(`Action performed: ${action} for project ${projectId || 'N/A'}`);
  };

  return (
    <div className="control-panel">
      <h3>Control Current Project</h3>
      
      <div className="project-id-input">
        <label>Enter ProjectsID:</label>
        <input 
          type="text" 
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="Enter project ID"
        />
      </div>

      <div className="control-grid">
        <button 
          className="control-btn btn-primary"
          onClick={() => handleControlAction('Passage')}
        >
          Passage
        </button>
        
        <button 
          className="control-btn btn-warning"
          onClick={() => handleControlAction('Break')}
        >
          Break
        </button>
        
        <button 
          className="control-btn btn-secondary"
          onClick={() => handleControlAction('Request Changes')}
        >
          درخواست تغییرات
        </button>
        
        <button 
          className="control-btn btn-primary"
          onClick={() => handleControlAction('Apply Changes')}
        >
          اعمال تغییرات
        </button>
        
        <button 
          className="control-btn btn-secondary"
          onClick={() => handleControlAction('Show Running Projects')}
        >
          نمایش پروژه های در حال اجرا
        </button>
        
        <button 
          className="control-btn btn-secondary"
          onClick={() => handleControlAction('Refresh')}
        >
          Refresh
        </button>
        
        <button 
          className="control-btn btn-secondary"
          onClick={() => handleControlAction('Show Completed Projects')}
        >
          نمایش پروژه های انجام شده
        </button>
        
        <button 
          className="control-btn btn-danger"
          onClick={() => handleControlAction('Send')}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;