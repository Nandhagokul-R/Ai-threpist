# 🧪 Mood Tracking Test Instructions

## How to Test Mood Score Update

### Step 1: Open Browser Console
1. Open the dashboard at http://localhost:3000/dashboard
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab

### Step 2: Track Your Mood
1. Click the **"Track Mood"** button (pink/rose button on dashboard)
2. Move the slider to set your mood (try **75%** for testing)
3. Click **"Save Mood"**

### Step 3: Check Console Logs
You should see these logs in order:
```
=== MOOD FORM SUCCESS CALLBACK ===
Received mood score: 75
Current activities count: X
Created new mood activity: {...}
Updated activities count: X+1
Calculated new stats: {moodScore: 75, ...}
New mood score should be: 75
Stats updated with new timestamp
Rendering dashboard with dailyStats: {moodScore: 75, ...}
```

### Step 4: Verify Visual Update
Look at the **"Today's Overview"** card (middle card):
- **Mood Score** should show: `75%`
- Below it should show: `(Updated: XX:XX:XX am/pm)` ← this timestamp should be current
- Bottom of card shows: `Last updated: XX:XX am`

### Expected Result ✅
- Mood Score displays **75%** (or whatever you selected)
- Timestamp updates to current time
- Toast notification appears: "Mood tracked successfully!"
- Recent Activity section shows new "Mood Check-in" entry

### If It's NOT Working ❌

**Check Console for Errors:**
- Any red error messages?
- Are the logs appearing?
- What does "New mood score should be:" show?

**Common Issues:**
1. **Logs don't appear** → MoodForm callback not firing
2. **"New mood score should be: null"** → calculateDailyStats issue
3. **No visual update** → React state not triggering re-render

**Send me the console logs if it's not working!**

---

## Quick Debug Commands

Open browser console and run:
```javascript
// Check current dashboard state
console.log('Activities:', JSON.parse(localStorage.getItem('dashboard-activities') || '[]'));

// Check mood entries
console.log('Mood entries:', JSON.parse(localStorage.getItem('dashboard-activities') || '[]').filter(a => a.type === 'mood'));
```

---

## Manual Test

If automatic doesn't work, try this:
1. Open Console
2. Paste and run:
```javascript
// Manually trigger mood update
window.dispatchEvent(new CustomEvent('mood-update', { detail: { score: 88 } }));
```
