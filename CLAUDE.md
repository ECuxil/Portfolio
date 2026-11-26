# Portfolio website (GitHub Pages, static)

Static portfolio site: About page (index.html) and Portfolio page (portfolio.html).
Projects are rendered from data/projects.json by js/main.js.

## Design rules (do not change without asking)
- Section titles have a green rectangle (#007A33, 0.13in high) as wide as the text.
- Each project: image 2.26in x 2.22in, teal bar (#0D6C7C, 1.00in x 0.10in), title, first sentence only + [expand].
- Clicking an image opens an enlarged view with the text on the right.
- Two columns on desktop, one column on mobile, always respecting side margins.
- Alignment, margins and the colored rectangles must always stay.

## Security rules (strict)
- Static files only. No backend, no GitHub API calls, no tokens, no secrets.
- No third-party scripts, fonts or analytics. Keep the Content-Security-Policy meta tags.
- Never use innerHTML or inline scripts/styles/event handlers. Use textContent.
- Links must be https. External links use rel="noopener noreferrer".
- Never add private repo content, personal data or credentials.
- Run `bash scripts/audit.sh` after every change; all lines must show a check mark.

## Workflow
- Preview locally with `python3 -m http.server` (fetch does not work from file://).
- Show me a summary of changes before committing. Never push without asking.
- Content is "All rights reserved" (see LICENSE). Keep the footer notice.
