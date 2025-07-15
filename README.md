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

Add to your Vite configuration:

```javascript
// vite.config.js
export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/places/business-search.js'
            ],
            refresh: true,
        }),
    ],
});
```

Then include in your Blade template:

```html
@vite(['resources/js/places/business-search.js'])
```

## Usage

### Basic Setup

```javascript
// Initialize the search in your Livewire component
const countryMap = {
    'United States': 'us',
    'Canada': 'ca',
    'United Kingdom': 'gb'
    // Add more countries as needed
};

const countriesList = ['United States', 'Canada', 'United Kingdom'];

// Initialize with Livewire component
window.businessPlacesSearch.init(wire, countryMap, countriesList);
```

### Required HTML Structure

Your HTML template must include these specific elements:

```html
<!-- Search input - wire:model.live is required -->
<input type="text" 
       wire:model.live="businessSearchQuery" 
       placeholder="Search for businesses...">

<!-- Results container - ID must be exactly 'businessSearchResults' -->
<div id="businessSearchResults"></div>

<!-- No results fallback - ID must be exactly 'noResultsFallback' -->
<div id="noResultsFallback" class="hidden">
    <p>No businesses found for your search.</p>
</div>
```

### Livewire Component Integration

Your Livewire component must have these properties and methods:

```php
<?php

class YourLivewireComponent extends Component
{
    public $businessSearchQuery = '';
    public $selectedCountry = null; // Used for country filtering
    public $selectedBusiness = [];
    
    public function setBusinessFromGooglePlaces($businessData)
    {
        // This method is called when a business is selected
        $this->selectedBusiness = $businessData;
        
        // Clear search query
        $this->businessSearchQuery = '';
        
        // Process business data
        $this->processBusiness($businessData);
    }
    
    protected function processBusiness($data)
    {
        // Access business data:
        // $data['name'], $data['formatted_address'], $data['latitude'], etc.
    }
}
```

## API Reference

### Initialization

```javascript
window.businessPlacesSearch.init(wire, countryMap, countriesList)
```

**Parameters:**
- `wire` (Object): Livewire component instance
- `countryMap` (Object): Maps country names to region codes
- `countriesList` (Array): List of available countries

### Automatic Search Handling

The library automatically watches for changes to `businessSearchQuery` in your Livewire component:

- Minimum 3 characters required
- 500ms debounce delay
- Automatic results display/clearing
- Country filtering when `selectedCountry` is set

### Business Data Format

Selected businesses return data in this format:

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
    'United States': 'us',
    'Canada': 'ca',
    'United Kingdom': 'gb',
    'Australia': 'au',
    'Germany': 'de',
    'France': 'fr',
    'Italy': 'it',
    'Spain': 'es',
    'Japan': 'jp',
    'China': 'cn',
    'India': 'in',
    'Brazil': 'br'
};
```

## Error Handling

The library includes comprehensive error handling:

- **Google Maps API not loaded**: Graceful degradation
- **Place class initialization failures**: Error logging and fallbacks
- **Search API failures**: Error logging with empty results
- **Network timeouts**: Automatic cleanup
- **Invalid place data**: Safe data extraction with fallbacks

## Implementation Notes

### Coordinate Extraction

The library uses `place.Dg?.location?.lat` and `place.Dg?.location?.lng` for coordinate extraction from the Google Places API response.

### Global Instance

The library creates a global instance accessible via `window.businessPlacesSearch`.

### Cleanup

The library automatically cleans up resources on Livewire navigation events.

## Requirements

- Google Maps JavaScript API with Places Library
- Modern browser with ES6+ support
- Livewire 3

## Troubleshooting

### Common Issues

1. **No results appearing**: Check that `businessSearchResults` container exists
2. **Search not triggering**: Ensure `wire:model.live="businessSearchQuery"` is set
3. **Country filtering not working**: Verify `selectedCountry` property exists in Livewire component
4. **API errors**: Check Google Maps API key and Places API is enabled

### Debug Mode

Enable debug logging in the browser console to see detailed error messages and API responses.

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the [Google Places API documentation](https://developers.google.com/maps/documentation/places/web-service/overview)
- Review the [Livewire documentation](https://livewire.laravel.com/)

## Acknowledgments

- Google Places API team for the excellent new API
- Livewire team for the reactive framework
- [ReviewConnect.me](https://reviewconnect.me/) for their valuable contribution
- Contributors and users of this library
