# EatWisely UI Design System

## Overview

EatWisely is a restaurant management platform with a clean, professional interface. The design language balances functionality with visual appeal, using a natural/organic color palette inspired by fresh, healthy food.

---

## Visual Language

### Brand Personality
- **Approachability**: Friendly, welcoming, not overly corporate
- **Trust**: Clean, reliable, professional
- **Health-Conscious**: Natural colors, organic feel
- **Clarity**: Information-dense but well-organized dashboards

### Design Principles
1. **Content-First**: Data and information take precedence over decoration
2. **Progressive Disclosure**: Show summaries by default, details on demand
3. **Consistent Patterns**: Reusable components for familiar interactions
4. **Visual Hierarchy**: Clear distinction between primary actions and secondary information
5. **Responsive**: Works across all device sizes

---

## Color System

### Primary Brand Color
```
#8fa31e  →  Primary Green (Olive/Lime)
```
Used for: CTAs, active states, highlights, success indicators

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#8fa31e` | Main brand color, buttons, links, active states |
| `primary-dark` | `#6b8a16` | Hover states, secondary buttons |
| `primary-darker` | `#4a6310` | Pressed states, emphasis |
| `primary-light` | `#a5b82e` | Highlights, badges |
| `primary-lightest` | `#3d5210` | Subtle backgrounds |

| Token | Hex | Usage |
|-------|-----|-------|
| `gray-50` | `#f9fafb` | Page background |
| `gray-100` | `#f3f4f6` | Card backgrounds, borders |
| `gray-200` | `#e5e7eb` | Dividers, inactive borders |
| `gray-300` | `#d1d5db` | Disabled states |
| `gray-400` | `#9ca3af` | Placeholder text |
| `gray-500` | `#6b7280` | Secondary text |
| `gray-600` | `#4b5563` | Body text |
| `gray-700` | `#374151` | Headings |
| `gray-800` | `#1f2937` | Dark text |
| `gray-900` | `#111827` | darkest text |

| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#10b981` | Success states, CREATE actions |
| `info` | `#3b82f6` | Information, UPDATE actions |
| `warning` | `#f59e0b` | Warnings, STATUS_CHANGE |
| `danger` | `#ef4444` | Errors, DELETE actions |
| `purple` | `#8b5cf6` | LOGIN actions |
| `muted` | `#6b7280` | LOGOUT, inactive |

### Action Colors (Audit Log)
```javascript
const ACTION_COLORS = {
  LOGIN: '#8b5cf6',        // Purple - sessions
  LOGOUT: '#6b7280',       // Gray - sessions ended
  CREATE: '#10b981',       // Green - new content
  UPDATE: '#3b82f6',      // Blue - modifications
  DELETE: '#ef4444',       // Red - removals
  STATUS_CHANGE: '#f59e0b' // Amber - status changes
}
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|--------------|
| `h1` | 2.25rem (36px) | 700 (Bold) | 1.2 |
| `h2` | 1.875rem (30px) | 700 (Bold) | 1.3 |
| `h3` | 1.5rem (24px) | 600 (SemiBold) | 1.4 |
| `h4` | 1.25rem (20px) | 600 (SemiBold) | 1.4 |
| `body` | 1rem (16px) | 400 (Regular) | 1.5 |
| `small` | 0.875rem (14px) | 400 (Regular) | 1.5 |
| `caption` | 0.75rem (12px) | 500 (Medium) | 1.4 |

### Usage Guidelines
- **Dashboard Headings**: Bold, dark gray (`#1f2937`)
- **Card Titles**: Semi-bold, slightly lighter (`#374151`)
- **Body Text**: Regular weight, readable gray (`#4b5563`)
- **Labels**: Medium weight, smaller size, muted color (`#6b7280`)
- **Data Values**: Bold, larger size for emphasis

---

## Spacing System

### Base Unit
```
4px
```

### Spacing Scale
| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing, icon padding |
| `space-2` | 8px | Component internal spacing |
| `space-3` | 12px | Between related elements |
| `space-4` | 16px | Standard padding |
| `space-5` | 20px | Section padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Large section gaps |

### Container Widths
- **Max Content**: 1280px
- **Sidebar**: 256px (fixed)
- **Cards**: Full width with max, responsive

