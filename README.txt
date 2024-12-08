# Server Status Dashboard

This project is a **Server Status Dashboard** that allows users to manage and monitor server statuses, including sorting, filtering, and logging in via email or Google authentication. Once logged in, users can view server data, sort it by name or status, and apply filters based on server uptime or status.

**Deployed Version**: [Server Status Dashboard on Vercel](https://server-status-dashboard-lemon.vercel.app/)

---

## Overview

This application provides an intuitive interface for users to interact with server data. Key features include:

- **Authentication**: Users can log in using their email or Google account.
- **Server List**: View a list of servers, including their name, IP address, status, response time, and uptime.
- **Sorting**: Users can sort the list of servers by **name** or **status**.
- **Filtering**: Users can filter the servers by **status** or **uptime** (e.g., from 90% to 100%).
- **Logout**: The user can log out from the dashboard at any time.
  
---

## Features

1. **Login**: 
   - Users can log in using either **Google** or **Email/Password**.
   - Sign-up is required for new users.
   
2. **Dashboard**:
   - Once logged in, users are redirected to the dashboard where they can see the server list.
   - The dashboard allows users to **sort** the server list by **name** or **status**.
   - Users can **filter** servers by **status** (Up, Down, Maintenance) and **uptime** (e.g., from 90% to 100%).
   - Users can **clear filters** to reset the view.

3. **Logout**:
   - A **logout button** at the top-right of the dashboard allows users to log out and return to the home page.

4. **Deployed on Vercel**: 
   - The project is live and deployed on **Vercel**.
   - You can access it here: [https://server-status-dashboard-lemon.vercel.app/](https://server-status-dashboard-lemon.vercel.app/).

---

***Implementation Overview:

Authentication
- Users can log in using either email/password or Google sign-in.
- Firebase Authentication handles both methods. Google authentication is implemented using Firebase's signInWithPopup method, while email/password login is handled through Firebase's signInWithEmailAndPassword.

Server Data
- The server data is fetched from a mock API (using MockAPI) which simulates the server statuses, response times, and uptimes.
- The server list can be sorted by name or status, and users can filter the data based on status (Up, Down, Maintenance) and uptime (e.g., 90% - 100%).

UI and Design
- The application uses a dark theme with a modern, minimalistic design.
- Buttons have hover effects, and form elements (inputs, buttons) have subtle transitions.
- Flexbox and CSS Grid are used to center and position elements responsively.
- React state management (useState, useEffect) handles sorting, filtering, and user authentication.

Deployment
- The application is deployed using Vercel for continuous deployment. Vercel automatically triggers a new deployment whenever changes are pushed to the connected GitHub repository.


Design Choices
- Dark Theme: The dark theme was chosen for a sleek, modern look, as well as for ease of use in low-light environments.
- Minimalist UI: The goal was to create a clean, simple, and intuitive interface. This allows users to focus on the core functionality (viewing, sorting, and filtering server data).
- Responsive Design: The layout is fully responsive, meaning it works well on both desktop and mobile devices.

Troubleshooting
- If the application doesn't show the correct data, verify that the Firebase credentials in .env.local are correctly set up.
- If the app is not deploying correctly, check the Vercel deployment logs for any errors.


