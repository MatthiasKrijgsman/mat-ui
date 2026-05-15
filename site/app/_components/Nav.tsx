import * as React from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Showcase" },
  { href: "/todo", label: "Todo" },
];

export const Nav = () => {
  return (
    <aside className="w-56 shrink-0 border-r border-stone-200 dark:border-stone-800 min-h-screen p-4 sticky top-0">
      <div className="text-base font-bold text-gray-900 dark:text-gray-100 px-2 mb-4">
        mat-ui
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-2 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
