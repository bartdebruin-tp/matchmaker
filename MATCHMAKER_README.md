# MatchMaker

A mobile-first Progressive Web App (PWA) for organizing random team matchups for sports or games.

## Features

- 📱 **Mobile-First Design** - Optimized for mobile devices with touch-friendly interface
- 💾 **Local Storage** - All data stored locally on your device
- 👥 **Player Management** - Add, edit, and delete players
- 🎯 **Group Management** - Create groups with custom names and colors
- ✅ **Active Player Selection** - Mark players as active for match generation
- 🎲 **Random Match Generation** - Automatically creates balanced team matchups
- 📲 **PWA Support** - Install on your phone for native app-like experience
- 🎨 **Beautiful UI** - Built with Tailwind CSS using emerald and stone themes

## How It Works

### Match Rules
- Each team consists of 2 players
- Each match has 2 teams (4 players total)
- Minimum 4 active players needed to generate matches
- Players are randomly shuffled for fair matchups

### Workflow

1. **Manage Players**
   - Navigate to the Players page
   - Add all your players with their names
   - Edit or delete players as needed

2. **Create Groups**
   - Navigate to the Groups page
   - Create groups for different days/venues
   - Assign custom names and colors to groups

3. **Add Players to Groups**
   - Click on a group to open group details
   - Add players from your player list
   - Players can be in multiple groups

4. **Select Active Players**
   - In the group detail page, tap players to mark them as active
   - Active players have a green highlight
   - Only active players will be included in matches

5. **Generate Matches**
   - Go to the Home page
   - See the count of active players
   - Click "Generate Matches" to create random team matchups
   - Regenerate as many times as needed

## Installation

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Install as PWA

1. Open the app in your mobile browser
2. Use your browser's "Add to Home Screen" option
3. The app will install and can be used offline

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons

## Project Structure

```
src/
├── components/      # Reusable UI components (buttons, inputs, etc.)
├── composables/     # Vue composables for shared logic
├── organisms/       # Complex components (modals, nav, cards)
├── templates/       # Full page templates
├── stores/          # Pinia state management
├── types/           # TypeScript type definitions
└── router/          # Vue Router configuration
```

## Data Storage

All data is stored in your browser's localStorage as JSON. The app automatically:
- Saves data when you add/edit/delete players or groups
- Loads data when you open the app
- Keeps your data private on your device

## Browser Support

Works on all modern browsers that support:
- ES6+
- Web Storage API
- Service Workers (for PWA features)

## License

MIT
