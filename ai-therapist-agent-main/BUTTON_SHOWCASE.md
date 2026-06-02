# Premium Button System - Showcase

This document showcases all the unique, professional button variants available in your AI Therapist application.

## Button Variants

### 1. **Default** - Shimmer Gradient Button
```tsx
<Button variant="default">Get Started</Button>
```
- **Use Case**: Primary actions, main CTAs
- **Visual**: Gradient background with shimmer effect on hover
- **Animation**: Smooth scale with light shimmer sweep

### 2. **Neon** - Glowing Neon Button
```tsx
<Button variant="neon">Try Now ✨</Button>
```
- **Use Case**: Eye-catching CTAs, premium features
- **Visual**: Cyan-blue-purple gradient with pulsing glow
- **Animation**: Pulse animation, scales on hover

### 3. **Glass** - Glassmorphic Button
```tsx
<Button variant="glass">Explore</Button>
```
- **Use Case**: Modern overlay buttons, floating actions
- **Visual**: Frosted glass effect with subtle blur
- **Animation**: Smooth lift with enhanced blur

### 4. **Premium** - Gold Luxury Button
```tsx
<Button variant="premium">Premium Access</Button>
```
- **Use Case**: Upgrade prompts, exclusive features
- **Visual**: Animated gold gradient
- **Animation**: Background position shift with scale

### 5. **Raised** - 3D Push Button
```tsx
<Button variant="raised">Click Me</Button>
```
- **Use Case**: Interactive elements, games, playful actions
- **Visual**: 3D shadow effect that responds to clicks
- **Animation**: Physical push-down animation

### 6. **Animated** - Gradient Wave Button
```tsx
<Button variant="animated">Start Journey</Button>
```
- **Use Case**: Welcome screens, onboarding flows
- **Visual**: Constantly shifting pink-purple-indigo gradient
- **Animation**: Continuous gradient animation

### 7. **Success** - Emerald Confirmation Button
```tsx
<Button variant="success">Confirm ✓</Button>
```
- **Use Case**: Confirmations, positive actions, completions
- **Visual**: Emerald-teal gradient with green glow
- **Animation**: Smooth scale and glow intensification

### 8. **Destructive** - Warning/Delete Button
```tsx
<Button variant="destructive">Delete</Button>
```
- **Use Case**: Destructive actions, warnings, deletions
- **Visual**: Red gradient with warning glow
- **Animation**: Scale with red shadow intensification

### 9. **Outline** - Premium Glass Outline
```tsx
<Button variant="outline">Learn More</Button>
```
- **Use Case**: Secondary actions, cancel buttons
- **Visual**: Glassmorphic outline with subtle blur
- **Animation**: Lift animation with border glow

### 10. **Ghost** - Minimal Hover Button
```tsx
<Button variant="ghost">Skip</Button>
```
- **Use Case**: Tertiary actions, optional interactions
- **Visual**: Transparent until hover
- **Animation**: Smooth background fade-in

### 11. **Soft** - Pastel Gentle Button
```tsx
<Button variant="soft">Gentle Action</Button>
```
- **Use Case**: Calm actions, mood tracking, wellness features
- **Visual**: Soft rose-pink pastel gradient
- **Animation**: Gentle scale with soft shadow

### 12. **Dark** - Dark Theme Optimized
```tsx
<Button variant="dark">Night Mode</Button>
```
- **Use Case**: Dark theme toggles, developer options
- **Visual**: Slate gradient optimized for visibility
- **Animation**: Scale with dark shadow

### 13. **Secondary** - Soft Auxiliary Button
```tsx
<Button variant="secondary">More Options</Button>
```
- **Use Case**: Alternative actions, secondary workflows
- **Visual**: Subtle gradient with border
- **Animation**: Smooth scale and shadow

### 14. **Link** - Text Link Button
```tsx
<Button variant="link">Read More →</Button>
```
- **Use Case**: Navigation, inline actions
- **Visual**: Underlined text
- **Animation**: Decoration transition

## Button Sizes

### Size Options
```tsx
<Button size="sm">Small</Button>       // Compact size
<Button size="default">Default</Button> // Standard size
<Button size="lg">Large</Button>       // Prominent size
<Button size="xl">Extra Large</Button>  // Hero CTAs

<Button size="icon">🎯</Button>        // Icon only
<Button size="icon-sm">⚡</Button>      // Small icon
<Button size="icon-lg">✨</Button>      // Large icon
```

## Combination Examples

### Therapy Session Button
```tsx
<Button 
  variant="animated" 
  size="lg"
  onClick={() => startTherapy()}
>
  <MessageSquare className="w-5 h-5" />
  Start Aura Therapy
  <ArrowRight className="w-5 h-5" />
</Button>
```

### Mood Tracking Button
```tsx
<Button 
  variant="soft" 
  size="default"
  onClick={() => trackMood()}
>
  <Heart className="w-5 h-5" />
  Track Mood
</Button>
```

### Premium Feature Button
```tsx
<Button 
  variant="premium" 
  size="lg"
  onClick={() => upgradeToPremium()}
>
  <Crown className="w-5 h-5" />
  Upgrade to Premium
</Button>
```

### Quick Action Icon Button
```tsx
<Button 
  variant="glass" 
  size="icon"
  onClick={() => openSettings()}
>
  <Settings className="w-5 h-5" />
</Button>
```

## Design Tips

1. **Use `neon` or `animated` for main CTAs** - They grab attention
2. **Use `soft` or `glass` for wellness features** - Creates calm vibes
3. **Use `raised` for interactive elements** - Adds playfulness
4. **Use `premium` sparingly** - Only for exclusive features
5. **Combine variants with appropriate sizes** - Match importance
6. **Add icons for better UX** - Visual cues help users
7. **Use `success` for confirmations** - Positive reinforcement
8. **Use `destructive` for warnings** - Clear danger signals

## Accessibility

All buttons include:
- ✅ Proper focus states with ring indicators
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Disabled state styling
- ✅ High contrast ratios
- ✅ Touch-friendly sizes (minimum 44px height)

## Dark Mode Support

All button variants are optimized for both light and dark modes with appropriate color adjustments and contrast ratios.

Enjoy your premium button system! 🎨✨
