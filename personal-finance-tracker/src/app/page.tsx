import TransactionsPage from "./transactions/page";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-muted/10 to-background flex flex-col items-center justify-start py-12 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">
          Personal Finance Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Track your expenses, analyze your spending, and stay on top of your finances with ease.
        </p>
      </header>
      <section className="w-full max-w-6xl">
        <TransactionsPage />
      </section>
    </main>
  );
}
