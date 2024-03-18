# Next BlockEditor App

## Installation & Usage

To begin, clone the tiptap-templates repository from GitHub using the following command:

```bash
git clone git@github.com:ueberdosis/tiptap-templates.git
```

This command clones the entire repository, providing access to all the Tiptap templates currently available. The block
editor template is located in `templates/next-block-editor-app`.

Proceed with the following steps:

```bash
# Duplicate the example environment file and adjust the necessary settings in the .env file
# Ensure the inclusion of your Tiptap cloud token and application IDs in the .env file
cp .env.example .env

# Install project dependencies
npm install

# Launch the development server
npm run dev

# Access the application at http://localhost:3000
```

## Usage Guidelines

The BlockEditor template is a fully functional Next.js application, akin to Notion or Dropbox Paper, suitable as a
foundation for your projects or as a base for a custom editor.

Key features of the template include:

- A Next.js setup with TypeScript
- A basic Tailwind setup for styling
- Pre-configured links to Tiptap Cloud for collaboration and data persistence.
- A Block Editor with a basic set of nodes and marks but also more advanced features like
  - Drag & Drop via a DragHandle
  - A fleshed out menu bar for text editing and formatting
  - Link editing
  - mocked image uploading that can be hooked up to your backend

You can either start a fresh project from this editor or copy over the editor or parts you need to your own projects.
Make sure to check out the [Tiptap documentation](https://tiptap.dev) for more information on how to use Tiptap.

## Folder structure

The template is structured as a Next.js app with a few additional folders and files:

- **components** Includes all React components used in the app
  - **BlockEditor** the wrapping BlockEditor setup component
  - **menus** a set of menus used in the editor (for example Link, Text and DragHandle menus)
  - **panels** popover menus used in menu bars for example the Colorpicker or Link editor
  - **Sidebar** the sidebar component
  - **TableOfContents** the table of contents component used for navigation
  - **ui** general reusable UI components used across the application
- **context** A place to put React contexts that are used in the app
- **extensions** Includes all Tiptap extensions used in the app including their NodeViews and logic parts
- **hooks** Including general hooks used for app and editor setup
- **lib** Includes helper functions
- **styles** Includes global CSS styles with Tailwind to setup richtext styling
