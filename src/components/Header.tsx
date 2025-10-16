import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            <Link href="/">My Blog</Link>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/login">Login</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
