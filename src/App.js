import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    telFileName: '',
    fullPathWavFileName: '',
    haveInternalWave: '',
    internalWaveNo: '',
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

  const [messages, setMessages] = useState(['Application started successfully']);
  const [activeTab, setActiveTab] = useState('running');
  const [projectId, setProjectId] = useState('');
  
  // SOAP related states
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Not connected');

  // FTP related states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Completed projects states
  const [completedProjects, setCompletedProjects] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [isLoadingCompleted, setIsLoadingCompleted] = useState(false);
  const [serverStatus, setServerStatus] = useState('🔴 قطع');

  // Running projects states
  const [runningProjects, setRunningProjects] = useState([]);
  const [runningTableColumns, setRunningTableColumns] = useState([]);
  const [isLoadingRunning, setIsLoadingRunning] = useState(false);
  const [runningServerStatus, setRunningServerStatus] = useState('🔴 قطع');

  const SERVICE_URL = '/wsRayaneh.asmx';
  const SERVICE_INFO = 'http://10.85.66.20/wsRayaneh.asmx';

  // FTP Configuration
  const ftpConfig = {
    server: '10.85.66.20',
    user: 'rayaneh',
    password: 'PayamResan555',
    folder: 'text'
  };

  // Fetch running projects
  const fetchRunningProjects = async () => {
    setIsLoadingRunning(true);
    addMessage('📊 در حال دریافت پروژه های در حال اجرا از پایگاه داده...');
    
    try {
      console.log('🌐 در حال ارسال درخواست به سرور برای دریافت پروژه های در حال اجرا...');
      
      const response = await fetch('http://localhost:5000/api/running-projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('📨 پاسخ سرور دریافت شد - وضعیت:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ خطای سرور:', response.status, errorText);
        throw new Error(`خطای HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ داده دریافتی از سرور:', result);
      
      if (result.success && result.data && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          const columns = Object.keys(result.data[0]);
          setRunningTableColumns(columns);
          setRunningProjects(result.data);
          setRunningServerStatus('🟢 متصل');
          addMessage(`✅ ${result.data.length} پروژه در حال اجرا بارگذاری شد`);
        } else {
          addMessage('ℹ️ هیچ پروژه در حال اجرایی یافت نشد', 'info');
          setRunningProjects([]);
          setRunningTableColumns([]);
          setRunningServerStatus('🟡 هیچ داده‌ای');
        }
      } else {
        throw new Error(result.message || 'ساختار پاسخ سرور نامعتبر است');
      }
      
    } catch (error) {
      console.error('❌ خطا در دریافت پروژه ها:', error);
      addMessage(`❌ خطا در دریافت داده: ${error.message}`, 'error');
      setRunningProjects([]);
      setRunningTableColumns([]);
      setRunningServerStatus('🔴 قطع');
    } finally {
      setIsLoadingRunning(false);
    }
  };

  // Fetch completed projects
  const fetchCompletedProjects = async () => {
    setIsLoadingCompleted(true);
    addMessage('📊 در حال دریافت پروژه های تکمیل شده از پایگاه داده...');
    
    try {
      console.log('🌐 در حال ارسال درخواست به سرور برای دریافت پروژه های تکمیل شده...');
      
      const response = await fetch('http://localhost:5000/api/completed-projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      console.log('📨 پاسخ سرور دریافت شد - وضعیت:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ خطای سرور:', response.status, errorText);
        throw new Error(`خطای HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ داده دریافتی از سرور:', result);
      
      if (result.success && result.data && Array.isArray(result.data)) {
        if (result.data.length > 0) {
          const columns = Object.keys(result.data[0]);
          setTableColumns(columns);
          setCompletedProjects(result.data);
          setServerStatus('🟢 متصل');
          addMessage(`✅ ${result.data.length} پروژه تکمیل شده بارگذاری شد`);
        } else {
          addMessage('ℹ️ هیچ پروژه تکمیل شده ای یافت نشد', 'info');
          setCompletedProjects([]);
          setTableColumns([]);
          setServerStatus('🟡 هیچ داده‌ای');
        }
      } else {
        throw new Error(result.message || 'ساختار پاسخ سرور نامعتبر است');
      }
      
    } catch (error) {
      console.error('❌ خطا در دریافت پروژه ها:', error);
      addMessage(`❌ خطا در دریافت داده: ${error.message}`, 'error');
      setCompletedProjects([]);
      setTableColumns([]);
      setServerStatus('🔴 قطع');
    } finally {
      setIsLoadingCompleted(false);
    }
  };

  // Function to get Persian column names
  const getPersianColumnName = (column) => {
    const columnMap = {
      projectsId: 'شناسه پروژه',
      telFileName: 'نام فایل تلفن',
      priority: 'اولویت',
      strCurSendingNo: 'شماره در حال ارسال',
      curTotalTels: 'کل شماره‌ها',
      curTotalSended: 'شماره‌های ارسال شده',
      curAnswerTels: 'شماره‌های پاسخ داده شده',
      curSuccess: 'موفقیت فعلی',
      totalSuccess: 'موفقیت کل',
      status: 'وضعیت',
      prjName: 'نام پروژه',
      startSendDate: 'تاریخ شروع ارسال',
      startSendTime: 'زمان شروع ارسال',
      endSendDate: 'تاریخ پایان ارسال',
      endSendTime: 'زمان پایان ارسال',
      totalTelInMainFile: 'کل شماره‌ها در فایل اصلی'
    };
    
    return columnMap[column] || column;
  };

  // Function to format cell values
  const formatCellValue = (value, column) => {
    if (value === null || value === undefined) return '-';
    
    if (column.toLowerCase().includes('status')) {
      return value;
    }
    
    if (column.toLowerCase().includes('date') || column.toLowerCase().includes('time')) {
      return value;
    }
    
    return value.toString();
  };

  const createSoapEnvelopes = (methodName, projectId) => [
    `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      <strProjectsId>${projectId}</strProjectsId>
    </${methodName}>
  </soap:Body>
</soap:Envelope>`,

    `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      <strProjectsId>${projectId}</strProjectsId>
    </${methodName}>
  </soap:Body>
</soap:Envelope>`,

    `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      <strprojectsid>${projectId}</strprojectsid>
    </${methodName}>
  </soap:Body>
</soap:Envelope>`,

    `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      <strProjectsId xsi:type="xsd:string">${projectId}</strProjectsId>
    </${methodName}>
  </soap:Body>
</soap:Envelope>`,

    `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" 
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
               xmlns:xsd="http://www.w3.org/2001/XMLSchema">
  <soap:Body>
    <${methodName} xmlns="http://tempuri.org/">
      <projectId>${projectId}</projectId>
    </${methodName}>
  </soap:Body>
</soap:Envelope>`
  ];

  const soapActions = (methodName) => [
    `http://tempuri.org/${methodName}`,
    `http://tempuri.org/wsRayaneh/${methodName}`,
    `http://tempuri.org/wsRayaneh.asmx/${methodName}`,
    `"http://tempuri.org/${methodName}"`
  ];

  const callSoapMethod = async (methodName) => {
    const currentProjectId = projectId.trim();
    if (!currentProjectId) {
      addMessage('Please enter a project ID');
      setConnectionStatus('Connection failed');
      return;
    }

    setIsLoading(true);
    setConnectionStatus(`Connecting to ${methodName}...`);
    addMessage(`Connecting to ${methodName} for project ${currentProjectId}...`);

    const soapEnvelopes = createSoapEnvelopes(methodName, currentProjectId);
    const actions = soapActions(methodName);

    for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      for (let envelopeIndex = 0; envelopeIndex < soapEnvelopes.length; envelopeIndex++) {
        try {
          const currentTry = (actionIndex * soapEnvelopes.length) + envelopeIndex + 1;
          const totalTries = actions.length * soapEnvelopes.length;
          
          setConnectionStatus(`Trying ${methodName} ${currentTry}/${totalTries}...`);
          addMessage(`Trying ${methodName} ${currentTry}/${totalTries}...`);
          
          const res = await fetch(SERVICE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/xml; charset=utf-8',
              'SOAPAction': actions[actionIndex],
            },
            body: soapEnvelopes[envelopeIndex],
          });

          const text = await res.text();

          if (text.includes('soap:Fault') || text.includes('faultstring')) {
            const faultMatch = text.match(/<faultstring>([\s\S]*?)<\/faultstring>/i);
            const errorMsg = faultMatch ? faultMatch[1].trim() : 'Unknown SOAP fault';
            
            if (!errorMsg.includes('Value cannot be null') && !errorMsg.includes('Parameter name: String')) {
              addMessage(`Different error with action "${actions[actionIndex]}" and format ${envelopeIndex + 1}: ${errorMsg}`);
              setConnectionStatus('Testing - Progress detected');
              continue;
            }
            
            if (currentTry < totalTries) {
              continue;
            }
            
            throw new Error(`SOAP Error: ${errorMsg}`);
          }

          if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }

          let resultMessage = `${methodName} executed successfully`;
          if (text.includes(`<${methodName}Result>`)) {
            const match = text.match(new RegExp(`<${methodName}Result>([\\s\\S]*?)</${methodName}Result>`, 'i'));
            resultMessage = match ? match[1].trim() : resultMessage;
          }
          
          addMessage(`SUCCESS with action "${actions[actionIndex]}" and format ${envelopeIndex + 1}! ${resultMessage}`);
          setConnectionStatus('Connected');
          setIsLoading(false);
          return;

        } catch (err) {
          if (actionIndex === actions.length - 1 && envelopeIndex === soapEnvelopes.length - 1) {
            addMessage(`Error: ${err.message}`);
            setConnectionStatus('Connection failed');
          }
        }
      }
    }

    setIsLoading(false);
  };

  // FTP Upload Functionality
  const uploadToFTP = async () => {
    if (!formData.telFileName) {
      addMessage('Please select a telephone file first');
      setUploadStatus('Please select a telephone file first');
      return;
    }

    setIsUploading(true);
    setUploadStatus('Preparing upload...');
    setUploadProgress(10);

    try {
      const fileContent = generateFileContent();
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const file = new File([blob], formData.telFileName, { type: 'text/plain' });

      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('server', ftpConfig.server);
      formDataToSend.append('user', ftpConfig.user);
      formDataToSend.append('password', ftpConfig.password);
      formDataToSend.append('folder', ftpConfig.folder);

      setUploadProgress(30);
      setUploadStatus('Uploading file to FTP server...');
      addMessage(`Uploading file "${formData.telFileName}" to FTP server...`);

      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `Server error: ${response.status}`);
      }

      if (result.success) {
        setUploadProgress(100);
        const successMessage = `File "${result.filename}" uploaded successfully to FTP server!`;
        setUploadStatus(successMessage);
        addMessage(successMessage);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = `Upload failed: ${error.message}`;
      setUploadStatus(errorMessage);
      addMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const generateFileContent = () => {
    const content = [
      '=== Project Configuration File ===',
      '',
      'File Information:',
      `Telephone File: ${formData.telFileName}`,
      `Wave File: ${formData.fullPathWavFileName}`,
      '',
      'Project Settings:',
      `Internal Wave Enabled: ${formData.haveInternalWave}`,
      `Internal Wave Number: ${formData.internalWaveNo}`,
      `Allowable Start Time: ${formData.allowableStartHour}:${formData.allowableStartMinute}`,
      `Allowable End Minute: ${formData.allowableEndMinute}`,
      `Desired Send Number: ${formData.desiredSendNo}`,
      '',
      'Test Configuration:',
      `Test ID Number: ${formData.testNoIdNo}`,
      `Test Ringtime: ${formData.testRingtime}`,
      `Test Number 1: ${formData.testNum1}`,
      `Test Number 2: ${formData.testNum2}`,
      `Test Number 3: ${formData.testNum3}`,
      `Caller ID: ${formData.callerId}`,
      `Priority: ${formData.priority}`,
      '',
      'System Information:',
      `Project ID: ${projectId}`,
      `Generated at: ${new Date().toLocaleString()}`,
      '=== End of File ==='
    ].join('\n');
    
    return content;
  };

  const testFTPConnection = async () => {
    addMessage('Testing FTP connection...');
    
    try {
      const response = await fetch('http://localhost:5000/test-ftp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ftpConfig)
      });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        addMessage('FTP connection test successful!');
      } else {
        addMessage(`FTP connection test failed: ${result.message}`);
      }
    } catch (error) {
      console.error('FTP test error:', error);
      addMessage(`FTP connection test failed: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileBrowse = (fieldName) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fieldName === 'telFileName' ? '.txt,.csv' : '.wav,.mp3';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData(prev => ({ ...prev, [fieldName]: file.name }));
        addMessage(`File selected: ${file.name} for ${fieldName}`);
        
        if (fieldName === 'telFileName' && !projectId) {
          const projectIdFromFile = file.name.replace(/\.[^/.]+$/, "");
          setProjectId(projectIdFromFile);
          addMessage(`Auto-generated Project ID: ${projectIdFromFile}`);
        }
      }
    };
    input.click();
  };

  const addMessage = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, `${timestamp} - ${message}`]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.telFileName) {
      addMessage('Error: Please select a telephone file');
      alert('Please select a telephone file');
      return;
    }
    
    if (!projectId.trim()) {
      addMessage('Error: Please enter a Project ID');
      alert('Please enter a Project ID');
      return;
    }
    
    addMessage('Project form submitted successfully!');
    addMessage(`Project ID: ${projectId}`);
    addMessage(`Telephone File: ${formData.telFileName}`);
    addMessage(`Wave File: ${formData.fullPathWavFileName}`);
    
    alert('Project submitted successfully!');
    console.log('Form Data:', formData);
    console.log('Project ID:', projectId);
  };

  const handleControlAction = (action) => {
    if (action === 'Pause') {
      callSoapMethod('Pause');
    } else if (action === 'Resume') {
      callSoapMethod('Resume');
    } else if (action === 'Break') {
      callSoapMethod('Break');
    } else if (action === 'Send') {
      uploadToFTP();
    } else if (action === 'Test FTP') {
      testFTPConnection();
    } else if (action === 'Show Completed Projects') {
      fetchCompletedProjects();
    } else if (action === 'Show Running Projects') {
      fetchRunningProjects();
    } else {
      addMessage(`Action performed: ${action} for project ${projectId || 'N/A'}`);
    }
  };

  const clearForm = () => {
    setFormData({
      telFileName: '',
      fullPathWavFileName: '',
      haveInternalWave: '',
      internalWaveNo: '',
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
    setProjectId('');
    addMessage('Form cleared');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Project Management System</h1>
      </header>

      <div className="app-container">
        <form className="project-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>Project Configuration</h2>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>0 - telFileName</label>
              <div className="file-input-wrapper">
                <input 
                  type="text" 
                  name="telFileName"
                  value={formData.telFileName}
                  readOnly
                  placeholder="Select telephone file"
                  className="file-input"
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
                className="form-select"
              >
                <option value="">Select Option</option>
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
                placeholder="Enter internal wave number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>3 - fullPathWavFileName</label>
              <div className="file-input-wrapper">
                <input 
                  type="text" 
                  name="fullPathWavFileName"
                  value={formData.fullPathWavFileName}
                  readOnly
                  placeholder="Select wave file"
                  className="file-input"
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
                placeholder="Start hour"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>5 - allowableStartMinute</label>
              <input 
                type="number" 
                name="allowableStartMinute"
                value={formData.allowableStartMinute}
                onChange={handleInputChange}
                placeholder="Start minute"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>7 - allowableEndMinute</label>
              <input 
                type="number" 
                name="allowableEndMinute"
                value={formData.allowableEndMinute}
                onChange={handleInputChange}
                placeholder="End minute"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>8 - desiredSendNo</label>
              <input 
                type="number" 
                name="desiredSendNo"
                value={formData.desiredSendNo}
                onChange={handleInputChange}
                placeholder="Desired send number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>9 - testNoIdNo</label>
              <input 
                type="number" 
                name="testNoIdNo"
                value={formData.testNoIdNo}
                onChange={handleInputChange}
                placeholder="Test ID number"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>10 - testRingtime</label>
              <input 
                type="text" 
                name="testRingtime"
                value={formData.testRingtime}
                onChange={handleInputChange}
                placeholder="Test ring time"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>11 - testNum1</label>
              <input 
                type="text" 
                name="testNum1"
                value={formData.testNum1}
                onChange={handleInputChange}
                placeholder="Test number 1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>12 - testNum2</label>
              <input 
                type="text" 
                name="testNum2"
                value={formData.testNum2}
                onChange={handleInputChange}
                placeholder="Test number 2"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>13 - testNum3</label>
              <input 
                type="text" 
                name="testNum3"
                value={formData.testNum3}
                onChange={handleInputChange}
                placeholder="Test number 3"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>14 - callerId</label>
              <input 
                type="text" 
                name="callerId"
                value={formData.callerId}
                onChange={handleInputChange}
                placeholder="Caller ID"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>16 - Priority</label>
              <input 
                type="number" 
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                placeholder="Priority"
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit Project
            </button>
            <button type="button" className="clear-btn" onClick={clearForm}>
              Clear Form
            </button>
          </div>
        </form>

        <div className="tabs">
          <button 
            className={activeTab === 'running' ? 'active' : ''}
            onClick={() => setActiveTab('running')}
          >
            نمایش پروژه های در حال اجرا
          </button>
          <button 
            className={activeTab === 'completed' ? 'active' : ''}
            onClick={() => setActiveTab('completed')}
          >
            نمایش پروژه های انجام شده
          </button>
        </div>

        <div className="content-area">
          {activeTab === 'running' && (
            <div className="table-container" dir="rtl">
              <div className="table-header">
                <h3>🚀 پروژه های در حال اجرا</h3>
                <div className="server-info">
                  <span className={`server-status ${runningServerStatus.includes('🟢') ? 'connected' : runningServerStatus.includes('🟡') ? 'warning' : 'disconnected'}`}>
                    وضعیت سرور: {runningServerStatus}
                  </span>
                  <button
                    className="refresh-btn"
                    onClick={fetchRunningProjects}
                    disabled={isLoadingRunning}
                  >
                    {isLoadingRunning ? '🔄 در حال بارگذاری...' : '🔄 بروزرسانی'}
                  </button>
                </div>
              </div>

              {isLoadingRunning ? (
                <div className="loading-message">
                  <div className="spinner"></div>
                  📊 در حال بارگذاری آخرین پروژه های در حال اجرا...
                </div>
              ) : runningServerStatus === '🔴 قطع' ? (
                <div className="no-data-message">
                  🔌 خطا در اتصال به سرور - لطفا از روشن بودن سرور اطمینان حاصل کنید
                </div>
              ) : (
                <>
                  {runningProjects.length > 0 ? (
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'visible',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '0',
                        boxSizing: 'border-box',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#888 #f1f1f1',
                      }}
                      className="scrollable-table-container"
                    >
                      <table
                        style={{
                          minWidth: '1000px',
                          width: 'max-content',
                          borderCollapse: 'collapse',
                          backgroundColor: 'white',
                          fontSize: '13px',
                        }}
                      >
                        <thead>
                          <tr>
                            {runningTableColumns.map((column, index) => (
                              <th
                                key={index}
                                style={{
                                  backgroundColor: '#2c3e50',
                                  color: 'white',
                                  padding: '12px 16px',
                                  textAlign: 'right',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  border: '1px solid #34495e',
                                  position: 'sticky',
                                  top: 0,
                                  zIndex: 1,
                                }}
                              >
                                {getPersianColumnName(column)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {runningProjects.map((project, index) => (
                            <tr
                              key={project.projectsId || index}
                              style={{
                                borderBottom: '1px solid #e0e0e0',
                              }}
                            >
                              {runningTableColumns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  style={{
                                    padding: '10px 16px',
                                    textAlign: 'right',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {formatCellValue(project[column], column)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-data-message">
                      📭 هیچ پروژه در حال اجرایی در پایگاه داده یافت نشد
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="table-container" dir="rtl">
              <div className="table-header">
                <h3>✅ پروژه های تکمیل شده</h3>
                <div className="server-info">
                  <span className={`server-status ${serverStatus.includes('🟢') ? 'connected' : serverStatus.includes('🟡') ? 'warning' : 'disconnected'}`}>
                    وضعیت سرور: {serverStatus}
                  </span>
                  <button
                    className="refresh-btn"
                    onClick={fetchCompletedProjects}
                    disabled={isLoadingCompleted}
                  >
                    {isLoadingCompleted ? '🔄 در حال بارگذاری...' : '🔄 بروزرسانی'}
                  </button>
                </div>
              </div>

              {isLoadingCompleted ? (
                <div className="loading-message">
                  <div className="spinner"></div>
                  📊 در حال بارگذاری آخرین پروژه های تکمیل شده...
                </div>
              ) : serverStatus === '🔴 قطع' ? (
                <div className="no-data-message">
                  🔌 خطا در اتصال به سرور - لطفا از روشن بودن سرور اطمینان حاصل کنید
                </div>
              ) : (
                <>
                  {completedProjects.length > 0 ? (
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'visible',
                        border: '1px solid #e0e0e0',
                        borderRadius: '4px',
                        padding: '0',
                        boxSizing: 'border-box',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#888 #f1f1f1',
                      }}
                      className="scrollable-table-container"
                    >
                      <table
                        style={{
                          minWidth: '1000px',
                          width: 'max-content',
                          borderCollapse: 'collapse',
                          backgroundColor: 'white',
                          fontSize: '13px',
                        }}
                      >
                        <thead>
                          <tr>
                            {tableColumns.map((column, index) => (
                              <th
                                key={index}
                                style={{
                                  backgroundColor: '#2c3e50',
                                  color: 'white',
                                  padding: '12px 16px',
                                  textAlign: 'right',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  border: '1px solid #34495e',
                                  position: 'sticky',
                                  top: 0,
                                  zIndex: 1,
                                }}
                              >
                                {getPersianColumnName(column)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {completedProjects.map((project, index) => (
                            <tr
                              key={project.projectsId || index}
                              style={{
                                borderBottom: '1px solid #e0e0e0',
                              }}
                            >
                              {tableColumns.map((column, colIndex) => (
                                <td
                                  key={colIndex}
                                  style={{
                                    padding: '10px 16px',
                                    textAlign: 'right',
                                    fontSize: '13px',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {formatCellValue(project[column], column)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="no-data-message">
                      📭 هیچ پروژه تکمیل شده ای در پایگاه داده یافت نشد
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="control-panel">
          <h3>Control Current Project</h3>
          
          <div className="project-id-input">
            <label>Enter Project ID:</label>
            <input
              type="text"
              placeholder="Enter Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="project-id-field"
            />
          </div>

          {isUploading && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">{uploadProgress}% - {uploadStatus}</div>
            </div>
          )}

          {uploadStatus && !isUploading && (
            <div className={`upload-status ${uploadStatus.includes('successfully') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}

          <div className="control-grid">
            <button 
              className="control-btn btn-warning"
              onClick={() => handleControlAction('Pause')}
              disabled={isLoading || !projectId.trim()}
            >
              {isLoading ? 'Processing...' : 'Pause'}
            </button>
            
            <button 
              className="control-btn btn-success"
              onClick={() => handleControlAction('Resume')}
              disabled={isLoading || !projectId.trim()}
            >
              {isLoading ? 'Processing...' : 'Resume'}
            </button>
            
            <button 
              className="control-btn btn-danger"
              onClick={() => handleControlAction('Break')}
              disabled={isLoading || !projectId.trim()}
            >
              {isLoading ? 'Processing...' : 'Break'}
            </button>
            
            <button 
              className="control-btn btn-info"
              onClick={() => handleControlAction('Test FTP')}
            >
              Test FTP Connection
            </button>
            
            <button 
              className="control-btn btn-primary"
              onClick={() => handleControlAction('Send')}
              disabled={isUploading || !formData.telFileName}
            >
              {isUploading ? 'Uploading...' : 'Send to FTP'}
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
              onClick={() => {
                setActiveTab('running');
                handleControlAction('Show Running Projects');
              }}
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
              onClick={() => {
                setActiveTab('completed');
                handleControlAction('Show Completed Projects');
              }}
            >
              نمایش پروژه های انجام شده
            </button>
          </div>
        </div>

        <div className="messages-section">
          <h3>Messages</h3>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <span className="text">{msg}</span>
              </div>
            ))}
          </div>
          <div className="messages-controls">
            <button 
              className="reset-btn"
              onClick={() => setMessages(['Messages cleared'])}
            >
              Reset Messages
            </button>
            <button 
              className="show-all-btn"
              onClick={() => addMessage('Show all messages clicked')}
            >
              Show All Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;