// 🎰 Diamond 11 - Casino Wallet Helper
// Path: frontend/public/games/wallet.js

(function () {
    const API = 'https://diamond11-backend.onrender.com/api';

    // ✅ Token multiple jagah se dhundo
    function getToken() {
        // 1. URL se
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            return token;
        }
        // 2. localStorage se
        token = localStorage.getItem('token') || 
                localStorage.getItem('userToken') || 
                localStorage.getItem('authToken');
        if (token) return token;
        
        // 3. Parent window se (agar iframe me hai)
        try {
            token = window.parent.localStorage.getItem('token');
            if (token) return token;
        } catch(e) {}
        
        return null;
    }

    const token = getToken();
    console.log('🎰 Wallet.js loaded | Token:', token ? '✅ Found' : '❌ Missing');

    window.CasinoGame = {
        balance: 0,

        // ✅ Fetch balance from server
        async fetchBalance() {
            if (!token) {
                console.warn('⚠️ No token - cannot fetch balance');
                return 0;
            }
            try {
                const res = await fetch(`${API}/wallet/balance`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    this.balance = data.data?.balance ?? data.balance ?? 0;
                    this.updateUI();
                    console.log('💰 Balance loaded:', this.balance);
                    return this.balance;
                }
            } catch (e) {
                console.error('❌ Wallet fetch error:', e);
            }
            return this.balance;
        },

        // ✅ Place Bet
        async placeBet(amount) {
            if (!token) {
                alert('Login required! Please login first.');
                return false;
            }
            if (amount <= 0) return false;
            if (amount > this.balance) {
                console.warn('❌ Insufficient balance');
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
                    this.balance = data.newBalance ?? (this.balance - amount);
                    this.updateUI();
                    console.log(`✅ Bet: ₹${amount} | Balance: ₹${this.balance}`);
                    return true;
                }
                console.warn('❌ Bet failed:', data.message);
                return false;
            } catch (e) {
                console.error('❌ PlaceBet error:', e);
                // Fallback: local deduction if server fails
                this.balance -= amount;
                this.updateUI();
                return true;
            }
        },

        // ✅ Report Win
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
                    this.balance = data.newBalance ?? (this.balance + amount);
                    this.updateUI();
                    console.log(`🎉 Win: ₹${amount} | Balance: ₹${this.balance}`);
                    return true;
                }
                return false;
            } catch (e) {
                console.error('❌ ReportWin error:', e);
                // Fallback: local add if server fails
                this.balance += amount;
                this.updateUI();
                return true;
            }
        },

        // ✅ Update all balance displays
        updateUI() {
            const selectors = [
                '#balance', '#topBal', '#topBalance',
                '#walletBalance', '#balanceDisplay', '#bal'
            ];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.textContent = this.balance.toFixed(2);
                });
            });
        }
    };

    // ✅ Initial load
    if (token) {
        window.CasinoGame.fetchBalance();
    }

})();