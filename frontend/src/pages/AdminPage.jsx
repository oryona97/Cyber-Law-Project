import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPage = () => {
  const [topics, setTopics] = useState([]);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentTopic, setCurrentTopic] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: '',
    max_depth: 5
  });

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

  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ name: '', description: '', system_prompt: '', max_depth: 5 });
    setShowModal(true);
  };

  const handleOpenEdit = (topic) => {
    setModalMode('edit');
    setCurrentTopic(topic);
    setFormData({
      name: topic.name,
      description: topic.description,
      system_prompt: topic.expertConfig?.system_prompt || '',
      max_depth: topic.expertConfig?.max_depth || 5
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        await axios.post('http://localhost:5001/api/admin/topics', formData);
        alert('Topic created!');
      } else {
        // Update Topic
        await axios.put(`http://localhost:5001/api/admin/topics/${currentTopic.id}`, {
          name: formData.name,
          description: formData.description,
          is_active: true
        });
        // Update Expert Config
        if (currentTopic.expertConfig) {
          await axios.put(`http://localhost:5001/api/admin/experts/${currentTopic.expertConfig.id}`, {
            system_prompt: formData.system_prompt,
            max_depth: formData.max_depth
          });
        }
        alert('Topic updated!');
      }
      setShowModal(false);
      fetchTopics();
    } catch (error) {
      console.error(error);
      alert('Operation failed');
    }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this topic?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/admin/topics/${id}`);
      fetchTopics();
    } catch (error) {
      alert('Error deactivating topic');
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-gear-fill me-2"></i>System Configuration</h2>
        <button className="btn btn-primary" onClick={handleOpenCreate}>+ Add New Topic</button>
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
                  <tr key={topic.id} className={!topic.is_active ? 'table-secondary text-muted' : ''}>
                    <td className="ps-4 fw-bold">{topic.name}</td>
                    <td className="small">{topic.description}</td>
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
                      <button 
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleOpenEdit(topic)}
                      >
                        Edit
                      </button>
                      {topic.is_active && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeactivate(topic.id)}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modalMode === 'create' ? 'Create New Topic' : 'Edit Topic'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label">Topic Name</label>
                      <input 
                        type="text" className="form-control" required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Max Chat Turns</label>
                      <input 
                        type="number" className="form-control" required
                        value={formData.max_depth}
                        onChange={(e) => setFormData({...formData, max_depth: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description (for User Menu)</label>
                    <input 
                      type="text" className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">AI System Prompt (The "Persona")</label>
                    <textarea 
                      className="form-control" rows="5" required
                      value={formData.system_prompt}
                      onChange={(e) => setFormData({...formData, system_prompt: e.target.value})}
                      placeholder="You are an expert in..."
                    ></textarea>
                    <div className="form-text">Instruct the AI on how to behave, what questions to ask, and what tone to use.</div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
