const tintColorLight = '#4DB6AC'; // DevWell main teal
const tintColorDark = '#4DB6AC'; // DevWell main teal

export default {
  light: {
    text: '#212121', // Dark charcoal for text
    background: '#F5F5F5', // Light gray background
    tint: tintColorLight,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: tintColorLight,
    // DevWell brand colors
    primary: '#4DB6AC', // Main teal
    secondary: '#B39DDB', // Soft purple
    accent: '#B39DDB', // Soft purple accent
    surface: '#FFFFFF', // White surface
    card: '#FFFFFF', // White cards
    border: '#EEEEEE', // Light border
    placeholder: '#999999', // Placeholder text
    disabled: '#CCCCCC', // Disabled elements
    error: '#FF6B6B', // Error color
    success: '#4CAF50', // Success color
  },
  dark: {
    text: '#FFFFFF', // White text for dark mode
    background: '#121212', // Dark background
    tint: tintColorDark,
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    // DevWell brand colors for dark mode
    primary: '#4DB6AC', // Main teal
    secondary: '#B39DDB', // Soft purple
    accent: '#B39DDB', // Soft purple accent
    surface: '#1E1E1E', // Dark surface
    card: '#2A2A2A', // Dark cards
    border: '#333333', // Dark border
    placeholder: '#666666', // Placeholder text
    disabled: '#444444', // Disabled elements
    error: '#FF6B6B', // Error color
    success: '#4CAF50', // Success color
  },
};
