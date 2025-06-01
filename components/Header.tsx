import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="border-b p-4 bg-gray-200">
      <Link href="/">
        <h2 className="text-2xl font-bold font-merriweather container mx-auto">
          NewsGuardian.AI
        </h2>
      </Link>
    </header>
  );
};

export default Header;
