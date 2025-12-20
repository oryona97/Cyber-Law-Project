import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/topics');
      setTopics(res.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-gear-fill me-2"></i>System Configuration</h2>
        <button className="btn btn-primary">+ Add New Topic</button>
      </div>

      <div className="card">
        <div className="card-header bg-white">
          Active Legal Topics & AI Personas
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th className="ps-4">Topic</th>
                  <th>Description</th>
                  <th>AI System Prompt (Preview)</th>
                  <th>Max Turns</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {topics.map(topic => (
                  <tr key={topic.id}>
                    <td className="ps-4 fw-bold text-primary">{topic.name}</td>
                    <td className="text-muted small">{topic.description}</td>
                    <td>
                      <code className="text-dark bg-light px-2 py-1 rounded small">
                        {topic.expertConfig?.system_prompt.substring(0, 40)}...
                      </code>
                    </td>
                    <td><span className="badge bg-secondary">{topic.expertConfig?.max_depth}</span></td>
                    <td>
                      <span className={`badge ${topic.is_active ? 'bg-success' : 'bg-danger'}`}>
                        {topic.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;