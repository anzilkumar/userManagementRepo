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

    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const sortSelect = document.getElementById('sortSelect');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    const tbody = document.getElementById('usersTableBody');
    const paginationContainer = document.getElementById('paginationContainer');

    let currentPage = 1;

    const renderTable = (users) => {
        if (!users || users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-users">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => {
            const wsAccess = user.gameAccess?.wordSearch ?? true;
            const cwAccess = user.gameAccess?.crossword ?? true;
            const profileImg = user.profileImage 
                ? `<img src="${user.profileImage}" alt="avatar" class="avatar-img">` 
                : `<img src="/img/avatar.png" alt="avatar" class="avatar-img" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%23cbd5e1%22><path d=%22M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z%22/></svg>'">`;

            return `
                <tr data-user-row="${user._id}">
                    <td>${profileImg}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>
                        <span class="status-pill ${user.isBlocked ? 'danger' : 'ok'}">
                            ${user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                    </td>
                    <td>
                        <button class="admin-action game-access-btn ${wsAccess ? '' : 'disabled-game'}" data-action="toggle-game" data-game="wordSearch" data-user-id="${user._id}" type="button" title="Toggle Word Search">
                            WS: ${wsAccess ? 'ON' : 'OFF'}
                        </button>
                        <button class="admin-action game-access-btn ${cwAccess ? '' : 'disabled-game'}" data-action="toggle-game" data-game="crossword" data-user-id="${user._id}" type="button" title="Toggle Crossword">
                            CW: ${cwAccess ? 'ON' : 'OFF'}
                        </button>
                    </td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td class="actions-cell">
                        <button class="admin-action edit-action-btn edit-user-btn" data-id="${user._id}" data-username="${user.username}" data-email="${user.email}" type="button" style="display:flex; align-items:center; gap:4px;" title="Edit User">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            Edit
                        </button>
                        <button class="admin-action" data-action="block" data-user-id="${user._id}" type="button">
                            ${user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button class="admin-action danger-button" data-action="delete" data-user-id="${user._id}" type="button">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    };

    const renderPagination = (totalPages, current) => {
        if (!paginationContainer) return;
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        html += `<button class="page-btn ${current === 1 ? 'disabled' : ''}" data-page="${current - 1}">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${current === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        html += `<button class="page-btn ${current === totalPages ? 'disabled' : ''}" data-page="${current + 1}">Next</button>`;
        
        paginationContainer.innerHTML = html;
    };

    const fetchUsers = async () => {
        if (!searchInput) return;
        const query = new URLSearchParams({
            search: searchInput.value.trim(),
            filter: filterSelect.value,
            sort: sortSelect.value,
            page: currentPage
        });

        try {
            const response = await fetch(`/admin/dashboard?${query.toString()}`, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            if (data.success) {
                renderTable(data.users);
                renderPagination(data.totalPages, data.currentPage);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    if (searchInput) {
        let debounceTimer;
        const resetPageAndFetch = () => {
            currentPage = 1;
            fetchUsers();
        };

        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(resetPageAndFetch, 300);
        });

        const updateDropdownVisual = (dropdownId, value) => {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            const option = dropdown.querySelector(`.dropdown-option[data-value="${value}"]`);
            if (option) {
                dropdown.querySelector('.dropdown-selected span').textContent = option.textContent;
                dropdown.querySelectorAll('.dropdown-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
            }
        };

        const setupDropdown = (dropdownId, inputId) => {
            const dropdown = document.getElementById(dropdownId);
            if (!dropdown) return;
            const input = document.getElementById(inputId);

            dropdown.addEventListener('click', (e) => {
                const option = e.target.closest('.dropdown-option');
                if (option) {
                    input.value = option.dataset.value;
                    updateDropdownVisual(dropdownId, option.dataset.value);
                    resetPageAndFetch();
                }
                dropdown.classList.toggle('open');
            });

            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                }
            });
        };

        setupDropdown('filterDropdown', 'filterSelect');
        setupDropdown('sortDropdown', 'sortSelect');

        searchBtn.addEventListener('click', resetPageAndFetch);

        resetBtn.addEventListener('click', () => {
            searchInput.value = '';
            filterSelect.value = 'all';
            sortSelect.value = 'latest';
            updateDropdownVisual('filterDropdown', 'all');
            updateDropdownVisual('sortDropdown', 'latest');
            currentPage = 1;
            fetchUsers();
        });

        if (paginationContainer) {
            paginationContainer.addEventListener('click', (e) => {
                const btn = e.target.closest('.page-btn');
                if (!btn || btn.classList.contains('disabled') || btn.classList.contains('active')) return;
                
                currentPage = parseInt(btn.dataset.page);
                fetchUsers();
            });
        }
    }

    document.addEventListener('click', async (event) => {
        const button = event.target.closest('.admin-action');
        if (!button) return;

        if (button.dataset.action === 'delete') {
            if (!confirm('Are you sure you want to permanently delete this user?')) {
                return;
            }
        }

        button.disabled = true;

        try {
            if (button.dataset.action === 'block') {
                await request(`/admin/users/${button.dataset.userId}/block`, { method: 'POST' });
                window.location.reload();
                return;
            }

            if (button.dataset.action === 'toggle-game') {
                await request(`/admin/users/${button.dataset.userId}/game-access`, { 
                    method: 'POST',
                    body: JSON.stringify({ game: button.dataset.game })
                });
                window.location.reload();
                return;
            }

            if (button.dataset.action === 'delete') {
                await request(`/admin/users/${button.dataset.userId}`, { method: 'DELETE' });
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

    const editModal = document.getElementById('editUserModal');
    const editForm = document.getElementById('editUserForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit-user-btn');
        if (editBtn) {
            document.getElementById('editUserId').value = editBtn.dataset.id;
            document.getElementById('editUsername').value = editBtn.dataset.username;
            document.getElementById('editEmail').value = editBtn.dataset.email;
            document.getElementById('editUsernameError').textContent = '';
            document.getElementById('editEmailError').textContent = '';
            editModal?.classList.add('show');
        }
    });

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editModal?.classList.remove('show');
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('editUserId').value;
            const username = document.getElementById('editUsername').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            
            document.getElementById('editUsernameError').textContent = '';
            document.getElementById('editEmailError').textContent = '';

            const saveBtn = document.getElementById('saveEditBtn');
            saveBtn.disabled = true;
            saveBtn.textContent = 'Saving...';

            try {
                const res = await fetch(`/admin/users/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email })
                });
                const data = await res.json();
                
                if (data.success) {
                    editModal?.classList.remove('show');
                    fetchUsers();
                } else if (data.errors) {
                    if (data.errors.username) document.getElementById('editUsernameError').textContent = data.errors.username;
                    if (data.errors.email) document.getElementById('editEmailError').textContent = data.errors.email;
                } else {
                    alert(data.message || 'Failed to update user');
                }
            } catch (error) {
                console.error(error);
                alert('An error occurred');
            } finally {
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Changes';
            }
        });
    }

}());
