// 🎮 Diamond 11 - Universal Game Bridge
(function() {
    const API_URL = 'https://diamond11-backend.onrender.com/api';
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn("⚠️ Not logged in - wallet disabled");
        return;
    }

    window.CasinoGame = {
        balance: 0,

        async init() {
            try {
                const res = await fetch(`${API_URL}/wallet/balance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                this.balance = data.balance || data.data?.balance || 0;
                this.updateUI();
                console.log("💰 Wallet Ready:", this.balance);
            } catch (e) { console.error("Init Error:", e); }
        },

        async placeBet(amount) {
            if (this.balance < amount) {
                alert("Insufficient Balance! Please deposit.");
                return false;
            }
            try {
                const res = await fetch(`${API_URL}/wallet/bet`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ amount })
                });
                const data = await res.json();
                if (data.success || data.balance !== undefined) {
                    this.balance = data.balance || (this.balance - amount);
                    this.updateUI();
                    return true;
                }
                alert(data.message || "Bet failed");
                return false;
            } catch (e) { 
                console.error("Bet Error:", e);
                this.balance -= amount;
                this.updateUI();
                return true;
            }
        },

        async reportWin(amount) {
            try {
                const res = await fetch(`${API_URL}/wallet/win`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ amount })
                });
                const data = await res.json();
                this.balance = data.balance || (this.balance + amount);
                this.updateUI();
                this.celebrate(amount);
            } catch (e) { 
                console.error("Win Error:", e);
                this.balance += amount;
                this.updateUI();
            }
        },

        updateUI() {
            const balanceText = "₹" + this.balance.toFixed(2);
            
            // Multiple IDs try
            ['user-balance', 'balance', 'wallet-balance', 'current-balance', 'walletBalance', 'coins', 'money'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.innerText = balanceText;
            });

            // Multiple classes try
            ['balance', 'wallet-balance', 'user-balance', 'balance-text', 'coins-display'].forEach(cls => {
                document.querySelectorAll('.' + cls).forEach(el => {
                    el.innerText = balanceText;
                });
            });

            // Login button replace
            document.querySelectorAll('button, a, span, div').forEach(el => {
                const text = el.textContent.trim();
                if (text === '₹Login' || text === 'Login') {
                    el.textContent = balanceText;
                    el.style.color = '#ffd700';
                    el.style.fontWeight = 'bold';
                }
            });

            // Global variables update
            if (typeof window.gameBalance !== 'undefined') window.gameBalance = this.balance;
            if (typeof window.userBalance !== 'undefined') window.userBalance = this.balance;
            if (typeof window.balance !== 'undefined') window.balance = this.balance;
        },

        celebrate(amt) {
            const popup = document.createElement('div');
            popup.style.cssText = `
                position: fixed; top: 50%; left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #ffd700, #ff8c00);
                color: white; padding: 30px 50px;
                border-radius: 20px; font-size: 24px;
                font-weight: bold; z-index: 99999;
                box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            `;
            popup.innerHTML = `🎉 YOU WON ₹${amt}! 🎉`;
            document.body.appendChild(popup);
            setTimeout(() => popup.remove(), 2500);
        }
    };

    window.addEventListener('DOMContentLoaded', () => {
        window.CasinoGame.init();
    });

    setInterval(() => {
        if (window.CasinoGame) window.CasinoGame.init();
    }, 30000);
})();