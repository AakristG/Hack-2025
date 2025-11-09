# Troubleshooting Guide

## Application Not Running

If your application isn't running, try these steps:

### 1. Check if Servers Are Running

```bash
# Check if processes are running
ps aux | grep -E "(node|npm)" | grep -v grep

# Check if ports are in use
lsof -ti:5001  # Backend port
lsof -ti:3000  # Frontend port
```

### 2. Kill Suspended/Stopped Processes

If you see processes with status "T" (stopped), kill them:

```bash
# Kill all node processes
pkill -9 node

# Or kill specific ports
lsof -ti:5001 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### 3. Restart the Application

```bash
# From the project root
npm run dev
```

### 4. Check for Errors

**Backend errors:**
- Check the terminal where the server is running
- Look for database initialization errors
- Check if port 5001 is already in use

**Frontend errors:**
- Open browser console (F12)
- Check for compilation errors
- Look for network errors in the Network tab

### 5. Common Issues

**Port Already in Use:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Database Issues:**
```bash
# Reset the database
npm run reset-db
```

**Node Modules Issues:**
```bash
# Reinstall dependencies
rm -rf node_modules client/node_modules
npm run install-all
```

**Environment Variables:**
- Make sure `.env` file exists in root directory
- Make sure `client/.env` exists (if using Firebase)
- Restart servers after changing `.env` files

### 6. Check Server Logs

**Backend should show:**
```
Connected to SQLite database
Server running on port 5001
```

**Frontend should show:**
```
Compiled successfully!
```

### 7. Still Not Working?

1. **Clear everything and restart:**
   ```bash
   # Kill all processes
   pkill -9 node
   
   # Clear node_modules (optional)
   # rm -rf node_modules client/node_modules
   
   # Restart
   npm run dev
   ```

2. **Check browser console** for specific error messages

3. **Check server terminal** for error messages

4. **Verify you're in the correct directory:**
   ```bash
   pwd
   # Should show: /Users/lanemeeks/Documents/GitHub/Hack-2025
   ```

