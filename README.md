# Leave Tracker

Minimal React + Vite app for tracking team leaves (week view Monday–Saturday).

Setup (PowerShell):

```powershell
cd D:\Code\Git\leave-tracker
npm install
npm run dev
```

Notes
- Data is in-memory sample data. No persistence yet.
- Leaves are persisted to browser localStorage under the key `leave-tracker:leaves`. This works in web and mobile webviews; later you can add sync to a backend API.
- Homepage has week view with collapsible categories and a simple modal to add notes and mark absent.
- Reports page is empty placeholder.
