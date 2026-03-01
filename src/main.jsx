import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rswzqpppadhlmccmowhr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzd3pxcHBwYWRobG1jY21vd2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzMjQzMTEsImV4cCI6MjA4NzkwMDMxMX0.exjFS1t_Q1gcXK6YbeDNQJwVS7JLn0ZB81XqPeq2Up8';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function SouthboundSalvage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); 

  useEffect(() => {
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

    fetchPublicInventory();
  }, []);

  // --- STYLING (MOBILE-FRIENDLY BACKGROUND FIX) ---
  
  // 1. The new dedicated background layer
  const fixedBackgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundImage: "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/marsh.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1, // Pushes it behind everything else
  };

  // 2. The page wrapper (removed the background image from here)
  const pageStyle = {
    color: '#e0e0e0',
    minHeight: '100vh',
    padding: '40px 20px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    borderBottom: '2px solid #d4af37', 
    paddingBottom: '25px',
    maxWidth: '700px', 
    margin: '0 auto 40px auto',
    background: 'rgba(0,0,0,0.65)', 
    borderRadius: '12px',
    paddingTop: '25px',
    backdropFilter: 'blur(8px)', 
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
    gap: '15px',
    maxWidth: '850px', 
    margin: '0 auto'
  };

  const cardStyle = {
    background: '#2a2a2a',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  };

  const ImageModal = () => {
    if (!selectedImage) return null;
    return (
      <div 
        onClick={() => setSelectedImage(null)} 
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'zoom-out' }}
      >
        <img 
          src={selectedImage} 
          alt="Enlarged view" 
          style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '8px', objectFit: 'contain', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }} 
        />
        <div style={{ position: 'absolute', top: '20px', right: '30px', color: 'white', fontSize: '30px', fontWeight: 'bold', cursor: 'pointer' }}>&times;</div>
      </div>
    );
  };

  return (
    <>
      {/* Our new mobile-safe background layer */}
      <div style={fixedBackgroundStyle}></div>

      <div style={pageStyle}>
        <header style={headerStyle}>
          <h1 style={{ color: '#d4af37', fontSize: '2.2em', margin: '0 0 10px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Southbound Salvage
          </h1>
          <p style={{ fontSize: '1em', color: '#ccc', margin: 0, letterSpacing: '1px' }}>
            Vintage Goods & Curated Collectibles
          </p>

          <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#ddd', lineHeight: '1.8', borderTop: '1px solid rgba(212, 175, 55, 0.3)', paddingTop: '15px', paddingLeft: '20px', paddingRight: '20px' }}>
            <strong style={{ letterSpacing: '1px' }}>CONTACT US</strong><br/>
            <a href="mailto:danelmore68@gmail.com" style={{ color: '#d4af37', textDecoration: 'none' }}>danelmore68@gmail.com</a> &nbsp;|&nbsp; <a href="mailto:lauraelmore1@hotmail.com" style={{ color: '#d4af37', textDecoration: 'none' }}>lauraelmore1@hotmail.com</a><br/>
            Text: <a href="tel:9123127432" style={{ color: '#d4af37', textDecoration: 'none' }}>(912) 312-7432</a> &nbsp;|&nbsp; <a href="tel:4047219920" style={{ color: '#d4af37', textDecoration: 'none' }}>(404) 721-9920</a>
          </div>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.5em', color: '#d4af37' }}>Loading Inventory...</div>
        ) : (
          <div style={gridStyle}>
            {inventory.map(item => (
              <div key={item.id} style={{ ...cardStyle, opacity: item.sold ? 0.6 : 1 }}>
                
                <div 
                  onClick={() => item.photo && setSelectedImage(item.photo)}
                  style={{ height: '140px', background: '#111', cursor: item.photo ? 'zoom-in' : 'default', position: 'relative' }}
                >
                  {item.photo ? (
                    <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>No Image</div>
                  )}
                  
                  {item.sold && (
                    <div style={{ position: 'absolute', top: '10px', right: '-35px', background: '#FF3B30', color: 'white', padding: '3px 40px', transform: 'rotate(45deg)', fontWeight: 'bold', fontSize: '11px', letterSpacing: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      SOLD
                    </div>
                  )}
                </div>

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h2 style={{ margin: '0 0 6px 0', fontSize: '1.1em', color: 'white' }}>{item.name}</h2>
                  <div style={{ color: '#aaa', fontSize: '0.8em', marginBottom: '10px', flexGrow: 1, maxHeight: '40px', overflow: 'hidden' }}>{item.desc}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #444', paddingTop: '10px' }}>
                    <span style={{ fontSize: '1.3em', fontWeight: 'bold', color: item.sold ? '#aaa' : '#d4af37' }}>
                      ${item.price}
                    </span>
                    <span style={{ fontSize: '0.7em', color: '#666' }}>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <ImageModal />

      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SouthboundSalvage />);
export default SouthboundSalvage;