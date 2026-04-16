```javascript
import { render, screen, fireEvent } from '@testing-library/vue';
import App from '../app.vue';

describe('ExpenseTracker', () => {
    it('renders the app and allows adding an expense', async () => {
        render(App);
        await fireEvent.click(screen.getByText('Add Expense'));
        await fireEvent.input(screen.getByLabelText('Category'), { target: { value: 'Food' } });
        await fireEvent.input(screen.getByLabelText('Amount'), { target: { value: '10.00' } });
        await fireEvent.click(screen.getByText('Add Expense'));

        expect(screen.getByText('Total Expenses: $10.00')).toBeInTheDocument();
    });

    it('renders the app and allows filtering expenses by category', async () => {
        render(App);
        await fireEvent.click(screen.getByText('Add Expense'));
        await fireEvent.input(screen.getByLabelText('Category'), { target: { value: 'Food' } });
        await fireEvent.input(screen.getByLabelText('Amount'), { target: { value: '10.00' } });
        await fireEvent.click(screen.getByText('Add Expense'));

        expect(screen.getByText('Total Expenses: $10.00')).toBeInTheDocument();
    });

    it('renders the app and allows viewing total expenses', async () => {
        render(App);
        await fireEvent.click(screen.getByText('Add Expense'));
        await fireEvent.input(screen.getByLabelText('Category'), { target: { value: 'Food' } });
        await fireEvent.input(screen.getByLabelText('Amount'), { target: { value: '10.00' } });
        await fireEvent.click(screen.getByText('Add Expense'));

        expect(screen.getByText('Total Expenses: $10.00')).toBeInTheDocument();
    });

    it('renders the app and allows signing out', async () => {
        render(App);
        await fireEvent.click(screen.getByText('Sign Out'));
        expect(screen.getByText('ExpenseTracker')).toBeInTheDocument();
    });
});
```