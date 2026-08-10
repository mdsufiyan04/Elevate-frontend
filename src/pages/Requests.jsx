import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/navbar/Navbar';
import { getMyRequests, updateRequest } from '../api/services';

const Requests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState({ incoming: [], outgoing: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRequests()
      .then(res => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await updateRequest(id, 'accepted');
      const exchangeId = res.data?.exchangeId || res.data?.exchange?.id;
      toast.success('Request accepted! Opening exchange...');
      const updated = await getMyRequests();
      setRequests(updated.data);
      if (exchangeId) {
        navigate(`/exchange/${exchangeId}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to accept request');
    }
  };

  const handleDecline = async (id) => {
    try {
      await updateRequest(id, 'rejected');
      toast.success('Request declined');
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to decline request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-apple-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { incoming, outgoing } = requests;

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-apple-black font-sans pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-[40px] md:text-[48px] font-bold text-apple-black tracking-tight leading-tight mb-12 border-b border-apple-border pb-8">Manage Requests</h1>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* Incoming Column */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[24px] font-bold text-apple-black tracking-tight flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-apple-gray" /> Incoming
              </h2>
              <span className="bg-apple-black text-white text-[12px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-[980px]">
                {incoming.length}
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {incoming.map((req, i) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="bg-white p-6 md:p-8 rounded-[24px] border border-apple-border shadow-sm flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={req.fromUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.fromUser?.username}`} className="w-12 h-12 rounded-full border border-apple-border bg-apple-bg" alt="" />
                        <div>
                          <h3 className="font-bold text-apple-black text-[16px] tracking-tight">{req.fromUser?.name || 'Unknown User'}</h3>
                          <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-[0.08em] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FBFBFD] border border-apple-border rounded-[16px] p-4">
                      <div className="mb-3">
                        <span className="text-[12px] font-bold text-apple-gray uppercase tracking-[0.08em] mr-2">Target Skill:</span>
                        <span className="px-3 py-1 bg-white border border-apple-border text-apple-black rounded-[980px] text-[12px] font-bold uppercase tracking-[0.08em]">{req.skill?.name}</span>
                      </div>
                      <p className="text-[14px] text-apple-black font-medium leading-relaxed italic">"{req.message}"</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {req.status === 'pending' ? (
                        <>
                          <button onClick={() => handleDecline(req.id)} className="flex-1 py-3.5 bg-white border border-[#E5E5EA] text-[#8E8E93] hover:text-apple-black hover:border-apple-black rounded-[980px] text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                            <XCircle className="w-4 h-4" /> Decline
                          </button>
                          <button onClick={() => handleAccept(req.id)} className="flex-1 py-3.5 bg-apple-black text-white hover:bg-[#333333] rounded-[980px] text-[15px] font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm">
                            <CheckCircle className="w-4 h-4" /> Accept
                          </button>
                        </>
                      ) : req.status === 'accepted' ? (
                         <div className="w-full py-3 bg-[#E5FADD] text-[#34C759] font-bold text-[14px] uppercase tracking-[0.08em] rounded-[12px] flex flex-col items-center justify-center gap-1">
                           <CheckCircle className="w-5 h-5" /> Accepted
                         </div>
                      ) : (
                         <div className="w-full py-3 bg-apple-bg text-apple-gray font-bold text-[14px] uppercase tracking-[0.08em] rounded-[12px] flex flex-col items-center justify-center gap-1">
                           <XCircle className="w-5 h-5" /> Declined
                         </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {incoming.length === 0 && (
                <div className="bg-white border text-center border-apple-border border-dashed rounded-[24px] py-12 px-4">
                  <p className="text-[15px] font-medium text-apple-gray">No incoming requests</p>
                </div>
              )}
            </div>
          </section>

          {/* Outgoing Column */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[24px] font-bold text-apple-black tracking-tight flex items-center gap-2">
                <ArrowLeft className="w-5 h-5 text-apple-gray" /> Outgoing
              </h2>
              <span className="bg-white border border-apple-border text-apple-black text-[12px] font-bold uppercase tracking-[0.08em] px-3 py-1 rounded-[980px]">
                {outgoing.length}
              </span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {outgoing.map((req, i) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                    className="bg-white p-6 md:p-8 rounded-[24px] border border-apple-border shadow-sm flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={req.toUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.toUser?.username}`} className="w-12 h-12 rounded-full border border-apple-border bg-apple-bg" alt="" />
                        <div>
                          <h3 className="font-bold text-apple-black text-[16px] tracking-tight">{req.toUser?.name || 'Unknown User'}</h3>
                          <p className="text-[12px] font-semibold text-apple-gray uppercase tracking-[0.08em] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {new Date(req.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {req.status === 'pending' && <span className="px-3 py-1.5 bg-[#FFF5E5] text-[#FF9F0A] font-bold uppercase tracking-[0.08em] text-[11px] rounded-[980px]">Pending</span>}
                        {req.status === 'accepted' && <span className="px-3 py-1.5 bg-[#E5FADD] text-[#34C759] font-bold uppercase tracking-[0.08em] text-[11px] rounded-[980px]">Accepted</span>}
                        {req.status === 'rejected' && <span className="px-3 py-1.5 bg-apple-bg text-apple-gray font-bold uppercase tracking-[0.08em] text-[11px] rounded-[980px]">Declined</span>}
                      </div>
                    </div>

                    <div className="bg-[#FBFBFD] border border-apple-border rounded-[16px] p-4">
                      <div className="mb-3">
                        <span className="text-[12px] font-bold text-apple-gray uppercase tracking-[0.08em] mr-2">Requested Skill:</span>
                        <span className="px-3 py-1 bg-white border border-apple-border text-apple-black rounded-[980px] text-[12px] font-bold uppercase tracking-[0.08em]">{req.skill?.name}</span>
                      </div>
                      <p className="text-[14px] text-apple-black font-medium leading-relaxed italic">"{req.message}"</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {outgoing.length === 0 && (
                <div className="bg-white border text-center border-apple-border border-dashed rounded-[24px] py-12 px-4">
                  <p className="text-[15px] font-medium text-apple-gray">No outgoing requests</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Requests;
