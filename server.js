const express = require('express');
const multer = require('multer');
const ftp = require('basic-ftp');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const sql = require('mssql');

const app = express();
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbConfig = {
  server: '10.85.66.20',
  database: 'payamresan',
  user: 'ramin',
  password: 'ram_1350',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'FTP Upload Server is running', 
    timestamp: new Date().toISOString() 
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/running-projects', async (req, res) => {
  let pool;
  try {
    console.log('Connecting to database for running projects...');
    pool = await sql.connect(dbConfig);
    
    const result = await sql.query(`
      SELECT TOP 3 projectsId
      ,telFileName
      ,priority
      ,strCurSendingNo
      ,curTotalTels
      ,curTotalSended
      ,curAnswerTels
      ,curSuccess
      ,totalSuccess
      ,status
      FROM vwStatForMainForm
    `);
    
    console.log(`Retrieved ${result.recordset.length} running projects from database`);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      message: `Found ${result.recordset.length} running projects`
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: []
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

app.get('/api/completed-projects', async (req, res) => {
  let pool;
  try {
    console.log('Connecting to database for completed projects...');
    pool = await sql.connect(dbConfig);
    
    const result = await sql.query(`
      SELECT TOP 3 projectsId
      ,prjName
      ,startSendDate
      ,startSendTime
      ,endSendDate
      ,endSendTime
      ,status
      ,totalTelInMainFile
      ,totalSuccess
      FROM vwLastPrj 
      ORDER BY startSendDate DESC
    `);
    
    console.log(`Retrieved ${result.recordset.length} completed projects from database`);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length,
      message: `Found ${result.recordset.length} completed projects`
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      data: []
    });
  } finally {
    if (pool) {
      await pool.close();
    }
  }
});

app.post('/test-ftp', async (req, res) => {
  console.log('Testing FTP connection to:', req.body.server);
  
  try {
    const { server, user, password, folder, port = 21 } = req.body;
    
    if (!server || !user || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing required FTP parameters: server, user, password'
      });
    }
    
    const client = new ftp.Client();
    client.ftp.verbose = true;

    await client.access({
      host: server,
      user: user,
      password: password,
      port: parseInt(port),
      secure: false,
      secureOptions: { rejectUnauthorized: false }
    });
    
    const targetDir = folder || '/';
    try {
      await client.cd(targetDir);
    } catch (error) {
      await client.ensureDir(targetDir);
    }
    
    const list = await client.list();
    client.close();
    
    res.json({
      success: true,
      message: 'FTP connection successful',
      directory: targetDir,
      fileCount: list.length
    });
    
  } catch (error) {
    console.error('FTP test error:', error);
    res.status(500).json({
      success: false,
      message: 'FTP connection failed',
      error: error.message
    });
  }
});

app.post('/upload', upload.single('file'), async (req, res) => {
  console.log('Upload request received for file:', req.file?.originalname);
  
  if (!req.file) {
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded' 
    });
  }

  const client = new ftp.Client();
  
  try {
    const { server, user, password, folder, port = 21 } = req.body;
    
    if (!server || !user || !password) {
      throw new Error('Missing FTP configuration parameters');
    }
    
    client.ftp.verbose = true;

    await client.access({
      host: server,
      user: user,
      password: password,
      port: parseInt(port),
      secure: false,
      secureOptions: { rejectUnauthorized: false }
    });
    
    const targetDir = folder || '/';
    await client.ensureDir(targetDir);
    
    const remoteFilename = req.file.originalname;
    await client.uploadFrom(req.file.path, remoteFilename);
    
    fs.unlinkSync(req.file.path);
    client.close();
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      filename: remoteFilename,
      directory: targetDir
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    try {
      client.close();
    } catch (e) {
      // Ignore close errors
    }
    
    res.status(500).json({
      success: false,
      error: 'Upload failed: ' + error.message
    });
  }
});

app.get('/info', (req, res) => {
  res.json({
    name: 'FTP Upload Server',
    version: '1.0.0',
    endpoints: [
      'GET  /health - Server health check',
      'GET  /api/test - Test endpoint',
      'GET  /api/running-projects - Get running projects',
      'GET  /api/completed-projects - Get completed projects',
      'POST /test-ftp - Test FTP connection',
      'POST /upload - Upload file to FTP'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 FTP Upload Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Running Projects: http://localhost:${PORT}/api/running-projects`);
  console.log(`📍 Completed Projects: http://localhost:${PORT}/api/completed-projects`);
}).on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});