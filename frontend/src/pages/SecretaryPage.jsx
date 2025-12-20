import { useState, useEffect } from 'react';
import axios from 'axios';

const SecretaryPage = () => {
  const [leads, setLeads] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      alert('Error assigning lawyer');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4"><i className="bi bi-inbox-fill me-2"></i>Incoming Leads Dashboard</h2>
      
      <div className="row g-4">
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
    </div>
  );
};

export default SecretaryPage;