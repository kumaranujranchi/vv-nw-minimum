# RealHome - Luxury Real Estate Web Portal

A clean, modern, and production-structured local development environment for the RealHome portal.

---

## 🚀 Quick Start (Localhost)

Server is currently running:
👉 **[http://localhost:3000](http://localhost:3000)**

### Run or Restart Server:
```bash
# Using npm
npm start
# or
npm run dev

# Using Node directly
node server.js
```

---

## 📁 Clean Codebase Architecture

```
realhome/
├── assets/                  # Centralized Static Assets
│   ├── css/                 # Stylesheets & theme styles
│   ├── js/                  # JavaScript libraries & handlers
│   ├── images/              # Logos, banners, icons
│   ├── fonts/               # Web fonts & icons
│   ├── lib/                 # Bootstrap, Slick, PhotoSwipe, AOS
│   ├── media/               # Video animations & media
│   └── uploads/             # Project gallery & mastheads
│
├── pages/                   # All HTML Pages
│   ├── about-us.html        # About Us page
│   ├── about-lt.html        # Group background
│   ├── residences.html      # Residential overview
│   ├── residences/          # Individual luxury project pages
│   ├── offices.html         # Commercial offices overview
│   ├── offices/             # Tech parks & business campus pages
│   ├── careers.html         # Careers page
│   ├── csr.html             # Corporate social responsibility
│   ├── buyers-guide.html    # Homebuyer's guide
│   ├── nri-corner.html      # NRI investment corner
│   ├── joint-ventures.html  # Joint ventures & partnerships
│   ├── partner-with-us.html # Channel partner portal
│   ├── know-your-rera.html  # RERA compliance information
│   ├── privacy-policy.html  # Disclaimer & legal policy
│   ├── sitemap.html         # HTML sitemap
│   ├── news.html            # News & media releases
│   ├── news/                # Individual press articles
│   ├── blogs.html           # Real estate insights
│   ├── blogs/               # 200+ localized articles & guides
│   └── events/              # Community & launch events
│
├── index.html               # Main entry homepage
├── server.js                # High-performance route & asset server
├── prefetch.js              # Offline asset caching script
└── package.json             # npm commands & dependencies
```

---

## 🌟 Highlights

- **Clean Structure**: 25+ loose single-file folders removed from root; all pages organized neatly in `pages/` and assets in `assets/`.
- **WordPress Clutter Removed**: Stripped scrap files like `hello-world`, `feed`, empty `rtb-forms`, and `category/uncategorized`.
- **Intelligent URL Routing**: Beautiful URLs without messy extensions (e.g. `http://localhost:3000/about-us`, `http://localhost:3000/residences`, `http://localhost:3000/offices`).
- **Interactive Forms**: Built-in mock API handles enquiry and visit schedule submissions with responsive toast notifications.
