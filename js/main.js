// Main Application
class BlackBoxDashboard {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentPageNum = 1;
        this.init();
    }
    
    async init() {
        this.bindEvents();
        await this.loadInitialData();
        this.startAutoRefresh();
        
        // Add scanline effect
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
        
        // Welcome animation
        setTimeout(() => {
            effects.showNotification('Welcome to BlackBoxAPI, Aerivue! 🔮', 'success');
        }, 1000);
    }
    
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.switchPage(page);
            });
        });
        
        // Refresh activity
        const refreshBtn = document.getElementById('refresh-activity');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadActivity());
        }
        
        // Add user modal
        const addUserBtn = document.getElementById('add-user');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showUserModal());
        }
        
        // Add bot
        const addBotBtn = document.getElementById('add-bot');
        if (addBotBtn) {
            addBotBtn.addEventListener('click', () => this.showBotModal());
        }
        
        // Modal close
        document.querySelectorAll('.close-modal, .cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // Save user
        const saveUser = document.querySelector('.save-user');
        if (saveUser) {
            saveUser.addEventListener('click', () => this.saveUser());
        }
        
        // Chart range buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadChartData(btn.dataset.range);
            });
        });
        
        // Apply date range
        const applyRange = document.getElementById('apply-range');
        if (applyRange) {
            applyRange.addEventListener('click', () => this.loadDetailedData());
        }
        
        // Log filters
        const logLevel = document.getElementById('log-level');
        const logSearch = document.getElementById('log-search');
        if (logLevel) logLevel.addEventListener('change', () => this.loadLogs());
        if (logSearch) logSearch.addEventListener('input', () => this.loadLogs());
        
        // Export logs
        const exportLogs = document.getElementById('export-logs');
        if (exportLogs) {
            exportLogs.addEventListener('click', () => this.exportLogs());
        }
        
        // Pagination
        const prevPage = document.getElementById('prev-page');
        const nextPage = document.getElementById('next-page');
        if (prevPage) prevPage.addEventListener('click', () => this.prevPage());
        if (nextPage) nextPage.addEventListener('click', () => this.nextPage());
        
        // Settings save
        const saveSettings = document.getElementById('save-settings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }
    }
    
    switchPage(page) {
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) link.classList.add('active');
        });
        
        // Update active page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(page).classList.add('active');
        
        this.currentPage = page;
        
        // Load page data
        switch(page) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'logs':
                this.loadLogs();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'bots':
                this.loadBots();
                break;
        }
    }
    
    async loadInitialData() {
        await this.loadDashboardData();
        await this.loadActivity();
    }
    
    async loadDashboardData() {
        try {
            const stats = await api.fetchStats();
            
            // Animate numbers
            this.animateNumber('total-requests', stats.total_requests);
            this.animateNumber('active-users', stats.active_users);
            this.animateNumber('active-bots', stats.active_bots);
            
            // Update charts
            chartManager.updateRequestsData(stats.requests_over_time);
            chartManager.updateServicesData(stats.service_distribution);
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            effects.showNotification('Failed to load dashboard data', 'error');
        }
    }
    
    async loadActivity() {
        try {
            const logs = await api.fetchLogs({ limit: 10 });
            const timeline = document.getElementById('activity-timeline');
            
            if (timeline) {
                timeline.innerHTML = logs.map(log => `
                    <div class="timeline-item">
                        <div class="timeline-icon">
                            <i class="fas ${this.getLogIcon(log.level)}"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>${log.service || 'System'}</h4>
                            <p>${log.message}</p>
                        </div>
                        <div class="timeline-time">${this.formatTime(log.timestamp)}</div>
                    </div>
                `).join('');
            }
            
        } catch (error) {
            console.error('Failed to load activity:', error);
        }
    }
    
    async loadUsers() {
        try {
            const data = await api.fetchUsers(this.currentPageNum);
            const grid = document.getElementById('users-grid');
            
            if (grid) {
                grid.innerHTML = data.users.map(user => `
                    <div class="user-card glass">
                        <div class="user-avatar-large">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.telegram_id}" alt="${user.username}">
                        </div>
                        <div class="user-card-info">
                            <h4>${user.first_name || user.username || 'User'}</h4>
                            <p>@${user.username || 'unknown'}</p>
                            <div class="user-stats-mini">
                                <span><i class="fas fa-coins"></i> ${user.points}</span>
                                <span><i class="fas fa-search"></i> ${user.total_searches}</span>
                                <span><i class="fas fa-users"></i> ${user.referral_count}</span>
                            </div>
                        </div>
                        <div class="user-card-actions">
                            <button onclick="dashboard.addPoints('${user.telegram_id}')">
                                <i class="fas fa-plus-circle"></i>
                            </button>
                            <button onclick="dashboard.banUser('${user.telegram_id}')">
                                <i class="fas fa-ban"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
                
                document.getElementById('page-info').textContent = `Page ${data.page} of ${data.total_pages}`;
            }
            
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }
    
    async loadBots() {
        try {
            const bots = await api.fetchBots();
            const grid = document.getElementById('bots-grid');
            
            if (grid) {
                grid.innerHTML = bots.map(bot => `
                    <div class="bot-card glass">
                        <div class="bot-icon">
                            <i class="fas fa-robot"></i>
                            <div class="bot-status ${bot.status === 'running' ? 'online' : 'offline'}"></div>
                        </div>
                        <div class="bot-info">
                            <h4>@${bot.username}</h4>
                            <p>Owner: ${bot.owner_id}</p>
                            <div class="bot-stats">
                                <span><i class="fas fa-search"></i> ${bot.search_count} searches</span>
                                <span><i class="fas fa-calendar"></i> ${new Date(bot.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div class="bot-actions">
                            <button onclick="dashboard.restartBot('${bot.token}')">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button onclick="dashboard.removeBot('${bot.token}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
            
        } catch (error) {
            console.error('Failed to load bots:', error);
        }
    }
    
    async loadLogs() {
        try {
            const level = document.getElementById('log-level')?.value || 'all';
            const search = document.getElementById('log-search')?.value || '';
            
            const logs = await api.fetchLogs({ level, search, page: this.currentPageNum, limit: 50 });
            const tbody = document.getElementById('logs-tbody');
            
            if (tbody) {
                tbody.innerHTML = logs.map(log => `
                    <tr class="log-${log.level}">
                        <td>${this.formatTime(log.timestamp)}</td>
                        <td><span class="log-badge ${log.level}">${log.level.toUpperCase()}</span></td>
                        <td>${log.service || '-'}</td>
                        <td>${log.message}</td>
                        <td>${log.user_id || '-'}</td>
                    </tr>
                `).join('');
                
                document.getElementById('page-info').textContent = `Page ${logs.page} of ${logs.total_pages}`;
            }
            
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }
    
    async loadAnalytics() {
        try {
            const stats = await api.fetchStats();
            
            document.getElementById('success-rate').textContent = `${stats.success_rate}%`;
            document.getElementById('avg-response').textContent = `${stats.avg_response_time}ms`;
            document.getElementById('error-rate').textContent = `${stats.error_rate}%`;
            document.getElementById('active-sessions').textContent = stats.active_sessions;
            
            chartManager.updateTrendData(stats.trend_data);
            await this.loadDetailedData();
            
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }
    
    async loadDetailedData() {
        const startDate = document.getElementById('start-date')?.value;
        const endDate = document.getElementById('end-date')?.value;
        
        try {
            const data = await api.fetchStats({ start_date: startDate, end_date: endDate });
            chartManager.updateDetailedData(data.detailed_stats);
            
        } catch (error) {
            console.error('Failed to load detailed data:', error);
        }
    }
    
    async loadChartData(range) {
        try {
            const data = await api.fetchStats({ range });
            chartManager.updateRequestsData(data.requests_over_time);
            
        } catch (error) {
            console.error('Failed to load chart data:', error);
        }
    }
    
    animateNumber(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const start = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * this.easeOutCubic(progress));
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        
        return date.toLocaleDateString();
    }
    
    getLogIcon(level) {
        switch(level) {
            case 'info': return 'fa-info-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'error': return 'fa-skull';
            default: return 'fa-circle';
        }
    }
    
    showUserModal() {
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.add('active');
    }
    
    showBotModal() {
        const token = prompt('Enter bot token from @BotFather:');
        if (token) {
            api.addBot(token, 'aerivue').then(() => {
                effects.showNotification('Bot added successfully!', 'success');
                this.loadBots();
            }).catch(() => {
                effects.showNotification('Failed to add bot', 'error');
            });
        }
    }
    
    closeModal() {
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.remove('active');
    }
    
    async saveUser() {
        const telegramId = document.getElementById('user-telegram-id').value;
        const username = document.getElementById('user-username').value;
        const role = document.getElementById('user-role').value;
        const points = document.getElementById('user-points').value;
        
        if (!telegramId) {
            effects.showNotification('Please enter Telegram ID', 'error');
            return;
        }
        
        try {
            await api.addUser({ telegram_id: telegramId, username, role, points });
            effects.showNotification('User added successfully!', 'success');
            this.closeModal();
            this.loadUsers();
            
        } catch (error) {
            effects.showNotification('Failed to add user', 'error');
        }
    }
    
    async addPoints(userId) {
        const points = prompt('Enter points to add:');
        if (points) {
            try {
                await api.addPoints(userId, parseInt(points));
                effects.showNotification(`Added ${points} points to user`, 'success');
                this.loadUsers();
            } catch (error) {
                effects.showNotification('Failed to add points', 'error');
            }
        }
    }
    
    async banUser(userId) {
        if (confirm('Are you sure you want to ban this user?')) {
            try {
                await api.banUser(userId);
                effects.showNotification('User banned successfully', 'success');
                this.loadUsers();
            } catch (error) {
                effects.showNotification('Failed to ban user', 'error');
            }
        }
    }
    
    async restartBot(token) {
        try {
            await api.restartBot(token);
            effects.showNotification('Bot restarted successfully', 'success');
            this.loadBots();
        } catch (error) {
            effects.showNotification('Failed to restart bot', 'error');
        }
    }
    
    async removeBot(token) {
        if (confirm('Are you sure you want to remove this bot?')) {
            try {
                await api.removeBot(token);
                effects.showNotification('Bot removed successfully', 'success');
                this.loadBots();
            } catch (error) {
                effects.showNotification('Failed to remove bot', 'error');
            }
        }
    }
    
    async saveSettings() {
        const settings = {
            rate_limit: document.getElementById('rate-limit')?.value,
            max_size: document.getElementById('max-size')?.value,
            enable_cache: document.getElementById('enable-cache')?.checked,
            alert_channel: document.getElementById('alert-channel')?.value,
            report_email: document.getElementById('report-email')?.value
        };
        
        try {
            await api.updateSettings(settings);
            effects.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            effects.showNotification('Failed to save settings', 'error');
        }
    }
    
    async exportLogs() {
        try {
            const logs = await api.fetchLogs({ limit: 10000 });
            const dataStr = JSON.stringify(logs, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `blackboxapi-logs-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            effects.showNotification('Logs exported successfully!', 'success');
        } catch (error) {
            effects.showNotification('Failed to export logs', 'error');
        }
    }
    
    prevPage() {
        if (this.currentPageNum > 1) {
            this.currentPageNum--;
            this.refreshCurrentPage();
        }
    }
    
    nextPage() {
        this.currentPageNum++;
        this.refreshCurrentPage();
    }
    
    refreshCurrentPage() {
        switch(this.currentPage) {
            case 'users': this.loadUsers(); break;
            case 'logs': this.loadLogs(); break;
        }
    }
    
    startAutoRefresh() {
        setInterval(() => {
            if (this.currentPage === 'dashboard') {
                this.loadDashboardData();
                this.loadActivity();
            }
        }, 30000);
    }
}

// Initialize dashboard
const dashboard = new BlackBoxDashboard();
window.dashboard = dashboard;
