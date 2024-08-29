import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, countries }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (countries && query.trim()) {
      const filteredSuggestions = countries.filter((country) =>
        country.properties.name.toLowerCase().startsWith(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [query, countries]);

  const handleSearch = (countryName) => {
    setQuery(countryName);
    if (countryName.trim()) {
      onSearch(countryName);
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for a country..."
      />
      <button onClick={() => handleSearch(query)}>Search</button>
      {suggestions.length > 0 && (
        <ul className="autocomplete-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSearch(suggestion.properties.name)}>
              {suggestion.properties.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
