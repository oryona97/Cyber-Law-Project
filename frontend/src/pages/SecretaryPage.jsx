import { useState, useEffect } from 'react';
import axios from 'axios';

const SecretaryPage = () => {
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' or 'lawyers'
  const [leads, setLeads] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Lawyer Form State
  const [newLawyer, setNewLawyer] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, lawyersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/secretary/leads'),
        axios.get('http://localhost:5001/api/secretary/lawyers')
      ]);
      setLeads(leadsRes.data);
      setLawyers(lawyersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const assignLawyer = async (leadId, lawyerId) => {
    try {
      await axios.post(`http://localhost:5001/api/secretary/leads/${leadId}/assign`, { lawyer_id: lawyerId });
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'assigned', Lawyer: lawyers.find(law => law.id == lawyerId) } : l));
      alert('Lawyer assigned successfully!');
    } catch (error) {
      alert('Error assigning lawyer');
    }
  };

  const handleCreateLawyer = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/secretary/lawyers', newLawyer);
      setLawyers([...lawyers, res.data]);
      setNewLawyer({ name: '', email: '', phone: '' }); // Reset form
      alert('Lawyer created!');
    } catch (error) {
      alert('Error creating lawyer');
    }
  };

  const handleDeleteLawyer = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this lawyer?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/secretary/lawyers/${id}`);
      setLawyers(lawyers.filter(l => l.id !== id));
    } catch (error) {
      alert('Error deleting lawyer');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="bi bi-briefcase-fill me-2"></i>Secretary Dashboard</h2>
        
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'leads' ? 'active' : ''}`} 
              onClick={() => setActiveTab('leads')}
            >
              Leads
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'lawyers' ? 'active' : ''}`} 
              onClick={() => setActiveTab('lawyers')}
            >
              Manage Lawyers
            </button>
          </li>
        </ul>
      </div>
      
      {/* LEADS TAB */}
      {activeTab === 'leads' && (
        <div className="row g-4">
          {leads.length === 0 && <p className="text-center text-muted">No leads found.</p>}
          {leads.map(lead => (
            <div key={lead.id} className="col-lg-6">
              <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className="badge bg-primary rounded-pill">{lead.Topic?.name}</span>
                  <span className={`badge ${lead.urgency === 'High' ? 'badge-urgent' : 'badge-normal'}`}>
                    {lead.urgency || 'Normal'} Priority
                  </span>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-light rounded-circle p-2 me-3 text-center" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-person-fill text-muted"></i>
                    </div>
                    <div>
                      <h5 className="card-title mb-0">{lead.User?.name || 'Unknown User'}</h5>
                      <small className="text-muted">{lead.User?.whatsapp_number}</small>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded mb-3 border-start border-4 border-warning">
                    <h6 className="text-muted text-uppercase small fw-bold mb-1">AI Summary</h6>
                    <p className="card-text mb-0">{lead.summary}</p>
                  </div>
                  
                  <hr className="my-3"/>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-muted small">
                      Created: {new Date(lead.created_at).toLocaleDateString()}
                    </div>
                    
                    {lead.status === 'assigned' ? (
                      <div className="text-success fw-bold">
                        <i className="bi bi-check-circle-fill me-1"></i>
                        Assigned to {lead.Lawyer?.name}
                      </div>
                    ) : (
                      <div className="d-flex align-items-center">
                        <select 
                          className="form-select form-select-sm me-2"
                          style={{maxWidth: '150px'}}
                          onChange={(e) => assignLawyer(lead.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Assign Lawyer...</option>
                          {lawyers.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LAWYERS TAB */}
      {activeTab === 'lawyers' && (
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header bg-white font-weight-bold">Add New Lawyer</div>
              <div className="card-body">
                <form onSubmit={handleCreateLawyer}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" className="form-control" required 
                      value={newLawyer.name}
                      onChange={(e) => setNewLawyer({...newLawyer, name: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" className="form-control" required
                      value={newLawyer.email}
                      onChange={(e) => setNewLawyer({...newLawyer, email: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone (Optional)</label>
                    <input 
                      type="text" className="form-control"
                      value={newLawyer.phone}
                      onChange={(e) => setNewLawyer({...newLawyer, phone: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">Add Lawyer</button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-white">Active Lawyers</div>
              <div className="card-body p-0">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lawyers.map(lawyer => (
                      <tr key={lawyer.id}>
                        <td className="fw-bold">{lawyer.name}</td>
                        <td>{lawyer.email}</td>
                        <td>{lawyer.phone || '-'}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteLawyer(lawyer.id)}
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                    {lawyers.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-muted">No lawyers found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SecretaryPage;
