import React, { useState } from 'react';

const PDFUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
      } else {
        alert('Please select a PDF file');
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload-pdf/', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      alert("PDF uploaded successfully!");
      onUploadSuccess();
    } catch (err) {
      alert("Upload failed. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      padding: '32px',
      width: '100%',
      maxWidth: '512px',
      margin: '0 auto'
    },
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    iconContainer: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      backgroundColor: '#dbeafe',
      borderRadius: '50%',
      marginBottom: '16px',
      fontSize: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px',
      margin: 0
    },
    subtitle: {
      color: '#6b7280',
      margin: 0
    },
    dropZone: {
      position: 'relative',
      border: '2px dashed',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      transition: 'all 0.2s',
      borderColor: dragActive ? '#3b82f6' : file ? '#10b981' : '#d1d5db',
      backgroundColor: dragActive ? '#eff6ff' : file ? '#f0fdf4' : 'transparent'
    },
    fileInput: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer'
    },
    dropContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    uploadIcon: {
      fontSize: '48px',
      color: file ? '#10b981' : '#9ca3af',
      marginBottom: '12px'
    },
    fileName: {
      color: '#059669',
      fontWeight: '500',
      marginBottom: '4px',
      margin: 0
    },
    fileSize: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    browseText: {
      color: '#374737',
      fontWeight: '500',
      marginBottom: '4px',
      margin: 0
    },
    browseLink: {
      color: '#2563eb'
    },
    supportText: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    uploadButton: {
      width: '100%',
      marginTop: '24px',
      backgroundColor: isUploading ? '#93c5fd' : '#2563eb',
      color: 'white',
      fontWeight: '600',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      cursor: isUploading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.iconContainer}>
          📄
        </div>
        <h2 style={styles.title}>Upload Your PDF</h2>
        <p style={styles.subtitle}>Upload a PDF document to start asking questions about its content</p>
      </div>

      <div
        style={styles.dropZone}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={styles.fileInput}
          disabled={isUploading}
        />
        
        <div style={styles.dropContent}>
          {file ? (
            <>
              <div style={styles.uploadIcon}>✅</div>
              <p style={styles.fileName}>{file.name}</p>
              <p style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <div style={styles.uploadIcon}>⬆️</div>
              <p style={styles.browseText}>
                Drop your PDF here, or <span style={styles.browseLink}>browse</span>
              </p>
              <p style={styles.supportText}>Supports PDF files up to 50MB</p>
            </>
          )}
        </div>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={isUploading}
          style={styles.uploadButton}
          onMouseOver={(e) => {
            if (!isUploading) {
              e.target.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseOut={(e) => {
            if (!isUploading) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {isUploading ? (
            <>
              <span style={{animation: 'spin 1s linear infinite'}}>⏳</span>
              Uploading...
            </>
          ) : (
            <>
              📤 Upload PDF
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default PDFUpload;