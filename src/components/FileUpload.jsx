import React, { useState } from 'react';
import { post } from '../utils/request';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
      // 清除之前的结果
      setResult(null);
    } else if (selectedFile) {
      setFile(null);
      setError('请选择PDF文件');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('请先选择PDF文件');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);

    setLoading(true);
    setError('');
    
    try {
      const data = await post('/api/upload', formData);
      
      if (data.success) {
        // 处理成功
        setResult({
          ...data.file,
          success: true,
          message: data.message
        });
      } else {
        // API返回失败信息
        setError(data.error?.message || '生成失败，请重试');
        setResult({
          ...data.file,
          success: false,
          message: data.message,
          error: data.error
        });
      }
    } catch (err) {
      // 网络错误或服务器返回非200状态码
      console.error('上传失败:', err);
      setError(err.response?.data?.error?.message || '上传失败，请稍后重试');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  // 重置状态，允许重新上传
  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">上传简历 PDF</h2>
      
      {!result && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-gray-600">选择文件</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">已选择: {file.name}</p>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full py-2 px-4 rounded-md text-white font-medium 
              ${!file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? '处理中...' : '上传并转换'}
          </button>
        </form>
      )}
      
      {loading && (
        <div className="mt-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">正在处理您的简历，请稍候...</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium text-gray-800 mb-2">
            {result.success ? '转换成功!' : '转换失败'}
          </h3>
          
          {!result.success && result.error && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700 mb-2">{result.message || '生成失败，请重试'}</p>
              {result.error.details && (
                <p className="text-xs text-red-600">错误详情: {result.error.details}</p>
              )}
            </div>
          )}
          
          {result.originalName && (
            <p className="text-sm text-gray-600 mb-1">原始文件: {result.originalName}</p>
          )}
          
          {result.timestamp && (
            <p className="text-sm text-gray-600 mb-3">处理时间: {new Date(result.timestamp).toLocaleString()}</p>
          )}
          
          <div className="flex space-x-2">
            {result.success && result.outputPath && (
              <a
                href={result.outputPath}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                查看HTML
              </a>
            )}
            
            <button
              onClick={handleReset}
              className="flex-1 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700"
            >
              重新上传
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload; 