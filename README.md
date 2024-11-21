# Exhibition Curator

A web application that allows users to create virtual art exhibitions by curating artworks from the Metropolitan Museum of Art and Harvard Art Museums.

## Live Demo

Visit the live application at: [Exhibition Curator](https://ka-exhibition-curator.netlify.app/)

## Features

- Search and explore artworks from multiple prestigious museums
- View detailed artwork information including high-resolution images
- Create personal exhibitions by selecting favorite artworks
- Navigate between artworks with previous/next functionality
- Sort and filter artworks by various criteria
- Responsive design for all device sizes
- Accessible user interface

## Technologies Used

- React 18
- React Router v6
- Tailwind CSS
- Lucide React Icons
- DND Kit for drag-and-drop functionality
- Metropolitan Museum of Art API
- Harvard Art Museums API

## Local Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/exhibition-curator.git
cd exhibition-curator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_HARVARD_API_KEY=your_harvard_api_key
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Building for Production

To create a production build:
```bash
npm run build
```

## API Documentation

### Metropolitan Museum of Art API
- Base URL: https://collectionapi.metmuseum.org/public/collection/v1
- No authentication required
- [Official Documentation](https://metmuseum.github.io/)

### Harvard Art Museums API
- Base URL: https://api.harvardartmuseums.org
- Requires API key
- [Official Documentation](https://github.com/harvardartmuseums/api-docs)

## Deployment

The application is deployed on Netlify. To deploy your own instance:

1. Create a Netlify account
2. Run `npm run build` to create a production build
3. Run `netlify deploy` and follow the prompts
4. For production deployment, use `netlify deploy --prod`

## Accessibility

This application follows WCAG 2.1 guidelines and includes:
- Proper heading hierarchy
- ARIA labels where necessary
- Keyboard navigation support
- High contrast text
- Alt text for images
- Focus indicators

## Project Structure

```
exhibition-curator/
├── public/
├── src/
│   ├── api/               # API integration
│   ├── components/        # React components
│   ├── contexts/          # Context providers
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Acknowledgments

- Metropolitan Museum of Art for their open access API
- Harvard Art Museums for their comprehensive API
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for the styling system