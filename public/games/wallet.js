// 🎰 Diamond 11 - UNIVERSAL Wallet Helper
// Ye purane games ke API calls ko bhi intercept karta hai
// Path: frontend/public/games/wallet.js

(function () {
    const API = 'https://diamond11-backend.onrender.com/api';

    // ✅ Get token
    function getToken() {
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');
        if (token) {
            localStorage.setItem('token', token);
            return token;
        }
        return localStorage.getItem('token') || 
               localStorage.getItem('userToken') || 
               localStorage.getItem('authToken');
    }

    const token = getToken();
    console.log('🎰 Wallet.js loaded | Token:', token ? '✅ Found' : '❌ Missing');

    // ✅ MAIN CasinoGame Object
    window.CasinoGame = {
        balance: 0,
        _initialized: false,

        async fetchBalance() {
            if (!token) return 0;
            try {
                const res = await fetch(`${API}/wallet/balance`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) return this.balance;
                const data = await res.json();
                if (data.success) {
                    this.balance = Number(data.data?.balance ?? data.balance ?? 0);
                    this._initialized = true;
                    this.updateUI();
                    return this.balance;
                }
            } catch (e) {
                console.error('Balance fetch error:', e);
            }
            return this.balance;
        },

        async placeBet(amount) {
            amount = Number(amount);
            if (!token || amount <= 0 || isNaN(amount)) return false;
            if (!this._initialized) await this.fetchBalance();
            if (amount > this.balance) return false;

            // Local deduction (instant UI)
            this.balance -= amount;
            this.updateUI();

            // Background sync
            this._syncBalance('deduct', amount);
            console.log(`✅ Bet: ₹${amount} | Balance: ₹${this.balance}`);
            return true;
        },

        async reportWin(amount) {
            amount = Number(amount);
            if (!token || amount <= 0 || isNaN(amount)) return false;

            this.balance += amount;
            this.updateUI();

            this._syncBalance('credit', amount);
            console.log(`🎉 Win: ₹${amount} | Balance: ₹${this.balance}`);
            return true;
        },

        // Background server sync (silent)
        _syncBalance(type, amount) {
            const endpoint = type === 'deduct' ? 'deduct' : 'credit';
            fetch(`${API}/wallet/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, type, gameCode: 'casino' })
            }).then(r => r.json()).then(data => {
                if (data.success && data.newBalance !== undefined) {
                    this.balance = Number(data.newBalance);
                    this.updateUI();
                }
            }).catch(() => {});
        },

        updateUI() {
            const selectors = ['#balance', '#topBal', '#topBalance', '#walletBalance', '#balanceDisplay', '#bal', '.balance', '.wallet-balance'];
            selectors.forEach(sel => {
                document.querySelectorAll(sel).forEach(el => {
                    el.textContent = this.balance.toFixed(2);
                });
            });
        }
    };

    // ================================================
    // 🔥 FETCH INTERCEPTOR - Purane games ke API calls fix karta hai
    // ================================================
    const originalFetch = window.fetch;
    
    window.fetch = async function(url, options = {}) {
        const urlStr = typeof url === 'string' ? url : url.url || '';
        
        // ✅ Intercept /game/place-bet calls
        if (urlStr.includes('/game/place-bet') || urlStr.includes('/api/game/place-bet')) {
            console.log('🎯 Intercepted place-bet call');
            try {
                const body = JSON.parse(options.body || '{}');
                const amount = Number(body.betAmount || body.amount || 0);
                
                const success = await window.CasinoGame.placeBet(amount);
                
                return new Response(JSON.stringify({
                    success: success,
                    newBalance: window.CasinoGame.balance,
                    message: success ? 'Bet placed' : 'Insufficient balance'
                }), {
                    status: success ? 200 : 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (e) {
                return new Response(JSON.stringify({ success: false, message: 'Error' }), { status: 400 });
            }
        }

        // ✅ Intercept /game/cashout calls
        if (urlStr.includes('/game/cashout') || urlStr.includes('/api/game/cashout')) {
            console.log('🎯 Intercepted cashout call');
            try {
                const body = JSON.parse(options.body || '{}');
                const winAmount = Number(body.winAmount || body.amount || 0);
                
                if (winAmount > 0) {
                    await window.CasinoGame.reportWin(winAmount);
                }
                
                return new Response(JSON.stringify({
                    success: true,
                    newBalance: window.CasinoGame.balance
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            } catch (e) {
                return new Response(JSON.stringify({ success: false }), { status: 400 });
            }
        }

        // ✅ Intercept /wallet/balance for consistency
        if (urlStr.includes('/wallet/balance') && !urlStr.includes(API)) {
            console.log('🎯 Intercepted balance call');
            return new Response(JSON.stringify({
                success: true,
                data: { balance: window.CasinoGame.balance },
                balance: window.CasinoGame.balance
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // ✅ Other requests pass through
        return originalFetch.apply(this, arguments);
    };

    console.log('🛡️ Fetch interceptor installed');

    // ✅ Auto-load balance
    if (token) {
        window.CasinoGame.fetchBalance();
        document.addEventListener('DOMContentLoaded', () => {
            window.CasinoGame.updateUI();
        });
    }

})();