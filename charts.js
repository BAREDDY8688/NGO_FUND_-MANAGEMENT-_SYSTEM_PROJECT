/**
 * NGO FUND MANAGEMENT SYSTEM - CHART.JS VISUALIZER
 * Financial trends, Inflow vs Outflow, Category distributions
 */

let incomeExpenseChart = null;
let categoryDonutChart = null;

function initDashboardCharts() {
  const donations = window.dataService.getDonations();
  const expenses = window.dataService.getExpenses();

  renderIncomeExpenseChart(donations, expenses);
  renderCategoryDonutChart(expenses);
}

function renderIncomeExpenseChart(donations, expenses) {
  const ctx = document.getElementById('incomeExpenseChartCanvas');
  if (!ctx) return;

  if (incomeExpenseChart) {
    incomeExpenseChart.destroy();
  }

  const months = ['Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026'];
  const donationData = [6500, 8200, 7400, 11200, 9800, donations.reduce((s, d) => s + Number(d.amount), 0)];
  const expenseData = [4800, 5900, 6100, 8400, 7200, expenses.reduce((s, e) => s + Number(e.amount), 0)];

  incomeExpenseChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        {
          label: 'Funds Inflow (Donations)',
          data: donationData,
          backgroundColor: '#0d9488',
          borderRadius: 6,
          barPercentage: 0.6
        },
        {
          label: 'Funds Outflow (Expenses)',
          data: expenseData,
          backgroundColor: '#f59e0b',
          borderRadius: 6,
          barPercentage: 0.6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
            color: '#334155'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return ` ${context.dataset.label}: $${context.raw.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" }, color: '#64748b' }
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { family: "'Plus Jakarta Sans', sans-serif" },
            color: '#64748b',
            callback: function(val) { return '$' + val.toLocaleString(); }
          }
        }
      }
    }
  });
}

function renderCategoryDonutChart(expenses) {
  const ctx = document.getElementById('categoryDonutChartCanvas');
  if (!ctx) return;

  if (categoryDonutChart) {
    categoryDonutChart.destroy();
  }

  // Aggregate expenses by category
  const categories = {};
  expenses.forEach(exp => {
    const cat = exp.category || 'General';
    categories[cat] = (categories[cat] || 0) + Number(exp.amount || 0);
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);
  const backgroundColors = ['#0d9488', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  categoryDonutChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels.length ? labels : ['Healthcare', 'Education', 'Food Relief', 'Disaster Aid', 'Admin'],
      datasets: [{
        data: data.length ? data : [35, 25, 20, 15, 5],
        backgroundColor: backgroundColors.slice(0, Math.max(labels.length, 5)),
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: "'Plus Jakarta Sans', sans-serif", weight: '500', size: 11 },
            boxWidth: 12,
            padding: 12,
            color: '#334155'
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.raw / total) * 100);
              return ` ${context.label}: $${context.raw.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      },
      cutout: '70%'
    }
  });
}

window.initDashboardCharts = initDashboardCharts;
