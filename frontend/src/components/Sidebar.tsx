import React from 'react';
import { MessageSquare, FolderSearch, Info, LogOut, Database } from 'lucide-react';
import { type User } from '../api';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  activeDoc: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  activeDoc
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-logo">
        <Database className="logo-icon" size={24} />
        <span className="logo-text">MRP Medical RAG</span>
      </div>

      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentTab === 'chat' ? 'active' : ''}`}
          onClick={() => setCurrentTab('chat')}
        >
          <MessageSquare size={20} />
          <span>Chat Assistant</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'files' ? 'active' : ''}`}
          onClick={() => setCurrentTab('files')}
        >
          <FolderSearch size={20} />
          <span>Search & Papers</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'about' ? 'active' : ''}`}
          onClick={() => setCurrentTab('about')}
        >
          <Info size={20} />
          <span>About & Evaluation</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        {activeDoc && (
          <div className="doc-pill" style={{ fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%', display: 'block', textAlign: 'center' }}>
            📄 Indexed: <strong>{activeDoc}</strong>
          </div>
        )}
        
        <div className="user-profile glass-panel">
          <div className="user-avatar">
            {getInitials(user.name)}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-email">{user.email}</span>
          </div>
        </div>

        <button className="nav-item" onClick={onLogout} style={{ color: 'var(--color-danger)' }}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
