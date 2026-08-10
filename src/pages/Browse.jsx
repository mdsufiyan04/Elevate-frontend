import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, UserPlus, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/navbar/Navbar';
import { categories } from '../data/dummyData';
import { getAllSkills, sendRequest } from '../api/services';

const Browse = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAllSkills({ 
      search: searchTerm, 
      type: typeFilter !== 'All' ? typeFilter.toLowerCase() : undefined,
      category: activeCategory !== 'All' ? activeCategory : undefined
    })
      .then(res => setSkills(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchTerm, typeFilter, activeCategory]);

  const openRequestModal = (skill) => {
    setSelectedSkill(skill);
    setMessage('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSkill(null);
    setMessage('');
  };

  const handleSendRequest = async () => {
    if (!selectedSkill?.user?.id) return;
    try {
      setRequesting(true);
      await sendRequest({
        toUserId: selectedSkill.user.id,
        skillId: selectedSkill.id,
        message: message
      });
      alert('Request sent!');
      closeModal();
      navigate('/requests');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-apple-black font-sans pb-16">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-10 text-center">
          <h1 className="text-[40px] md:text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight mb-3">Browse Skills</h1>
          <p className="text-[17px] text-apple-gray font-medium">Find what you need or discover something new.</p>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8 max-w-3xl mx-auto">
          <div className="relative w-full md:w-2/3 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray group-focus-within:text-apple-black transition-colors" />
            <input 
              type="text" 
              placeholder="Search skills or users..." 
              className="w-full pl-12 pr-6 py-4 bg-white border border-apple-border rounded-[980px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 transition-all text-apple-black placeholder-apple-gray text-[15px] shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-1/3 group">
            <select 
              className="w-full bg-white border border-apple-border text-apple-black py-4 px-6 rounded-[980px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 transition-all appearance-none text-[15px] cursor-pointer shadow-sm font-medium"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Offer">Offering</option>
              <option value="Want">Wanting</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-hover:text-apple-black transition-colors" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide justify-start md:justify-center">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] font-medium transition-all text-[14px] active:scale-[0.98] ${activeCategory === 'All' ? 'bg-apple-black text-white shadow-md' : 'bg-white text-apple-black border border-apple-border hover:border-black/30 hover:bg-white'}`}
          >
            All Categories
          </button>
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat.name)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-[980px] font-medium transition-all text-[14px] flex items-center gap-2 active:scale-[0.98] ${activeCategory === cat.name ? 'bg-apple-black text-white shadow-md' : 'bg-white text-apple-black border border-apple-border hover:border-black/30 hover:bg-white'}`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="h-px bg-apple-border w-full max-w-4xl mx-auto mb-10"></div>

        {/* Skills Grid */}
        {loading ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
           </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center justify-center bg-white rounded-[24px] border border-apple-border max-w-3xl mx-auto min-h-[300px]">
             <div className="bg-apple-bg w-16 h-16 flex items-center justify-center rounded-full mb-4">
               <Search className="w-8 h-8 text-apple-gray" />
             </div>
             <h3 className="text-[20px] font-bold text-apple-black mb-2">No skills found</h3>
             <p className="text-[15px] text-apple-gray max-w-sm">We couldn't find any skills matching your current search and filters. Try adjusting them.</p>
          </div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <motion.div variants={fadeUp} key={skill.id} className="bg-white rounded-[24px] border border-apple-border overflow-hidden hover:-translate-y-1 hover:border-black/20 hover:shadow-xl hover:shadow-black/5 transition-all flex flex-col cursor-default">
                <div className="p-6 border-b border-apple-border flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-4 py-1.5 rounded-[980px] text-[12px] font-bold uppercase tracking-[0.08em] ${skill.type === 'offer' ? 'bg-[#0A84FF]/10 text-[#0A84FF]' : 'bg-[#FF9F0A]/10 text-[#FF9F0A]'}`}>
                      {skill.type === 'offer' ? 'Offering' : 'Seeking'}
                    </div>
                  </div>
                  <h3 className="text-[24px] font-bold text-apple-black mb-2 tracking-[-0.01em]">{skill.name}</h3>
                  <p className="text-[13px] font-semibold text-apple-gray mb-8 uppercase tracking-[0.08em]">{skill.level}</p>
                  
                  <div className="flex items-center gap-4 bg-apple-bg/50 p-4 rounded-[16px]">
                    <img src={skill.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.user?.username}`} className="w-12 h-12 rounded-full border border-apple-border bg-white" alt="" />
                    <div>
                      <p className="font-bold text-apple-black text-[15px] tracking-tight">{skill.user?.name}</p>
                      <p className="text-[13px] font-medium text-apple-gray mt-0.5">{skill.user?.college}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-apple-bg/30 flex gap-3 mt-auto">
                  <button
                    onClick={() => navigate(`/profile/${skill.user.id}`)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-3 bg-white border border-apple-border text-apple-black rounded-[980px] text-[14px] font-semibold hover:border-apple-black active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => openRequestModal(skill)}
                    disabled={!skill.user?.id}
                    className="flex-1 py-3 bg-apple-black text-white rounded-[980px] text-[14px] font-semibold hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    Request Match
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Request Modal */}
      {showModal && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={closeModal}></motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden border border-apple-border relative z-10 shadow-2xl shadow-black/10">
            <div className="px-8 py-6 border-b border-apple-border flex justify-between items-center">
              <h3 className="text-[20px] font-bold text-apple-black tracking-tight">Send Request</h3>
              <button onClick={closeModal} className="text-apple-gray hover:text-apple-black bg-apple-bg hover:bg-[#EAEAEA] p-2 rounded-full transition-colors active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-3">Exchange Details</label>
                <div className="bg-[#FBFBFD] border border-apple-border rounded-[20px] p-5">
                  <p className="text-[19px] font-bold text-apple-black tracking-tight">
                    {selectedSkill.name} <span className="text-apple-gray font-semibold ml-2 text-[15px] uppercase tracking-[0.08em]">{selectedSkill.level}</span>
                  </p>
                  <p className="text-[15px] font-medium text-apple-gray mt-2 flex items-center gap-2">With {selectedSkill.user?.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-3">Intro Message</label>
                <textarea
                  rows="4"
                  className="w-full bg-[#FBFBFD] border border-apple-border rounded-[20px] p-5 text-[15px] text-apple-black focus:border-apple-black focus:ring-4 focus:ring-black/5 outline-none resize-none transition-all placeholder-apple-gray"
                  placeholder={`Hi ${selectedSkill.user?.name}, I'm interested in learning ${selectedSkill.name}. Would you be open to an exchange?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSendRequest}
                  disabled={requesting}
                  className="w-full py-4 bg-apple-black text-white rounded-[980px] text-[16px] font-semibold hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center min-h-[56px]"
                >
                  {requesting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending...</span>
                    </div>
                  ) : 'Send Match Request'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Browse;
