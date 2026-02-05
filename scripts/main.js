
// Initialize transactions from localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Form submission
document.getElementById('transactionForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const transaction = {
        id: Date.now(),
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.querySelector('input[name="type"]:checked').value
    };

    transactions.push(transaction);
    saveTransactions();
    updateUI();

    // Reset form
    this.reset();
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('income').checked = true;

    // Show success feedback
    showNotification('✨ Transaksi berhasil ditambahkan!');
});

// Delete transaction
function deleteTransaction(id) {
    if (confirm('Yakin ingin menghapus transaksi ini?')) {
        transactions = transactions.filter(t => t.id !== id);
        saveTransactions();
        updateUI();
        showNotification('🗑️ Transaksi berhasil dihapus!');
    }
}

// Save to localStorage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Update UI
function updateUI() {
    const tbody = document.getElementById('transactionBody');

    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <div class="empty-state-icon">🌾</div>
                    <div>Belum ada transaksi. Mulai tambahkan transaksi pertama Anda!</div>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(t => `
                <tr>
                    <td>${formatDate(t.date)}</td>
                    <td>${t.description}</td>
                    <td><strong>Rp ${formatNumber(t.amount)}</strong></td>
                    <td><span class="badge badge-${t.type === 'Pemasukan' ? 'income' : 'expense'}">${t.type}</span></td>
                    <td><button class="delete-btn" onclick="deleteTransaction(${t.id})">🗑️</button></td>
                </tr>
            `).join('');
    }

    updateSummary();
}

// Update summary
function updateSummary() {
    const income = transactions
        .filter(t => t.type === 'Pemasukan')
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === 'Pengeluaran')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;

    document.getElementById('totalIncome').textContent = `Rp ${formatNumber(income)}`;
    document.getElementById('totalExpense').textContent = `Rp ${formatNumber(expense)}`;
    document.getElementById('balance').textContent = `Rp ${formatNumber(balance)}`;

    // Color balance based on value
    const balanceEl = document.getElementById('balance');
    if (balance < 0) {
        balanceEl.style.color = 'var(--sunset)';
    } else {
        balanceEl.style.color = 'var(--forest-dark)';
    }
}

// Format number with thousand separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Format date to Indonesian format
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--sage), var(--forest-medium));
        color: white;
        padding: 16px 24px;
        border-radius: 15px;
        box-shadow: 0 8px 25px var(--shadow);
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.5s ease-out;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-out';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize UI on page load
updateUI();