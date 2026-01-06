# 🎬 Can I Watch?

A modern, high-performance web application designed to help users discover movies and TV shows, and find exactly where to stream them (Netflix, Prime Video, Disney+, etc.) based on their region.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

![Project Screenshot](./public/preview.png)

## 🚀 Features

* **Smart Discovery:** Browse trending, top-rated, and genre-specific content.
* **Streaming Availability:** Real-time data showing which platform (Netflix, Apple TV, etc.) hosts the content.
* **Subscription Filtering:** Users can toggle their active subscriptions to filter results dynamically.
* **Detailed Information:** Comprehensive views for Movies, TV Shows, and Cast members.
* **Filmography:** Dedicated pages for actors showing their complete work history.
* **Watchlist:** Local-storage based watchlist to keep track of must-watch content.
* **Search:** Instant search functionality for titles and people.
* **Responsive UI:** Fully responsive design optimized for mobile, tablet, and desktop.
* **Performance:** Server-Side Rendering (SSR) and Client-Side optimization for blazing fast load times.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Data Source:** [TMDB API](https://www.themoviedb.org/documentation/api)
* **Icons:** Lucide React
* **Deployment:** Vercel / Docker
* **State Management:** React Hooks & Local Storage

## 📦 Getting Started

### Prerequisites

* Node.js 18+
* NPM or Yarn
* A TMDB API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/ilkernedim/can-i-watch.git](https://github.com/ilkernedim/can-i-watch.git)
    cd can-i-watch
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your API key:
    ```env
    NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🐳 Docker Support

This project includes a production-ready `Dockerfile` and `docker-compose.yml`.

To run via Docker:

```bash
docker-compose up --build -d

The application will be available at http://localhost:3000.

🤝 Contributing
Contributions, issues, and feature requests are welcome.

