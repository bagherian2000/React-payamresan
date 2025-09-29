import React, { useState } from 'react';

const ProjectForm = ({ onMessage }) => {
  const [formData, setFormData] = useState({
    telFileName: '',
    haveInternalWave: '',
    internalWaveNo: '',
    fullPathWavFileName: '',
    allowableStartHour: '12',
    allowableStartMinute: '8',
    allowableEndMinute: '',
    desiredSendNo: '11',
    testNoIdNo: '10000',
    testRingtime: '09132159903',
    testNum1: '09133079361',
    testNum2: '09133079361',
    testNum3: '',
    callerId: '9990',
    priority: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileBrowse = (fieldName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: file.name
        }));
        onMessage(`File selected: ${file.name} for ${fieldName}`);
      }
    };
    input.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onMessage('Project form submitted successfully');
    console.log('Form Data:', formData);
  };

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>0 - telFileName</label>
          <div className="file-input-wrapper">
            <input 
              type="text" 
              value={formData.telFileName}
              readOnly
              placeholder="Select telephone file"
            />
            <button 
              type="button" 
              className="browse-btn"
              onClick={() => handleFileBrowse('telFileName')}
            >
              Browse Tel File
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>1 - haveInternalWave</label>
          <select 
            name="haveInternalWave"
            value={formData.haveInternalWave}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>2 - internalWaveNo</label>
          <input 
            type="number" 
            name="internalWaveNo"
            value={formData.internalWaveNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>3 - fullPathWavFileName</label>
          <div className="file-input-wrapper">
            <input 
              type="text" 
              value={formData.fullPathWavFileName}
              readOnly
              placeholder="Select wave file"
            />
            <button 
              type="button" 
              className="browse-btn"
              onClick={() => handleFileBrowse('fullPathWavFileName')}
            >
              Browse Wave File
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>4 - allowableStartHour</label>
          <input 
            type="number" 
            name="allowableStartHour"
            value={formData.allowableStartHour}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>5 - allowableStartMinute</label>
          <input 
            type="number" 
            name="allowableStartMinute"
            value={formData.allowableStartMinute}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>7 - allowableEndMinute</label>
          <input 
            type="number" 
            name="allowableEndMinute"
            value={formData.allowableEndMinute}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>8 - desiredSendNo</label>
          <input 
            type="number" 
            name="desiredSendNo"
            value={formData.desiredSendNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>9 - testNoIdNo</label>
          <input 
            type="number" 
            name="testNoIdNo"
            value={formData.testNoIdNo}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>10 - testRingtime</label>
          <input 
            type="text" 
            name="testRingtime"
            value={formData.testRingtime}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>11 - testNum1</label>
          <input 
            type="text" 
            name="testNum1"
            value={formData.testNum1}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>12 - testNum2</label>
          <input 
            type="text" 
            name="testNum2"
            value={formData.testNum2}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>13 - testNum3</label>
          <input 
            type="text" 
            name="testNum3"
            value={formData.testNum3}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>13 - callerId</label>
          <input 
            type="text" 
            name="callerId"
            value={formData.callerId}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>16 - Priority</label>
          <input 
            type="number" 
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <button type="submit" className="browse-btn" style={{ width: '100%' }}>
        Submit Project
      </button>
    </form>
  );
};

export default ProjectForm;