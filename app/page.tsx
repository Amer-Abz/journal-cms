import AuthButton from '@/components/AuthButton'; // Assuming components is aliased to @/components or relative path

export default function HomePage() {
  const pageStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  };

  const headerStyle: React.CSSProperties = {
    position: 'fixed', // Make header fixed
    top: '0',
    left: '0',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#f0f0f0', // Light grey background
    borderBottom: '1px solid #ddd',
    boxSizing: 'border-box', // Ensure padding doesn't increase width
    zIndex: 1000, // Ensure header is above other content
  };

  const mainContentStyle: React.CSSProperties = {
    marginTop: '80px', // Add margin to push content below fixed header
    textAlign: 'center',
  };

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <h1>Journal CMS</h1>
        <AuthButton />
      </header>
      <main style={mainContentStyle}>
        <h2>Welcome to your Journal CMS</h2>
        <p>This is the main page. Content will go here.</p>
        {/* More content can be added here */}
      </main>
    </div>
  );
}
