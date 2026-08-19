# Personal Portfolio Website

A premium, dark-mode personal portfolio website built with pure HTML, CSS, and JavaScript. Zero dependencies, lightning fast, and ready to deploy on GitHub Pages.

## Features

- 🌙 Stunning dark mode with glassmorphism design
- ✨ Smooth scroll-reveal animations
- 📱 Fully responsive (mobile, tablet, desktop)
- ⚡ Zero dependencies — no build step required
- 🎨 Customizable design tokens via CSS variables
- ♿ Accessible with semantic HTML and ARIA labels
- 🔍 SEO optimized with meta tags

## Sections

1. **Hero** — Animated gradient background with typing effect
2. **About** — Bio with animated stat counters
3. **Skills** — Categorized skill bars with progress animation
4. **Projects** — Filterable project grid with hover effects
5. **Experience** — Animated vertical timeline
6. **Testimonials** — Auto-rotating carousel
7. **Contact** — Form + social media links
8. **Blog** — Preview cards for blog posts

## 🚀 Deploy to GitHub Pages

### Option 1: Quick Deploy

1. Create a new repository on GitHub
2. Push these files to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. Go to **Settings → Pages** in your GitHub repo
4. Under "Source", select **Deploy from a branch**
5. Choose `main` branch, `/ (root)` folder, and click **Save**
6. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

### Option 2: Use as GitHub User Site

1. Create a repo named `YOUR_USERNAME.github.io`
2. Push these files to `main`
3. Your site will automatically be live at `https://YOUR_USERNAME.github.io/`

## 🎨 Customization Guide

### Personal Info
Open `index.html` and search for `<!-- CUSTOMIZE:` comments to find all placeholder content that should be replaced with your own info.

### Design Tokens
Open `style.css` and modify the CSS variables in `:root` to change colors, fonts, and spacing:

```css
:root {
  --bg-primary: #0a0a0f;        /* Main background */
  --bg-surface: #12121a;         /* Card backgrounds */
  --accent-cyan: #00d4ff;        /* Primary accent */
  --accent-purple: #7c3aed;      /* Gradient end */
  --accent-amber: #f59e0b;       /* Highlight color */
  --text-primary: #e2e8f0;       /* Main text */
  --text-secondary: #94a3b8;     /* Muted text */
}
```

### Adding Real Projects
In `index.html`, find the projects section and duplicate a `.project-card` block. Update the `data-category` attribute for filtering.

### Contact Form
To make the contact form functional:
1. Sign up at [Formspree](https://formspree.io/)
2. Replace the form `action` attribute with your Formspree endpoint
3. Remove the JavaScript form handler in `script.js`

## 📁 File Structure

```
portfolio/
├── index.html    # Main HTML file
├── style.css     # Styles and design system
├── script.js     # Interactivity and animations
└── README.md     # This file
```

## License

Free to use and modify for personal and commercial projects.
