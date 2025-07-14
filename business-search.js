/**
 * Google Maps Places API Business Search (New API)
 * 
 * Clean implementation using Place.searchByText() - no legacy code
 */

class BusinessPlacesSearch {
    constructor() {
        this.searchTimeout = null;
        this.wire = null;
        this.countryMap = {};
        this.countriesList = [];
        this.Place = null;
    }

    /**
     * Initialize the business places search
     */
    init(wire, countryMap, countriesList) {
        this.wire = wire;
        this.countryMap = countryMap;
        this.countriesList = countriesList;

        this.initGooglePlaces();
        this.initBusinessSearch();
        this.setupCleanup();
    }

    /**
     * Initialize Google Places API
     */
    async initGooglePlaces() {
        try {
            if (!window.google || !window.google.maps) {
                console.error('Google Maps JavaScript API is not loaded');
                return;
            }

            const { Place } = await google.maps.importLibrary("places");
            this.Place = Place;
        } catch (error) {
            console.error('Failed to initialize Google Places API:', error);
        }
    }

    /**
     * Initialize business search functionality
     */
    initBusinessSearch() {
        // Handle business search
        this.wire.$watch('businessSearchQuery', (value) => {
            // Clear previous timeout
            if (this.searchTimeout) {
                clearTimeout(this.searchTimeout);
            }

            // Clear results if query is empty
            if (!value || value.trim().length < 3) {
                this.displayBusinessSearchResults([]);
                return;
            }

            // Debounce search
            this.searchTimeout = setTimeout(async () => {
                if (value.trim().length >= 3) {
                    try {
                        const results = await this.searchBusinesses(value.trim());
                        this.displayBusinessSearchResults(results, value.trim());
                    } catch (error) {
                        console.error('Business search failed:', error);
                        this.displayBusinessSearchResults([], value.trim());
                    }
                }
            }, 500);
        });
    }

    /**
     * Search for businesses using new Place.searchByText() API
     */
    async searchBusinesses(query) {
        if (!this.Place) {
            console.error('Place class not loaded');
            throw new Error('Place class not loaded');
        }

        try {
            const request = {
                textQuery: query,
                fields: [
                    'id', 'displayName', 'formattedAddress', 'location',
                    'nationalPhoneNumber', 'websiteURI', 'businessStatus',
                    'rating', 'userRatingCount', 'types', 'addressComponents',
                    'googleMapsURI', 'primaryType', 'regularOpeningHours'
                ],
                maxResultCount: 8
            };

            // Add location bias for selected country if available
            if (this.wire.selectedCountry && this.countryMap[this.wire.selectedCountry]) {
                request.region = this.countryMap[this.wire.selectedCountry];
            }
            // If no country selected, search globally without restriction

            const { places } = await this.Place.searchByText(request);
            
            if (!places || places.length === 0) {
                return [];
            }

            return places.map(place => this.formatPlace(place));

        } catch (error) {
            console.error('Error searching businesses:', error);
            throw error;
        }
    }

    /**
     * Format place data (clean new API format)
     */
    formatPlace(place) {
        // Extract coordinates from the working location structure
        const latitude = place.Dg?.location?.lat || null;
        const longitude = place.Dg?.location?.lng || null;

        const formatted = {
            place_id: place.id,
            name: place.displayName || '',
            formatted_address: place.formattedAddress || '',
            phone: place.nationalPhoneNumber || '',
            website: place.websiteURI || '',
            business_status: place.businessStatus || '',
            rating: place.rating || 0,
            user_ratings_total: place.userRatingCount || 0,
            types: place.types || [],
            latitude: latitude,
            longitude: longitude,
            url: place.googleMapsURI || '',
            primary_type: place.primaryType || '',
            address_components: this.extractAddressComponents(place.addressComponents),
            opening_hours: this.extractOpeningHours(place.regularOpeningHours)
        };

        return formatted;
    }

