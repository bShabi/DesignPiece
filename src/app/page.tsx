import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center py-20">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Design Your Perfect Piece
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Create and sell custom clothing designs. From T-shirts to socks, bring your ideas to life with our intuitive design platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started
              </Button>
            </Link>
            <Link href="/design">
              <Button size="lg" variant="outline">
                Try Designer
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-8 py-16">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Design</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Create unique designs with our intuitive canvas editor. Add text, images, and choose from various styles.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Sell</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Open your own shop and start selling your designs to customers worldwide.
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Track</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your orders and track their status from production to delivery.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
} 