document.addEventListener("DOMContentLoaded", function () {
    fetch('arts.json')
        .then(response => response.json())
        .then(data => {
            const paintingsContainer = document.getElementById('paintings-container');
            const gridWrapper = document.createElement('div');
            gridWrapper.classList.add('pinterest-grid', 'mb-5');
            paintingsContainer.appendChild(gridWrapper);

            const paginationWrapper = document.createElement('nav');
            paginationWrapper.classList.add('bottomPag' ,'d-flex', 'justify-content-center');
            paginationWrapper.innerHTML = `
                <nav aria-label="Page navigation example">
                    <ul class="pagination gap-2 gap-md-3 gap-lg-5" id="pagination"></ul>
                </nav>
            `;
            paintingsContainer.appendChild(paginationWrapper);

            const searchInput = document.querySelector('.search');
            const itemsPerPage = 20;
            let currentPage = 1;
            let filteredData = data;

            function renderPage(page, dataSet) {
                gridWrapper.innerHTML = '';
                const start = (page - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                const itemsToShow = dataSet.slice(start, end);

                itemsToShow.forEach(painting => {
                    const item = document.createElement('div');
                    item.classList.add('pinterest-item');

                    const card = document.createElement('div');
                    card.classList.add('card');
                    card.style.cursor = 'pointer';

                    card.innerHTML = `
                        <img src="${painting.image}" class="card-img-top" alt="${painting.title}">
                        <div class="card-body">
                            <h5 class="card-title">${painting.title}</h5>
                            <p class="card-text">${painting.creator}</p>
                        </div>
                    `;

                    card.addEventListener('click', () => openModal(painting));
                    item.appendChild(card);
                    gridWrapper.appendChild(item);
                });
            }

            function renderPagination(dataSet) {
                const pagination = document.getElementById('pagination');
                pagination.innerHTML = '';

                const totalPages = Math.ceil(dataSet.length / itemsPerPage);

                const prevLi = document.createElement('li');
                prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
                prevLi.innerHTML = `
                    <a class="page-link bg-black text-white" href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                `;
                prevLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        currentPage--;
                        renderPage(currentPage, dataSet);
                        renderPagination(dataSet);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
                pagination.appendChild(prevLi);

                for (let i = 1; i <= totalPages; i++) {
                    const pageLi = document.createElement('li');
                    pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
                    const pageLink = document.createElement('a');
                    pageLink.className = 'page-link bg-black rounded-2 text-white';
                    pageLink.href = '#';
                    pageLink.textContent = i;
                    pageLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        currentPage = i;
                        renderPage(currentPage, dataSet);
                        renderPagination(dataSet);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    });

                    pageLi.appendChild(pageLink);
                    pagination.appendChild(pageLi);
                }

                const nextLi = document.createElement('li');
                nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
                nextLi.innerHTML = `
                    <a class="page-link bg-black text-white" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                `;
                nextLi.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                        currentPage++;
                        renderPage(currentPage, dataSet);
                        renderPagination(dataSet);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
                pagination.appendChild(nextLi);
            }

            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                filteredData = data.filter(item =>
                    item.title.toLowerCase().includes(searchTerm) ||
                    item.creator.toLowerCase().includes(searchTerm)
                );
                currentPage = 1;
                renderPage(currentPage, filteredData);
                renderPagination(filteredData);
            });

            // A-Z / Z-A FILTER BUTTON CLICK
            document.getElementById('applyFilterBtn').addEventListener('click', () => {
                const azChecked = document.getElementById('radioDefault1').checked;
                const zaChecked = document.getElementById('radioDefault2').checked;

                if (azChecked) {
                    filteredData.sort((a, b) => a.title.localeCompare(b.title));
                } else if (zaChecked) {
                    filteredData.sort((a, b) => b.title.localeCompare(a.title));
                }

                currentPage = 1;
                renderPage(currentPage, filteredData);
                renderPagination(filteredData);

                // Optional: Close the dropdown
                const dropdownToggle = document.querySelector('.dropdown-toggle');
                const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
                dropdownInstance.hide();
            });

            renderPage(currentPage, filteredData);
            renderPagination(filteredData);
        })
        .catch(error => {
            console.error('Error fetching paintings data:', error);
        });
});

function openModal(painting) {
    const modal = new bootstrap.Modal(document.getElementById('paintingModal'));
    document.getElementById('paintingModalLabel').textContent = painting.title;
    document.getElementById('paintingModalImage').src = painting.image;
    document.getElementById('paintingModalDescription').textContent = painting.description;
    modal.show();
}
