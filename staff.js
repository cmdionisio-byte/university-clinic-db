document.addEventListener('DOMContentLoaded', function() {
    // 1. ELEMENTS
    const addModal = document.getElementById('addStaffModal');
    const viewModal = document.getElementById('viewStaffModal');
    const editModal = document.getElementById('editStaffModal');
    const addBtn = document.getElementById('add-doctor-modal-btn');
    const searchInput = document.getElementById('doctor-search-input');
    const filterSpecialty = document.getElementById('filter-specialty');
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    const limitRecords = document.getElementById('limit-records'); // NEW
    const tableBody = document.querySelector('table tbody');
    const addForm = document.getElementById('addStaffForm');
    const editForm = document.getElementById('editStaffForm');
    const sortHeaders = document.querySelectorAll('th.sortable');

    // 2. MODAL UTILS
    function showModal(modal) { if (modal) { modal.removeAttribute('hidden'); modal.style.display = 'flex'; } }
    function hideModal(modal) { if (modal) { modal.style.display = 'none'; modal.setAttribute('hidden', ''); } }

    // 3. VALIDATION
    function validateForm(event) {
        const form = event.target;
        const firstName = form.querySelector('input[name="firstname"]').value.trim();
        const lastName = form.querySelector('input[name="lastname"]').value.trim();
        const middleInit = form.querySelector('input[name="middleinit"]').value.trim();
        const contact = form.querySelector('input[name="contact"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();

        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(firstName)) { alert("Error: First Name must contain letters only."); event.preventDefault(); return; }
        if (!nameRegex.test(lastName)) { alert("Error: Last Name must contain letters only."); event.preventDefault(); return; }
        if (middleInit.length > 0 && !/^[A-Za-z]$/.test(middleInit)) { alert("Error: Middle Initial must be a single letter."); event.preventDefault(); return; }
        if (contact.length > 0 && (!/^[0-9]+$/.test(contact) || contact.length !== 11)) { alert("Error: Contact Number must be 11 digits."); event.preventDefault(); return; }
        if (email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert("Error: Invalid email address."); event.preventDefault(); return; }
    }

    if (addForm) addForm.addEventListener('submit', validateForm);
    if (editForm) editForm.addEventListener('submit', validateForm);

    // 4. BUTTONS
    if(addBtn) addBtn.addEventListener('click', () => showModal(addModal));

    if (tableBody) {
        tableBody.addEventListener('click', function(e) {
            const target = e.target.closest('button');
            if (!target) return;

            // VIEW
            if (target.classList.contains('view-btn')) {
                const data = target.dataset;
                document.getElementById('view-name').textContent = data.name || '';
                document.getElementById('view-email').textContent = data.email || '';
                document.getElementById('view-specialty').textContent = data.specialty || '';
                document.getElementById('view-address').textContent = data.address || '';
                document.getElementById('view-contact').textContent = data.contact || '';
                document.getElementById('view-sex').textContent = data.sex || '';
                document.getElementById('view-dob').textContent = data.dob || '';
                showModal(viewModal);
            }

            // EDIT
            if (target.classList.contains('edit-btn')) {
                const data = target.dataset;
                document.getElementById('edit-id').value = data.id || '';
                document.getElementById('edit-firstname').value = data.first || '';
                document.getElementById('edit-lastname').value = data.last || '';
                document.getElementById('edit-middle').value = data.middle || '';
                document.getElementById('edit-email').value = data.email || '';
                document.getElementById('edit-address').value = data.address || '';
                document.getElementById('edit-contact').value = data.contact || '';
                document.getElementById('edit-sex').value = data.sex || '';
                document.getElementById('edit-dob').value = data.dob || '';
                
                const idsString = data.specialtyids ? String(data.specialtyids) : ""; 
                const idsArray = idsString.split(',').map(id => id.trim());
                const checkboxes = document.querySelectorAll('#edit-specialty-container input[type="checkbox"]');
                checkboxes.forEach(cb => { cb.checked = idsArray.includes(cb.value); });
                
                showModal(editModal);
            }
        });
    }

    // 5. SORTING CLICK HEADERS
    sortHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const currentSort = sortBy.value;
            const sortType = this.dataset.sort; 
            let newSort = sortType;
            if (sortType === 'name_asc') { newSort = (currentSort === 'name_asc') ? 'name_desc' : 'name_asc'; }
            sortBy.value = newSort;
            fetchResults();
        });
    });

    // 6. CLOSE MODALS
    document.addEventListener('click', function(e) {
        if (e.target.closest('.close-modal-btn')) {
            hideModal(addModal); hideModal(viewModal); hideModal(editModal);
            if (addModal.style.display === 'none') { const form = document.getElementById('addStaffForm'); if(form) form.reset(); }
        }
        if (e.target === addModal) hideModal(addModal);
        if (e.target === viewModal) hideModal(viewModal);
        if (e.target === editModal) hideModal(editModal);
    });

    // 7. FETCH LOGIC
    function fetchResults() {
        const term = searchInput ? searchInput.value.trim() : '';
        const specialty = filterSpecialty ? filterSpecialty.value : '';
        const status = filterStatus ? filterStatus.value : 'Active';
        const sort = sortBy ? sortBy.value : 'newest';
        const limit = limitRecords ? limitRecords.value : '10';

        const params = new URLSearchParams();
        if(term) params.append('search', term);
        if(specialty) params.append('filter_specialty', specialty);
        if(status) params.append('filter_status', status);
        if(sort) params.append('sort_by', sort);
        if(limit) params.append('limit', limit);

        fetch(`staff.php?${params.toString()}`)
            .then(response => response.text())
            .then(html => {
                 const parser = new DOMParser();
                 const doc = parser.parseFromString(html, 'text/html');
                 const newTbody = doc.querySelector('table tbody');
                 const newPagination = doc.querySelector('.pagination');
                 
                 if(newTbody && tableBody) tableBody.innerHTML = newTbody.innerHTML;
                 const paginationDiv = document.querySelector('.pagination');
                 if(paginationDiv) paginationDiv.innerHTML = newPagination ? newPagination.innerHTML : '';
            })
            .catch(err => console.error('Error:', err));
    }

    if(searchInput) searchInput.addEventListener('input', fetchResults);
    if(filterSpecialty) filterSpecialty.addEventListener('change', fetchResults);
    if(filterStatus) filterStatus.addEventListener('change', fetchResults);
    if(sortBy) sortBy.addEventListener('change', fetchResults);
    if(limitRecords) limitRecords.addEventListener('change', fetchResults);
});