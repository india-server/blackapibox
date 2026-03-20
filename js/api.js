// API Configuration
const API_BASE = 'https://api.blackboxapi.com/v1';
const WS_BASE = 'wss://api.blackboxapi.com/ws';

// WebSocket Connection for Live Stats
let ws = null;

class BlackBoxAPI {
    constructor() {
        this.token = localStorage.getItem('api_token') || null;
        this.initWebSocket();
    }
    
    initWebSocket() {
        if (ws) ws.close();
        
        ws = new WebSocket(`${WS_BASE}/live`);
        
        ws.onopen = () => {
            console.log('WebSocket connected');
            this.authenticate();
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleLiveData(data);
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        ws.onclose = () => {
            console.log('WebSocket disconnected, reconnecting in 5s...');
            setTimeout(() => this.initWebSocket(), 5000);
        };
    }
    
    authenticate() {
        if (this.token) {
            ws.send(JSON.stringify({
                type: 'auth',
                token: this.token
            }));
        }
    }
    
    handleLiveData(data) {
        switch(data.type) {
            case 'stats':
                document.getElementById('live-rps').textContent = data.rps;
                document.getElementById('live-users').textContent = data.active_users;
                document.getElementById('live-latency').textContent = `${data.latency}ms`;
                break;
                
            case 'system':
                document.getElementById('cpu-usage').textContent = `${data.cpu}%`;
                document.getElementById('ram-usage').textContent = data.ram;
                document.getElementById('storage-usage').textContent = data.storage;
                break;
        }
    }
    
    async fetchStats() {
        const response = await fetch(`${API_BASE}/stats`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return await response.json();
    }
    
    async fetchUsers(page = 1) {
        const response = await fetch(`${API_BASE}/users?page=${page}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return await response.json();
    }
    
    async fetchBots() {
        const response = await fetch(`${API_BASE}/bots`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return await response.json();
    }
    
    async fetchLogs(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE}/logs?${params}`, {
            headers: {
                'Authorization': `Bearer ${this.token}`
            }
        });
        return await response.json();
    }
    
    async addUser(userData) {
        const response = await fetch(`${API_BASE}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        return await response.json();
    }
    
    async addBot(token, ownerId) {
        const response = await fetch(`${API_BASE}/bots`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, owner_id: ownerId })
        });
        return await response.json();
    }
    
    async updateSettings(settings) {
        const response = await fetch(`${API_BASE}/settings`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return await response.json();
    }
}

// Export instance
window.api = new BlackBoxAPI();
