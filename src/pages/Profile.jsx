import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, GraduationCap, Star, Calendar, MessageSquarePlus, X, ChevronDown } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getUserById, sendRequest, getMyProfile } from '../api/services';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getUserById(id), getMyProfile()])
      .then(([profileRes]) => {
        setProfile(profileRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = async (skill) => {
    if (!skill) return;
    try {
      setRequesting(true);
      await sendRequest({
        toUserId: profile.id,
        skillId: skill.id,
        message: message
      });
      alert('Request sent!');
      setShowModal(false);
      setMessage('');
      setSelectedSkill(null);
      navigate('/requests');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  const openRequestModal = () => {
    setMessage('');
    const offers = profile?.skills?.filter(s => s.type === 'offer') || [];
    setSelectedSkill(offers.length === 1 ? offers[0] : null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage('');
    setSelectedSkill(null);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-apple-gray font-medium">User not found.</p>
      </div>
    );
  }

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const wantSkills = profile.skills?.filter(s => s.type === 'want') || [];
  const reviews = profile.reviewsReceived || [];
  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-apple-black font-sans pb-16">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[32px] overflow-hidden border border-apple-border mb-8 shadow-sm">
          <div className="h-56 bg-gradient-to-r from-[#E5E5EA] to-[#F2F2F7] w-full relative"></div>
          <div className="px-8 pb-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex flex-col items-start -mt-20 relative z-10 w-full md:w-auto">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.name} className="w-40 h-40 rounded-full border-[6px] border-white bg-white mb-6 shadow-md" />
                <h1 className="text-[36px] font-bold text-apple-black tracking-tight leading-none mb-2">{profile.name}</h1>
                <p className="text-[17px] font-semibold text-apple-gray">@{profile.username}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-6 text-[14px] text-apple-black font-medium">
                  <div className="flex items-center gap-1.5 bg-apple-bg px-4 py-2 rounded-[980px] border border-apple-border"><MapPin className="w-4 h-4 text-apple-gray" /> {profile.location || 'Not set'}</div>
                  <div className="flex items-center gap-1.5 bg-apple-bg px-4 py-2 rounded-[980px] border border-apple-border"><GraduationCap className="w-4 h-4 text-apple-gray" /> {profile.college || 'Not set'}</div>
                </div>
              </div>
              
              <div className="flex flex-col items-start md:items-end w-full md:w-auto pt-6">
                <div className="flex gap-10">
                  <div className="text-center md:text-right">
                    <p className="text-[32px] font-bold text-apple-black flex items-center justify-center md:justify-end gap-1.5 tracking-tight">
                      {(profile.rating || 0).toFixed(1)} <Star className="w-6 h-6 text-apple-black fill-current" />
                    </p>
                    <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-semibold mt-1">{profile.reviewCount || 0} Reviews</p>
                  </div>
                  <div className="w-px h-16 bg-apple-border"></div>
                  <div className="text-center md:text-left">
                    <p className="text-[32px] font-bold text-apple-black tracking-tight">{profile.completedExchanges || 0}</p>
                    <p className="text-[12px] text-apple-gray uppercase tracking-[0.08em] font-semibold mt-1">Exchanges</p>
                  </div>
                </div>
                {!isOwnProfile && (
                  <button 
                    onClick={openRequestModal}
                    disabled={offerSkills.length === 0}
                    className="w-full md:w-auto px-10 py-4 bg-apple-black text-white rounded-[980px] font-semibold text-[15px] hover:bg-[#333333] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                  >
                    <MessageSquarePlus className="w-5 h-5 flex-shrink-0" /> Request Exchange
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Left Column: Bio & Skills */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-[24px] p-8 border border-apple-border">
              <h3 className="text-[20px] font-bold text-apple-black mb-4">About</h3>
              <p className="text-[15px] text-apple-gray leading-relaxed mb-8">{profile.bio || 'No bio provided.'}</p>
              <div className="flex items-center gap-2 text-[13px] text-apple-gray uppercase tracking-[0.08em] font-semibold border-t border-apple-border pt-6">
                <Calendar className="w-4 h-4" /> Joined {formatDate(profile.createdAt)}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-apple-border">
              <h3 className="text-[20px] font-bold text-apple-black mb-6">Skills Offered</h3>
              <div className="flex flex-wrap gap-2">
                {offerSkills.map((skill) => (
                  <div key={skill.id} className="px-4 py-2 bg-[#0A84FF]/10 text-[#0A84FF] rounded-[980px] text-[14px] font-bold">
                    {skill.name} <span className="text-[12px] opacity-80 ml-1 uppercase tracking-[0.08em] font-semibold">• {skill.level}</span>
                  </div>
                ))}
                {offerSkills.length === 0 && <span className="text-[15px] font-medium text-apple-gray">None</span>}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-8 border border-apple-border">
              <h3 className="text-[20px] font-bold text-apple-black mb-6">Seeking</h3>
              <div className="flex flex-wrap gap-2">
                {wantSkills.map((skill) => (
                  <div key={skill.id} className="px-4 py-2 bg-[#FF9F0A]/10 text-[#FF9F0A] rounded-[980px] text-[14px] font-bold">
                    {skill.name} <span className="text-[12px] opacity-80 ml-1 uppercase tracking-[0.08em] font-semibold">• {skill.level}</span>
                  </div>
                ))}
                {wantSkills.length === 0 && <span className="text-[15px] font-medium text-apple-gray">None</span>}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Reviews */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-6">
            <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-white p-8 rounded-[18px] border border-apple-border text-center text-[17px] text-apple-gray">
                No reviews yet.
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="bg-white p-6 rounded-[18px] border border-apple-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.author?.username}`} alt="" className="w-12 h-12 rounded-full border border-apple-border" />
                      <div>
                        <h5 className="font-semibold text-apple-black text-[14px]">{rev.author?.name}</h5>
                        <p className="text-[14px] text-apple-gray">{rev.author?.college}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-1 mb-1 justify-end">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className={`w-4 h-4 ${j < rev.rating ? 'text-apple-black fill-current' : 'text-apple-border'}`} />
                        ))}
                      </div>
                      <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{formatDate(rev.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-apple-gray leading-relaxed mb-4">"{rev.text}"</p>
                  <div className="inline-block px-3 py-1 bg-apple-bg text-apple-black text-[12px] font-medium uppercase tracking-[0.08em] rounded-[980px] border border-apple-border">
                    Skill: {rev.skill}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </div>
      </main>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={closeModal}></motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="bg-white rounded-[32px] w-full max-w-md overflow-hidden border border-apple-border relative z-10 shadow-2xl shadow-black/10">
            <div className="px-8 py-6 border-b border-apple-border flex justify-between items-center">
              <h3 className="text-[20px] font-bold text-apple-black tracking-tight">Request Exchange</h3>
              <button onClick={closeModal} className="text-apple-gray hover:text-apple-black bg-apple-bg hover:bg-[#EAEAEA] p-2 rounded-full transition-colors active:scale-95">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-3">Skill being requested</label>
                {offerSkills.length > 1 ? (
                  <div className="relative group">
                    <select
                      className="w-full bg-[#FBFBFD] border border-apple-border rounded-[20px] py-4 px-5 text-[15px] text-apple-black focus:border-apple-black focus:ring-4 focus:ring-black/5 outline-none appearance-none transition-all font-medium shadow-sm cursor-pointer"
                      value={selectedSkill?.id || ''}
                      onChange={(e) => {
                        const skill = offerSkills.find(s => s.id === parseInt(e.target.value));
                        setSelectedSkill(skill || null);
                      }}
                    >
                      <option value="">Select a skill...</option>
                      {offerSkills.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.level})</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-focus-within:text-apple-black transition-colors" />
                  </div>
                ) : (
                  <div className="bg-[#FBFBFD] border border-apple-border rounded-[20px] p-5 shadow-sm">
                    <p className="text-[17px] font-bold text-apple-black">
                      {selectedSkill?.name || offerSkills[0]?.name || 'No skills available'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-3">Intro Message</label>
                <textarea 
                  rows="4" 
                  className="w-full bg-[#FBFBFD] border border-apple-border rounded-[20px] p-5 text-[15px] text-apple-black focus:border-apple-black focus:ring-4 focus:ring-black/5 outline-none resize-none transition-all shadow-sm placeholder-apple-gray"
                  placeholder={`Hi ${profile.name}, I'd love to learn from you!`}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => handleSendRequest(selectedSkill || offerSkills[0])}
                  disabled={requesting || offerSkills.length === 0}
                  className="w-full py-4 bg-apple-black text-white rounded-[980px] font-semibold text-[16px] hover:bg-[#333333] active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center min-h-[56px]"
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

export default Profile;
