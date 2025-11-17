# India Biodiversity Explorer 🌿

A comprehensive, interactive web application built with React, TypeScript, and Tailwind CSS to explore India's rich biodiversity, biogeographical zones, and conservation efforts.

## 🌟 Features

### Core Pages
- **Home** - Hero section with feature cards and statistics
- **Biogeographical Zones** - Explore India's 10 unique zones
- **Species Directory** - Searchable database with filters (zone, status, favorites)
- **Ecosystems** - Learn about different ecosystem types
- **Conservation Status** - IUCN Red List categories and species
- **Interactive Map** - Leaflet.js map showing species distribution
- **Biodiversity Value** - Understanding ecosystem services
- **Quiz** - Interactive MCQ quiz with scoring
- **About** - Project information and objectives

### Key Functionality
✅ **Search & Filter** - Find species by name, zone, or conservation status  
✅ **Interactive Map** - Click markers to view species details  
✅ **Favorites System** - Save favorite species (LocalStorage)  
✅ **Dark Mode Toggle** - Switch between light and dark themes  
✅ **Responsive Design** - Mobile-first approach  
✅ **Conservation Tags** - Color-coded status indicators  
✅ **Quiz System** - Test biodiversity knowledge with instant feedback  
✅ **Animations** - Smooth transitions and hover effects  

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Routing**: React Router v6
- **Maps**: Leaflet.js + React Leaflet
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **State Management**: React Query

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Navbar.tsx       # Navigation bar with mobile menu
│   ├── Footer.tsx       # Footer with links
│   ├── ThemeProvider.tsx # Dark mode context
│   ├── SpeciesCard.tsx  # Species display card
│   ├── SpeciesModal.tsx # Species detail modal
│   └── MapComponent.tsx # Leaflet map wrapper
├── pages/
│   ├── Home.tsx         # Landing page
│   ├── Zones.tsx        # Biogeographical zones
│   ├── Species.tsx      # Species directory
│   ├── Ecosystems.tsx   # Ecosystem types
│   ├── Conservation.tsx # Conservation status
│   ├── Map.tsx          # Interactive map
│   ├── Value.tsx        # Biodiversity value
│   ├── Quiz.tsx         # Quiz challenge
│   ├── About.tsx        # About page
│   └── NotFound.tsx     # 404 page
├── lib/
│   └── utils.ts         # Utility functions
├── hooks/
│   ├── use-toast.ts     # Toast notifications
│   └── use-mobile.tsx   # Mobile breakpoint hook
├── App.tsx              # Main app with routing
├── main.tsx             # App entry point
└── index.css            # Global styles & design system

public/
└── data/
    └── species.json     # Species data (20 entries)
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
```bash
git clone <your-repo-url>
cd india-biodiversity-explorer
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

The app will open at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 📊 Data Structure

### Species Data Format (`public/data/species.json`)

```json
{
  "id": 1,
  "species_name": "Panthera tigris",
  "common_name": "Bengal Tiger",
  "zone": "Indo-Malayan",
  "ecosystem": "Tropical Forest",
  "status": "Endangered",
  "lat": 22.5726,
  "lon": 88.3639,
  "description": "Description text...",
  "population": "2500-3000",
  "threats": ["Habitat loss", "Poaching"]
}
```

### Biogeographical Zones
1. Trans-Himalayan
2. Himalayan
3. Desert
4. Semi-Arid
5. Western Ghats
6. Deccan Peninsula
7. Gangetic Plain
8. North-East India
9. Islands
10. Coastal

### Conservation Status (IUCN)
- ✅ Least Concern (Green)
- ⚠️ Vulnerable (Yellow)
- 🔴 Endangered (Red)
- ⚫ Critically Endangered (Black)

## 🎨 Design System

### Color Scheme
- **Primary**: Green tones (biodiversity theme)
- **Accent**: Earth orange
- **Status Colors**: Semantic conservation status colors
- **Ecosystem Colors**: Unique color for each ecosystem type

### Typography
- Font: System font stack for performance
- Responsive scaling
- Semantic heading hierarchy

### Animations
- Fade in/out transitions
- Hover lift effects
- Slide up animations
- Smooth page transitions

## 🧩 Key Components

### SpeciesCard
Displays species with:
- Common & scientific names
- Conservation status badge
- Zone and ecosystem info
- Favorite toggle button
- View details button

### MapComponent
- Leaflet map of India
- Species markers with color-coded status
- Popup on marker click
- Legend for status colors
- Zoom and pan controls

### Quiz System
- 10 multiple-choice questions
- Instant feedback with explanations
- Score tracking
- Progress bar
- Results with performance rating

## 🔧 Customization

### Adding New Species
Edit `public/data/species.json` and add new entries following the data structure.

### Modifying Theme Colors
Edit `src/index.css` to change CSS custom properties:
```css
:root {
  --primary: 142 76% 36%;
  --accent: 35 90% 55%;
  /* ... */
}
```

### Adding New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Navbar.tsx`

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Troubleshooting

### Map not loading
Ensure Leaflet CSS is imported in `MapComponent.tsx`:
```typescript
import "leaflet/dist/leaflet.css";
```

### Dark mode not persisting
Check localStorage is enabled in your browser.

### Species data not loading
Verify `public/data/species.json` exists and contains valid JSON.

## 📄 License

This is an educational project created for learning purposes.

## 🤝 Contributing

This is a minor project template. Feel free to:
- Add more species data
- Enhance map features
- Add data visualizations
- Improve quiz questions
- Add more biogeographical information

## 📧 Contact

For questions or suggestions about this project, please refer to the About page in the application.

---

**Note**: This project uses representative data for educational purposes. Actual species distribution and population numbers should be verified with official sources like Wildlife Institute of India, IUCN Red List, and Ministry of Environment, Forest and Climate Change.

## 🎓 Educational Value

Perfect for:
- School/College projects
- Environmental science presentations
- Biodiversity awareness campaigns
- Interactive learning tools
- Conservation education

---

Built with ❤️ for Indian Wildlife Conservation
