// Chart Management
class ChartManager {
    constructor() {
        this.charts = {};
        this.init();
    }
    
    init() {
        this.initRequestsChart();
        this.initServicesChart();
        this.initDetailedChart();
        this.initTrendSpark();
    }
    
    initRequestsChart() {
        const ctx = document.getElementById('requests-chart').getContext('2d');
        
        this.charts.requests = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Requests',
                    data: [],
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#a855f7'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#a0a0b0' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0b0' }
                    }
                },
                interaction: { mode: 'nearest', axis: 'x', intersect: false }
            }
        });
    }
    
    initServicesChart() {
        const ctx = document.getElementById('services-chart').getContext('2d');
        
        this.charts.services = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Number', 'Aadhar', 'IMEI', 'RTO', 'Telegram'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: [
                        '#7c3aed',
                        '#a855f7',
                        '#c084fc',
                        '#e879f9',
                        '#f0abfc'
                    ],
                    borderWidth: 0,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#a0a0b0', font: { size: 12 } }
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    initDetailedChart() {
        const ctx = document.getElementById('detailed-chart');
        if (!ctx) return;
        
        this.charts.detailed = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Requests',
                    data: [],
                    backgroundColor: 'rgba(124, 58, 237, 0.6)',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#a0a0b0' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#a0a0b0' }
                    }
                }
            }
        });
    }
    
    initTrendSpark() {
        const canvas = document.getElementById('trend-spark');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 60);
        gradient.addColorStop(0, 'rgba(124, 58, 237, 0.8)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
        
        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(30).fill(''),
                datasets: [{
                    data: [],
                    borderColor: '#7c3aed',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false } },
                elements: { point: { radius: 0 } }
            }
        });
    }
    
    updateRequestsData(data) {
        this.charts.requests.data.labels = data.labels;
        this.charts.requests.data.datasets[0].data = data.values;
        this.charts.requests.update();
    }
    
    updateServicesData(data) {
        this.charts.services.data.datasets[0].data = data;
        this.charts.services.update();
    }
    
    updateDetailedData(data) {
        this.charts.detailed.data.labels = data.labels;
        this.charts.detailed.data.datasets[0].data = data.values;
        this.charts.detailed.update();
    }
    
    updateTrendData(data) {
        this.charts.trend.data.datasets[0].data = data;
        this.charts.trend.update();
    }
}

// Initialize charts
window.chartManager = new ChartManager();
