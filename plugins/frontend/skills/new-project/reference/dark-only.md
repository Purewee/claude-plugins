# Dark only

Use this only when the user asked for a dark-only app (the form offers light only, or light + dark with a toggle). Generate the project light only, then:

- Put `class="dark"` on `<html>`: in `index.html` (Vite), or `className={`${fontSans.variable} dark`}` in the root layout (Next.js). shadcn's `.dark` block then switches the semantic tokens.
- In `index.css` / `globals.css`, give the brand roles app code uses their dark values instead of the light ones: `primary #d0bcff`, `on-primary #381e72`, `primary-hover #e8ddff`, `surface #141218`, `on-surface #e6e0e9`, `on-surface-variant #cac4d0`, `surface-container-low #1d1b20`, `surface-container #211f26`, `outline #938f99`, `outline-variant #49454f`, `inverse-surface #e6e0e9`, `inverse-on-surface #322f35`.
- Write no `dark:` classes and no toggle.
