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
        
        // Mobile functions
        this.initMobileMenu();
        this.initStatsSidebar();
        this.initBottomNav();
        this.initPullToRefresh();
        this.initResizeHandler();
        
        // Update charts on orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateChartResponsiveness(), 100);
        });
        
        // Add scanline effect
        const scanline = document.createElement('div');
        scanline.className = 'scanline';
        document.body.appendChild(scanline);
        
        // Welcome animation
        setTimeout(() => {
            if (window.effects) {
                window.effects.showNotification('Welcome to BlackBoxAPI, Aerivue! 🔮', 'success');
            }
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
        
        // Save settings
        const saveSettings = document.getElementById('save-settings');
        if (saveSettings) {
            saveSettings.addEventListener('click', () => this.saveSettings());
        }
        
        // Rotate secret
        const rotateSecret = document.getElementById('rotate-secret');
        if (rotateSecret) {
            rotateSecret.addEventListener('click', () => {
                const newSecret = prompt('Enter new JWT secret:');
                if (newSecret) {
                    document.getElementById('jwt-secret').value = newSecret;
                    window.effects.showNotification('Secret updated!', 'success');
                }
            });
        }
    }
    
    switchPage(page) {
        // Update active nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) link.classList.add('active');
        });
        
        // Update bottom nav active
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) item.classList.add('active');
        });
        
        // Update active page
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        const targetPage = document.getElementById(page);
        if (targetPage) targetPage.classList.add('active');
        
        this.currentPage = page;
        
        // Load page data
        switch(page) {
            case 'dashboard':
                this.loadDashboardData();
                this.loadActivity();
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
        
        // Close mobile menu if open
        const nav = document.querySelector('.glass-nav');
        const menuToggle = document.getElementById('mobileMenuToggle');
        const overlay = document.getElementById('mobileOverlay');
        if (nav && nav.classList.contains('open')) {
            nav.classList.remove('open');
            if (menuToggle) menuToggle.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
            document.body.style.overflow = '';
        }
    }
    
    async loadInitialData() {
        await this.loadDashboardData();
        await this.loadActivity();
        
        // Set default dates for analytics
        const today = new Date();
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');
        if (startDate) startDate.value = weekAgo.toISOString().split('T')[0];
        if (endDate) endDate.value = today.toISOString().split('T')[0];
    }
    
    async loadDashboardData() {
        try {
            // Simulate API call
            const stats = {
                total_requests: 15234,
                active_users: 1247,
                active_bots: 8,
                requests_over_time: {
                    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                    values: Array.from({length: 24}, () => Math.floor(Math.random() * 400) + 100)
                },
                service_distribution: [5234, 3421, 2341, 1892, 2346]
            };
            
            // Animate numbers
            this.animateNumber('total-requests', stats.total_requests);
            this.animateNumber('active-users', stats.active_users);
            this.animateNumber('active-bots', stats.active_bots);
            
            // Update charts
            if (window.chartManager) {
                window.chartManager.updateRequestsData(stats.requests_over_time);
                window.chartManager.updateServicesData(stats.service_distribution);
            }
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }
    
    async loadActivity() {
        try {
            const activities = [
                { level: 'info', service: 'Number API', message: 'User 1234567890 searched number', time: 'Just now' },
                { level: 'success', service: 'Aadhar API', message: 'Successfully fetched records', time: '2 min ago' },
                { level: 'warning', service: 'IMEI API', message: 'Rate limit approaching', time: '5 min ago' },
                { level: 'info', service: 'Bot Manager', message: 'New bot added: @blackbox_bot', time: '12 min ago' },
                { level: 'error', service: 'RTO API', message: 'Invalid RC number format', time: '25 min ago' }
            ];
            
            const timeline = document.getElementById('activity-timeline');
            if (timeline) {
                timeline.innerHTML = activities.map(act => `
                    <div class="timeline-item">
                        <div class="timeline-icon">
                            <i class="fas ${this.getLogIcon(act.level)}"></i>
                        </div>
                        <div class="timeline-content">
                            <h4>${act.service}</h4>
                            <p>${act.message}</p>
                        </div>
                        <div class="timeline-time">${act.time}</div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Failed to load activity:', error);
        }
    }
    
    async loadUsers() {
        try {
            const users = [
                { telegram_id: '123456789', username: 'aerivue', first_name: 'Aerivue', points: 9999, total_searches: 1234, referral_count: 56 },
                { telegram_id: '987654321', username: 'user1', first_name: 'User One', points: 450, total_searches: 89, referral_count: 3 },
                { telegram_id: '456789123', username: 'user2', first_name: 'User Two', points: 230, total_searches: 45, referral_count: 1 }
            ];
            
            const grid = document.getElementById('users-grid');
            if (grid) {
                grid.innerHTML = users.map(user => `
                    <div class="user-card glass">
                        <div class="user-avatar-large">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${user.telegram_id}" alt="${user.username}">
                        </div>
                        <div class="user-card-info">
                            <h4>${user.first_name}</h4>
                            <p>@${user.username}</p>
                            <div class="user-stats-mini">
                                <span><i class="fas fa-coins"></i> ${user.points}</span>
                                <span><i class="fas fa-search"></i> ${user.total_searches}</span>
                                <span><i class="fas fa-users"></i> ${user.referral_count}</span>
                            </div>
                        </div>
                        <div class="user-card-actions">
                            <button onclick="window.dashboard.addPoints('${user.telegram_id}')">
                                <i class="fas fa-plus-circle"></i>
                            </button>
                            <button onclick="window.dashboard.banUser('${user.telegram_id}')">
                                <i class="fas fa-ban"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Failed to load users:', error);
        }
    }
    
    async loadBots() {
        try {
            const bots = [
                { username: 'blackbox_bot', owner_id: 'aerivue', status: 'running', search_count: 1234, created_at: new Date() },
                { username: 'ff_hack_bot', owner_id: 'user1', status: 'running', search_count: 567, created_at: new Date() },
                { username: 'info_bot', owner_id: 'user2', status: 'stopped', search_count: 89, created_at: new Date() }
            ];
            
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
                            <button onclick="window.dashboard.restartBot('${bot.username}')">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                            <button onclick="window.dashboard.removeBot('${bot.username}')">
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
            const logs = [
                { timestamp: new Date(), level: 'info', service: 'System', message: 'Server started', user_id: '-' },
                { timestamp: new Date(), level: 'info', service: 'Number API', message: 'Search performed: 9876543210', user_id: '123456789' },
                { timestamp: new Date(), level: 'warning', service: 'IMEI API', message: 'Rate limit 80%', user_id: '-' },
                { timestamp: new Date(), level: 'error', service: 'RTO API', message: 'Connection timeout', user_id: '-' }
            ];
            
            const tbody = document.getElementById('logs-tbody');
            if (tbody) {
                tbody.innerHTML = logs.map(log => `
                    <tr class="log-${log.level}">
                        <td>${this.formatTime(log.timestamp)}</td>
                        <td><span class="log-badge ${log.level}">${log.level.toUpperCase()}</span></td>
                        <td>${log.service}</td>
                        <td>${log.message}</td>
                        <td>${log.user_id}</td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Failed to load logs:', error);
        }
    }
    
    async loadAnalytics() {
        try {
            document.getElementById('success-rate').textContent = '98.7%';
            document.getElementById('avg-response').textContent = '124ms';
            document.getElementById('error-rate').textContent = '1.3%';
            document.getElementById('active-sessions').textContent = '1,247';
            
            await this.loadDetailedData();
        } catch (error) {
            console.error('Failed to load analytics:', error);
        }
    }
    
    async loadDetailedData() {
        try {
            const data = {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                values: [420, 380, 450, 520, 680, 590, 470]
            };
            
            if (window.chartManager) {
                window.chartManager.updateDetailedData(data);
            }
        } catch (error) {
            console.error('Failed to load detailed data:', error);
        }
    }
    
    async loadChartData(range) {
        try {
            let data;
            if (range === 'day') {
                data = {
                    labels: Array.from({length: 24}, (_, i) => `${i}:00`),
                    values: Array.from({length: 24}, () => Math.floor(Math.random() * 400) + 100)
                };
            } else if (range === 'week') {
                data = {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    values: Array.from({length: 7}, () => Math.floor(Math.random() * 2000) + 500)
                };
            } else {
                data = {
                    labels: Array.from({length: 30}, (_, i) => `Day ${i+1}`),
                    values: Array.from({length: 30}, () => Math.floor(Math.random() * 3000) + 1000)
                };
            }
            
            if (window.chartManager) {
                window.chartManager.updateRequestsData(data);
            }
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
            case 'success': return 'fa-check-circle';
            default: return 'fa-circle';
        }
    }
    
    // Mobile Functions
    initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const overlay = document.getElementById('mobileOverlay');
        const nav = document.querySelector('.glass-nav');
        const swipeHint = document.getElementById('swipeHint');
        
        if (!menuToggle || !nav) return;
        
        // Show swipe hint on first visit
        if (!localStorage.getItem('swipeHintShown')) {
            setTimeout(() => {
                if (swipeHint) swipeHint.classList.add('show');
                setTimeout(() => {
                    if (swipeHint) swipeHint.classList.remove('show');
                }, 3000);
                localStorage.setItem('swipeHintShown', 'true');
            }, 2000);
        }
        
        const toggleMenu = () => {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
            if (overlay) overlay.classList.toggle('active');
            
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('open')) {
                icon.className = 'fas fa-times';
                document.body.style.overflow = 'hidden';
            } else {
                icon.className = 'fas fa-bars';
                document.body.style.overflow = '';
            }
        };
        
        menuToggle.addEventListener('click', toggleMenu);
        if (overlay) overlay.addEventListener('click', toggleMenu);
        
        // Swipe to open
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            if (touchStartX < 50 && touchEndX - touchStartX > 50) {
                if (!nav.classList.contains('open')) {
                    toggleMenu();
                }
            }
        });
    }
    
    initStatsSidebar() {
        const statsToggle = document.getElementById('statsToggle');
        const statsSidebar = document.querySelector('.stats-sidebar');
        
        if (!statsToggle || !statsSidebar) return;
        
        statsToggle.addEventListener('click', () => {
            statsSidebar.classList.toggle('open');
            statsToggle.classList.toggle('active');
            
            const icon = statsToggle.querySelector('i');
            if (statsSidebar.classList.contains('open')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-chart-line';
            }
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (statsSidebar.classList.contains('open') && 
                !statsSidebar.contains(e.target) && 
                !statsToggle.contains(e.target)) {
                statsSidebar.classList.remove('open');
                statsToggle.classList.remove('active');
                statsToggle.querySelector('i').className = 'fas fa-chart-line';
            }
        });
    }
    
    initBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchPage(page);
            });
        });
    }
    
    initPullToRefresh() {
        let touchStartY = 0;
        const pullToRefresh = document.getElementById('pullToRefresh');
        let refreshing = false;
        
        if (!pullToRefresh) return;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                touchStartY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && !refreshing) {
                const pullDistance = e.touches[0].clientY - touchStartY;
                if (pullDistance > 50) {
                    pullToRefresh.classList.add('active');
                }
            }
        });
        
        document.addEventListener('touchend', async () => {
            if (pullToRefresh.classList.contains('active') && !refreshing) {
                refreshing = true;
                pullToRefresh.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Refreshing...</span>';
                
                await this.loadDashboardData();
                await this.loadActivity();
                
                setTimeout(() => {
                    pullToRefresh.classList.remove('active');
                    pullToRefresh.innerHTML = '<i class="fas fa-sync-alt"></i><span>Pull to refresh</span>';
                    refreshing = false;
                }, 1000);
            }
        });
    }
    
    initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 1025) {
                    const nav = document.querySelector('.glass-nav');
                    const menuToggle = document.getElementById('mobileMenuToggle');
                    const overlay = document.getElementById('mobileOverlay');
                    if (nav && nav.classList.contains('open')) {
                        nav.classList.remove('open');
                        if (menuToggle) menuToggle.classList.remove('active');
                        if (overlay) overlay.classList.remove('active');
                        if (menuToggle) menuToggle.querySelector('i').className = 'fas fa-bars';
                        document.body.style.overflow = '';
                    }
                }
                this.updateChartResponsiveness();
            }, 250);
        });
    }
    
    updateChartResponsiveness() {
        if (window.chartManager && window.chartManager.charts) {
            Object.values(window.chartManager.charts).forEach(chart => {
                if (chart && chart.resize) chart.resize();
            });
        }
    }
    
    // Modal Functions
    showUserModal() {
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.add('active');
    }
    
    closeModal() {
        const modal = document.getElementById('user-modal');
        if (modal) modal.classList.remove('active');
        
        // Clear inputs
        document.getElementById('user-telegram-id').value = '';
        document.getElementById('user-username').value = '';
        document.getElementById('user-points').value = '100';
    }
    
    saveUser() {
        const telegramId = document.getElementById('user-telegram-id').value;
        const username = document.getElementById('user-username').value;
        
        if (!telegramId) {
            if (window.effects) {
                window.effects.showNotification('Please enter Telegram ID', 'error');
            }
            return;
        }
        
        if (window.effects) {
            window.effects.showNotification(`User ${username || telegramId} added!`, 'success');
        }
        this.closeModal();
        this.loadUsers();
    }
    
    showBotModal() {
        const token = prompt('Enter bot token from @BotFather:');
        if (token && token.length > 10) {
            if (window.effects) {
                window.effects.showNotification('Bot added successfully!', 'success');
            }
            this.loadBots();
        } else if (token) {
            if (window.effects) {
                window.effects.showNotification('Invalid bot token', 'error');
            }
        }
    }
    
    addPoints(userId) {
        const points = prompt('Enter points to add:');
        if (points && !isNaN(points)) {
            if (window.effects) {
                window.effects.showNotification(`Added ${points} points to user`, 'success');
            }
            this.loadUsers();
        }
    }
    
    banUser(userId) {
        if (confirm('Are you sure you want to ban this user?')) {
            if (window.effects) {
                window.effects.showNotification('User banned successfully', 'success');
            }
            this.loadUsers();
        }
    }
    
    restartBot(botName) {
        if (window.effects) {
            window.effects.showNotification(`Restarting @${botName}...`, 'info');
            setTimeout(() => {
                window.effects.showNotification(`@${botName} restarted!`, 'success');
            }, 2000);
        }
    }
    
    removeBot(botName) {
        if (confirm(`Are you sure you want to remove @${botName}?`)) {
            if (window.effects) {
                window.effects.showNotification(`@${botName} removed`, 'success');
            }
            this.loadBots();
        }
    }
    
    async saveSettings() {
        if (window.effects) {
            window.effects.showNotification('Settings saved successfully!', 'success');
        }
    }
    
    async exportLogs() {
        if (window.effects) {
            window.effects.showNotification('Logs exported!', 'success');
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
        
        // Live stats update
        setInterval(() => {
            const rps = Math.floor(Math.random() * 50) + 20;
            const users = Math.floor(Math.random() * 200) + 1000;
            const latency = Math.floor(Math.random() * 100) + 50;
            
            const liveRps = document.getElementById('live-rps');
            const liveUsers = document.getElementById('live-users');
            const liveLatency = document.getElementById('live-latency');
            const cpuUsage = document.getElementById('cpu-usage');
            const ramUsage = document.getElementById('ram-usage');
            const storageUsage = document.getElementById('storage-usage');
            
            if (liveRps) liveRps.textContent = rps;
            if (liveUsers) liveUsers.textContent = users;
            if (liveLatency) liveLatency.textContent = `${latency}ms`;
            if (cpuUsage) cpuUsage.textContent = `${Math.floor(Math.random() * 30) + 10}%`;
            if (ramUsage) ramUsage.textContent = `${(Math.random() * 3 + 1).toFixed(1)}GB`;
            if (storageUsage) storageUsage.textContent = `${Math.floor(Math.random() * 100) + 100}GB`;
        }, 2000);
    }
}

// Initialize dashboard
const dashboard = new BlackBoxDashboard();
window.dashboard = dashboard;
