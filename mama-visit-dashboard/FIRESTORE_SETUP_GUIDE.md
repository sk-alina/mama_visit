# 🔥 Firestore API Setup Guide

## Step-by-Step Instructions to Enable Firestore API and Fix Persistence

### **Method 1: Using Google Cloud Console (Recommended)**

#### Step 1: Open the Google Cloud Console
1. Open your web browser
2. Go to: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=mamavisit1
3. Make sure you're signed in with the same Google account you used for Firebase

#### Step 2: Enable the Firestore API
1. You should see a page titled "Cloud Firestore API"
2. If the API is disabled, you'll see a blue "ENABLE" button
3. Click the **"ENABLE"** button
4. Wait for the API to be enabled (this usually takes 30-60 seconds)
5. You should see a confirmation message

#### Step 3: Initialize Firestore Database
1. Open your terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd "G:\Coding\v2\mama-visit-dashboard"
   ```
3. Run the following command to create the Firestore database:
   ```bash
   firebase firestore:databases:create "(default)" --project mamavisit1 --location=us-central1
   ```
4. Wait for the database to be created

#### Step 4: Deploy Security Rules
1. In the same terminal, run:
   ```bash
   firebase deploy --only "firestore:rules" --project mamavisit1
   ```
2. This will deploy the security rules that allow read/write access for testing

### **Method 2: Using Firebase Console (Alternative)**

#### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/
2. Click on your project "mamavisit1"

#### Step 2: Set up Firestore
1. In the left sidebar, click on **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (this allows read/write access for testing)
4. Click **"Next"**
5. Choose **"us-central1"** as the location
6. Click **"Done"**

### **Step 5: Test the Fix**

After completing either method above:

1. **Start your development server** (if not already running):
   ```bash
   cd "G:\Coding\v2\mama-visit-dashboard"
   npm start
   ```

2. **Open your browser** and go to: http://localhost:3000

3. **Navigate to the Itinerary page** (click "Расписание" in the sidebar)

4. **Test persistence**:
   - Click "Добавить событие" (Add Event)
   - Fill out the form with a test event
   - Click "Добавить" (Add)
   - **Refresh the page** (F5 or Ctrl+R)
   - **Verify the event is still there**

### **Expected Results After Enabling Firestore:**

✅ **No more Firebase connection errors** in the browser console
✅ **Events persist** after page refresh
✅ **Real-time updates** work properly
✅ **All CRUD operations** (Create, Read, Update, Delete) function correctly

### **Troubleshooting:**

If you encounter any issues:

1. **Wait 2-3 minutes** after enabling the API for changes to propagate
2. **Clear your browser cache** and refresh the page
3. **Check the browser console** for any remaining error messages
4. **Restart the development server** if needed

### **Security Note:**

The current setup uses permissive security rules for testing. For production use, you should implement proper authentication and more restrictive security rules.

### **What Was Fixed:**

1. ✅ **Firebase Configuration**: Updated with real API keys and project settings
2. ✅ **Date Picker Dependencies**: Installed required packages
3. ✅ **Error Handling**: Added better logging and validation
4. ✅ **Security Rules**: Created firestore.rules file
5. 🔧 **Firestore API**: Needs manual activation (follow steps above)

Once you complete the Firestore API setup, your schedule items will persist perfectly across page refreshes!
