Backend (Node.js)
Refactored blocking I/O:
Replaced all fs.readFileSync calls with asynchronous, non-blocking fs.promises.readFile and fs.promises.writeFile for better performance and scalability.

Improved GET /api/stats performance:
Introduced caching of computed stats to avoid recalculating on every request. Cache is invalidated on data file changes or after a timeout to keep data fresh without excess overhead.

Added unit tests (Jest) for items routes:
Covered happy paths and error cases to ensure robust API behavior.

Pagination and search:
Implemented server-side pagination (page, limit) and search filtering (q parameter) to efficiently handle large datasets.

----

Frontend (React)
Fixed memory leaks:
Added cleanup in useEffect hooks to prevent state updates after component unmount, avoiding memory leaks during async fetches.

Pagination & search:
Integrated client-side UI for pagination and search that works with server API parameters.

Performance optimization:
Integrated react-window to virtualize the list, rendering only visible items and keeping the UI smooth even with large datasets.

UI/UX polish:

Added loading states and skeletons for better feedback.

Improved accessibility with proper ARIA attributes and keyboard navigation.

Added styling for inputs, buttons, and list items with clear disabled states and focus outlines.

