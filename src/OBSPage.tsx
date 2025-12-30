
function OBSPage() {
    const openOBS = () => {
        const link = document.createElement('a');
        link.href = 'obs://';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', textAlign: 'center' }}>
            <h1>OBS Studio</h1>
            <button
                onClick={openOBS}
                style={{
                    padding: '15px 30px',
                    fontSize: '18px',
                    backgroundColor: '#6441a5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Open OBS Studio
            </button>
            <p style={{ marginTop: '20px', color: '#666' }}>
                Note: OBS Studio must be installed on your computer for this to work.
            </p>
        </div>
    );
}

export default OBSPage;

