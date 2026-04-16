```javascript
import { setupRealtime, teardownRealtime } from './realtime.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = window.__SUPABASE_URL__;
const anonKey = window.__SUPABASE_ANON_KEY__;

if (!supabaseUrl || !anonKey) {
    document.body.innerHTML = '<div style="color: red; text-align: center;">Supabase credentials not injected</div>';
} else {
    const supabase = createClient(supabaseUrl, anonKey);
    let currentUser = null;

    async function init() {
        try {
            const { data: session } = await supabase.auth.getSession();
            if (session?.user) {
                currentUser = session.user;
                document.body.classList.add('loaded');
                renderApp();
            } else {
                renderAuthGate();
            }
        } catch (error) {
            console.error('Auth init failed:', error);
            document.body.innerHTML = '<div style="color: red; text-align: center;">Supabase credentials not injected</div>';
        } finally {
            document.querySelector('.loading').style.display = 'none';
        }
    }

    function renderAuthGate() {
        const authGate = `
            <h1>ExpenseTracker</h1>
            <form id="authForm">
                <input type="email" id="email" placeholder="Email" required>
                <input type="password" id="password" placeholder="Password" required>
                <button type="submit">Sign In</button>
            </form>
        `;
        document.getElementById('app').innerHTML = authGate;
        document.getElementById('authForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            try {
                const { user, error } = await supabase.auth.signInWithPassword({ email, password });
                if (user) {
                    currentUser = user;
                    document.body.classList.add('loaded');
                    renderApp();
                } else {
                    alert(error.message);
                }
            } catch (error) {
                console.error('Sign in failed:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }

    function renderApp() {
        const appHtml = `
            <h1>ExpenseTracker</h1>
            <form id="addForm">
                <input type="text" id="category" placeholder="Category" required>
                <input type="number" id="amount" step="0.01" placeholder="Amount" required>
                <button type="submit">Add Expense</button>
            </form>
            <h2>Total Expenses: $<span id="totalExpenses">0.00</span></h2>
            <ul id="expenses"></ul>
            <button id="signOut">Sign Out</button>
        `;
        document.getElementById('app').innerHTML = appHtml;
        document.getElementById('addForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const category = document.getElementById('category').value;
            const amount = parseFloat(document.getElementById('amount').value);
            try {
                const { data, error } = await supabase.from('app_00bf_expenses').insert([
                    { user_id: currentUser.id, category, amount }
                ]);
                if (data) {
                    renderExpenses();
                } else {
                    alert(error.message);
                }
            } catch (error) {
                console.error('Add expense failed:', error);
                alert('An error occurred. Please try again.');
            }
        });
        document.getElementById('signOut').addEventListener('click', async () => {
            await supabase.auth.signOut();
            currentUser = null;
            document.body.classList.remove('loaded');
            renderAuthGate();
        });
    }

    function renderExpenses() {
        const { data, error } = await supabase.from('app_00bf_expenses').select('*').eq('user_id', currentUser.id);
        if (data) {
            const expensesList = document.getElementById('expenses');
            expensesList.innerHTML = '';
            let total = 0;
            data.forEach(expense => {
                const li = document.createElement('li');
                li.textContent = `${expense.category}: $${expense.amount.toFixed(2)}`;
                expensesList.appendChild(li);
                total += expense.amount;
            });
            document.getElementById('totalExpenses').textContent = total.toFixed(2);
        } else if (error) {
            console.error('Fetch expenses failed:', error);
            alert('An error occurred. Please try again.');
        }
    }

    init();
}
```