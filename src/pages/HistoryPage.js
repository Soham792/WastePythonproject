import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';
import './HistoryPage.css';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/history/');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/history/${itemId}/`);
      setHistory(history.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="history-page">
      <h2>Classification History</h2>
      <div className="history-list">
        {history.map((item) => (
          <div key={item.id} className="history-item">
            <div className="image-container">
              <img 
                src={`http://localhost:8000${item.image_url}`} 
                alt={`Classification ${item.id}`}
              />
            </div>
            <div className="details">
              <div className="history-header">
                <div>
                  <p className="date">📅 {item.date}</p>
                  <p className="time">⏰ {item.time}</p>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
              
              <div className="predictions">
                {item.predictions.map((pred, idx) => (
                  <div key={idx} className="prediction">
                    <span className="class-name">{pred.class}</span>
                    <span className="confidence">
                      {Math.round(pred.confidence * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;