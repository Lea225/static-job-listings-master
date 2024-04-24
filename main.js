document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('[data-filter]');
    const clearButton = document.querySelector('.clear');
    const selectedFiltersDiv = document.getElementById('selected-filters');
    const activeFilters = {}; // Pour stocker les filtres actifs

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value');

            // Mettre à jour les filtres actifs
            if (activeFilters[filterType] === filterValue) {
                delete activeFilters[filterType]; // Si le filtre est déjà actif, le supprimer
            } else {
                activeFilters[filterType] = filterValue; // Sinon, ajouter le filtre
            }

            // Mettre à jour la div des filtres sélectionnés
            updateSelectedFilters(activeFilters);

            // Filtrer les offres d'emploi
            filterJobs(activeFilters);
        });
    });

    clearButton.addEventListener('click', function(e) {
        e.preventDefault();
        for (const key in activeFilters) {
            delete activeFilters[key];
        }
        updateSelectedFilters(activeFilters);
        filterJobs(activeFilters);
    });

    function updateSelectedFilters(filters) {
        selectedFiltersDiv.innerHTML = '';

        // Vérifie s'il y a des filtres actifs
        const hasActiveFilters = Object.keys(filters).length > 0;

        if (hasActiveFilters) {
            selectedFiltersDiv.style.display = 'flex'; // Affiche la div des filtres sélectionnés
        } else {
            selectedFiltersDiv.style.display = 'none'; // Cache la div des filtres sélectionnés s'il n'y a pas de filtres actifs
        }

        for (const [key, value] of Object.entries(filters)) {
            const filterSpan = document.createElement('span');
            filterSpan.classList.add('filter-item');

            const filterText = document.createElement('span');
            filterText.textContent = `${value}`;
            filterSpan.appendChild(filterText);

            const removeIcon = document.createElement('img');
            removeIcon.src = 'images/icon-remove.svg';
            removeIcon.alt = 'Remove filter';
            removeIcon.classList.add('remove-icon');
            removeIcon.addEventListener('click', function() {
                delete filters[key];
                updateSelectedFilters(filters);
                filterJobs(filters);
            });

            filterSpan.appendChild(removeIcon);

            selectedFiltersDiv.appendChild(filterSpan);
        }

        // Rend visible ou invisible le bouton "Clear" en fonction de la présence de filtres actifs
        if (hasActiveFilters) {
            clearButton.style.display = 'block'; // Affiche le bouton "Clear" s'il y a des filtres actifs
        } else {
            clearButton.style.display = 'none'; // Cache le bouton "Clear" s'il n'y a pas de filtres actifs
        }
    }

    function filterJobs(filters) {
        const items = document.querySelectorAll('.item');

        items.forEach(item => {
            const leftItems = item.querySelector('.left-items');
            const rightItems = item.querySelector('.right-items');

            const isMatchingLeft = checkFilter(leftItems, filters);
            const isMatchingRight = checkFilter(rightItems, filters);

            if (isMatchingLeft || isMatchingRight) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function checkFilter(element, filters) {
        const buttons = element.querySelectorAll('button');

        for (const [key, value] of Object.entries(filters)) {
            let hasFilter = false;

            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                const btnFilterType = button.getAttribute('data-filter');
                const btnFilterValue = button.getAttribute('data-value');

                if (btnFilterType === key && (value === 'all' || btnFilterValue === value)) {
                    hasFilter = true;
                    break;
                }
            }

            if (!hasFilter) {
                return false;
            }
        }

        return true;
    }
});
