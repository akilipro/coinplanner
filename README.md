# CoinBuy Planner

CoinBuy Planner is a secure crypto purchase planning app built with [Next.js](https://nextjs.org), [NextAuth.js](https://next-auth.js.org/), [MongoDB](https://www.mongodb.com/), and [Tailwind CSS](https://tailwindcss.com). Only registered users can add/view their own data. Each saved plan is linked to the user. Non-registered users see only a landing page optimized for conversion.

## Getting Started

## Features

- User authentication (Email, Google, Facebook)
- Each user sees only their own saved plans
- Add, edit, delete, and mark coins as bought
- Responsive and clean UI with Tailwind CSS
- Secure MongoDB data storage
- Conversion-optimized landing page for new users

## Getting Started

1. Clone the repo and install dependencies:

   ```bash
   npm install
   # or yarn install
   ```

2. Create a `.env.local` file with your MongoDB URI and NextAuth provider secrets:

   ```env
   MONGO_URI=your_mongodb_uri
   EMAIL_SERVER=your_email_server
   EMAIL_FROM=your_email_from
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   FACEBOOK_CLIENT_ID=your_facebook_client_id
   FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to use the app.

## Authentication & User Data

- Only authenticated users (Email, Google, Facebook) can add/view their own plans.
- Each plan is linked to the user who created it.
- Non-authenticated users see only the landing page and cannot access planner features.

## Landing Page

Visitors who are not logged in see a conversion-optimized landing page with a call to action to register or sign in.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## License

This project is open source and available under the [MIT License](LICENSE).