---

## Component Patterns

### Cards

**Stat Card**
```
┌─────────────────────────────────────┐
│  [Icon]                             │
│                                     │
│  Title                    Value     │
│  Subtitle                            │
│                                     │
│  Trend indicator                    │
└─────────────────────────────────────┘

Styles:
- Background: white
- Border: 1px solid #e5e7eb
- Border-radius: 1rem (16px)
- Shadow: shadow-sm (0 1px 2px rgba(0,0,0,0.05))
- Hover: shadow-lg, border-primary/20
```

**Chart Card**
```
┌─────────────────────────────────────┐
│  Title              [Badge: count]  │
│  Subtitle                          │
├─────────────────────────────────────┤
│                                     │
│         [Chart Area]               │
│                                     │
├─────────────────────────────────────┤
│  [Legend items...]                  │
└─────────────────────────────────────┘

Styles:
- White background
- Border-radius: 1rem
- Padding: 1.5rem
- Min-height for chart: 256px
```

### Buttons

**Primary Button**
```
Background: #8fa31e (primary)
Hover: #6b8a16 (primary-dark)
Text: white
Padding: 0.75rem 1.5rem
Border-radius: 0.75rem (12px)
Font-weight: 600

Shadow: shadow-lg, shadow-primary/25
Transition: all 300ms
```

**Secondary Button**
```
Background: white
Border: 1px solid #e5e7eb
Text: #374151
Hover: bg-gray-50

Border-radius: 0.75rem
```

**Icon Button**
```
Size: 2.5rem (40px) square
Border-radius: 0.75rem
Background: white
Border: 1px solid #e5e7eb

Hover: bg-gray-50
```

### Form Elements

**Input Fields**
```
Height: 2.5rem (40px)
Border: 1px solid #e5e7eb
Border-radius: 0.5rem (8px)
Padding: 0 1rem

Focus: border-primary, ring-2 ring-primary/20
```

**Select/Dropdown**
```
Same as Input
Chevron icon on right
```

### Badges & Tags

**Count Badge**
```
Background: primary/10 (light green)
Text: primary
Font-size: 0.75rem
Font-weight: 700
Padding: 0.25rem 0.5rem
Border-radius: 9999px (full)
```

**Action Badge** (for audit logs)
```
Background: action-color/10
Text: action-color
Border: 1px solid action-color/20
Border-radius: 0.5rem
```

### Tables

```
Header: bg-gray-50, font-semibold, text-sm
Row hover: bg-gray-50
Border: 1px solid #e5e7eb
Border-radius: 0.5rem
Alternating: none (clean white)
```

### Navigation

**Sidebar**
```
Width: 256px
Background: white
Border-right: 1px solid #e5e7eb
Item height: 2.5rem
Active: bg-primary/10, text-primary, border-l-4 border-primary
```

**Top Bar**
```
Height: 64px
Background: white
Border-bottom: 1px solid #e5e7eb
```

---

## Layout Patterns

### Dashboard Layout
```
┌──────────────────────────────────────────────────────┐
│  Top Bar (Logo, Search, User Menu)                   │
├────────────┬─────────────────────────────────────────┤
│            │                                         │
│  Sidebar   │  Main Content Area                       │
│  (Nav)     │  ┌─────────────────────────────────────┐  │
│            │  │  Page Header (Title + Actions)    │  │
│  - Home    │  └─────────────────────────────────────┘  │
│  - Users   │  ┌─────────────────────────────────────┐  │
│  - Stats   │  │                                     │  │
│  - Audit   │  │  Content Cards / Tables            │  │
│  - Settings│  │                                     │  │
│            │  │                                     │  │
│            │  └─────────────────────────────────────┘  │
│            │                                         │
└────────────┴─────────────────────────────────────────┘
```

### Dashboard Overview Grid
```
Responsive Grid:
- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (grid-cols-2)
- Desktop: 4 columns (grid-cols-4)

Gap: 1.25rem (20px)
```

### Stats Cards Row
```
[Users] [Restaurants] [Categories] [Menu Items]
4 cards on desktop, 2 on tablet, 1 on mobile
```

