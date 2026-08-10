import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Briefcase } from 'lucide-react';
import Navbar from '../components/navbar/Navbar';
import { aiMatches } from '../data/dummyData';
import { getMyProfile, getMyRequests, getMyExchanges } from '../api/services';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, requestsRes] = await Promise.all([
          getMyProfile(),
          getMyRequests(),
        ]);
        let exchangesData = [];
        try {
          const exchangesRes = await getMyExchanges();
          exchangesData = exchangesRes.data;
        } catch (e) {}

        setProfile(profileRes.data);
        setRequests(requestsRes.data);
        setExchanges(exchangesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pendingIncoming = requests.incoming.filter(r => r.status === 'pending');
  const offeredSkillsCount = profile.skills?.filter(s => s.type === 'offer').length || 0;

  return (
    <div className="min-h-screen bg-white text-apple-black font-sans pb-16">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Welcome Bar */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-[40px] md:text-[48px] font-bold text-apple-black tracking-[-0.02em] leading-tight">Helloww!!, {profile.name.split(' ')[0]}.</h1>
          <p className="text-[17px] font-medium text-apple-gray mt-2">{dateStr}</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Exchanges', value: exchanges.filter(ex => ex.status === 'active').length },
            { label: 'Pending Requests', value: pendingIncoming.length },
            { label: 'Skills Offered', value: offeredSkillsCount },
            { label: 'Rating', value: `${profile.rating}★` }
          ].map((stat, i) => (
            <motion.div variants={fadeUp} key={i} className="bg-white p-6 rounded-[24px] border border-apple-border flex flex-col justify-between hover:border-black/10 transition-colors">
              <span className="text-[32px] md:text-[40px] font-bold text-apple-black leading-none tracking-[-0.01em] mb-3">{stat.value}</span>
              <span className="text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em]">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Matches */}
        <motion.section variants={fadeUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[13px] font-semibold text-apple-gray uppercase tracking-[0.08em]">Top Matches</h2>
            <span className="px-3 py-1 bg-apple-bg border border-apple-border text-apple-black text-[12px] font-medium rounded-full flex items-center gap-1">
              Based on your skills
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.slice(0, 3).map((match, i) => (
              <div key={i} className="bg-white rounded-[24px] border border-apple-border p-6 flex flex-col justify-between group hover:border-black/20 hover:-translate-y-1 transition-all">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <img src={match.avatar} alt={match.name} className="w-16 h-16 rounded-full border border-apple-border" />
                    <div className="text-[28px] font-bold text-apple-black leading-none tracking-[-0.01em]">
                      {match.matchScore}%
                    </div>
                  </div>
                  <h3 className="font-semibold text-apple-black text-[19px] tracking-tight">{match.name}</h3>
                  <p className="text-[14px] text-apple-gray font-medium mb-4">{match.college}</p>
                  <div className="bg-apple-bg rounded-2xl p-4 mb-6 relative hover:bg-[#EAEAEA] transition-colors cursor-default">
                    <p className="text-[14px] text-apple-black leading-relaxed font-medium">"{match.matchReason}"</p>
                  </div>
                </div>
                <button onClick={() => navigate(`/profile/${match.id}`)} className="w-full py-4 bg-apple-black text-white font-medium rounded-[980px] hover:bg-[#333333] active:scale-[0.98] transition-all">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="grid lg:grid-cols-3 gap-12 pt-4">
          
          {/* Active Exchanges */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Active Exchanges</h2>
            
            {exchanges.filter(ex => ex.status === 'active').length === 0 ? (
              <div className="bg-white p-12 rounded-[24px] border border-apple-border text-center flex flex-col items-center justify-center min-h-[250px]">
                <p className="text-[17px] font-medium text-apple-gray mb-6">No active exchanges yet. Start by browsing skills!</p>
                <button onClick={() => navigate('/browse')} className="px-8 py-4 bg-apple-black text-white rounded-[980px] font-medium hover:bg-[#333333] active:scale-[0.98] transition-all">
                  Browse Skills
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {exchanges.filter(ex => ex.status === 'active').map((ex) => {
                  const partner = ex.user1Id === user?.id ? ex.user2 : ex.user1;
                  const me = ex.user1Id === user?.id ? ex.user1 : ex.user2;
                  return (
                    <div key={ex.id} className="bg-white rounded-[24px] border border-apple-border p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-black/10 transition-colors">
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="flex items-center -space-x-4">
                          <img src={me?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${me?.username}`} className="w-14 h-14 rounded-full border-2 border-white bg-white z-10" alt="" />
                          <img src={partner?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner?.username}`} className="w-14 h-14 rounded-full border-2 border-white bg-white z-0" alt="" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-apple-black tracking-tight text-[17px]">{partner?.name || 'Partner'}</h3>
                          <p className="text-[14px] font-medium text-apple-gray mt-1">{ex.user1Skill} ↔ {ex.user2Skill}</p>
                        </div>
                      </div>

                      <div className="flex-1 w-full px-4 md:px-8">
                        <div className="flex justify-between text-[12px] font-semibold text-apple-gray uppercase tracking-[0.08em] mb-3">
                          <span>Session Progress</span>
                          <span className="text-apple-black">{ex.sessionsCompleted} / {ex.totalSessions}</span>
                        </div>
                        <div className="w-full bg-apple-bg rounded-[980px] h-2 overflow-hidden">
                          <div className="bg-[#0A84FF] h-full rounded-[980px]" style={{ width: `${ex.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex w-full md:w-auto">
                        <button onClick={() => navigate(`/exchange/${ex.id}`)} className="flex-1 px-8 py-3 bg-white border border-apple-border text-apple-black rounded-[980px] text-[15px] font-medium hover:bg-apple-bg active:scale-[0.98] transition-all whitespace-nowrap">
                          Open Workspace
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-[28px] font-semibold text-apple-black tracking-[-0.01em]">Requests</h2>
              <button onClick={() => navigate('/requests')} className="text-[15px] font-medium text-apple-gray hover:text-apple-black transition-colors mb-1">View All</button>
            </div>
            
            <div className="bg-white rounded-[24px] border border-apple-border p-6 min-h-[250px]">
              <div className="space-y-6">
                {pendingIncoming.length === 0 && <p className="text-[15px] font-medium text-apple-gray py-4">No pending requests.</p>}
                {pendingIncoming.slice(0, 3).map((req, i) => (
                  <div key={i} className="border-b border-apple-border last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={req.fromUser.avatar} className="w-12 h-12 rounded-full border border-apple-border" />
                      <div>
                        <h4 className="font-semibold text-apple-black text-[15px]">{req.fromUser.name}</h4>
                        <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-[0.06em] mt-0.5">{new Date(req.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="bg-apple-bg rounded-[16px] p-4 border border-apple-border/50 mb-4 cursor-default">
                      <p className="text-[14px] text-apple-black italic leading-relaxed line-clamp-3">"{req.message}"</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-2.5 bg-apple-black text-white rounded-[980px] text-[14px] font-medium hover:bg-[#333333] active:scale-[0.96] transition-all">
                        Accept
                      </button>
                      <button className="flex-1 py-2.5 bg-white border border-apple-border text-apple-black rounded-[980px] text-[14px] font-medium hover:bg-apple-bg active:scale-[0.96] transition-all">
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
