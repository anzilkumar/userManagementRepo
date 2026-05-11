(function () {
    const request = async (url, options = {}) => {
        const response = await fetch(url, {
            headers: { 'Content-Type': 'application/json' },
            ...options
        });
        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Admin action failed');
        }

        return data;
    };

    document.addEventListener('click', async (event) => {
        const button = event.target.closest('.admin-action');
        if (!button) return;

        button.disabled = true;

        try {
            if (button.dataset.action === 'block') {
                await request(`/admin/users/${button.dataset.userId}/block`, { method: 'POST' });
                window.location.reload();
                return;
            }

            if (button.dataset.action === 'scoreboard-visibility') {
                await request(`/admin/users/${button.dataset.userId}/scoreboard-visibility`, { method: 'POST' });
                window.location.reload();
                return;
            }

            if (button.dataset.action === 'delete-score') {
                await request(`/admin/scores/${button.dataset.scoreId}`, { method: 'DELETE' });
                document.querySelector(`[data-score-row="${button.dataset.scoreId}"]`)?.remove();
            }
        } catch (error) {
            button.disabled = false;
            alert(error.message);
        }
    });
}());
