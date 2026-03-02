# WhatsApp Module Structure

## Entry Points
- `Main.jsx` -> main container orchestration
- `LoginPage.jsx` -> compatibility wrapper to auth feature

## Feature Folders
- `features/auth` -> authentication UI (`LoginPage`)
- `features/layout` -> WhatsApp shell navigation (`LeftSidebar`)
- `features/chats` -> chat list, settings menu, and active chat UI
- `features/users` -> user management panel

## Shared Components
- `shared/SearchInput.jsx`
- `shared/FilterChips.jsx`
- `shared/ContactCard.jsx`

## Legacy
- `legacy/` stores old/duplicate files kept for reference only.