### Charts Row
```
[Chart - 2/3 width]  [Chart - 1/3 width]
or stacked on mobile
```

---

## Visual Effects

### Shadows
```css
shadow-sm    /* 0 1px 2px rgba(0,0,0,0.05) */
shadow-md    /* 0 4px 6px rgba(0,0,0,0.1) */
shadow-lg    /* 0 10px 15px rgba(0,0,0,0.1) */
shadow-xl    /* 0 20px 25px rgba(0,0,0,0.1) */
shadow-primary/25 /* Custom: primary with 25% opacity */
```

### Gradients
```
Dashboard Header (Realtime Banner):
background: linear-gradient(to right, #8fa31e, #6b8a16, #8fa31e)

Chart Gradients (Area fills):
from: action-color at 80% opacity
to: action-color at 10% opacity
```

### Animations
```
Transitions: all 300ms ease-in-out

Pulse animation (realtime indicator):
animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

Spin animation (loading):
animation: spin 1s linear infinite
```

### Border Radius
```
sm:    0.25rem  (4px)   - inputs
base:  0.5rem   (8px)   - buttons
lg:    0.75rem  (12px)  - cards, inputs
xl:    1rem     (16px)  - cards
2xl:   1.5rem   (24px)  - large cards
full:  9999px          - pills, avatars
```

---

## Responsive Breakpoints

```
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Mobile Adaptations
- Sidebar becomes drawer/overlay
- Stats cards stack vertically
- Charts resize or hide complex legends
- Tables scroll horizontally if needed

---

## Accessibility

### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18px+): minimum 3:1 ratio
- Primary green (#8fa31e) on white: 4.2:1 (passes for large text)

### Focus States
- Visible focus rings: `ring-2 ring-primary/50`
- Skip to main content link
- Keyboard navigation support

### Screen Reader
- ARIA labels on icons
- Semantic HTML (headings, lists, buttons)
- Alt text on images

---

## Common Component Combinations

### Stats Card with Trend
```
┌──────────────────────────────┐
│  Total Users    [Users Icon]  │
│  1,234                        │
│  890 active                   │
│                              │
│  ↑ 12% vs last week           │
└──────────────────────────────┘

Code:
<StatsCard 
  title="Total Users" 
  value={1234} 
  subtitle="890 active"
  icon={HiUsers}
  trend={12}
  color="#8fa31e"
/>
```

### Chart with Custom Tooltip
```
┌──────────────────────────────┐
│  User Activity               │
│  Signups, logins & visitors   │
├──────────────────────────────┤
│  [Area Chart with 3 lines]   │
│                              │
├──────────────────────────────┤
│  ● Visitors  ● Logins ● Signups │
└──────────────────────────────┘

Tooltip shows:
┌────────────────┐
│ 2024-01-15     │
│ Visitors: 45   │
│ Logins: 12     │
│ Signups: 3     │
└────────────────┘
```

### Recent Activity Item
```
[Icon]  username  •  [ACTION]  •  entity
        timestamp

Styles:
- Icon: 40px square, colored by action
- Action badge: colored pill
- Hover: bg-gray-50
```

---

## Design Checklist

When implementing new components:

- [ ] Uses primary green (#8fa31e) for primary actions
- [ ] Has proper border-radius (0.75rem for cards, 0.5rem for buttons)
- [ ] Includes hover/active states with smooth transitions
- [ ] Has proper spacing (use spacing scale)
- [ ] Text is readable (use type scale)
- [ ] Responsive on mobile/tablet/desktop
- [ ] Has loading/empty states
- [ ] Error states are clear and red
- [ ] Uses consistent icons from react-icons/hi and react-icons/fa

---

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── DashboardOverview.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   ├── pages/
│   │   ├── superadmin/
│   │   ├── admin/
│   │   ├── manager/
│   │   └── user/
│   ├── index.css          # Global styles, fonts
│   └── App.jsx
├── tailwind.config.js     # Theme configuration
└── package.json
```

---

## Resources

- **Icons**: `react-icons/hi` (Heroicons), `react-icons/fa` (FontAwesome)
- **Components**: `flowbite-react` (based on Flowbite)
- **Charts**: `recharts`
- **Colors**: Configured in `tailwind.config.js`