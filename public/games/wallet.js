// 🎮 Diamond 11 - Games Wallet Integration
// Sirf games ke andar chalega, home/login page pe nahi

(function() {
  'use strict';

  // ✅ Check karo ye games folder ke andar hai ya nahi
  const isGamePage = window.location.pathname.includes('/games/');
  
  // ❌ Agar game page nahi hai to kuch mat karo
  if (!isGamePage) {
    console.log('Not a game page, wallet.js skipped');
    return;
  }

  const API_URL = 'https://diamond11-backend.onrender.com/api';
  const token = localStorage.getItem('token');

  // ❌ Agar login nahi hai to redirect
  if (!token) {
    console.warn('User not logged in - wallet features disabled');
    // Alert hatao, redirect hatao - game khelne do
    return;
  }

  // 🌍 Global Wallet Object
  window.DiamondWallet = {
    balance: 0,
    token: token,

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
        this.balance -= amount;
        this.updateUI();
        return true;
      }
    },

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

    updateUI() {
      const ids = ['balance', 'wallet-balance', 'user-balance', 'current-balance', 'walletBalance'];
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = `₹${this.balance.toFixed(2)}`;
      });

      const classes = ['balance', 'wallet-balance', 'user-balance'];
      classes.forEach(cls => {
        document.querySelectorAll(`.${cls}`).forEach(el => {
          el.textContent = `₹${this.balance.toFixed(2)}`;
        });
      });

      document.querySelectorAll('button, a, span, div').forEach(el => {
        if (el.textContent.trim() === '₹Login' || el.textContent.trim() === 'Login') {
          el.textContent = `₹${this.balance.toFixed(2)}`;
          el.style.color = '#ffd700';
          el.style.fontWeight = 'bold';
        }
      });
    },

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
      `;
      popup.innerHTML = `🎉 You Won ₹${amount}! 🎉`;
      document.body.appendChild(popup);
      setTimeout(() => popup.remove(), 2500);
    },

    goHome() {
      window.location.href = '/';
    }
  };

  window.addEventListener('DOMContentLoaded', () => {
    window.DiamondWallet.getBalance();
    console.log('✅ Diamond Wallet Loaded!');
  });

  setInterval(() => {
    window.DiamondWallet.getBalance();
  }, 30000);

})();