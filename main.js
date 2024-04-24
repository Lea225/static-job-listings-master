document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('[data-filter]');
    const activeFilters = {}; // Pour stocker les filtres actifs

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value');
            
            // Mettre à jour les filtres actifs
            activeFilters[filterType] = filterValue;
            
            // Mettre à jour la div des filtres sélectionnés
            updateSelectedFilters(activeFilters);
            
            // Filtrer les offres d'emploi
            filterJobs(activeFilters);
        });
    });

    function updateSelectedFilters(filters) {
        const selectedFiltersDiv = document.getElementById('selected-filters');
        selectedFiltersDiv.innerHTML = '';

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

        // Ajout du bouton "Clear"
        if (hasActiveFilters) {
            const clearButton = document.createElement('a');
            clearButton.textContent = 'Clear';
            clearButton.classList.add('clear-button');
            clearButton.addEventListener('click', function() {
                for (const key in filters) {
                    delete filters[key];
                }
                updateSelectedFilters(filters);
                filterJobs({}); // Filtrer tous les éléments
            });
            selectedFiltersDiv.appendChild(clearButton);
        }
    }

    function filterJobs(filters) {
        const items = document.querySelectorAll('.item');

        items.forEach(item => {
            const leftItems = item.querySelector('.left-items');
            const rightItems = item.querySelector('.right-items');
                
            const isMatching = checkFilter(leftItems, filters) || checkFilter(rightItems, filters);

            if (Object.keys(filters).length === 0 || isMatching) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    function checkFilter(element, filters) {
        const buttons = element.querySelectorAll('button');

        for (const [key, value] of Object.entries(filters)) {
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                const btnFilterType = button.getAttribute('data-filter');
                const btnFilterValue = button.getAttribute('data-value');

                if (btnFilterType === key && (value === 'all' || btnFilterValue === value)) {
                    return true;
                }
            }
        }
        
        return false;
    }
});
