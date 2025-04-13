# AI Code Bug Fixer

A lightweight AI-powered tool to automatically fix bugs in your code. Built with Next.js, TailwindCSS, and Hugging Face's free AI models. No OpenAI API keys required!

## Features

- Supports multiple programming languages (JavaScript, Python, Java, C++, C#, PHP, Ruby, Go, Swift)
- Free to use (uses Hugging Face's models instead of OpenAI)
- Easy to deploy on Vercel
- Minimal dependencies
- Clean, responsive UI

## Getting Started

### Prerequisites

- Node.js 14.x or later
- npm or yarn
- (Optional) A free Hugging Face account for API token

### Installation

1. Clone this repository:
   ```
   git clone <your-repo-url>
   cd ai-code-bug-fixer
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file:
   ```
   HUGGING_FACE_API_KEY=your_hugging_face_token  # Optional but recommended
   ```
   
   You can get a free token from [Hugging Face settings](https://huggingface.co/settings/tokens).
   Note: The app works without a token but may hit rate limits.

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploying to Vercel

1. Create a Vercel account if you don't have one at [vercel.com](https://vercel.com)

2. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

3. Deploy:
   ```
   vercel
   ```

4. Add your environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add your `HUGGING_FACE_API_KEY` (if you have one)

## How It Works

1. The app sends your code to an API endpoint.
2. The endpoint uses Hugging Face's CodeLlama model to analyze and fix the code.
3. The model identifies bugs, fixes them, and provides an explanation.
4. The fixed code and explanation are returned to the user interface.

## Limitations

- The Hugging Face free tier has rate limits
- Complex bugs may not be perfectly fixed
- Very large code samples may be truncated

## License

This project is licensed under the MIT License - see the LICENSE file for details.
