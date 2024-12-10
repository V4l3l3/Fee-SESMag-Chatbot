// src/components/FileUpload.jsx
import { useState } from 'react';

function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file);

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (response.ok) {
          onFileUpload(result.text);  // Send the processed PDF content back to the parent component
        } else {
          setError('Failed to process the PDF');
        }
      } catch (error) {
        setError('Error uploading file: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Upload a PDF</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </form>

      {error && <p className="mt-2 text-red-600">{error}</p>}
      {file && <p className="mt-2 text-gray-700">Selected file: {file.name}</p>}
    </div>
  );
}

export default FileUpload;
