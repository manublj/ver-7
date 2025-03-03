# Wiki Ver8

## Overview

Wiki Ver8 is a Progressive Web Application (PWA) designed as an interactive, structured wiki for documenting, categorizing, and exploring news and Pokémon-related content. It leverages Google Sheets as a lightweight backend database and uses React on the frontend to ensure a fluid, modern user experience.

## Features

- **Article Feed:** Displays a curated feed of Pokémon-related and general news articles categorized as THEORY or REPORTING.
- **Reading Mode:** Offers an enhanced reading interface that parses articles using the Readability API, making text easier to digest.
- **Highlighting & Floating Icons:** Enables users to highlight sections of text; these highlights are then visually represented as floating icons both in the article view and on the homepage feed.
- **Dynamic Content Addition:** A floating 'Add' button lets users input new data. The input form adapts based on the content category selected (THEORY or REPORTING).
- **Google Sheets Integration:** All data is stored and updated dynamically in Google Sheets, ensuring real-time synchronization across the application.
- **Entity-based Organization:** Articles and reports are categorized by entities (e.g., Pokémon, trainers, organizations, events).
- **Offline Functionality:** Utilizes Progressive Web App capabilities for offline access.
- **Complete Table Views:** View complete database tables for all Google Sheets data.

## Project Structure

### Backend (Google Sheets)

The backend consists of a single Google Spreadsheet divided into four sheets:

1. **theory (Stores news excerpts and metadata)**

   - Fields:
     - CATEGORY (THEORY / REPORTING) *(dropdown)*
     - KEYWORDS *(dropdown)*
     - SRC-TYPE *(post, article, book, pdf)* *(dropdown)*
     - POST (Platform: IG, FB, X, YT) *(if SRC-TYPE = post)*
     - POST_CONTENT *(text of social-media post)*
     - HEADLINE (Title) *(if SRC-TYPE = article)*
     - DOMAIN (Website source) *(dropdown)*
     - HIGHLIGHTS (Excerpted text from the article)
     - WHO (Entity mentioned) *(dropdown)*
     - WHO_TYPE (Entity type: Pokémon, Trainer, Item) *(dropdown)*
     - SPECTRUM (Bias classification) *(dropdown)*
     - DATE_PUBLISHED

2. **reporting (Stores summaries, sources, and authorship)**

   - Fields:
     - CATEGORY (THEORY / REPORTING) *(dropdown)*
     - HEADLINE (Title)
     - REGION *(dropdown)*
     - SRC-TYPE *(post, article, book, pdf)* *(dropdown)*
     - POST (Platform) *(if SRC-TYPE = post)*
     - DOMAIN (Website source) *(if SRC-TYPE = article)*
     - HIGHLIGHTS (Excerpted text from the article)
     - URL (Link to full article)
     - WHO (Entity mentioned) *(dropdown)*
     - WHO_TYPE (Entity type) *(dropdown)*
     - SPECTRUM (Bias classification) *(dropdown)*
     - DATE_PUBLISHED

3. **WHO (Entity Information)**

   - Reserved for future details about entities.

4. **CARDS (Stores entity-based data)**

   - Fields:
     - WHO (Entity name) *(dropdown)*
     - WHO_TYPE (Character, Political Party, Movement) *(dropdown)*
     - SPECTRUM (LEFT, CENTRE, RIGHT) *(dropdown)*

### Frontend (React PWA)

- **Homepage:**

  - Displays a complete feed of articles pulled from the 'theory' sheet.
  - Each item in the feed shows:
    - Headline (top-left)
    - Reading Progress (bottom-left)
    - Author (bottom-right as tag)
    - Domain (bottom-right as tag)
  - Clicking an item opens the Reading Mode.
  - Toggle between card view and complete table view of data.

- **Reading Mode:**

  - Parses articles using the Readability API.
  - Allows users to highlight text, which turns yellow.
  - Highlights are displayed as floating icons within the article and homepage feed.

- **Adding New Entries:**

  - Features a floating 'Add' button that triggers a form for inputting new data.
  - Users select a CATEGORY (THEORY or REPORTING), determining the target backend sheet.
  - The form dynamically adapts based on the chosen category and source type.

- **CARDS Page:**

  - Displays entity-based cards consolidating related articles.
  - Provides full table views of all sheets for reference.
  - Filter entities by Character, Political Party, or Movement.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Google Cloud Platform account with Sheets API enabled
- Google Service Account with access to your spreadsheet

### Installation and Setup

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:3000
   REACT_APP_GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
   REACT_APP_GOOGLE_API_KEY=your-google-api-key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Key Dependencies

- React 18.2.0
- React Bootstrap 2.8.0
- @mozilla/readability 0.4.4
- Google Spreadsheet 4.1.0
- Workbox PWA tools 7.0.0
- Axios 1.5.0
- React Icons 4.10.1

## Development

- Uses `react-app-rewired` for custom Webpack configuration.
- PWA optimization with Workbox.
- Development mode includes hot reloading and debugging tools.

## License

This project is licensed under the MIT License - see the LICENSE file for details.