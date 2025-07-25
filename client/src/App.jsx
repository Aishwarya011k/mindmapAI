
import React from 'react';
import logo from './assets';
import heroSvg from './assets/hero.svg';
import about from './assets/about.svg';
import './index.css';

// Tailwind custom animations (add to global CSS if not present)
// .animate-fade-in { animation: fadeIn 1s ease; }
// .animate-bounce { animation: bounce 1s infinite; }
// .animate-pulse { animation: pulse 2s infinite; }
// .animate-float { animation: float 3s infinite alternate; }
// .animate-move-x { animation: moveX 2s infinite alternate; }
// .animate-move-y { animation: moveY 2s infinite alternate; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
// @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-12px); } }
// @keyframes moveX { 0% { transform: translateX(0); } 100% { transform: translateX(18px); } }
// @keyframes moveY { 0% { transform: translateY(0); } 100% { transform: translateY(18px); } }

function App() {
  const [savedMaps, setSavedMaps] = React.useState([]);

  // Save mind map securely
  const handleSaveMindMap = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/secure-mindmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rawText: inputText, nodes: mindMap.nodes, edges: mindMap.edges })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Save failed');
      alert('Mind map saved!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved mind maps for dashboard
  const fetchSavedMaps = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/secure-mindmaps', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Fetch failed');
      setSavedMaps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn && section === 'dashboard') {
      fetchSavedMaps();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, section]);
  const [inputText, setInputText] = React.useState("");
  const [mindMap, setMindMap] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [section, setSection] = React.useState('home');
  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem('token'));
  const [user, setUser] = React.useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const [authLoading, setAuthLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState("");
  const [signupData, setSignupData] = React.useState({ name: '', email: '', password: '' });
  const [signinData, setSigninData] = React.useState({ email: '', password: '' });

  // Signup handler
  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsLoggedIn(true);
      setSection('dashboard');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Signin handler
  const handleSignin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signin failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsLoggedIn(true);
      setSection('dashboard');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setSection('home');
  };

  // Function to handle mind map generation
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMindMap(null);
    try {
      const res = await fetch("http://localhost:5000/api/mindmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: inputText })
      });
      if (!res.ok) throw new Error("Failed to generate mind map");
      const data = await res.json();
      setMindMap(data);
    } catch (err) {
      setError(err.message || "Error generating mind map");
    } finally {
      setLoading(false);
    }
  };

  // Section content
  const renderSection = () => {
    switch (section) {
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 py-24 max-w-6xl mx-auto animate-fade-in">
              {/* Left: Headline & Buttons */}
              <div className="flex-1 flex flex-col justify-center gap-8 md:pr-8">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 leading-tight">
                  <span className="block">Transform <span className="text-cyan-400">Messy Notes</span></span>
                  <span className="block">Into <span className="text-pink-400">MindMaps</span></span>
                </h1>
                <p className="text-lg text-gray-200 mb-8 max-w-xl">
                  MapMyMess uses AI & NLP to turn your raw, unstructured notes into clear, interactive mind maps. Organize ideas, visualize connections, and export your insights.
                </p>
                <div className="flex gap-6 mt-2">
                  <button className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold px-8 py-3 rounded-full shadow hover:from-pink-400 hover:to-cyan-400 transition animate-bounce" onClick={()=>setSection('try')}>Try Now</button>
                  <button className="bg-[#18122B] border-2 border-cyan-400 text-white font-semibold px-8 py-3 rounded-full shadow flex items-center gap-2 hover:bg-cyan-400 hover:text-[#18122B] transition">
                    Download Info <span className="text-lg">↓</span>
                  </button>
                </div>
              </div>
              {/* Right: Custom SVG Illustration */}
              <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
                <img src={heroSvg} alt="Hero Illustration" className="w-full max-w-lg h-auto animate-float" />
              </div>
            </section>
            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-4 py-20 animate-fade-in">
              <h2 className="text-4xl font-extrabold text-center mb-16 tracking-tight">Why <span className="text-cyan-400">MapMyMess?</span></h2>
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 justify-center items-stretch">
                <div className="flex-1 bg-gradient-to-br from-cyan-900/60 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-row items-center gap-6 hover:scale-[1.03] transition-transform animate-move-x">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-cyan-400/20">
                    <span className="text-5xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-cyan-300">AI Topic Extraction</h3>
                    <p className="text-gray-300">Let AI instantly find key ideas and topics in your messy notes, brainstorms, or transcripts.</p>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-900/60 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-row items-center gap-6 hover:scale-[1.03] transition-transform animate-move-y">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-pink-400/20">
                    <span className="text-5xl">🗺️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-pink-300">Interactive Mind Map</h3>
                    <p className="text-gray-300">Visualize and explore connections between ideas with a beautiful, interactive mind map.</p>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-green-900/60 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-row items-center gap-6 hover:scale-[1.03] transition-transform animate-move-x">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-400/20">
                    <span className="text-5xl">💾</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-green-300">Save & Retrieve</h3>
                    <p className="text-gray-300">Securely save your mind maps and access them anytime, anywhere.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      case 'try':
        return (
          <section className="max-w-4xl mx-auto px-4 py-20 flex flex-col md:flex-row gap-12 items-center animate-fade-in">
            {/* Left: Input */}
            <div className="flex-1 flex flex-col gap-6">
              <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Try MapMyMess Live</h2>
              <p className="text-gray-300 mb-2">Paste your messy notes below and see the magic!</p>
              {/* Only one textarea and button for input and generation */}
              <textarea
                className="w-full min-h-[120px] bg-[#232144] border-2 border-cyan-400 rounded-xl text-white text-base p-4 mb-4 focus:outline-none focus:border-pink-400 resize-y transition-all duration-300"
                placeholder="Paste your messy notes here..."              
               
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold px-8 py-3 rounded-full shadow hover:from-pink-400 hover:to-cyan-400 transition-all duration-300 animate-bounce"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Mind Map'}
              </button>
              <textarea
                className="w-full min-h-[120px] bg-[#232144] border-2 border-cyan-400 rounded-xl text-white text-base p-4 mb-4 focus:outline-none focus:border-pink-400 resize-y transition-all duration-300"
                placeholder="Paste your messy notes here..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold px-8 py-3 rounded-full shadow hover:from-pink-400 hover:to-cyan-400 transition-all duration-300 animate-bounce"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Mind Map'}
              </button>
            </div>
            {/* Right: Mind Map Visualization (real data) */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-full max-w-md min-h-72 bg-[#232144] rounded-2xl shadow-lg flex flex-col items-center justify-center overflow-auto animate-float p-4">
                {error && <div className="text-red-400 mb-2">{error}</div>}
                {mindMap && mindMap.nodes && mindMap.nodes.length > 0 ? (
                  <>
                    <div className="mb-4 text-cyan-300 font-bold">Nodes:</div>
                    <ul className="mb-4">
                      {mindMap.nodes.map((node, idx) => (
                        <li key={idx} className="text-white">{node.data.label}</li>
                      ))}
                    </ul>
                    <div className="mb-2 text-pink-300 font-bold">Edges:</div>
                    <ul>
                      {mindMap.edges.map((edge, idx) => (
                        <li key={idx} className="text-gray-300">{edge.data.source} → {edge.data.target}</li>
                      ))}
                    </ul>
                    {isLoggedIn && (
                      <button className="mt-4 bg-cyan-400 text-[#18122B] px-6 py-2 rounded-full font-semibold hover:bg-cyan-500 transition" onClick={handleSaveMindMap} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Mind Map'}
                      </button>
                    )}
                  </>
                ) : (
                  <span className="mt-4 text-gray-400 text-sm">{loading ? 'Generating mind map...' : '(No mind map yet)'}</span>
                )}
              </div>
            </div>
          </section>
        );
      case 'dashboard':
        return (
          <section className="max-w-6xl mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-8 text-cyan-400 text-center">Welcome, Aishwarya!</h2>
            {/* Stats Row */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 justify-center">
              <div className="flex-1 bg-gradient-to-br from-cyan-400/20 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <span className="text-5xl font-bold text-cyan-400 mb-2">2</span>
                <span className="text-lg text-gray-200">Mind Maps Saved</span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-pink-400/20 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <span className="text-5xl font-bold text-pink-400 mb-2">1</span>
                <span className="text-lg text-gray-200">Profile</span>
              </div>
              <div className="flex-1 bg-gradient-to-br from-green-400/20 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-col items-center">
                <span className="text-5xl font-bold text-green-400 mb-2">0</span>
                <span className="text-lg text-gray-200">Exports</span>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="flex flex-col md:flex-row gap-8 mb-12 justify-center">
              <button className="flex-1 bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold px-8 py-6 rounded-2xl shadow-lg hover:from-pink-400 hover:to-cyan-400 transition animate-bounce text-xl">Create New Mind Map</button>
              <button className="flex-1 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold px-8 py-6 rounded-2xl shadow-lg hover:from-cyan-400 hover:to-pink-400 transition text-xl">Export All</button>
            </div>
            {/* Saved Mind Maps List */}
            <div className="bg-[#232144] rounded-2xl shadow-lg p-8 mb-12">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">Your Mind Maps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {savedMaps.map((map, idx) => (
                  <div key={map._id || idx} className="bg-[#18122B] rounded-xl p-6 shadow flex flex-col gap-2 animate-float">
                    <span className="font-semibold text-cyan-400 text-lg">{map.rawText.slice(0, 40)}...</span>
                    <span className="text-xs text-gray-400">Created: {new Date(map.createdAt).toLocaleDateString()}</span>
                    <div className="flex gap-2 mt-2">
                      <button className="bg-cyan-400 text-[#18122B] px-4 py-1 rounded-full text-sm">View</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Account Info Card */}
            <div className="max-w-md mx-auto bg-gradient-to-br from-pink-400/20 to-[#232144] rounded-2xl shadow-lg p-8 flex flex-col gap-4 items-center">
              <h3 className="text-xl font-bold text-pink-300 mb-2">Account Info</h3>
              <div className="text-gray-300">Name: <span className="font-semibold text-white">Aishwarya</span></div>
              <div className="text-gray-300">Email: <span className="font-semibold text-white">aishwarya@email.com</span></div>
              <button className="bg-pink-400 text-white px-6 py-2 rounded-full font-semibold mt-4 hover:bg-pink-500 transition">Edit Profile</button>
              <button className="bg-cyan-400 text-[#18122B] px-6 py-2 rounded-full font-semibold mt-4 hover:bg-cyan-500 transition" onClick={()=>{setIsLoggedIn(false);setSection('home')}}>Log Out</button>
            </div>
          </section>
        );
      case 'about':
        return (
          <section className="max-w-7xl mx-auto px-4 py-24 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-16 bg-gradient-to-br from-[#232144] to-[#18122B] rounded-3xl shadow-2xl border-2 border-cyan-400/20 p-8 md:p-16">
              <div className="flex-1 flex justify-center items-center mb-12 md:mb-0">
                <img src={about} alt="About MapMyMess" className="w-full max-w-lg h-auto animate-float drop-shadow-xl" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-5xl font-extrabold mb-6 text-cyan-400 animate-pulse drop-shadow-lg">Meet MapMyMess</h2>
                <p className="text-lg text-gray-200 mb-6">MapMyMess is a next-gen AI tool that transforms your messy notes into beautiful, interactive mind maps. Designed for students, creators, and thinkers, it helps you organize, visualize, and connect your ideas effortlessly.</p>
                <ul className="space-y-5 mb-8">
                  <li className="flex items-start gap-4"><span className="text-2xl">🤖</span><span><span className="font-bold text-cyan-400">AI-Powered Clarity:</span> Instantly extract topics and structure from any text.</span></li>
                  <li className="flex items-start gap-4"><span className="text-2xl">🗺️</span><span><span className="font-bold text-pink-400">Visual Mind Mapping:</span> Drag, drop, and explore your ideas in a dynamic, interactive map.</span></li>
                  <li className="flex items-start gap-4"><span className="text-2xl">🔒</span><span><span className="font-bold text-green-400">Private & Secure:</span> Your data is encrypted and only accessible by you.</span></li>
                  <li className="flex items-start gap-4"><span className="text-2xl">🤝</span><span><span className="font-bold text-yellow-400">Collaborate:</span> Work with friends or teammates in real time.</span></li>
                </ul>
                <div className="bg-cyan-400/10 border-l-4 border-cyan-400 rounded-lg p-6 text-cyan-200 font-semibold text-lg shadow mb-4">“Don’t just take notes. Map your mess, and watch your ideas come alive.”</div>
              </div>
            </div>
          </section>
        );
      case 'contact':
        return (
          <section className="max-w-xl mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-6 text-pink-400">Contact Us</h2>
            <form className="flex flex-col gap-6">
              <input type="text" placeholder="Your Name" className="px-4 py-3 rounded bg-[#232144] text-white border border-cyan-400 focus:outline-none" />
              <input type="email" placeholder="Your Email" className="px-4 py-3 rounded bg-[#232144] text-white border border-cyan-400 focus:outline-none" />
              <textarea placeholder="Your Message" className="px-4 py-3 rounded bg-[#232144] text-white border border-pink-400 focus:outline-none min-h-[100px]" />
              <button className="bg-gradient-to-r from-cyan-400 to-pink-400 text-white font-semibold px-8 py-3 rounded-full shadow hover:from-pink-400 hover:to-cyan-400 transition">Send Message</button>
            </form>
            <div className="mt-8 text-gray-400 text-center">Or email us at <a href="mailto:hello@mapmymess.com" className="text-cyan-400">hello@mapmymess.com</a></div>
          </section>
        );
      case 'signin':
        return (
          <section className="max-w-md mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-6 text-cyan-400 text-center">Sign In</h2>
            <form className="flex flex-col gap-6 bg-[#232144] rounded-2xl p-8 shadow-lg" onSubmit={handleSignin}>
              <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-[#18122B] text-white border border-cyan-400 focus:outline-none" value={signinData.email} onChange={e => setSigninData({ ...signinData, email: e.target.value })} required />
              <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-[#18122B] text-white border border-cyan-400 focus:outline-none" value={signinData.password} onChange={e => setSigninData({ ...signinData, password: e.target.value })} required />
              <button type="submit" className="bg-cyan-400 text-[#18122B] font-semibold px-8 py-3 rounded-full shadow hover:bg-cyan-500 transition" disabled={authLoading}>{authLoading ? 'Signing in...' : 'Sign In'}</button>
              {authError && <div className="text-red-400 mt-2">{authError}</div>}
            </form>
            <div className="mt-6 text-center text-gray-400">Don't have an account? <span className="text-pink-400 cursor-pointer" onClick={() => setSection('signup')}>Sign Up</span></div>
          </section>
        );
      case 'signup':
        return (
          <section className="max-w-md mx-auto px-4 py-20 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-6 text-pink-400 text-center">Create Your Account</h2>
            <form className="flex flex-col gap-6 bg-[#232144] rounded-2xl p-8 shadow-lg" onSubmit={handleSignup}>
              <input type="text" placeholder="Full Name" className="px-4 py-3 rounded bg-[#18122B] text-white border border-pink-400 focus:outline-none" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} required />
              <input type="email" placeholder="Email" className="px-4 py-3 rounded bg-[#18122B] text-white border border-pink-400 focus:outline-none" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} required />
              <input type="password" placeholder="Password" className="px-4 py-3 rounded bg-[#18122B] text-white border border-pink-400 focus:outline-none" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} required />
              <button type="submit" className="bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold px-8 py-3 rounded-full shadow hover:from-cyan-400 hover:to-pink-400 transition animate-bounce" disabled={authLoading}>{authLoading ? 'Signing up...' : 'Sign Up'}</button>
              {authError && <div className="text-red-400 mt-2">{authError}</div>}
            </form>
            <div className="mt-6 text-center text-gray-400">Already have an account? <span className="text-cyan-400 cursor-pointer" onClick={() => setSection('signin')}>Sign In</span></div>
          </section>
        );
      case 'blog':
        return (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-16 md:py-20 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-8 sm:mb-10 text-cyan-400 text-center animate-pulse drop-shadow-lg">🧠 MindMap from Mess: Turning Chaos into Clarity</h2>
            <div className="flex flex-col gap-6 sm:gap-8 text-base sm:text-lg md:text-xl text-gray-200">
              <p className="italic text-gray-300">It all started with a messy note I scribbled down late one night. A week later, I looked at it again — and it made absolutely no sense. That was my lightbulb moment. I realized how often we capture ideas in raw form — in notes, in voice memos, in chaotic lists — but rarely return to structure or understand them. That’s where MindMap from Mess began.</p>
              <p>This project was born out of a simple but relatable problem: the overwhelming amount of unstructured information we deal with every day. Whether it’s a student trying to organize lecture notes, a content creator brainstorming new ideas, or even a startup founder planning a product launch — we all struggle to turn chaos into clarity. <span className="text-cyan-400 font-semibold">According to a study by Microsoft, our average attention span has dropped to just 8 seconds</span>, which means we’re absorbing more information than ever, but processing less of it meaningfully.</p>
              <p>I wanted to build something that could bridge that gap — something that wouldn’t just take notes, but actually understand them, process them, and present them back in a structured, visual way. So I built <span className="text-pink-400 font-bold">MindMap from Mess</span> — a full-stack JavaScript app powered by AI that takes messy, free-form text and transforms it into clean, structured mind maps.</p>
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mt-8 mb-2">How it Works</h3>
              <p>The app uses a combination of <span className="text-cyan-400">React</span>, <span className="text-pink-400">Tailwind CSS</span>, <span className="text-green-400">Node.js</span>, and <span className="text-yellow-300">MongoDB</span>, with <span className="text-cyan-300">OpenAI’s GPT-4</span> at the core for Natural Language Processing (NLP). The user interface is inspired by minimal mockup aesthetics — simple, centered, and focused on clarity. I used Figma to design the layout, which features a laptop-style mockup that feels more like an interactive tool than just a web form. The app allows users to paste any rough notes — long or short — and instantly generates a visual mind map based on extracted topics and subpoints.</p>
              <p>At the backend, GPT-4 handles the hard work. I experimented with different NLP techniques like topic modeling, summarization, and keyphrase extraction (concepts inspired by tools like KeyBERT and spaCy). Eventually, I developed a custom prompt structure that could take free-flowing input and break it down into a parent-child tree of ideas. That tree is then rendered on the frontend as a beautiful, clean mind map. <span className="text-cyan-400 font-semibold">It's kind of like seeing your scattered thoughts get their own roadmap.</span></p>
              <blockquote className="border-l-4 border-pink-400 pl-4 sm:pl-6 bg-pink-400/5 rounded my-4 sm:my-6 text-pink-200 font-medium text-sm sm:text-base md:text-lg">What makes this tool unique is its ability to truly understand context — not just extract keywords, but recognize relationships between them. That’s what a real mind map is all about: showing how ideas connect. I also added export functionality, so users can download their mind map as an image or share it directly.</blockquote>
              <h3 className="text-xl sm:text-2xl font-bold text-pink-400 mt-8 mb-2">Deployment & Real-World Use</h3>
              <p>Deploying the app on AWS was another learning experience in itself. I used EC2 for the backend, S3 and CloudFront for assets, and integrated HTTPS using Nginx and Certbot for security. All API requests are secured, and MongoDB handles user sessions and history.</p>
              <p>What surprised me most during this build was how many real-world use cases emerged. Students can use it to organize class notes. Writers can turn brain dumps into story outlines. Product teams can process raw feedback into feature maps. I even tested it myself during this project — pasting parts of my journal and watching it generate emotional insights I hadn’t seen before. <span className="text-cyan-400 font-semibold">Research by BetterUp shows that visual thinking improves problem-solving by 23% and boosts idea recall.</span> This tool aligns with that cognitive advantage.</p>
              <h3 className="text-xl sm:text-2xl font-bold text-cyan-400 mt-8 mb-2">Design & Branding</h3>
              <p>Aesthetically, I kept the branding simple. The logo is just a puzzle piece — symbolic of assembling fragments into something whole. That metaphor sits at the core of this project: taking what’s incomplete and giving it form. I also used SVG icons from Lucide and Heroicons, custom animated backgrounds from Haikei, and made the UI fully responsive with Tailwind’s utility-first classes.</p>
              <blockquote className="border-l-4 border-cyan-400 pl-4 sm:pl-6 bg-cyan-400/5 rounded my-4 sm:my-6 text-cyan-200 font-medium text-sm sm:text-base md:text-lg">Building MindMap from Mess taught me how to think more like a product designer, not just a coder. It helped me understand the user journey — from raw thought to structured insight — and how AI can quietly, powerfully assist in that process. I now see this as not just a portfolio project, but a tool I actually want to use every day.</blockquote>
              <p className="text-base sm:text-lg md:text-xl text-pink-200 font-semibold">If you’ve ever felt overwhelmed by the mess in your mind, I hope this tool can help. You can check out the code, contribute, or just try it out. I’d love to hear your feedback and see how you use it in your own workflows.</p>
              <p className="mt-8 text-center text-gray-400 italic text-sm sm:text-base md:text-lg">After all, messy thoughts don’t mean unworthy thoughts. Sometimes, they just need the right space to unfold.</p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#18122B] text-white font-sans">
      {/* Top Navigation */}
      <nav className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-3 border-b border-[#232144] gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <img src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
          <span className="text-lg sm:text-xl font-bold tracking-wide">MapMyMess</span>
        </div>
        <ul className="flex flex-wrap gap-4 sm:gap-8 text-xs sm:text-sm font-medium items-center justify-center">
          <li className={`hover:text-cyan-400 cursor-pointer ${section==='home'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('home')}>Home</li>
          <li className={`hover:text-cyan-400 cursor-pointer ${section==='about'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('about')}>About</li>
          <li className={`hover:text-cyan-400 cursor-pointer ${section==='contact'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('contact')}>Contact</li>
          <li className={`hover:text-cyan-400 cursor-pointer ${section==='blog'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('blog')}>Blog</li>
          <li className={`hover:text-cyan-400 cursor-pointer ${section==='try'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('try')}>Try</li>
          {isLoggedIn ? (
            <li className={`hover:text-cyan-400 cursor-pointer ${section==='dashboard'?'text-cyan-400 font-bold':''}`} onClick={()=>setSection('dashboard')}>Dashboard</li>
          ) : (
            <li>
              <button className="ml-2 sm:ml-4 bg-cyan-400 text-[#18122B] font-semibold px-4 sm:px-5 py-2 rounded-full shadow hover:bg-cyan-500 transition text-xs sm:text-sm" onClick={()=>setSection('signin')}>Sign In</button>
            </li>
          )}
        </ul>
      </nav>

      {/* Section Content */}
      <main className="w-full">
        {renderSection()}
      </main>

      {/* Footer - Premium animated */}
      <footer className="w-full py-8 sm:py-10 text-center text-gray-400 text-xs sm:text-sm mt-10 sm:mt-16 border-t border-[#232144] bg-gradient-to-r from-[#18122B] via-[#232144] to-[#18122B] animate-fade-in">
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-2 md:gap-4 mb-2">
          <span className="font-bold text-cyan-400 animate-pulse">MapMyMess</span>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:text-cyan-400 transition" onClick={()=>setSection('about')}>About</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:text-cyan-400 transition" onClick={()=>setSection('contact')}>Contact</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:text-cyan-400 transition" onClick={()=>setSection('blog')}>Blog</a>
          <span className="hidden md:inline">|</span>
          <a href="#" className="hover:text-cyan-400 transition" onClick={()=>setSection('try')}>Try</a>
          {isLoggedIn && <><span className="hidden md:inline">|</span><a href="#" className="hover:text-cyan-400 transition" onClick={()=>setSection('dashboard')}>Dashboard</a></>}
        </div>
        <div className="mt-2">&copy; {new Date().getFullYear()} MapMyMess. All rights reserved.</div>
        <div className="mt-2 text-[10px] sm:text-xs text-gray-500">Made with <span className="text-pink-400 animate-bounce">♥</span> by Aishwarya011k</div>
      </footer>
    </div>
  );
}

export default App;
