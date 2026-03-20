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
    }
    
    initRequestsChart() {
        const ctx = document.getElementById('requests-chart');
        if (!ctx) return;
        
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
                    pointHoverRadius: 6
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
                }
            }
        });
    }
    
    initServicesChart() {
        const ctx = document.getElementById('services-chart');
        if (!ctx) return;
        
        this.charts.services = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Number', 'Aadhar', 'IMEI', 'RTO', 'Telegram'],
                datasets: [{
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: ['#7c3aed', '#a855f7', '#c084fc', '#e879f9', '#f0abfc'],
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
        
        this.charts.detailed = new Chart(ctx, {
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
    
    updateRequestsData(data) {
        if (this.charts.requests) {
            this.charts.requests.data.labels = data.labels;
            this.charts.requests.data.datasets[0].data = data.values;
            this.charts.requests.update();
        }
    }
    
    updateServicesData(data) {
        if (this.charts.services) {
            this.charts.services.data.datasets[0].data = data;
            this.charts.services.update();
        }
    }
    
    updateDetailedData(data) {
        if (this.charts.detailed) {
            this.charts.detailed.data.labels = data.labels;
            this.charts.detailed.data.datasets[0].data = data.values;
            this.charts.detailed.update();
        }
    }
}

window.chartManager = new ChartManager();
