# Google Places API Business Search

A clean, modern JavaScript library for searching businesses using the Google Places API (New API) with Livewire 3 integration.

## Features

- ✨ **Modern API**: Uses the new Google Places API (`Place.searchByText()`)
- 🔍 **Real-time Search**: Debounced search with 500ms delay
- 🌍 **Country Filtering**: Optional country-specific search results
- 📱 **Responsive UI**: Clean dropdown interface with dark mode support
- ⚡ **Livewire Integration**: Seamless integration with Livewire 3 components
- 🛡️ **Error Handling**: Comprehensive error handling and fallbacks
- 🎯 **Rich Data**: Includes ratings, reviews, opening hours, and contact info
- 🧹 **Memory Management**: Proper cleanup and resource management

## Installation

### 1. Include Google Maps JavaScript API

Add the Google Maps JavaScript API to your HTML:

```html
<script async defer 
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
</script>
```

### 2. Include the Business Search Script

```html
<script src="path/to/business-search.js"></script>
```

Or use as ES6 module:

```javascript
import BusinessPlacesSearch from './business-search.js';
```

## Usage

### Basic Setup

```javascript
// Initialize the search
const countryMap = {
    'US': 'us',
    'CA': 'ca',
    'GB': 'gb'
    // Add more countries as needed
};

const countriesList = ['US', 'CA', 'GB'];

// Initialize with Livewire component
window.businessPlacesSearch.init(wire, countryMap, countriesList);
```

### HTML Structure

Your HTML should include these elements:

```html
<!-- Search input -->
<input type="text" 
       wire:model.live="businessSearchQuery" 
       placeholder="Search for businesses...">

<!-- Results container -->
<div id="businessSearchResults"></div>

<!-- No results fallback -->
<div id="noResultsFallback" class="hidden">
    <p>No businesses found for your search.</p>
</div>
```

### Livewire Component Integration

In your Livewire component:

```php
<?php

class BusinessSearchComponent extends Component
{
    public $businessSearchQuery = '';
    public $selectedCountry = null;
    
    public function setBusinessFromGooglePlaces($businessData)
    {
        // Handle the selected business data
        $this->selectedBusiness = $businessData;
        
        // Clear search
        $this->businessSearchQuery = '';
        
        // Process business data as needed
        $this->processBusiness($businessData);
    }
    
    protected function processBusiness($data)
    {
        // Your business logic here
        // Access data like: $data['name'], $data['formatted_address'], etc.
    }
}
```

## API Reference

### Constructor

```javascript
const businessSearch = new BusinessPlacesSearch();
```

### Methods

#### `init(wire, countryMap, countriesList)`

Initialize the business search functionality.

**Parameters:**
- `wire` (Object): Livewire component instance
- `countryMap` (Object): Mapping of country codes to region codes
- `countriesList` (Array): List of available countries

#### `searchBusinesses(query)`

Search for businesses using the Google Places API.

**Parameters:**
- `query` (String): Search query (minimum 3 characters)

**Returns:** Promise resolving to array of formatted business objects

#### `selectBusiness(placeId)`

Select a business by its place ID and fetch detailed information.

**Parameters:**
- `placeId` (String): Google Places API place ID

#### `cleanup()`

Clean up resources and timeouts.

### Business Data Format

The library returns business data in the following format:

```javascript
{
    place_id: "ChIJ...",
    name: "Business Name",
    formatted_address: "123 Main St, City, State 12345",
    phone: "+1 (555) 123-4567",
    website: "https://example.com",
    business_status: "OPERATIONAL",
    rating: 4.5,
    user_ratings_total: 150,
    types: ["restaurant", "food", "establishment"],
    latitude: 40.7128,
    longitude: -74.0060,
    url: "https://maps.google.com/...",
    primary_type: "restaurant",
    address_components: {
        street_number: "123",
        route: "Main St",
        locality: "City",
        administrative_area_level_1: "State",
        country: "Country",
        postal_code: "12345"
    },
    opening_hours: {
        is_open: null,
        weekday_text: [
            "Monday: 9:00 AM – 5:00 PM",
            "Tuesday: 9:00 AM – 5:00 PM",
            // ...
        ]
    }
}
```

## Configuration

### Country Mapping

Configure country-specific search by providing a country map:

```javascript
const countryMap = {
    'US': 'us',
    'CA': 'ca',
    'GB': 'gb',
    'AU': 'au',
    'DE': 'de',
    'FR': 'fr',
    'IT': 'it',
    'ES': 'es',
    'JP': 'jp',
    'CN': 'cn',
    'IN': 'in',
    'BR': 'br'
};
```

### Search Options

You can customize the search behavior by modifying these properties:

```javascript
// Minimum query length (default: 3)
const MIN_QUERY_LENGTH = 3;

// Search debounce delay (default: 500ms)
const SEARCH_DELAY = 500;

// Maximum results (default: 8)
const MAX_RESULTS = 8;
```

## Styling

The library generates HTML with the following CSS classes for styling:

```css
/* Results container */
.bg-white.dark\:bg-zinc-800 { /* Main container */ }

/* Individual result items */
.hover\:bg-gray-100.dark\:hover\:bg-zinc-700 { /* Hover states */ }

/* Text styling */
.text-gray-900.dark\:text-gray-100 { /* Business names */ }
.text-gray-500.dark\:text-gray-400 { /* Addresses and secondary text */ }
.text-yellow-600.dark\:text-yellow-400 { /* Ratings */ }
.text-green-600.dark\:text-green-400 { /* Open status */ }
.text-red-600.dark\:text-red-400 { /* Closed status */ }
```

## Error Handling

The library includes comprehensive error handling:

- **API Load Failures**: Graceful handling when Google Maps API fails to load
- **Search Errors**: Proper error handling during business searches
- **Network Issues**: Timeout and retry mechanisms
- **Invalid Data**: Validation and fallbacks for malformed responses

## Requirements

- Google Maps JavaScript API with Places Library
- Modern browser with ES6+ support
- Livewire 3 (for integration features)

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Google Places API (New API) integration
- Livewire 3 support
- Real-time search with debouncing
- Country-specific filtering
- Dark mode support

## Support

For issues and questions:
- Create an issue on GitHub
- Check the [Google Places API documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- Review the [Livewire documentation](https://livewire.laravel.com/)

## Acknowledgments

- Google Places API team for the excellent new API
- Livewire team for the reactive framework
- [VerifiedVoices.io](https://verifiedvoices.io/en) for their valuable contribution
- Contributors and users of this library