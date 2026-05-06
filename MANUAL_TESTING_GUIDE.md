# MANUAL TESTING CHECKLIST - CS 322 Clinical Trials App

## **PREPARATION** ✅

### **1. Start Both Servers**
```bash
# Terminal 1: Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev
```

**Expected:**
- Backend: `http://127.0.0.1:8000` (check `/health` endpoint)
- Frontend: `http://localhost:5174/`

---

## **BACKEND API TESTING** 🔧

### **2. Test Health Endpoint**
```bash
curl http://127.0.0.1:8000/health
```
**Expected:** `{"status":"ok"}`

### **3. Test Authentication**
```bash
# Register new user
curl -X POST "http://127.0.0.1:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123","role":"user"}'

# Login (save the token)
curl -X POST "http://127.0.0.1:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"testpass123"}'
```
**Expected:** JWT token returned

### **4. Test Trial Data**
```bash
# Get trials by condition
curl "http://127.0.0.1:8000/trials/?condition=diabetes&limit=3"

# Get specific trial (copy ID from above)
curl "http://127.0.0.1:8000/trials/{trial_id}"
```
**Expected:** Real trial data from ClinicalTrials.gov

### **5. Test User Actions**
```bash
# Save trial (use token from login)
curl -X POST "http://127.0.0.1:8000/trials/{trial_id}/save" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Pass trial
curl -X POST "http://127.0.0.1:8000/trials/{trial_id}/pass" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
**Expected:** `{"status":"saved/passed","interaction_id":"..."}`

### **6. Test Analytics**
```bash
curl "http://127.0.0.1:8000/trials/analytics/stats"
```
**Expected:** Updated counts after save/pass actions

---

## **FRONTEND UI TESTING** 🌐

### **7. Browser Testing Setup**
1. Open `http://localhost:5174/`
2. Open Browser Developer Tools (F12)
3. Check Console for errors
4. Check Network tab for API calls

### **8. User Registration Flow**
1. Click "Sign Up" or go to registration
2. Fill form: email, password, role selection
3. Submit form
4. **Expected:** Redirect to login or profile setup
5. **Check:** Network tab shows successful POST to `/auth/register`

### **9. User Login Flow**
1. Go to login page
2. Enter credentials from registration
3. Click "Login"
4. **Expected:** Redirect to home/dashboard
5. **Check:** JWT token stored in localStorage

### **10. Trial Browsing**
1. Login as participant
2. Click "Find Trials" or "All Trials"
3. **Expected:** See list of real diabetes trials
4. **Check:** Network tab shows GET `/trials/?condition=diabetes`

### **11. Trial Details View**
1. Click "More Info" on any trial
2. **Expected:** Detailed trial page loads
3. **Check:** URL changes to `/participant/trials/{id}`
4. **Verify:** Shows sponsor, location, compensation, etc.

### **12. Save/Pass Actions**
1. On trial details page, click "Save" button
2. **Expected:** Success message appears
3. **Check:** Network tab shows POST `/trials/{id}/save`
4. Click "Pass" button
5. **Expected:** Success message appears
6. **Check:** Network tab shows POST `/trials/{id}/pass`

### **13. Analytics Dashboard**
1. Click "Analytics" in navigation
2. **Expected:** Shows stats (views, saves, passes)
3. **Check:** Network tab shows GET `/trials/analytics/stats`
4. **Verify:** Numbers update after save/pass actions

### **14. Trial Matching**
1. Go to trial swiping page
2. **Expected:** Cards show with match reasons
3. **Check:** API response includes `match_score` and `match_reasons`
4. Try different filters (location, phase, etc.)

---

## **END-TO-END USER FLOWS** 🔄

### **15. Complete Participant Journey**
1. **Register** → Login → **Profile Setup**
2. **Browse Trials** → **View Details** → **Save Trial**
3. **Check Analytics** → **See Updated Stats**
4. **Try Different Filters** → **See Filtered Results**

### **16. Clinic User Testing**
1. Register as "clinic" role
2. **Expected:** Different navigation/analytics
3. **Check:** Clinic-specific pages load

---

## **ERROR TESTING** ⚠️

### **17. Authentication Errors**
1. Try accessing protected routes without login
2. **Expected:** Redirect to login
3. Try invalid credentials
4. **Expected:** Error message

### **18. Network Errors**
1. Stop backend server
2. Try any action in frontend
3. **Expected:** Graceful error handling
4. Restart backend, retry

### **19. Invalid Data**
1. Try saving non-existent trial ID
2. **Expected:** 404 error
3. Try malformed API requests
4. **Expected:** Proper error responses

---

## **PERFORMANCE TESTING** 📊

### **20. Load Testing**
```bash
# Test multiple trial requests
for i in {1..10}; do
  curl -s "http://127.0.0.1:8000/trials/?condition=diabetes&limit=50" > /dev/null &
done
```
**Expected:** No crashes, reasonable response times

### **21. Database Persistence**
1. Save/pass several trials
2. Restart backend server
3. Check analytics still show correct counts
4. **Expected:** Data persists across restarts

---

## **CROSS-BROWSER TESTING** 🌍

### **22. Multiple Browsers**
1. Test in Chrome, Firefox, Edge
2. **Expected:** Consistent behavior
3. Check localStorage works across browsers

---

## **MOBILE RESPONSIVENESS** 📱

### **23. Responsive Design**
1. Resize browser window to mobile size
2. Test all pages and interactions
3. **Expected:** Proper mobile layout

---

## **DEBUGGING CHECKLIST** 🔍

### **If Something Breaks:**
1. **Check Console:** Browser dev tools for JavaScript errors
2. **Check Network:** Failed API calls, wrong endpoints
3. **Check Logs:** Backend terminal for Python errors
4. **Check Database:** Data persistence issues
5. **Check Tokens:** JWT expiration or invalid tokens

### **Common Issues:**
- **401 Unauthorized:** Check JWT token validity
- **404 Not Found:** Verify trial IDs and endpoints
- **500 Server Error:** Check backend logs
- **CORS Issues:** Check browser network tab

---

## **FINAL VERIFICATION** ✅

### **24. Complete Test Summary**
- [ ] Backend APIs responding correctly
- [ ] Authentication working
- [ ] Trial data loading
- [ ] User actions (save/pass) working
- [ ] Analytics updating
- [ ] Frontend UI functional
- [ ] No console errors
- [ ] No network failures
- [ ] Data persists
- [ ] Responsive design works

**🎉 If all checks pass, your Sprint #2 is complete!**