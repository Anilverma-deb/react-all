import React, { useState, useEffect } from 'react';
import { Upload, Edit, Trash2, Search, Download, Printer, Filter, ChevronDown, User, Book, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// ======================== RESULT MANAGER (PARENT COMPONENT) ========================
const ResultManager = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [isAdmin, setIsAdmin] = useState(true); // Toggle for demo

  return (
    <div className="result-container">
      <div className="result-header">
        <h1 className="result-title">Result Management System</h1>
        <div className="result-role-toggle">
          <button 
            className={`result-role-btn ${isAdmin ? 'result-active-role' : ''}`}
            onClick={() => setIsAdmin(true)}
          >
            Admin View
          </button>
          <button 
            className={`result-role-btn ${!isAdmin ? 'result-active-role' : ''}`}
            onClick={() => setIsAdmin(false)}
          >
            Student View
          </button>
        </div>
      </div>

      {isAdmin ? (
        <div className="result-admin-container">
          <div className="result-tabs">
            <button 
              className={`result-tab ${activeTab === 'upload' ? 'result-active-tab' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              <Upload size={16} /> Upload Results
            </button>
            <button 
              className={`result-tab ${activeTab === 'manage' ? 'result-active-tab' : ''}`}
              onClick={() => setActiveTab('manage')}
            >
              <Edit size={16} /> Manage Results
            </button>
          </div>

          <div className="result-tab-content">
            {activeTab === 'upload' ? <ResultUpload /> : <ResultTable />}
          </div>
        </div>
      ) : (
        <StudentResultViewer />
      )}

      <style jsx>{`
        /* =============== BASE STYLES =============== */
        .result-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-title {
          font-size: 28px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .result-role-toggle {
          display: flex;
          background: #f7fafc;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .result-role-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .result-active-role {
          background: #4299e1;
          color: white;
        }

        /* =============== ADMIN STYLES =============== */
        .result-admin-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .result-tabs {
          display: flex;
          background: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-tab {
          padding: 12px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4a5568;
          transition: all 0.2s;
        }

        .result-tab:hover {
          background: #ebf8ff;
          color: #3182ce;
        }

        .result-active-tab {
          background: white;
          color: #3182ce;
          border-bottom: 2px solid #3182ce;
        }

        .result-tab-content {
          padding: 20px;
        }

        /* =============== RESPONSIVE STYLES =============== */
        @media (max-width: 768px) {
          .result-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .result-tabs {
            flex-direction: column;
          }

          .result-tab {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .result-title {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
};

// ======================== RESULT UPLOAD COMPONENT ========================
const ResultUpload = () => {
  const [uploadMethod, setUploadMethod] = useState('form');
  const [excelData, setExcelData] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [formData, setFormData] = useState({
    rollNo: '',
    name: '',
    branch: 'CS',
    semester: '1',
    subjects: [
      { name: 'Mathematics', marks: '' },
      { name: 'Physics', marks: '' },
      { name: 'Chemistry', marks: '' }
    ],
    totalMarks: '',
    grade: '',
    status: 'Pass'
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handlePdfUpload = (e) => {
    const files = Array.from(e.target.files);
    setPdfFiles(files);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, e) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index].marks = e.target.value;
    setFormData(prev => ({ ...prev, subjects: newSubjects }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Calculate total and grade here
    alert('Results submitted successfully!');
    // Reset form
    setFormData({
      rollNo: '',
      name: '',
      branch: 'CS',
      semester: '1',
      subjects: [
        { name: 'Mathematics', marks: '' },
        { name: 'Physics', marks: '' },
        { name: 'Chemistry', marks: '' }
      ],
      totalMarks: '',
      grade: '',
      status: 'Pass'
    });
  };

  const handlePdfSubmit = () => {
    if (pdfFiles.length === 0) {
      alert('Please select at least one PDF file');
      return;
    }
    
    // Here you would typically upload the PDFs to your server
    // For demo purposes, we'll just show an alert
    alert(`Successfully uploaded ${pdfFiles.length} PDF file(s)`);
    setPdfFiles([]);
  };

  return (
    <div className="result-upload-container">
      <div className="result-upload-methods">
        <button 
          className={`result-method-btn ${uploadMethod === 'form' ? 'result-active-method' : ''}`}
          onClick={() => setUploadMethod('form')}
        >
          Manual Form
        </button>
        <button 
          className={`result-method-btn ${uploadMethod === 'excel' ? 'result-active-method' : ''}`}
          onClick={() => setUploadMethod('excel')}
        >
          Excel Upload
        </button>
        <button 
          className={`result-method-btn ${uploadMethod === 'pdf' ? 'result-active-method' : ''}`}
          onClick={() => setUploadMethod('pdf')}
        >
          PDF Upload
        </button>
      </div>

      {uploadMethod === 'form' ? (
        <form className="result-form" onSubmit={handleSubmit}>
          <div className="result-form-group">
            <label className="result-form-label">Roll Number</label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleInputChange}
              className="result-form-input"
              required
            />
          </div>

          <div className="result-form-group">
            <label className="result-form-label">Student Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="result-form-input"
              required
            />
          </div>

          <div className="result-form-row">
            <div className="result-form-group">
              <label className="result-form-label">Branch</label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="result-form-select"
              >
                <option value="CS">Computer Science</option>
                <option value="EE">Electrical Engineering</option>
                <option value="ME">Mechanical Engineering</option>
                <option value="CE">Civil Engineering</option>
              </select>
            </div>

            <div className="result-form-group">
              <label className="result-form-label">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="result-form-select"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="result-subjects-container">
            <h3 className="result-subjects-title">Subject Marks</h3>
            {formData.subjects.map((subject, index) => (
              <div key={index} className="result-subject-group">
                <label className="result-subject-label">{subject.name}</label>
                <input
                  type="number"
                  value={subject.marks}
                  onChange={(e) => handleSubjectChange(index, e)}
                  className="result-subject-input"
                  min="0"
                  max="100"
                  required
                />
              </div>
            ))}
          </div>

          <div className="result-form-row">
            <div className="result-form-group">
              <label className="result-form-label">Total Marks</label>
              <input
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleInputChange}
                className="result-form-input"
                required
              />
            </div>

            <div className="result-form-group">
              <label className="result-form-label">Grade</label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="result-form-select"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>

            <div className="result-form-group">
              <label className="result-form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="result-form-select"
              >
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
          </div>

          <button type="submit" className="result-submit-btn">
            Save Result
          </button>
        </form>
      ) : uploadMethod === 'excel' ? (
        <div className="result-excel-upload">
          <div className="result-excel-instructions">
            <h3>Excel Upload Instructions</h3>
            <p>Upload an Excel file with the following format:</p>
            <div className="result-excel-sample">
              <table>
                <thead>
                  <tr>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>Semester</th>
                    <th>Subject1</th>
                    <th>Subject2</th>
                    <th>Subject3</th>
                    <th>Total</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td>John Doe</td>
                    <td>CS</td>
                    <td>4</td>
                    <td>85</td>
                    <td>78</td>
                    <td>92</td>
                    <td>255</td>
                    <td>A</td>
                    <td>Pass</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="result-file-upload">
            <label className="result-file-label">
              <input 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileUpload}
                className="result-file-input"
              />
              <span className="result-file-custom">
                <Upload size={18} /> Choose Excel File
              </span>
            </label>
          </div>

          {excelData.length > 0 && (
            <div className="result-excel-preview">
              <h3>Preview (First 5 Rows)</h3>
              <div className="result-preview-table">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(excelData[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 5).map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="result-import-btn">
                Import {excelData.length} Records
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="result-pdf-upload">
          <div className="result-pdf-instructions">
            <h3>PDF Upload Instructions</h3>
            <p>Upload PDF result files for students. Each PDF should be named with the student's roll number.</p>
            <p>Example: <strong>101_John_Doe_Result.pdf</strong> (where 101 is the roll number)</p>
          </div>

          <div className="result-file-upload">
            <label className="result-file-label">
              <input 
                type="file" 
                accept=".pdf"
                multiple
                onChange={handlePdfUpload}
                className="result-file-input"
              />
              <span className="result-file-custom">
                <Upload size={18} /> Choose PDF Files
              </span>
            </label>
          </div>

          {pdfFiles.length > 0 && (
            <div className="result-pdf-preview">
              <h3>Selected Files ({pdfFiles.length})</h3>
              <ul className="result-pdf-list">
                {pdfFiles.map((file, index) => (
                  <li key={index} className="result-pdf-item">
                    <span className="result-pdf-name">{file.name}</span>
                    <span className="result-pdf-size">{(file.size / 1024).toFixed(2)} KB</span>
                  </li>
                ))}
              </ul>
              <button 
                className="result-import-btn"
                onClick={handlePdfSubmit}
              >
                Upload {pdfFiles.length} PDF File(s)
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        /* =============== UPLOAD COMPONENT STYLES =============== */
        .result-upload-container {
          padding: 20px;
        }

        .result-upload-methods {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-method-btn {
          padding: 10px 20px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 500;
          color: #4a5568;
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }

        .result-active-method {
          color: #3182ce;
          border-bottom-color: #3182ce;
        }

        /* Form Styles */
        .result-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .result-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .result-form-label {
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }

        .result-form-input, .result-form-select {
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .result-form-input:focus, .result-form-select:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .result-form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .result-subjects-container {
          margin: 15px 0;
          padding: 15px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .result-subjects-title {
          margin: 0 0 10px 0;
          font-size: 16px;
          color: #2d3748;
        }

        .result-subject-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .result-subject-label {
          font-size: 14px;
          color: #4a5568;
        }

        .result-subject-input {
          width: 80px;
          padding: 8px 10px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          text-align: center;
        }

        .result-submit-btn {
          padding: 12px 20px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          align-self: flex-start;
        }

        .result-submit-btn:hover {
          background: #2c5282;
        }

        /* Excel Upload Styles */
        .result-excel-upload {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-excel-instructions {
          background: #f7fafc;
          padding: 15px;
          border-radius: 8px;
        }

        .result-excel-instructions h3 {
          margin-top: 0;
          color: #2d3748;
        }

        .result-excel-sample table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 13px;
        }

        .result-excel-sample th, 
        .result-excel-sample td {
          border: 1px solid #e2e8f0;
          padding: 6px 10px;
          text-align: left;
        }

        .result-excel-sample th {
          background: #ebf8ff;
          color: #2b6cb0;
        }

        .result-file-upload {
          margin-top: 10px;
        }

        .result-file-input {
          display: none;
        }

        .result-file-custom {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #ebf8ff;
          color: #3182ce;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px dashed #90cdf4;
        }

        .result-file-custom:hover {
          background: #bee3f8;
        }

        .result-excel-preview {
          margin-top: 20px;
        }

        .result-preview-table {
          overflow-x: auto;
          margin: 10px 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
        }

        .result-preview-table table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }

        .result-preview-table th, 
        .result-preview-table td {
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          text-align: left;
        }

        .result-preview-table th {
          background: #f7fafc;
          font-weight: 500;
        }

        .result-import-btn {
          padding: 10px 16px;
          background: #38a169;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-import-btn:hover {
          background: #2f855a;
        }

        /* PDF Upload Styles */
        .result-pdf-upload {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-pdf-instructions {
          background: #f7fafc;
          padding: 15px;
          border-radius: 8px;
        }

        .result-pdf-instructions h3 {
          margin-top: 0;
          color: #2d3748;
        }

        .result-pdf-preview {
          margin-top: 20px;
        }

        .result-pdf-list {
          list-style: none;
          padding: 0;
          margin: 15px 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
        }

        .result-pdf-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 15px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
        }

        .result-pdf-item:last-child {
          border-bottom: none;
        }

        .result-pdf-name {
          color: #2d3748;
        }

        .result-pdf-size {
          color: #718096;
          font-size: 13px;
        }

        /* =============== RESPONSIVE STYLES =============== */
        @media (max-width: 768px) {
          .result-form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .result-upload-methods {
            flex-direction: column;
            border-bottom: none;
          }

          .result-method-btn {
            border-bottom: 1px solid #e2e8f0;
          }

          .result-active-method {
            border-bottom: 1px solid #3182ce;
          }
        }
      `}</style>
    </div>
  );
};

// ======================== RESULT TABLE COMPONENT ========================
const ResultTable = () => {
  const [results, setResults] = useState([
    {
      id: 1,
      rollNo: '101',
      name: 'John Doe',
      branch: 'CS',
      semester: '4',
      subjects: [
        { name: 'Mathematics', marks: 85 },
        { name: 'Physics', marks: 78 },
        { name: 'Chemistry', marks: 92 }
      ],
      totalMarks: 255,
      grade: 'A',
      status: 'Pass',
      date: '2023-05-15'
    },
    // More sample data...
  ]);

  const [filters, setFilters] = useState({
    branch: 'all',
    semester: 'all',
    status: 'all',
    searchQuery: ''
  });

  const filteredResults = results.filter(result => {
    return (
      (filters.branch === 'all' || result.branch === filters.branch) &&
      (filters.semester === 'all' || result.semester === filters.semester) &&
      (filters.status === 'all' || result.status === filters.status) &&
      (
        result.rollNo.includes(filters.searchQuery) || 
        result.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      setResults(prev => prev.filter(result => result.id !== id));
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredResults.map(r => ({
      'Roll No': r.rollNo,
      'Name': r.name,
      'Branch': r.branch,
      'Semester': r.semester,
      'Total Marks': r.totalMarks,
      'Grade': r.grade,
      'Status': r.status,
      'Date': r.date
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, "results.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Results Summary', 14, 16);
    doc.autoTable({
      head: [['Roll No', 'Name', 'Branch', 'Semester', 'Total', 'Grade', 'Status']],
      body: filteredResults.map(r => [
        r.rollNo, 
        r.name, 
        r.branch, 
        r.semester, 
        r.totalMarks, 
        r.grade, 
        r.status
      ]),
      startY: 22,
    });
    doc.save('results.pdf');
  };

  return (
    <div className="result-table-container">
      <div className="result-table-controls">
        <div className="result-search-container">
          <Search className="result-search-icon" size={18} />
          <input
            type="text"
            placeholder="Search by Roll No or Name..."
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            className="result-search-input"
          />
        </div>

        <div className="result-filters">
          <div className="result-filter-group">
            <label className="result-filter-label">Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="result-filter-select"
            >
              <option value="all">All Branches</option>
              <option value="CS">Computer Science</option>
              <option value="EE">Electrical</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>

          <div className="result-filter-group">
            <label className="result-filter-label">Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="result-filter-select"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="result-filter-group">
            <label className="result-filter-label">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="result-filter-select"
            >
              <option value="all">All Status</option>
              <option value="Pass">Pass</option>
              <option value="Fail">Fail</option>
            </select>
          </div>
        </div>

        <div className="result-export-buttons">
          <button className="result-export-btn" onClick={exportToExcel}>
            <Download size={16} /> Excel
          </button>
          <button className="result-export-btn" onClick={exportToPDF}>
            <Printer size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="result-table-wrapper">
        <table className="result-data-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Semester</th>
              <th>Total Marks</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map(result => (
                <tr key={result.id}>
                  <td>{result.rollNo}</td>
                  <td>{result.name}</td>
                  <td>{result.branch}</td>
                  <td>{result.semester}</td>
                  <td>{result.totalMarks}</td>
                  <td>
                    <span className={`result-grade-badge result-grade-${result.grade}`}>
                      {result.grade}
                    </span>
                  </td>
                  <td>
                    <span className={`result-status-badge result-status-${result.status.toLowerCase()}`}>
                      {result.status}
                    </span>
                  </td>
                  <td>{result.date}</td>
                  <td>
                    <div className="result-action-buttons">
                      <button className="result-action-btn result-edit-btn">
                        <Edit size={16} />
                      </button>
                      <button 
                        className="result-action-btn result-delete-btn"
                        onClick={() => handleDelete(result.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="result-no-data">
                  No results found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        /* =============== TABLE COMPONENT STYLES =============== */
        .result-table-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-table-controls {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .result-search-container {
          position: relative;
          max-width: 400px;
        }

        .result-search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #718096;
        }

        .result-search-input {
          width: 100%;
          padding: 10px 15px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .result-search-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .result-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .result-filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 150px;
        }

        .result-filter-label {
          font-size: 13px;
          color: #4a5568;
          font-weight: 500;
        }

        .result-filter-select {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .result-export-buttons {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .result-export-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .result-export-btn:hover {
          background: #ebf8ff;
          border-color: #bee3f8;
        }

        .result-table-wrapper {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .result-data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .result-data-table th {
          background: #f7fafc;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #2d3748;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-data-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .result-data-table tr:last-child td {
          border-bottom: none;
        }

        .result-data-table tr:hover {
          background: #f7fafc;
        }

        .result-grade-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 13px;
        }

        .result-grade-A {
          background: #c6f6d5;
          color: #22543d;
        }

        .result-grade-B {
          background: #feebc8;
          color: #744210;
        }

        .result-grade-C {
          background: #fed7d7;
          color: #742a2a;
        }

        .result-grade-D, .result-grade-F {
          background: #e2e8f0;
          color: #1a202c;
        }

        .result-status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-weight: 500;
          font-size: 13px;
        }

        .result-status-pass {
          background: #c6f6d5;
          color: #22543d;
        }

        .result-status-fail {
          background: #fed7d7;
          color: #742a2a;
        }

        .result-action-buttons {
          display: flex;
          gap: 8px;
        }

        .result-action-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .result-edit-btn {
          background: #ebf8ff;
          color: #3182ce;
        }

        .result-edit-btn:hover {
          background: #bee3f8;
        }

        .result-delete-btn {
          background: #fff5f5;
          color: #e53e3e;
        }

        .result-delete-btn:hover {
          background: #fed7d7;
        }

        .result-no-data {
          text-align: center;
          padding: 30px;
          color: #718096;
          font-style: italic;
        }

        /* =============== RESPONSIVE STYLES =============== */
        @media (max-width: 768px) {
          .result-filters {
            flex-direction: column;
            gap: 10px;
          }

          .result-filter-group {
            min-width: 100%;
          }
        }

        @media (max-width: 480px) {
          .result-export-buttons {
            flex-direction: column;
          }

          .result-export-btn {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

// ======================== STUDENT RESULT VIEWER ========================
const StudentResultViewer = () => {
  const [searchParams, setSearchParams] = useState({
    rollNo: '',
    dob: ''
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const mockResults = [
    {
      rollNo: '101',
      name: 'John Doe',
      dob: '2000-01-15',
      branch: 'Computer Science',
      semester: '4',
      subjects: [
        { name: 'Mathematics', marks: 85, maxMarks: 100 },
        { name: 'Physics', marks: 78, maxMarks: 100 },
        { name: 'Chemistry', marks: 92, maxMarks: 100 },
        { name: 'Programming', marks: 88, maxMarks: 100 },
        { name: 'Database', marks: 91, maxMarks: 100 }
      ],
      totalMarks: 434,
      maxTotal: 500,
      percentage: 86.8,
      grade: 'A',
      status: 'Pass',
      date: '2023-05-15'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      const foundResult = mockResults.find(r => 
        r.rollNo === searchParams.rollNo && 
        r.dob === searchParams.dob
      );
      
      if (foundResult) {
        setResult(foundResult);
      } else {
        setError('No result found with the provided details');
      }
      setIsLoading(false);
    }, 1000);
  };

  const generatePDF = () => {
    if (!result) return;
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 53, 147);
    doc.text('UNIVERSITY OF EXAMPLE', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('OFFICIAL GRADE REPORT', 105, 30, { align: 'center' });
    
    // Student Info
    doc.setFontSize(12);
    doc.text(`Name: ${result.name}`, 20, 50);
    doc.text(`Roll No: ${result.rollNo}`, 20, 60);
    doc.text(`Branch: ${result.branch}`, 20, 70);
    doc.text(`Semester: ${result.semester}`, 20, 80);
    doc.text(`Result Date: ${result.date}`, 120, 80);
    
    // Subjects Table
    doc.autoTable({
      startY: 90,
      head: [['Subject', 'Marks Obtained', 'Max Marks', 'Percentage']],
      body: result.subjects.map(sub => [
        sub.name,
        sub.marks,
        sub.maxMarks,
        `${((sub.marks / sub.maxMarks) * 100).toFixed(2)}%`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [40, 53, 147],
        textColor: 255
      }
    });
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text(`Total Marks: ${result.totalMarks} / ${result.maxTotal}`, 20, finalY);
    doc.text(`Percentage: ${result.percentage}%`, 20, finalY + 10);
    doc.text(`Grade: ${result.grade}`, 20, finalY + 20);
    doc.text(`Status: ${result.status}`, 20, finalY + 30);
    
    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('This is a computer generated document. No signature required.', 105, 280, { align: 'center' });
    
    doc.save(`${result.rollNo}_${result.name}_Result.pdf`);
  };

  return (
    <div className="result-student-container">
      <div className="result-student-search">
        <h2 className="result-student-title">Check Your Results</h2>
        <form onSubmit={handleSearch} className="result-search-form">
          <div className="result-form-group">
            <label className="result-form-label">Roll Number</label>
            <input
              type="text"
              value={searchParams.rollNo}
              onChange={(e) => setSearchParams({ ...searchParams, rollNo: e.target.value })}
              className="result-form-input"
              required
            />
          </div>
          
          <div className="result-form-group">
            <label className="result-form-label">Date of Birth</label>
            <input
              type="date"
              value={searchParams.dob}
              onChange={(e) => setSearchParams({ ...searchParams, dob: e.target.value })}
              className="result-form-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="result-search-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search Result'}
          </button>
        </form>
        
        {error && <div className="result-error-message">{error}</div>}
      </div>
      
      {result && (
        <div className="result-display-container">
          <div className="result-display-header">
            <h3 className="result-display-title">Result Details</h3>
            <button 
              className="result-download-btn"
              onClick={generatePDF}
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
          
          <div className="result-student-info">
            <div className="result-info-item">
              <User size={18} className="result-info-icon" />
              <div>
                <span className="result-info-label">Name</span>
                <span className="result-info-value">{result.name}</span>
              </div>
            </div>
            
            <div className="result-info-item">
              <span className="result-info-icon">#</span>
              <div>
                <span className="result-info-label">Roll No</span>
                <span className="result-info-value">{result.rollNo}</span>
              </div>
            </div>
            
            <div className="result-info-item">
              <Book size={18} className="result-info-icon" />
              <div>
                <span className="result-info-label">Branch</span>
                <span className="result-info-value">{result.branch}</span>
              </div>
            </div>
            
            <div className="result-info-item">
              <Calendar size={18} className="result-info-icon" />
              <div>
                <span className="result-info-label">Semester</span>
                <span className="result-info-value">{result.semester}</span>
              </div>
            </div>
          </div>
          
          <div className="result-subjects-table">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Max Marks</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>{subject.marks}</td>
                    <td>{subject.maxMarks}</td>
                    <td>{((subject.marks / subject.maxMarks) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="result-summary">
            <div className="result-summary-item">
              <span className="result-summary-label">Total Marks</span>
              <span className="result-summary-value">{result.totalMarks} / {result.maxTotal}</span>
            </div>
            
            <div className="result-summary-item">
              <span className="result-summary-label">Percentage</span>
              <span className="result-summary-value">{result.percentage}%</span>
            </div>
            
            <div className="result-summary-item">
              <span className="result-summary-label">Grade</span>
              <span className={`result-summary-value result-grade-${result.grade}`}>
                {result.grade}
              </span>
            </div>
            
            <div className="result-summary-item">
              <span className="result-summary-label">Status</span>
              <span className={`result-summary-value result-status-${result.status.toLowerCase()}`}>
                {result.status}
              </span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* =============== STUDENT VIEWER STYLES =============== */
        .result-student-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .result-student-search {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 30px;
        }

        .result-student-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: #2d3748;
          font-size: 24px;
          text-align: center;
        }

        .result-search-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .result-form-label {
          font-size: 14px;
          font-weight: 500;
          color: #4a5568;
        }

        .result-form-input {
          padding: 12px 15px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s;
        }

        .result-form-input:focus {
          outline: none;
          border-color: #3182ce;
          box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
        }

        .result-search-btn {
          padding: 12px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 10px;
        }

        .result-search-btn:hover {
          background: #2b6cb0;
        }

        .result-search-btn:disabled {
          background: #a0aec0;
          cursor: not-allowed;
        }

        .result-error-message {
          margin-top: 15px;
          padding: 12px;
          background: #fff5f5;
          color: #e53e3e;
          border-radius: 6px;
          text-align: center;
        }

        /* Result Display Styles */
        .result-display-container {
          background: white;
          border-radius: 10px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .result-display-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-display-title {
          margin: 0;
          color: #2d3748;
          font-size: 20px;
        }

        .result-download-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          background: #38a169;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .result-download-btn:hover {
          background: #2f855a;
        }

        .result-student-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }

        .result-info-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .result-info-icon {
          color: #3182ce;
          font-weight: bold;
        }

        .result-info-label {
          display: block;
          font-size: 12px;
          color: #718096;
          margin-bottom: 4px;
        }

        .result-info-value {
          font-weight: 500;
          color: #2d3748;
        }

        .result-subjects-table {
          overflow-x: auto;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
        }

        .result-subjects-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .result-subjects-table th {
          background: #f7fafc;
          padding: 12px 15px;
          text-align: left;
          font-weight: 600;
          color: #2d3748;
          border-bottom: 1px solid #e2e8f0;
        }

        .result-subjects-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .result-subjects-table tr:last-child td {
          border-bottom: none;
        }

        .result-subjects-table tr:hover {
          background: #f7fafc;
        }

        .result-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          padding: 15px;
          background: #f7fafc;
          border-radius: 8px;
        }

        .result-summary-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-summary-label {
          font-size: 13px;
          color: #718096;
        }

        .result-summary-value {
          font-weight: 600;
          color: #2d3748;
          font-size: 16px;
        }

        .result-grade-A {
          color: #22543d;
        }

        .result-grade-B {
          color: #744210;
        }

        .result-grade-C {
          color: #742a2a;
        }

        .result-grade-D, .result-grade-F {
          color: #1a202c;
        }

        .result-status-pass {
          color: #22543d;
        }

        .result-status-fail {
          color: #742a2a;
        }

        /* =============== RESPONSIVE STYLES =============== */
        @media (max-width: 768px) {
          .result-student-info {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .result-student-search {
            padding: 20px 15px;
          }

          .result-display-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .result-student-info {
            grid-template-columns: 1fr;
          }

          .result-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultManager;