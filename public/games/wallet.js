// 🎮 Diamond 11 - Games Wallet Integration
// Ye file automatically wallet balance manage karti hai

(function() {
  'use strict';

  const API_URL = 'https://diamond11-backend.onrender.com/api';
  const token = localStorage.getItem('token');

  // ❌ Agar login nahi hai to redirect
  if (!token) {
    alert('Please login first to play!');
    window.location.href = '/login';
    return;
  }

  // 🌍 Global Wallet Object (Har game use kar sakta hai)
  window.DiamondWallet = {
    balance: 0,
    token: token,

    // 💰 Get Current Balance
    async getBalance() {
      try {
        const res = await fetch(`${API_URL}/wallet/balance`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        this.balance = data.balance || data.data?.balance || 0;
        this.updateUI();
        return this.balance;
      } catch (err) {
        console.error('Balance fetch error:', err);
        return 0;
      }
    },

    // 🎲 Place Bet (Deduct Amount)
    async placeBet(amount, gameName = 'game') {
      if (this.balance < amount) {
        alert('Insufficient balance! Please deposit money.');
        return false;
      }

      try {
        const res = await fetch(`${API_URL}/wallet/bet`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount, game: gameName })
        });
        const data = await res.json();
        
        if (data.success || data.balance !== undefined) {
          this.balance = data.balance || (this.balance - amount);
          this.updateUI();
          return true;
        } else {
          alert(data.message || 'Bet failed');
          return false;
        }
      } catch (err) {
        console.error('Bet error:', err);
        // Fallback: deduct locally
        this.balance -= amount;
        this.updateUI();
        return true;
      }
    },

    // 🏆 Add Winning Amount
    async addWinning(amount, gameName = 'game') {
      try {
        const res = await fetch(`${API_URL}/wallet/win`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ amount, game: gameName })
        });
        const data = await res.json();
        this.balance = data.balance || (this.balance + amount);
        this.updateUI();
        this.showWinPopup(amount);
        return true;
      } catch (err) {
        console.error('Win error:', err);
        this.balance += amount;
        this.updateUI();
        return true;
      }
    },

    // 🎨 Update UI (Balance Show)
    updateUI() {
      // Multiple ID names try karo (har game me alag ho sakta)
      const ids = ['balance', 'wallet-balance', 'user-balance', 'current-balance', 'walletBalance'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          el.textContent = `₹${this.balance.toFixed(2)}`;
        }
      });

      // Class ke through bhi try karo
      const classes = ['balance', 'wallet-balance', 'user-balance'];
      classes.forEach(cls => {
        document.querySelectorAll(`.${cls}`).forEach(el => {
          el.textContent = `₹${this.balance.toFixed(2)}`;
        });
      });

      // Login button ko balance se replace karo
      const loginBtns = document.querySelectorAll('button, a, span, div');
      loginBtns.forEach(el => {
        if (el.textContent.trim() === '₹Login' || el.textContent.trim() === 'Login') {
          el.textContent = `₹${this.balance.toFixed(2)}`;
          el.style.color = '#ffd700';
          el.style.fontWeight = 'bold';
        }
      });
    },

    // 🎉 Win Popup
    showWinPopup(amount) {
      const popup = document.createElement('div');
      popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ffd700, #ff8c00);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        animation: winPop 0.5s ease-out;
      `;
      popup.innerHTML = `🎉 You Won ₹${amount}! 🎉`;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 2500);
    },

    // 🚪 Back to Home
    goHome() {
      window.location.href = '/';
    }
  };

  // 🎬 Auto-fetch balance on page load
  window.addEventListener('DOMContentLoaded', () => {
    window.DiamondWallet.getBalance();
    console.log('✅ Diamond Wallet Loaded!');
  });

  // 🔄 Refresh balance every 30 seconds
  setInterval(() => {
    window.DiamondWallet.getBalance();
  }, 30000);

  // 🎨 Animation CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes winPop {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
      50% { transform: translate(-50%, -50%) scale(1.2); }
      100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);

})();