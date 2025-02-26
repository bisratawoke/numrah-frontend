## Getting Started

Follow the steps below to set up and run the development server for this Next.js project.

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installation

1. Install dependencies:
   ```shSSSSS
   yarn install
   # or
   npm install
   ```

### Environment Variables

Before running the project, create a `.env` file in the root directory and add the following keys:

```env
OPENAI_API_KEY=
ELEVEN_LABS_API_KEY=
API_URL=
```

#### FYI

The API_URL is the URL to the FastAPI project: https://github.com/bisratawoke/numrah-backend

Replace the values with your actual API keys and URLs.

### Running the Development Server

Start the development server with:

```sh
yarn dev
# or
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000) by default.

### Additional Notes

- Make sure your `.env` file is not committed to version control by adding it to `.gitignore`.
- Refer to the Next.js [documentation](https://nextjs.org/docs) for further details.

Happy coding! 🚀
