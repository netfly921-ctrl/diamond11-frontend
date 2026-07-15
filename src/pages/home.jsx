import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSyncAlt, FaHome, FaGift, FaWallet, FaUser } from "react-icons/fa";

const API_URL = "https://diamond11-backend.onrender.com";

// ✅ SMART URL GENERATOR + TOKEN PASS (FIXED)
function getPlayUrl(game) {
  let code = game.code ? game.code.toLowerCase() : "";

  // Special case for CHICKEN PRO (space wala folder)
  if (code === "chickenpro") code = "CHICKEN PRO";

  // Agar MongoDB mein gameUrl hai toh use karo, warna code se banao
  let url = game.gameUrl || game.path || `/games/${code}/index.html`;

  // Ensure URL lowercase hai (except CHICKEN PRO)
  if (code !== "CHICKEN PRO") {
    url = url.toLowerCase();
  }

  // Ensure URL ends with index.html
  if (!url.endsWith(".html")) {
    if (!url.endsWith("/")) url += "/";
    url += "index.html";
  }

  // ✅ FIXED: Token URL me pass karo (wallet.js ke liye)
  const token = localStorage.getItem("token");
  if (token && !url.includes("token=")) {
    url += (url.includes("?") ? "&" : "?") + "token=" + token;
  }

  return encodeURI(url);
}

function getImageUrl(game) {
  if (game.image && game.image.trim() !== "") return game.image;
  if (game.code) return `/game-images/${game.code}.png`;
  return `/game-images/01.png`;
}

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem("user");
      return s ? JSON.parse(s) : {};
    } catch {
      return {};
    }
  });

  const updateUser = (u) => {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
  };

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [banners] = useState([
    { id: 1, text: "RECHARGE BONUS 100%", sub: "Deposit now and get double!", color: "from-pink-500 via-red-500 to-yellow-500", emoji: "🎁" },
    { id: 2, text: "DAILY BONUS ₹500", sub: "Login daily and claim!", color: "from-blue-500 via-purple-500 to-pink-500", emoji: "💰" },
    { id: 3, text: "REFER & EARN ₹50", sub: "Invite friends and earn!", color: "from-green-400 via-teal-500 to-blue-500", emoji: "👥" }
  ]);

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    fetchGames();
    fetchBalance();

    const balanceInterval = setInterval(fetchBalance, 15000);
    const bannerInterval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => {
      clearInterval(balanceInterval);
      clearInterval(bannerInterval);
    };
  }, []);

  const fetchGames = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/game/list`);
      if (res.data?.success) {
        setGames(res.data.data || []);
      } else {
        setGames([]);
      }
    } catch (e) {
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${API_URL}/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        updateUser({ ...user, balance: res.data.data.balance });
      }
    } catch (e) {}
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="pb-24 min-h-screen bg-[#4A0E8F]">
      <div className="bg-[#3b0b72] p-4 flex justify-between items-center shadow-md">
        <h1 className="text-white font-black text-xl tracking-wider">DIAMOND 11</h1>
        <div className="flex gap-3 items-center">
          <span className="text-xl">🇮🇳</span>
          <button onClick={() => navigate("/notifications")} className="text-white text-xl">🔔</button>
        </div>
      </div>

      <div className="px-3 mt-4">
        <div className={`bg-gradient-to-r ${banners[currentBanner].color} rounded-2xl shadow-xl overflow-hidden`} style={{ minHeight: "140px" }}>
          <div className="flex items-center justify-between h-full p-5">
            <div className="flex-1">
              <p className="text-white text-[10px] font-bold opacity-80 mb-1 uppercase tracking-wider">💎 DIAMOND 11</p>
              <h2 className="text-white text-xl font-black leading-tight mb-1">{banners[currentBanner].text}</h2>
              <p className="text-white/80 text-xs mb-3">{banners[currentBanner].sub}</p>
              <button onClick={() => navigate("/wallet")} className="bg-white text-purple-800 px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                Play Now →
              </button>
            </div>
            <div className="text-6xl ml-2 drop-shadow-lg">{banners[currentBanner].emoji}</div>
          </div>
        </div>
        <div className="flex justify-center gap-1.5 mt-2 mb-3">
          {banners.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentBanner(idx)} className={`rounded-full transition-all ${idx === currentBanner ? "bg-yellow-400 w-4 h-1.5" : "bg-purple-500 w-1.5 h-1.5"}`} />
          ))}
        </div>
      </div>

      <div className="px-3 mb-4">
        <div className="bg-[#5B21B6] rounded-xl p-3.5 flex items-center justify-between shadow-lg border border-white/10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/wallet")}>
            <div className="w-11 h-11 bg-gradient-to-tr from-yellow-300 to-orange-500 rounded-full flex items-center justify-center text-purple-900 font-black text-lg">
              {user?.uid?.charAt(0) || "U"}
            </div>
            <div>
              <p className="text-purple-300 text-[10px] font-medium">ID: {user?.uid || "N/A"}</p>
              <p className="text-white font-black text-xl">₹{(user?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <button onClick={handleManualRefresh} className={`bg-white/10 p-2.5 rounded-full text-white ${refreshing ? "animate-spin" : ""}`}>
            <FaSyncAlt className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-10">
        <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-yellow-400 rounded-full"></span> 🎮 All Games ({games.length})
        </h3>

        {loading ? (
          <div className="text-center text-purple-300 py-12">
            <div className="text-5xl mb-3 animate-bounce">🎮</div>
            <p>Loading Games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center text-purple-300 py-12">
            <p>No Games Available</p>
            <button onClick={fetchGames} className="mt-4 bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold">Retry</button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-y-5 gap-x-3">
            {games.map((game) => {
              const img = getImageUrl(game);
              // ✅ Token ke saath URL banega
              const playUrl = getPlayUrl(game);

              return (
                <div key={game._id || game.code} onClick={() => { window.location.href = playUrl; }} className="flex flex-col items-center cursor-pointer active:scale-95 group">
                  <div className="w-[90px] h-[90px] bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-white/20 group-hover:border-yellow-400">
                    <img src={img} alt={game.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/game-images/01.png"; }} />
                  </div>
                  <p className="text-white text-[11px] font-bold mt-2 text-center leading-tight max-w-[90px] truncate">{game.displayName || game.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#3b0b72] border-t border-purple-800 flex justify-around p-3 z-50">
        <button onClick={() => navigate("/home")} className="flex flex-col items-center text-yellow-400">
          <FaHome className="text-xl" />
          <span className="text-[10px] mt-1">Home</span>
        </button>
        <button onClick={() => navigate("/activity")} className="flex flex-col items-center text-purple-300 hover:text-yellow-400">
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

export default Home;