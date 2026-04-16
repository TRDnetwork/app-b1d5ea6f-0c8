```javascript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = window.__SUPABASE_URL__;
const anonKey = window.__SUPABASE_ANON_KEY__;

if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase credentials not injected');
}

const supabase = createClient(supabaseUrl, anonKey);

describe('Supabase API', () => {
    it('adds an expense and retrieves it', async () => {
        const { data: session } = await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
        if (!session?.user) throw new Error('User not authenticated');

        const { data, error } = await supabase.from('app_00bf_expenses').insert([
            { user_id: session.user.id, category: 'Food', amount: 10.00 }
        ]);
        if (error) throw new Error(error.message);

        const { data: retrievedData, error: retrievalError } = await supabase.from('app_00bf_expenses').select('*').eq('user_id', session.user.id);
        if (retrievalError) throw new Error(retrievalError.message);

        expect(retrievedData.length).toBe(1);
        expect(retrievedData[0].category).toBe('Food');
        expect(retrievedData[0].amount).toBe(10.00);
    });

    it('filters expenses by category', async () => {
        const { data: session } = await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
        if (!session?.user) throw new Error('User not authenticated');

        const { data, error } = await supabase.from('app_00bf_expenses').insert([
            { user_id: session.user.id, category: 'Food', amount: 10.00 },
            { user_id: session.user.id, category: 'Transportation', amount: 5.00 }
        ]);
        if (error) throw new Error(error.message);

        const { data: retrievedData, error: retrievalError } = await supabase.from('app_00bf_expenses').select('*').eq('user_id', session.user.id).eq('category', 'Food');
        if (retrievalError) throw new Error(retrievalError.message);

        expect(retrievedData.length).toBe(1);
        expect(retrievedData[0].category).toBe('Food');
    });

    it('handles error when adding an expense', async () => {
        const { data: session } = await supabase.auth.signInWithPassword({ email: 'test@example.com', password: 'password' });
        if (!session?.user) throw new Error('User not authenticated');

        try {
            await supabase.from('app_00bf_expenses').insert([
                { user_id: session.user.id, category: '', amount: 10.00 }
            ]);
        } catch (error) {
            expect(error.message).toContain('category is required');
        }
    });
});
```