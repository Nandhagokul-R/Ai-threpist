# 🧪 Mood Update Test

## Step-by-Step Instructions:

### 1. Open Browser Console
- Navigate to: http://localhost:3000/dashboard
- Press **F12** (or right-click → Inspect)
- Go to **Console** tab
- Clear console (click 🚫 icon)

### 2. Track Your Mood
- Click the **"Track Mood"** button (pink/rose button)
- Slider should default to **60%** (😊 Neutral)
- Move slider to **85%**
- You should see:
  - Large emoji: 😃
  - Text: "Good"
  - Percentage: "85%"
- Click **"Save Mood"**

### 3. Watch Console Logs (in order):

```
MoodForm: Starting submission
MoodForm: Success response: {...}
=== MOOD FORM SUCCESS CALLBACK ===
Received mood score: 85
Current activities count: X
Current dailyStats BEFORE update: {moodScore: null, ...}
Created new mood activity: {moodScore: 85, ...}
Updated activities count: X+1
Full updated activities: [...]
Calculated new stats: {moodScore: 85, ...}
New mood score should be: 85
Set skipNextFetchRef.current = true
State updates called - React should re-render now
=== DASHBOARD RENDER ===
Mood Score value: 85
Forcing re-render with timestamp update
```

### 4. Check Dashboard Display

Look at **"Today's Overview"** card (middle section):
- **Mood Score** should show: **85%**
- Below it: `(Updated: XX:XX:XX pm)`
- Bottom of card: `Last updated: XX:XX pm`

---

## 🐛 If It's NOT Working:

### Scenario A: Logs appear but score stays "No data"
**Problem:** Stats calculation or state update issue
**Check:** Look for this in console:
```
New mood score should be: 85  ← What number do you see?
```

### Scenario B: No logs appear at all
**Problem:** Callback not firing
**Check:** Did you see "MoodForm: Starting submission"?

### Scenario C: Logs show correct value but card doesn't update
**Problem:** Render issue
**Check:** Look for "=== DASHBOARD RENDER ===" - does it show the new value?

---

## 📋 What to Send Me:

1. **Copy ALL console logs** from when you click "Save Mood"
2. **Screenshot** of the "Today's Overview" card
3. **What does the Mood Score card show?** (e.g., "No data", "75%", etc.)

---

## Quick Debug Commands:

Open console and run:
```javascript
// Check current state
console.log('Current activities:', window.localStorage.getItem('activities'));

// Manually trigger update (TEST ONLY)
console.log('This is a test - checking if React is working');
```
