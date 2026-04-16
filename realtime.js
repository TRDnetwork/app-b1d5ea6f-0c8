```javascript
let channels = [];

export function setupRealtime(supabase, onChange) {
    const channel = supabase.channel('expenses', { config: { presence: true } });
    channel.on('postgres_changes', { event: '*', schema: 'public' }, payload => {
        onChange(payload);
    });
    channel.subscribe();
    channels.push(channel);
}

export function teardownRealtime() {
    channels.forEach(channel => channel.unsubscribe());
    channels = [];
}
```