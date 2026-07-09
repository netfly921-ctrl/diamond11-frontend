// 🎰 Diamond 11 - Casino Wallet Helper
// Path: frontend/public/games/wallet.js

(function () {
    const API = 'https://diamond11-backend.onrender.com/api';

    // Get token from URL
    function getToken() {
        const params = new URLSearchParams(window.location.search);
        return params.get('token');
    }

    const token = getToken();

    window.CasinoGame = {
        balance: 0,
        _syncing: false,

        // ✅ Fetch balance from server
        async fetchBalance() {
            if (!token) {
                console.warn('No token found in URL');
                return 0;
            }
            try {
                const res = await fetch(`${API}/wallet/balance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    this.balance = data.data?.balance || data.balance || 0;
                    this.updateUI();
                    return this.balance;
                }
            } catch (e) {
                console.error('Wallet fetch error:', e);
            }
            return this.balance;
        },

        // ✅ Place Bet - Server pe deduct hoga
        async placeBet(amount) {
            if (!token) {
                console.warn('No token');
                return false;
            }
            if (amount <= 0) return false;
            if (amount > this.balance) {
                console.warn('Insufficient balance');
                return false;
            }

            try {
                const res = await fetch(`${API}/game/place-bet`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        gameCode: 'casino',
                        betAmount: amount
                    })
                });
                const data = await res.json();

                if (data.success) {
                    // ✅ Server se aaya hua balance set karo
                    this.balance = data.newBalance ?? (this.balance - amount);
                    this.updateUI();
                    console.log(`✅ Bet placed: ₹${amount} | New Balance: ₹${this.balance}`);
                    return true;
                } else {
                    console.warn('Bet failed:', data.message);
                    return false;
                }
            } catch (e) {
                console.error('PlaceBet error:', e);
                return false;
            }
        },

        // ✅ Report Win - Server pe add hoga
        async reportWin(amount) {
            if (!token) return false;
            if (amount <= 0) return false;

            try {
                const res = await fetch(`${API}/game/cashout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        gameCode: 'casino',
                        betAmount: 0,
                        winAmount: amount,
                        multiplier: 1
                    })
                });
                const data = await res.json();

                if (data.success) {
                    // ✅ Server se aaya hua balance set karo
                    this.balance = data.newBalance ?? (this.balance + amount);
                    this.updateUI();
                    console.log(`✅ Win reported: ₹${amount} | New Balance: ₹${this.balance}`);
                    return true;
                } else {
                    console.warn('Cashout failed:', data.message);
                    return false;
                }
            } catch (e) {
                console.error('ReportWin error:', e);
                return false;
            }
        },

        // ✅ Update all balance displays on page
        updateUI() {
            const selectors = [
                '#balance', '#topBal', '#topBalance',
                '#walletBalance', '#balanceDisplay'
            ];
            selectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) el.textContent = this.balance.toFixed(2);
            });
        }
    };

    // ✅ Initial balance load
    if (token) {
        window.CasinoGame.fetchBalance();
    } else {
        console.warn('⚠️ No token in URL. Add ?token=YOUR_TOKEN to URL');
    }

})();