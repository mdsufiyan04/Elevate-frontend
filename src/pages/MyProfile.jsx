import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, GraduationCap, Calendar, Edit3, Plus, Trash2, X, ChevronDown } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { getMyProfile, addSkill, deleteSkill, updateMyProfile } from '../api/services';

const CATEGORIES = ['Tech', 'Design', 'Music', 'Languages', 'Fitness', 'Business', 'Arts', 'Cooking'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showWantForm, setShowWantForm] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [category, setCategory] = useState('Tech');
  const [level, setLevel] = useState('Beginner');
  const [description, setDescription] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCollege, setEditCollege] = useState('');

  useEffect(() => {
    setLoading(true);
    getMyProfile()
      .then(res => {
        setProfile(res.data);
        setEditName(res.data.name || '');
        setEditBio(res.data.bio || '');
        setEditLocation(res.data.location || '');
        setEditCollege(res.data.college || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const resetSkillForm = () => {
    setSkillName('');
    setCategory('Tech');
    setLevel('Beginner');
    setDescription('');
    setShowOfferForm(false);
    setShowWantForm(false);
  };

  const openOfferForm = () => {
    setSkillName('');
    setCategory('Tech');
    setLevel('Beginner');
    setDescription('');
    setShowWantForm(false);
    setShowOfferForm(true);
  };

  const openWantForm = () => {
    setSkillName('');
    setCategory('Tech');
    setLevel('Beginner');
    setDescription('');
    setShowOfferForm(false);
    setShowWantForm(true);
  };

  const handleAddSkill = async (type) => {
    if (!skillName.trim()) return;
    try {
      await addSkill({
        name: skillName,
        category: category,
        level: level,
        type: type,
        description: description
      });
      setSkillName('');
      setCategory('Tech');
      setLevel('Beginner');
      setDescription('');
      setShowOfferForm(false);
      setShowWantForm(false);
      getMyProfile().then(res => setProfile(res.data));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add skill');
    }
  };

  const handleProfileSave = async () => {
    try {
      await updateMyProfile({
        name: editName,
        bio: editBio,
        location: editLocation,
        college: editCollege
      });
      setIsEditing(false);
      getMyProfile().then(res => {
        setProfile(res.data);
        setEditName(res.data.name || '');
        setEditBio(res.data.bio || '');
        setEditLocation(res.data.location || '');
        setEditCollege(res.data.college || '');
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await deleteSkill(id);
      getMyProfile().then(res => setProfile(res.data));
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const offerSkills = profile.skills?.filter(s => s.type === 'offer') || [];
  const wantSkills = profile.skills?.filter(s => s.type === 'want') || [];
  const reviews = profile.reviewsReceived || [];
  const completion = Math.min(100, 40 + (profile.bio ? 20 : 0) + offerSkills.length * 10 + wantSkills.length * 10);

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white border border-apple-border rounded-[18px] p-6 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-[14px] text-apple-gray uppercase tracking-[0.08em] font-semibold mb-3">Profile {completion}% Complete</h2>
            <div className="h-3 w-full bg-apple-bg border border-apple-border rounded-[980px] overflow-hidden">
              <div className="h-full bg-apple-black rounded-[980px] transition-all" style={{ width: `${completion}%` }}></div>
            </div>
          </div>
          <p className="text-[14px] text-apple-gray font-medium">Add bio and skills to reach 100%</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[24px] p-8 border border-apple-border mb-12">
          {isEditing ? (
            <div className="space-y-6">
              <h3 className="text-[28px] font-bold text-apple-black tracking-tight">Edit Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-4 bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 text-[15px] font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Location</label>
                  <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} className="w-full p-4 bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 text-[15px] font-medium transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">College</label>
                  <input type="text" value={editCollege} onChange={(e) => setEditCollege(e.target.value)} className="w-full p-4 bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 text-[15px] font-medium transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Bio</label>
                  <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full p-4 bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 text-[15px] font-medium h-32 resize-none transition-all" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setIsEditing(false)} className="px-8 py-3.5 bg-white border border-apple-border text-apple-black hover:bg-apple-bg rounded-[980px] font-bold text-[15px] transition-colors active:scale-95">Cancel</button>
                <button onClick={handleProfileSave} className="px-8 py-3.5 bg-apple-black text-white rounded-[980px] font-bold text-[15px] hover:bg-[#333333] transition-colors active:scale-95">Save Changes</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <img src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} alt={profile.name} className="w-32 h-32 rounded-full border border-apple-border" />
                <div>
                  <h1 className="text-[32px] font-bold text-apple-black tracking-[-0.01em]">{profile.name}</h1>
                  <p className="text-[17px] text-apple-gray mt-2 max-w-xl">{profile.bio || 'No bio added yet.'}</p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mt-4 text-[14px] text-apple-gray">
                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {profile.location || 'Not set'}</span>
                    <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> {profile.college || 'Not set'}</span>
                    <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {formatDate(profile.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-apple-black font-semibold mt-6 justify-center md:justify-start">
                    <Star fill="currentColor" className="w-5 h-5" /><span>{(profile.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 border border-apple-black text-apple-black hover:bg-apple-bg rounded-[980px] font-medium transition-colors">
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-12">
            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[24px] font-semibold text-apple-black tracking-[-0.01em]">Skills I Offer</h3>
                <button onClick={openOfferForm} className="p-2 border border-apple-black text-apple-black rounded-full hover:bg-apple-bg transition-colors" title="Add skill to offer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {offerSkills.map(skill => (
                  <div key={skill.id} className="bg-apple-bg border border-apple-border p-5 rounded-[18px] flex justify-between items-center group">
                    <div>
                      <h4 className="font-semibold text-apple-black text-[17px]">{skill.name}</h4>
                      <p className="text-apple-gray text-[12px] uppercase tracking-[0.08em] mt-1">{skill.category}</p>
                      {skill.description && <p className="text-apple-gray text-[14px] mt-2 leading-relaxed">{skill.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-apple-black bg-white border border-apple-border px-3 py-1 rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium">{skill.level}</span>
                      <button onClick={() => handleDeleteSkill(skill.id)} className="text-apple-gray hover:text-apple-black p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {offerSkills.length === 0 && !showOfferForm && <p className="text-[14px] text-apple-gray">No skills offered yet.</p>}
              </div>
              {showOfferForm && (
                <div className="bg-white p-8 rounded-[24px] border border-apple-border mt-4 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-[19px] text-apple-black tracking-tight">Add Skill to Offer</h4>
                    <button onClick={resetSkillForm} className="text-apple-gray hover:text-apple-black bg-apple-bg hover:bg-[#EAEAEA] p-2 rounded-full transition-colors active:scale-95">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Guitar, Spanish"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 font-medium transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Category</label>
                        <div className="relative group">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 appearance-none font-medium text-apple-black transition-colors"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-focus-within:text-apple-black" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Level</label>
                        <div className="relative group">
                          <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 appearance-none font-medium text-apple-black transition-colors"
                          >
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-focus-within:text-apple-black" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Description (optional)</label>
                      <input
                        type="text"
                        placeholder="What specifically can you teach or want to learn?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 font-medium transition-colors"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <button onClick={resetSkillForm} className="px-6 py-3.5 text-[15px] font-bold bg-white border border-apple-border hover:bg-apple-bg text-apple-black rounded-[980px] transition-colors active:scale-95">
                        Cancel
                      </button>
                      <button onClick={() => handleAddSkill('offer')} className="px-8 py-3.5 text-[15px] font-bold bg-apple-black text-white hover:bg-[#333333] rounded-[980px] transition-colors active:scale-95 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>

            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[24px] font-semibold text-apple-black tracking-[-0.01em]">Skills I Want</h3>
                <button onClick={openWantForm} className="p-2 border border-apple-black text-apple-black rounded-full hover:bg-apple-bg transition-colors" title="Add skill to want">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {wantSkills.map(skill => (
                  <div key={skill.id} className="bg-white border border-apple-black p-5 rounded-[18px] flex justify-between items-center group">
                    <div>
                      <h4 className="font-semibold text-apple-black text-[17px]">{skill.name}</h4>
                      <p className="text-apple-gray text-[12px] uppercase tracking-[0.08em] mt-1">{skill.category}</p>
                      {skill.description && <p className="text-apple-gray text-[14px] mt-2 leading-relaxed">{skill.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-apple-black bg-apple-bg border border-apple-border px-3 py-1 rounded-[980px] text-[12px] uppercase tracking-[0.08em] font-medium">{skill.level}</span>
                      <button onClick={() => handleDeleteSkill(skill.id)} className="text-apple-gray hover:text-apple-black p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {wantSkills.length === 0 && !showWantForm && <p className="text-[14px] text-apple-gray">No skills wanted yet.</p>}
              </div>
              {showWantForm && (
                <div className="bg-white p-8 rounded-[24px] border border-apple-border mt-4 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-[19px] text-apple-black tracking-tight">Add Skill to Want</h4>
                    <button onClick={resetSkillForm} className="text-apple-gray hover:text-apple-black bg-apple-bg hover:bg-[#EAEAEA] p-2 rounded-full transition-colors active:scale-95">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Skill Name</label>
                      <input
                        type="text"
                        placeholder="e.g. React, Guitar, Spanish"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 font-medium transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Category</label>
                        <div className="relative group">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 appearance-none font-medium text-apple-black transition-colors"
                          >
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-focus-within:text-apple-black" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Level</label>
                        <div className="relative group">
                          <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                            className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 appearance-none font-medium text-apple-black transition-colors"
                          >
                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray pointer-events-none group-focus-within:text-apple-black" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-2">Description (optional)</label>
                      <input
                        type="text"
                        placeholder="What specifically can you teach or want to learn?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 text-[15px] bg-[#FBFBFD] border border-apple-border rounded-[16px] focus:outline-none focus:border-apple-black focus:ring-4 focus:ring-black/5 font-medium transition-colors"
                      />
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                      <button onClick={resetSkillForm} className="px-6 py-3.5 text-[15px] font-bold bg-white border border-apple-border hover:bg-apple-bg text-apple-black rounded-[980px] transition-colors active:scale-95">
                        Cancel
                      </button>
                      <button onClick={() => handleAddSkill('want')} className="px-8 py-3.5 text-[15px] font-bold bg-apple-black text-white hover:bg-[#333333] rounded-[980px] transition-colors active:scale-95 flex items-center gap-2">
                        <Plus className="w-5 h-5" /> Add Skill
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>
          </div>

          <div className="lg:col-span-2">
            <motion.section initial="hidden" animate="visible" variants={fadeUp}>
              <h3 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em] mb-8">My Reviews</h3>
              <div className="space-y-6">
                {reviews.length === 0 ? (
                  <div className="bg-white p-8 rounded-[18px] border border-apple-border text-center text-[17px] text-apple-gray">
                    No reviews yet.
                  </div>
                ) : (
                  reviews.map(review => (
                    <div key={review.id} className="bg-white p-6 rounded-[18px] border border-apple-border">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4 items-center">
                          <img src={review.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.author?.username}`} alt={review.author?.name} className="w-12 h-12 rounded-full border border-apple-border" />
                          <div>
                            <h4 className="font-semibold text-apple-black text-[14px]">{review.author?.name}</h4>
                            <p className="text-[14px] text-apple-gray">{review.author?.college}</p>
                          </div>
                        </div>
                        <span className="text-[12px] text-apple-gray uppercase tracking-[0.08em]">{formatDate(review.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex text-apple-black">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-apple-border'}`} />
                          ))}
                        </div>
                        <span className="text-[12px] bg-apple-bg border border-apple-border text-apple-black px-3 py-1 rounded-[980px] font-medium uppercase tracking-[0.08em]">Exchanged: {review.skill}</span>
                      </div>
                      <p className="text-[14px] text-apple-gray leading-relaxed">"{review.text}"</p>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
