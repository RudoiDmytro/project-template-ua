# Best Shop - E-Commerce Website

![Best Shop Homepage](image.png)

## Project Structure

```
/
├── src/
│   ├── assets/         # Images, logos, and data.json
│   ├── components/     # Reusable HTML partials (header, footer)
│   ├── js/             # JavaScript source files (modularized)
│   │   ├── pages/      # Page-specific JS modules
│   │   ├── cart.js
│   │   ├── main.js     # Main JS entry point
│   │   ├── ui.js
│   │   └── utils.js
│   ├── pages/          # HTML pages
│   └── scss/           # Sass source files
│       ├── abstracts/
│       ├── base/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       └── main.scss   # Main Sass entry point
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

Follow these instructions to set up and run the project locally on your machine for development and testing purposes.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and npm (Node Package Manager) installed on your system. You can verify your installation by running:

```sh
node -v
npm -v
```

### Installation

1.  **Clone the repository** (or download the source code)

2.  **Install project dependencies:**
    This project uses `sass` for compiling SCSS to CSS, and `serve` for running a local development server. These are listed as `devDependencies` in `package.json`. Install them by running:
    ```sh
    npm install
    ```

### Running the Project

The project includes two main scripts in `package.json` to streamline development.

1.  **Compile Sass:**
    This command watches for any changes in your `.scss` files and automatically compiles them into a single `main.css` file in the `src/css` directory. Run this in a separate terminal window and leave it running while you work:
    ```sh
    npm run sass
    ```

2.  **Start the Development Server:**
    This command starts a local web server that serves the `src` directory as the website's root. This is the recommended way to view the project.
    ```sh
    npm run start
    ```

After running `npm run start`, your browser should automatically open to `http://localhost:3000` (or another available port). You can now view and interact with the website.