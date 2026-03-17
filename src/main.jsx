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
  const [showAbout, setShowAbout] = useState(false);
  const [filterNew, setFilterNew] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  useEffect(() => {
    // --- Check for Stripe Success ---
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      alert("Thank you for your purchase! We've received your order and will be in touch shortly to coordinate shipping or pickup.");
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Courier+Prime:wght@700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

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

  const handleCheckout = async (item) => {
    setCheckoutLoading(item.id);
    try {
      const { data, error } = await supabase.functions.invoke('checkout', {
        body: {
          item_name: item.name,
          price: item.price,
          shipping_size: item.shipping_size || 'medium'
        }
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url; 
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("There was an issue starting checkout. Please try again.");
      setCheckoutLoading(null);
    }
  };

  const isNewItem = (createdAt) => {
    const itemDate = new Date(createdAt);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    return itemDate > fortyEightHoursAgo;
  };

  const displayedInventory = filterNew 
    ? inventory.filter(item => isNewItem(item.created_at))
    : inventory;

  // --- Background Styling Updated ---
  const fixedBackgroundStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundImage: "linear-gradient(rgba(255,255,255,0.2), rgba(255,255,255,0.4)), url('/lauraiscrazy.jpeg')",
    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1,
  };

  const pageStyle = {
    color: '#003366', minHeight: '100vh', padding: '40px 20px',
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center', marginBottom: '20px', borderBottom: '3px solid #003366',
    paddingBottom: '25px', maxWidth: '700px', margin: '0 auto 20px auto',
    borderRadius: '12px', paddingTop: '25px', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    position: 'relative', overflow: 'hidden', backgroundColor: '#ffffff',
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0.75)), url('https://rswzqpppadhlmccmowhr.supabase.co/storage/v1/object/public/assests/image0-removebg-preview.png')`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '350px auto'
  };

  const buttonContainerStyle = {
    display: 'flex', justifyContent: 'center', gap: '15px', maxWidth: '400px', margin: '0 auto 20px auto'
  };

  const toggleButtonStyle = (isActive) => ({
    backgroundColor: isActive ? '#003366' : '#ffffff',
    color: isActive ? '#ffffff' : '#003366',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    textAlign: 'center',
    cursor: 'pointer',
    border: '1px solid #003366',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '0.8em',
    transition: 'all 0.2s ease'
  });

  const aboutContentStyle = {
    maxWidth: '700px', margin: '0 auto 30px auto', textAlign: 'center',
    color: '#003366', padding: '25px', backgroundColor: '#ffffff',
    borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    lineHeight: '1.7', border: '2px solid #003366'
  };

  const infoSectionStyle = {
    maxWidth: '800px', margin: '0 auto 30px auto', textAlign: 'center',
    color: '#003366', padding: '20px', borderTop: '2px solid #003366',
    borderBottom: '2px solid #003366', backgroundColor: '#ffffff',
    borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.3)'
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
    marginTop: '60px', textAlign: 'center', color: '#003366',
    fontSize: '0.9em', opacity: 0.9, letterSpacing: '1px', paddingBottom: '40px',
    fontWeight: 'bold'
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

        <div style={buttonContainerStyle}>
          <div onClick={() => { setShowAbout(!showAbout); setFilterNew(false); }} style={toggleButtonStyle(showAbout)}>
            {showAbout ? 'Close' : 'About Us'}
          </div>
          <div onClick={() => { setFilterNew(!filterNew); setShowAbout(false); }} style={toggleButtonStyle(filterNew)}>
            {filterNew ? 'Show All' : 'New Arrivals'}
          </div>
        </div>

        {showAbout && (
          <div style={aboutContentStyle}>
            <p style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '15px' }}>
              Old barns. Estate sales. Attic corners. We find it all.
            </p>
            <p style={{ fontSize: '1.15em', fontStyle: 'italic' }}>
              We travel far and wide to bring you a hand-selected mix of vintage, antique, and unique items. 
              Our inventory is constantly changing because we are always on the hunt.
            </p>
          </div>
        )}

        <div style={infoSectionStyle}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1.6em', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {filterNew ? 'Fresh Finds' : 'Contact us to order'}
          </p>
          <p style={{ margin: '0', fontSize: '1.2em', fontWeight: 'bold', lineHeight: '1.6' }}>
            {filterNew ? 'Items added in the last 48 hours' : 'We accept Multiple forms of payment.'}<br />
            <span style={{ fontSize: '1em', fontWeight: 'normal' }}>
              Local pickup in <strong>Temple, GA</strong>. We can also ship at buyers cost.
            </span>
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', fontSize: '1.5em', color: '#003366', marginTop: '100px', fontWeight: 'bold' }}>Loading Inventory...</div>
        ) : (
          <>
            {displayedInventory.length === 0 && filterNew ? (
              <div style={{ textAlign: 'center', color: '#003366', padding: '40px', fontSize: '1.2em', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', maxWidth: '500px', margin: '0 auto', border: '1px solid #003366' }}>
                No new items in the last 48 hours. Check back soon or view our full inventory!
              </div>
            ) : (
              <div style={gridStyle}>
                {displayedInventory.map(item => (
                  <div key={item.id} style={{ ...cardStyle, opacity: item.sold ? 0.6 : 1 }}>
                    <div onClick={() => item.photo && setSelectedImage(item.photo)} style={imageContainerStyle}>
                      {item.photo ? (
                        <img src={item.photo} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px', position: 'relative', zIndex: 1 }} />
                      ) : (
                        <div style={{ color: '#003366', fontWeight: 'bold' }}>No Image</div>
                      )}
                      
                      {!item.sold && isNewItem(item.created_at) && (
                        <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#003366', color: 'white', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '10px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>NEW</div>
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
                        
                        {!item.sold ? (
                          item.shipping_size === 'pickup' ? (
                            <div style={{ textAlign: 'right' }}>
                              <span style={{ fontSize: '0.85em', color: '#003366', fontWeight: 'bold', display: 'block' }}>LOCAL PICKUP ONLY</span>
                              <span style={{ fontSize: '0.7em', color: '#666', fontStyle: 'italic' }}>Temple, GA</span>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleCheckout(item)}
                              disabled={checkoutLoading === item.id}
                              style={{
                                backgroundColor: checkoutLoading === item.id ? '#888' : '#28a745',
                                color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px',
                                fontWeight: 'bold', cursor: checkoutLoading === item.id ? 'wait' : 'pointer',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', transition: 'background-color 0.2s'
                              }}
                            >
                              {checkoutLoading === item.id ? 'Loading...' : 'Buy Now'}
                            </button>
                          )
                        ) : (
                          <span style={{ fontSize: '0.8em', color: '#FF3B30', fontWeight: 'bold' }}>SOLD OUT</span>
                        )}
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}

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