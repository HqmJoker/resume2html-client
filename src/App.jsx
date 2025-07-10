import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import { get } from './utils/request';

// 定义处理后文件的类型接口
// @ts-ignore
/**
 * @typedef {Object} ProcessedFile
 * @property {string} originalName - 原始文件名
 * @property {string} outputFileName - 输出文件名
 * @property {string} outputPath - 输出文件路径
 * @property {number} timestamp - 处理时间戳
 */

function App() {
  /** @type {[ProcessedFile | null, React.Dispatch<React.SetStateAction<ProcessedFile | null>>]} */
  const [processedFile, setProcessedFile] = useState(null);

  // 处理下载操作 - 未完善，需要调整，要根据返回连接下载文件
  const handleDownload = async () => {
    const fileUrl = `/output/test.html`;
    const fileName = 'test.html';
    
    try {
      // 使用我们封装的get请求，设置responseType为'blob'
      const response = await get(fileUrl, {}, {
        responseType: 'blob'
      });
      
      // 创建一个新的Blob对象
      const blob = new Blob([response], { type: 'text/html' });
      
      // 为blob创建一个对象URL
      const url = window.URL.createObjectURL(blob);
      
      // 创建一个临时的下载链接
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // 添加到DOM并触发点击
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('下载文件失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Resume2HTML Converter</h1>
          <p className="text-gray-600 mt-2">Upload your PDF resume and convert it to HTML format</p>
        </header>
        
        {!processedFile ? (
          <div className="mt-6 flex justify-center">
            <FileUpload setProcessedFile={setProcessedFile} />
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 w-full mb-4">
              <h2 className="text-lg font-medium text-green-800">Conversion Successful!</h2>
              <p className="text-green-700">Your PDF has been converted to HTML</p>
              <p className="text-sm text-gray-600 mt-2">Original filename: {processedFile.originalName}</p>
            </div>
            
            <div className="flex space-x-4">
              {/* 预览按钮 */}
              <a 
                href={`${process.env.REACT_APP_API_URL}${processedFile.outputPath}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview HTML
              </a>
              
              {/* 下载按钮 */}
              <button 
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download HTML File
              </button>
            </div>
            
            <button 
              onClick={() => setProcessedFile(null)}
              className="mt-4 text-gray-600 hover:text-gray-800 transition duration-300 ease-in-out"
            >
              Convert Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 