import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaHome, FaGift, FaWallet, FaUser, 
  FaArrowUp, FaArrowDown, FaGamepad, 
  FaTrophy, FaHistory, FaSyncAlt 
} from "react-icons/fa";

const API_URL = "https://diamond11-backend.onrender.com";

const Transactions = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filteredTx, setFilteredTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  const filters = [
    { key: "all", label: "All", color: "bg-yellow-400" },
    { key: "game_win", label: "Game Win", color: "bg-green-500" },
    { key: "game_loss", label: "Game Loss", color: "bg-red-500" },
    { key: "deposit", label: "Deposit", color: "bg-blue-500" },
    { key: "withdraw", label: "Withdraw", color: "bg-orange-500" },
    { key: "bonus", label: "Bonus", color: "bg-purple-500" },
  ];

  useEffect(() => {
    fetchTransactions();
    fetchBalance();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [activeFilter, transactions]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setCurrentBalance(res.data.data?.balance || 0);
      }
    } catch (e) {
      console.error("Balance fetch error:", e);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // ✅ Try multiple endpoints (fallback)
      const endpoints = [
        `${API_URL}/api/wallet/transactions`,
        `${API_URL}/api/transactions`,
        `${API_URL}/api/wallet/history`,
        `${API_URL}/api/user/transactions`,
      ];

      let data = null;
      for (const endpoint of endpoints) {
        try {
          const res = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.success && res.data.data) {
            data = res.data.data;
            break;
          }
          if (Array.isArray(res.data)) {
            data = res.data;
            break;
          }
        } catch (err) {
          continue;
        }
      }

      if (data && Array.isArray(data)) {
        // Normalize transaction data
        const normalized = data.map(tx => ({
          _id: tx._id || tx.id || Math.random().toString(),
          type: (tx.type || tx.transactionType || "other").toLowerCase(),
          amount: Number(tx.amount || 0),
          balanceAfter: Number(tx.balanceAfter || tx.newBalance || tx.balance || 0),
          balanceBefore: Number(tx.balanceBefore || tx.oldBalance || 0),
          description: tx.description || tx.remark || tx.note || getDefaultDescription(tx.type),
          status: tx.status || "success",
          gameCode: tx.gameCode || tx.game || "",
          createdAt: tx.createdAt || tx.date || tx.timestamp || new Date().toISOString(),
          txId: tx.txId || tx.transactionId || tx._id?.slice(-8) || ""
        }));

        // Sort by date (newest first)
        normalized.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTransactions(normalized);
      } else {
        setTransactions([]);
      }
    } catch (e) {
      console.error("Transaction fetch error:", e);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDescription = (type) => {
    const desc = {
      deposit: "Wallet Deposit",
      withdraw: "Wallet Withdrawal",
      game_win: "Game Winning",
      game_loss: "Game Loss",
      bonus: "Bonus Received",
      bet: "Bet Placed",
      cashout: "Game Cashout"
    };
    return desc[type?.toLowerCase()] || "Transaction";
  };

  const filterTransactions = () => {
    if (activeFilter === "all") {
      setFilteredTx(transactions);
    } else {
      const filtered = transactions.filter(tx => {
        const type = tx.type?.toLowerCase() || "";
        if (activeFilter === "game_win") {
          return type.includes("win") || type.includes("cashout") || type === "credit";
        }
        if (activeFilter === "game_loss") {
          return type.includes("loss") || type.includes("bet") || type.includes("deduct");
        }
        return type.includes(activeFilter);
      });
      setFilteredTx(filtered);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTransactions(), fetchBalance()]);
    setTimeout(() => setRefreshing(false), 800);
  };

  // ✅ Icon based on transaction type
  const getTxIcon = (type) => {
    const t = type?.toLowerCase() || "";
    if (t.includes("deposit")) return <FaArrowDown className="text-green-400" />;
    if (t.includes("withdraw")) return <FaArrowUp className="text-orange-400" />;
    if (t.includes("win") || t.includes("cashout")) return <FaTrophy className="text-yellow-400" />;
    if (t.includes("loss") || t.includes("bet") || t.includes("deduct")) return <FaGamepad className="text-red-400" />;
    if (t.includes("bonus")) return <FaGift className="text-purple-400" />;
    return <FaHistory className="text-blue-400" />;
  };

  // ✅ Amount color and prefix
  const getAmountStyle = (type, amount) => {
    const t = type?.toLowerCase() || "";
    const isCredit = t.includes("deposit") || t.includes("win") || t.includes("cashout") || t.includes("bonus") || t.includes("credit");
    return {
      color: isCredit ? "text-green-400" : "text-red-400",
      prefix: isCredit ? "+" : "-",
      bg: isCredit ? "bg-green-500/10" : "bg-red-500/10"
    };
  };

  // ✅ Format date time
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const time = d.toLocaleTimeString("en-IN", { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true 
      });

      if (d.toDateString() === today.toDateString()) {
        return `Today, ${time}`;
      }
      if (d.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${time}`;
      }
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }) + ", " + time;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-[#4A0E8F]">
      {/* Header */}
      <div className="bg-[#3b0b72] p-4 flex justify-between items-center shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white text-xl">
            ←
          </button>
          <h1 className="text-white font-black text-lg">Transaction History</h1>
        </div>
        <button 
          onClick={handleRefresh} 
          className={`bg-white/10 p-2 rounded-full text-white ${refreshing ? "animate-spin" : ""}`}
        >
          <FaSyncAlt className="w-4 h-4" />
        </button>
      </div>

      {/* Current Balance Card */}
      <div className="px-3 pt-4">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-xl">
          <p className="text-white/70 text-xs font-bold mb-1">CURRENT BALANCE</p>
          <p className="text-white text-3xl font-black">
            ₹{currentBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-2 mt-3">
            <button 
              onClick={() => navigate("/deposit")} 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-xs font-bold"
            >
              + DEPOSIT
            </button>
            <button 
              onClick={() => navigate("/withdraw")} 
              className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg text-xs font-bold"
            >
              WITHDRAW
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 pt-4 overflow-x-auto">
        <div className="flex gap-2 pb-2" style={{ minWidth: "max-content" }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${
                activeFilter === f.key 
                  ? `${f.color} text-purple-900 shadow-lg` 
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {f.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-3 pt-3">
        {loading ? (
          <div className="text-center text-purple-300 py-16">
            <div className="text-5xl mb-3 animate-pulse">💰</div>
            <p>Loading transactions...</p>
          </div>
        ) : filteredTx.length === 0 ? (
          <div className="text-center text-purple-300 py-16">
            <FaHistory className="text-5xl mx-auto mb-3 opacity-50" />
            <p className="text-lg font-bold">No transactions found</p>
            <p className="text-xs mt-2 opacity-70">
              {activeFilter === "all" 
                ? "Start playing to see your history!" 
                : `No ${activeFilter.replace("_", " ")} transactions yet`}
            </p>
            <button 
              onClick={handleRefresh}
              className="mt-4 bg-yellow-400 text-purple-900 px-6 py-2 rounded-full text-sm font-bold"
            >
              🔄 Refresh
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTx.map((tx) => {
              const style = getAmountStyle(tx.type, tx.amount);
              return (
                <div
                  key={tx._id}
                  className="bg-[#5B21B6]/60 backdrop-blur border border-white/10 rounded-xl p-3 flex items-center gap-3 hover:bg-[#5B21B6]/80 transition-all"
                >
                  {/* Icon */}
                  <div className={`w-11 h-11 ${style.bg} rounded-full flex items-center justify-center text-lg flex-shrink-0`}>
                    {getTxIcon(tx.type)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">
                      {tx.description}
                      {tx.gameCode && (
                        <span className="ml-1 text-purple-300 text-[10px] uppercase">
                          ({tx.gameCode})
                        </span>
                      )}
                    </p>
                    <p className="text-purple-300 text-[10px]">
                      {formatDate(tx.createdAt)}
                    </p>
                    {tx.txId && (
                      <p className="text-purple-400 text-[9px] font-mono mt-0.5">
                        ID: {tx.txId}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right flex-shrink-0">
                    <p className={`${style.color} font-black text-sm`}>
                      {style.prefix}₹{Math.abs(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                    {tx.balanceAfter > 0 && (
                      <p className="text-purple-300 text-[10px] mt-0.5">
                        Bal: ₹{tx.balanceAfter.toFixed(2)}
                      </p>
                    )}
                    <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 font-bold ${
                      tx.status === "success" || tx.status === "completed" 
                        ? "bg-green-500/20 text-green-400" 
                        : tx.status === "pending" 
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {tx.status?.toUpperCase() || "SUCCESS"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#3b0b72] border-t border-purple-800 flex justify-around p-3 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center text-purple-300 hover:text-yellow-400">
          <FaHome className="text-xl" />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => navigate("/activity")} className="flex flex-col items-center text-yellow-400">
          <FaGift className="text-xl" />
          <span className="text-[10px] mt-1">Activity</span>
        </button>
        <button onClick={() => navigate("/wallet")} className="flex flex-col items-center text-purple-300 hover:text-yellow-400">
          <FaWallet className="text-xl" />
          <span className="text-[10px] mt-1">Wallet</span>
        </button>
        <button onClick={() => navigate("/account")} className="flex flex-col items-center text-purple-300 hover:text-yellow-400">
          <FaUser className="text-xl" />
          <span className="text-[10px] mt-1">Account</span>
        </button>
      </div>
    </div>
  );
};

export default Transactions;