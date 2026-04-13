# OpenEdge

**OpenEdge** is a specialized trading terminal and workflow engine designed for high-conviction traders and small teams. It bridges the gap between raw market data and disciplined trade execution, focusing on hypothesis tracking, rule enforcement, and execution analysis.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://open-edge-phi.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## ⚡ Core Features

- **Live Market Tape**: High-density real-time quotes and breaking news ticker (Yahoo Finance, CNBC, CoinGecko).
- **Hypothesis Engine**: Systematic trade planning and review (Drizzle ORM + SQLite).
- **Rule Enforcement**: Integrated behavioral guardrails to track FOMO, revenge trading, and drift.
- **Dynamic Workspaces**: Flexible, persistent dashboard layouts using `PanelWorkspace`.
- **TradingView Integration**: Fully integrated multi-chart grid with ticker synchronization.
- **Execution Scorecards**: Detailed post-trade analysis and performance metrics.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Runtime**: [React 19](https://react.dev/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) with [libSQL](https://github.com/tursodatabase/libsql) (SQLite)
- **Styling**: Tailwind CSS + Framer Motion
- **State**: React Context + Custom Hooks
- **Icons**: Lucide React

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [pnpm 9+](https://pnpm.io/)

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/john-formanek-code/OpenEdge.git
cd OpenEdge

# Install dependencies
pnpm install

# Environment setup
cp .env.example .env.local

# Database migration
pnpm drizzle-kit push

# Start development server
pnpm dev
```
Open [http://localhost:2500](http://localhost:2500) to access the terminal.

---

## 🌍 Deployment

### Vercel
1. Push your fork to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set your environment variables (see `.env.example`).
4. (Optional) Connect a [Turso](https://turso.tech/) database for a managed libSQL experience.

---

## 🧪 Quality & Testing

Ensure code quality with the built-in check suite:
```bash
pnpm check
```
This runs TypeScript validation, linting, and basic formatting checks.

---

## 🤝 Contributing

Contributions are welcome! Whether it's a new feature, bug fix, or documentation improvement:
1. Review the [Contributing Guide](CONTRIBUTING.md).
2. Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).
3. Open a Pull Request with a clear description of changes.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

*OpenEdge is an open-source tool for informational and workflow purposes only. Always manage your risk responsibly.*
