# Freelancer Dashboard

A fully responsive Freelancer Dashboard built with Next.js, TypeScript, Tailwind CSS, ShadCN UI, and Framer Motion. This dashboard allows freelancers to manage their job offers, track ongoing projects, and receive notifications in real-time.

## Features

### 🔥 Freelancer Overview
- Displays a personalized greeting for the logged-in freelancer.
- Provides a quick summary of pending offers and ongoing projects.

### 📩 Job Offers Management
- Fetches job offers dynamically based on the freelancer's email.
- Each offer includes details like title, message, budget, and deadline.
- Options to **Accept** or **Deny** offers with smooth UI interactions.
- Uses `tRPC` mutations to update the offer status.

### 📊 Projects Section
- Displays a list of projects assigned to the freelancer.
- Shows project details like title, description, budget, deadline, and status.
- Animated hover effects to enhance user experience.

### 🔔 Real-time Notifications
- A **Bell Icon** in the top-right corner triggers the notification dropdown.
- Notifications appear as a smooth pop-up card.
- The timestamp is labeled as **"Now"** to indicate real-time alerts.

### 🎨 Modern UI & Animations
- Built with **Tailwind CSS** for a sleek and responsive design.
- Uses **Framer Motion** for smooth animations and transitions.
- **ShadCN UI** components ensure a professional look and feel.

## Tech Stack
- **Next.js** – Server-side rendering and API handling.
- **TypeScript** – Strict typing for better maintainability.
- **Tailwind CSS** – Utility-first styling.
- **ShadCN UI** – Beautiful UI components.
- **Framer Motion** – Smooth animations.
- **tRPC** – API communication without boilerplate.
- **NextAuth.js** – Secure authentication.

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/freelance-dashboard.git
   cd freelance-dashboard
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Screenshots
![Dashboard Overview](IMAGE_URL_HERE)
![Job Offers](IMAGE_URL_HERE)
![Projects Section](IMAGE_URL_HERE)
![Notifications](IMAGE_URL_HERE)

## Folder Structure
```
freelance-dashboard/
│-- app/
│   ├── _components/ui/   # Reusable UI components
│   ├── dashboard/        # Dashboard layout & logic
│   ├── auth/             # Authentication handling
│-- lib/
│   ├── trpc.ts           # API utilities with tRPC
│-- pages/
│-- public/
│-- styles/
│-- README.md
```

## Future Improvements
- ✅ Dark mode support
- ✅ More detailed job insights
- ✅ In-app messaging system

## Contributing
Pull requests are welcome! For major changes, open an issue first to discuss the changes.

## License
MIT License © 2025 Akshay

