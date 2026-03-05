import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = 'https://rswzqpppadhlmccmowhr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzd3pxcHBwYWRobG1jY21vd2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjQzMTEsImV4cCI6MjA4NzkwMDMxMX0.exjFS1t_Q1gcXK6YbeDNQJwVS7JLn0ZB81XqPeq2Up8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function SouthboundSalvage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visitCount, setVisitCount] = useState(null);

  useEffect(() => {
    // 1. Load Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Courier+Prime:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // 2. Fetch Inventory from Supabase
    const fetchPublicInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (!error && data) {
          setInventory(data);
        }
      } catch (e) {
        console.error("Failed to load inventory:", e);
      } finally {
        setLoading(false);
      }
    };

    // 3. Visitor Counter Logic
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const endpoint = isLocal ? 'get' : 'up'; 
    
    fetch(`https://api.counterapi.dev/v1/southboundsalvage/hits/${endpoint}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          setVisitCount(data.count);
        }
      })
      .catch(err => console.error("Counter Error:", err));

    fetchPublicInventory();
  }, []);

  // --- Styling ---
  const fixedBackgroundStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/marsh.jpg')",
    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1,
  };

  const pageStyle = {
    color: '#003366', minHeight: '100vh', padding: '40px 20px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center', marginBottom: '40px', borderBottom: '3px solid #003366',
    paddingBottom: '25px', maxWidth: '700px', margin: '0 auto 40px auto',
    borderRadius: '12px', paddingTop: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
    position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url('https://rswzqpppadhlmccmowhr.supabase.co/storage/v1/object/public/assests/image0-removebg-preview.png')`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '350px auto'
  };

  const infoSectionStyle = {
    maxWidth: '800px',
    margin: '0 auto 30px auto',
    textAlign: 'center',
    color: '#003366',
    padding: '20px',
    borderTop: '2px solid #003366',
    borderBottom: '2px solid #003366',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
  };

  const gridStyle = {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '20px', maxWidth: '900px', margin: '0 auto'
  };

  const cardStyle = {
    background: '#ffffff', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.4)', display: 'flex',
    flexDirection: 'column', position: 'relative', border: '1px solid rgba(0, 51, 102, 0.1)'
  };

  const imageContainerStyle = {
    height: '180px', cursor: 'zoom-in', position: 'relative',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '12px', background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 20px, rgba(0, 51, 102, 0.2) 20px, rgba(0, 51, 102, 0.2) 40px)'
  };

  const counterStyle = {
    marginTop: '60px', textAlign: 'center', color: '#ffffff',
    fontSize: '0.9em', opacity: 0.9, letterSpacing: '1px', paddingBottom: '40px'
  };

  const odometerStyle = {
    backgroundColor: '#003366', color: '#ffffff', padding: '5px 10px',
    borderRadius: '4px', fontFamily: '"Courier Prime", monospace',
    fontSize: '1.2em', marginLeft: '12px', boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.7)',
    border: '1px solid rgba(255,255,255,0.2)'
  };

  const ImageModal = () => {
    if (!selectedImage) return null;
    return (
      <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'zoom-out' }}>
        <img src={selectedImage} alt="Enlarged" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} />
        <div style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '35px', fontWeight: 'bold' }}>&times;</div>
      </div>
    );
  };

  return (
    <>
      <div style={fixedBackgroundStyle}></div>
      <div style={pageStyle}>
        <header style={headerStyle}>
          <h1 style={{ color: '#003366', fontSize: '4.5em', margin: '0 0 5px 0', fontFamily: "'Great Vibes', cursive", fontWeight: 'normal', lineHeight: '1.1' }}>
            Southbound Salvage
          </h1>
          <p style={{ fontSize: '1.1em', color: '#003366', margin: 0, letterSpacing: '1px', fontWeight: 'bold' }}>
            Vintage Goods & Curated Collectibles
          </p>
          <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#003366', lineHeight: '1.8', borderTop: '1px solid rgba(0, 51, 102, 0.2)', paddingTop: '15px', paddingLeft: '20px', paddingRight: '20px' }}>
            <strong>CONTACT US</strong><br/>
            <a href="mailto:danelmore68@gmail.com" style={{ color: '#003366', textDecoration: 'none', fontWeight: 'bold' }}>danelmore68@gmail.com</a> &nbsp;|&nbsp; <a href="mailto:lauraelmore1@hotmail.com" style={{ color: '#003366', textDecoration: 'none', fontWeight: 'bold' }}>lauraelmore1@hotmail.com</a><br/>
            Text: <a href="tel:9123127432" style={{ color: '#003366', textDecoration: 'none', fontWeight: 'bold' }}>(912) 312-7432</a> &nbsp;|&nbsp; <a href="tel:4047219920" style={{ color: '#003366', textDecoration: 'none', fontWeight: 'bold' }}>(404) 721-9920</a>
          </div>
        </header>

        {/* --- Order, Payment & Shipping Info Section --- */}
        <div style={infoSectionStyle}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1.6em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Contact us to order
          </p>
          <p style={{ margin: '0', fontSize: '1.2em', fontWeight: 'bold', lineHeight: '1.6' }}>
            We accept Multiple forms of payment.<br />
            <span style={{ fontSize: '1em', fontWeight: 'normal' }}>
              Local pickup in <strong>Temple, GA</strong>. We can also ship at buyers cost.
            </span>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.5em', color: '#ffffff', marginTop: '100px' }}>Loading Inventory...</div>
        ) : (
          <>
            <div style={gridStyle}>
              {inventory.map(item => (
                <div key={item.id} style={{ ...cardStyle, opacity: item.sold ? 0.6 : 1 }}>
                  <div onClick={() => item.photo && setSelectedImage(item.photo)} style={imageContainerStyle}>
                    {item.photo ? (
                      <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px', position: 'relative', zIndex: 1 }} />
                    ) : (
                      <div style={{ color: '#003366', fontWeight: 'bold' }}>No Image</div>
                    )}
                    {item.sold && (
                      <div style={{ position: 'absolute', top: '10px', right: '-35px', background: '#FF3B30', color: 'white', padding: '3px 40px', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>SOLD</div>
                    )}
                  </div>
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.1em', color: '#003366', fontWeight: 'bold' }}>{item.name}</h2>
                    <div style={{ color: '#444', fontSize: '0.85em', marginBottom: '12px', flexGrow: 1, lineHeight: '1.4' }}>{item.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(0, 51, 102, 0.1)', paddingTop: '10px' }}>
                      <span style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#003366' }}>${item.price}</span>
                      <span style={{ fontSize: '0.7em', color: '#888' }}>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer style={counterStyle}>
              OFFICIAL VISITOR COUNT 
              <span style={odometerStyle}>
                {visitCount !== null ? visitCount.toLocaleString().padStart(6, '0') : '000000'}
              </span>
            </footer>
          </>
        )}
        <ImageModal />
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SouthboundSalvage />);
export default SouthboundSalvage;