    /**
     * Extract address components
     */
    extractAddressComponents(components) {
        const extracted = {
            street_number: '',
            route: '',
            locality: '',
            administrative_area_level_1: '',
            country: '',
            postal_code: ''
        };

        if (components && Array.isArray(components)) {
            components.forEach(component => {
                const types = component.types || [];
                if (types.includes('street_number')) {
                    extracted.street_number = component.longText || '';
                }
                if (types.includes('route')) {
                    extracted.route = component.longText || '';
                }
                if (types.includes('locality')) {
                    extracted.locality = component.longText || '';
                }
                if (types.includes('administrative_area_level_1')) {
                    extracted.administrative_area_level_1 = component.longText || '';
                }
                if (types.includes('country')) {
                    extracted.country = component.longText || '';
                }
                if (types.includes('postal_code')) {
                    extracted.postal_code = component.longText || '';
                }
            });
        }

        return extracted;
    }

    /**
     * Extract opening hours
     */
    extractOpeningHours(openingHours) {
        if (!openingHours) return null;
        
        return {
            is_open: null, // Would need currentOpeningHours for this
            weekday_text: openingHours.weekdayDescriptions || []
        };
    }

    /**
     * Display business search results as dropdown
     */
    displayBusinessSearchResults(results, searchQuery = '') {
        const resultsContainer = document.getElementById('businessSearchResults');
        const noResultsFallback = document.getElementById('noResultsFallback');

        // Hide no results fallback first
        if (noResultsFallback) {
            noResultsFallback.classList.add('hidden');
        }

        if (!resultsContainer) {
            console.error('Business search results container not found');
            return;
        }

        if (!results || results.length === 0) {
            resultsContainer.innerHTML = '';

            // Show no results fallback if there was a search query
            if (searchQuery && searchQuery.length >= 3 && noResultsFallback) {
                noResultsFallback.classList.remove('hidden');
            }
            return;
        }

        // Create clean dropdown results
        const resultsHtml = results.map((business) => `
            <div class="px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-700 cursor-pointer border-b border-gray-100 dark:border-zinc-700 last:border-b-0" onclick="window.businessPlacesSearch.selectBusiness('${business.place_id}')">
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            ${business.name || 'Unknown Business'}
                        </div>
                        <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                            ${business.formatted_address || 'No address available'}
                        </div>
                        ${business.rating ? `
                            <div class="flex items-center mt-1">
                                <span class="text-xs text-yellow-600 dark:text-yellow-400 mr-1">★ ${business.rating}</span>
                                ${business.user_ratings_total ? `
                                    <span class="text-xs text-gray-500 dark:text-gray-400">(${business.user_ratings_total.toLocaleString()})</span>
                                ` : ''}
                            </div>
                        ` : ''}
                    </div>
                    ${business.business_status === 'OPERATIONAL' ? `
                        <span class="text-xs text-green-600 dark:text-green-400 ml-2">Open</span>
                    ` : business.business_status ? `
                        <span class="text-xs text-red-600 dark:text-red-400 ml-2">Closed</span>
                    ` : ''}
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = `
            <div class="mt-1 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-md shadow-lg max-h-34 overflow-y-auto">
                ${resultsHtml}
            </div>
        `;
    }

    /**
     * Select a business from search results
     */
    async selectBusiness(placeId) {
        if (!this.Place) {
            console.error('Place class not loaded');
            return;
        }

        try {
            const place = new this.Place({ id: placeId });
            await place.fetchFields({
                fields: [
                    'id', 'displayName', 'formattedAddress', 'location',
                    'nationalPhoneNumber', 'websiteURI', 'businessStatus',
                    'rating', 'userRatingCount', 'types', 'addressComponents',
                    'googleMapsURI', 'primaryType', 'regularOpeningHours'
                ]
            });

            const businessData = this.formatPlace(place);
            this.selectBusinessData(businessData);

        } catch (error) {
            console.error('Failed to get business details:', error);
        }
    }

    /**
     * Handle business selection
     */
    selectBusinessData(businessData) {
        if (this.wire && this.wire.setBusinessFromGooglePlaces) {
            this.wire.setBusinessFromGooglePlaces(businessData);
        }
    }

    /**
     * Setup cleanup when component is removed
     */
    setupCleanup() {
        document.addEventListener('livewire:navigating', () => {
            this.cleanup();
        });
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = null;
        }
    }
}

// Create global instance
window.businessPlacesSearch = new BusinessPlacesSearch();

// Export for module usage
export default BusinessPlacesSearch;
