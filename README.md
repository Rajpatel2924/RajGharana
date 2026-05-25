# RajGharana - A simple eCommerce website

RajGharana is an open-source **Next.js eCommerce frontend** project.  
It provides a modern, fast and customizable shopping UI.  
This repo is **frontend only** – contributors can improve the design, add new pages, animations and more.

---

## Features

-   Built with **Next.js + Tailwind CSS**
-   Responsive design
-   Reusable components
-   Customizable layouts and colors
-   **Razorpay Payment Integration** - Secure payment processing
-   Open for contributions (UI/UX, animations, themes, layouts etc.)

---

## Getting Started

1. Clone the repo

    ```bash
    git clone https://github.com/GreatStackDev/RajGharana.git
    cd RajGharana
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Run locally

    ```bash
    npm run dev
    ```

## 💳 Payment Integration (Razorpay)

RajGharana includes integrated **Razorpay payment gateway** for secure transactions.

### Quick Setup:

1. Sign up at [Razorpay](https://razorpay.com)
2. Get your API keys from the Razorpay Dashboard
3. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Add your Razorpay keys to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

For detailed setup instructions, see [RAZORPAY_SETUP.md](./RAZORPAY_SETUP.md)

---

## Contributing

We welcome all kinds of contributions! You can:

- Create new pages
- Improve layouts
- Add animations and transitions
- Enhance responsiveness
- Refactor components
- Suggest new UI/UX ideas
- Add themes or color variations
- Introduce accessibility improvements
- Add filtering/search features
- Improve documentation

Check out [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the **MIT License**.

---

## 🌟 Contributors

Thanks to everyone who contributes to **RajGharana**!
