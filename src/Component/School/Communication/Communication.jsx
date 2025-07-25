import React, { useState, useEffect } from 'react';
import './Communication-Management.css';

const CommunicationDashboard = () => {
  // State for messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Principal', content: 'Staff meeting tomorrow at 10 AM', timestamp: '10:30 AM', category: 'announcement', read: false },
    { id: 2, sender: 'Math Department', content: 'New curriculum guidelines attached', timestamp: 'Yesterday', category: 'academic', read: true },
    { id: 3, sender: 'Admin', content: 'Fee payment deadline extended', timestamp: 'Jul 5', category: 'finance', read: true },
    { id: 4, sender: 'Sports Coach', content: 'Inter-school tournament next week', timestamp: 'Jul 4', category: 'event', read: false },
    { id: 5, sender: 'IT Support', content: 'System maintenance tonight', timestamp: 'Jul 3', category: 'technical', read: true },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  const [composeOpen, setComposeOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationCount, setNotificationCount] = useState(2);

  // Filter messages based on active tab
  const filteredMessages = messages.filter(message => {
    const matchesTab = activeTab === 'all' || message.category === activeTab;
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         message.sender.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Mark message as read
  const markAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? {...msg, read: true} : msg
    ));
    setNotificationCount(prev => prev - 1);
  };

  // Delete message
  const deleteMessage = (id) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // Send new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage.content,
      timestamp: 'Just now',
      category: 'sent',
      read: true
    };
    setMessages([newMsg, ...messages]);
    setComposeOpen(false);
    setNewMessage({ recipient: '', subject: '', content: '' });
  };

  // Animation for notification count
  useEffect(() => {
    const unreadCount = messages.filter(msg => !msg.read).length;
    setNotificationCount(unreadCount);
  }, [messages]);

  return (
    <div className="communicationDashboard__container">
      {/* Header */}
      <header className="communicationDashboard__header">
        <h1 className="communicationDashboard__title"> Communication Dashboard</h1>
        <div className="communicationDashboard__headerActions">
          <div className="communicationDashboard__searchBox">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="communicationDashboard__searchInput"
            />
            <span className="communicationDashboard__searchIcon">🔍</span>
          </div>
          <button 
            className="communicationDashboard__composeBtn"
            onClick={() => setComposeOpen(true)}
          >
            ✏️ Compose
          </button>
          <div className="communicationDashboard__notificationBadge">
            {notificationCount > 0 && (
              <span className="communicationDashboard__notificationCount">
                {notificationCount}
              </span>
            )}
            🔔
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="communicationDashboard__main">
        {/* Categories/Tabs */}
        <div className="communicationDashboard__tabs">
          <button
            className={`communicationDashboard__tab ${activeTab === 'all' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Messages
          </button>
          <button
            className={`communicationDashboard__tab ${activeTab === 'announcement' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('announcement')}
          >
            Announcements
          </button>
          <button
            className={`communicationDashboard__tab ${activeTab === 'academic' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            Academic
          </button>
          <button
            className={`communicationDashboard__tab ${activeTab === 'finance' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            Finance
          </button>
          <button
            className={`communicationDashboard__tab ${activeTab === 'event' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('event')}
          >
            Events
          </button>
          <button
            className={`communicationDashboard__tab ${activeTab === 'technical' ? 'communicationDashboard__tab--active' : ''}`}
            onClick={() => setActiveTab('technical')}
          >
            Technical
          </button>
        </div>

        {/* Messages List */}
        <div className="communicationDashboard__messages">
          {filteredMessages.length === 0 ? (
            <div className="communicationDashboard__emptyState">
              <div className="communicationDashboard__emptyIcon">📭</div>
              <p>No messages found</p>
            </div>
          ) : (
            filteredMessages.map(message => (
              <div 
                key={message.id} 
                className={`communicationDashboard__message ${!message.read ? 'communicationDashboard__message--unread' : ''}`}
                onClick={() => markAsRead(message.id)}
              >
                <div className="communicationDashboard__messageHeader">
                  <span className="communicationDashboard__messageSender">{message.sender}</span>
                  <span className="communicationDashboard__messageTime">{message.timestamp}</span>
                  {!message.read && (
                    <span className="communicationDashboard__unreadIndicator"></span>
                  )}
                  <button 
                    className="communicationDashboard__deleteBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMessage(message.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
                <div className="communicationDashboard__messageContent">
                  {message.content}
                </div>
                <div className="communicationDashboard__messageCategory">
                  {message.category}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Compose Message Modal */}
      {composeOpen && (
        <div className="communicationDashboard__composeModal">
          <div className="communicationDashboard__composeContent">
            <div className="communicationDashboard__composeHeader">
              <h2>New Message</h2>
              <button 
                className="communicationDashboard__closeBtn"
                onClick={() => setComposeOpen(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSendMessage}>
              <div className="communicationDashboard__formGroup">
                <label>To:</label>
                <select
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                  className="communicationDashboard__formInput"
                  required
                >
                  <option value="">Select recipient</option>
                  <option value="allTeachers">All Teachers</option>
                  <option value="allStudents">All Students</option>
                  <option value="mathDept">Math Department</option>
                  <option value="scienceDept">Science Department</option>
                  <option value="admin">Administration</option>
                </select>
              </div>
              <div className="communicationDashboard__formGroup">
                <label>Subject:</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  className="communicationDashboard__formInput"
                  required
                />
              </div>
              <div className="communicationDashboard__formGroup">
                <label>Message:</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                  className="communicationDashboard__formTextarea"
                  required
                ></textarea>
              </div>
              <div className="communicationDashboard__formActions">
                <button 
                  type="button"
                  className="communicationDashboard__cancelBtn"
                  onClick={() => setComposeOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="communicationDashboard__sendBtn"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunicationDashboard;