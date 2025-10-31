# Mobile UI Quick Reference

## Mobile Header (Always Visible at Top)
```
┌─────────────────────────────────────┐
│ 🌿 Anna Bazaar        ☰ (Menu)     │
│                                     │
│ 🔍 [Search products...]            │
└─────────────────────────────────────┘
```

## Hamburger Menu (Slides from Right)
```
┌──────────────────────────┐
│  Menu              ✕     │
├──────────────────────────┤
│                          │
│  📦 Products             │
│  💬 Chats          (3)   │
│  📄 Orders         (5)   │
│  👤 Profile              │
│                          │
│ ────────────────────     │
│                          │
│  🌙 Dark Mode            │
│  🚪 Logout               │
│                          │
└──────────────────────────┘
```

## Bottom Navigation (Fixed at Bottom)
```
┌──────────────────────────────────────┐
│  📦      💬      🛒      👤          │
│ Products Chats   Cart  Profile       │
│          (3)     (2)                 │
└──────────────────────────────────────┘
```

## Voice Assistant (Floating Button)
```
                          ┌────┐
                          │ 💬 │  ← Gemini Voice
                          │ ✨ │     Assistant
                          └────┘
```

## Mobile View Sections

### 1. Farmer View - Products Tab
- List of all farmer's products
- "Add New Product" button (prominent)
- Each product card shows:
  - Product image
  - Name, price, quantity
  - Edit/Delete buttons

### 2. Farmer View - Chats Tab
- List of buyer negotiations
- Price proposals
- Accept/Reject buttons
- Buyer details

### 3. Farmer View - Orders Tab
- Incoming orders
- Order status tracking
- Update status button
- Order details

### 4. Farmer View - Profile Tab
- Live weather widget
- Profile information
- Edit profile button
- Statistics (products, orders)

---

### 5. Buyer View - Browse Tab
- Product listings grid
- Filter options
- Search functionality
- Add to cart buttons

### 6. Buyer View - Chats Tab
- Negotiation proposals
- Farmer responses
- Conversation history

### 7. Buyer View - Cart Tab
- Cart items
- Quantity controls
- Total price
- "Place Order" button

### 8. Buyer View - Profile Tab
- Purchase history
- Profile details
- Order tracking

## Touch Interactions

### Tap Targets
- ✅ All buttons: Minimum 44px × 44px
- ✅ Bottom nav items: Full column width
- ✅ Menu items: Full row height

### Gestures
- **Tap**: Select/Navigate
- **Long press**: Context actions (future)
- **Swipe down**: Refresh (future)
- **Pinch**: Image zoom (future)

## Color Coding

### Farmer Mode
- **Primary**: Green (#10b981)
- **Active nav**: Light green background
- **Buttons**: Green gradient

### Buyer Mode
- **Primary**: Blue (#3b82f6)
- **Active nav**: Light blue background
- **Buttons**: Blue gradient

## Responsive Behavior

| Screen Size | Header Layout | Navigation Type | Grid Columns |
|-------------|--------------|----------------|--------------|
| < 640px     | Mobile       | Bottom Nav     | 1 column     |
| 640-768px   | Mobile       | Bottom Nav     | 2 columns    |
| ≥ 768px     | Desktop      | Top Nav        | 3 columns    |

## Dark Mode Support
- Toggle available in hamburger menu
- All components adapt automatically
- Proper contrast maintained
- Icons remain visible

## Performance Tips

### On Mobile Devices:
1. Images are optimized for screen size
2. Animations use GPU acceleration
3. Bottom nav stays fixed (no reflow)
4. Voice chat loads on demand
5. API calls are debounced

### Network Optimization:
- Weather data cached for 10 minutes
- Product images lazy-loaded
- Gemini API responses streamed
- Minimal re-renders

## Keyboard Navigation
- Tab through interactive elements
- Enter to activate buttons
- Escape to close modals/menu
- Arrow keys in lists (future)

---

**Pro Tip**: Use the bottom navigation for quick access to main sections, and the hamburger menu for settings and logout!
