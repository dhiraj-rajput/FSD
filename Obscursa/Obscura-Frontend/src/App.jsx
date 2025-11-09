import { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import IntroPage from './pages/IntroPage';
import EncryptPage from './pages/EncryptPage';
import DecryptPage from './pages/DecryptPage';
import FileViewPage from './pages/FileViewPage';

function App() {
  const [currentPage, setCurrentPage] = useState('intro');
  const [viewFileId, setViewFileId] = useState('');

  // Helper to build URLs for pages
  const buildUrl = (page, fileId) => {
    if (page === 'file-view' && fileId) return `/file/${fileId}`;
    if (page === 'encrypt') return '/encrypt';
    if (page === 'decrypt') return '/decrypt';
    return '/';
  };

  // Centralized navigation that updates state and browser history
  const navigate = useCallback((page, fileId = '') => {
    setCurrentPage((prev) => {
      // update file id first when navigating to file-view
      if (page === 'file-view' && fileId) setViewFileId(fileId);
      return page;
    });

    // ensure viewFileId is in sync (for the rare case where fileId is passed later)
    if (page === 'file-view' && fileId) setViewFileId(fileId);

    const url = buildUrl(page, fileId);
    const state = { page, fileId };
    // push a new history entry
    window.history.pushState(state, '', url);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Navigation 
        currentPage={currentPage === 'file-view' ? 'intro' : currentPage} 
        onNavigate={(page) => navigate(page)} 
      />

      {currentPage === 'intro' && <IntroPage onNavigate={navigate} />}
      {currentPage === 'encrypt' && <EncryptPage onFileEncrypted={(fileId) => {
        // navigate to file-view and push URL/state
        navigate('file-view', fileId);
      }} />}
      {currentPage === 'decrypt' && <DecryptPage />}
      {currentPage === 'file-view' && <FileViewPage fileId={viewFileId} />}

      {/* Initialize from the current URL and listen for popstate so browser Back/Forward works */}
      <HistorySync setCurrentPage={setCurrentPage} setViewFileId={setViewFileId} />
    </div>
  );
}

export default App;

// Small component to synchronize browser history with app state
function HistorySync({ setCurrentPage, setViewFileId }) {
  useEffect(() => {
    // parse the current location and update app state
    const syncFromLocation = () => {
      const path = window.location.pathname || '/';
      if (path.startsWith('/file/')) {
        const id = path.split('/file/')[1];
        setViewFileId(id || '');
        setCurrentPage('file-view');
      } else if (path === '/encrypt') {
        setViewFileId('');
        setCurrentPage('encrypt');
      } else if (path === '/decrypt') {
        setViewFileId('');
        setCurrentPage('decrypt');
      } else {
        setViewFileId('');
        setCurrentPage('intro');
      }
    };

    // ensure initial sync (on page load)
    syncFromLocation();

    const onPop = (ev) => {
      // Try to restore from history state first
      const state = ev.state;
      if (state && state.page) {
        setViewFileId(state.fileId || '');
        setCurrentPage(state.page);
        return;
      }
      // fallback to parsing the URL
      syncFromLocation();
    };

    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [setCurrentPage, setViewFileId]);
}
