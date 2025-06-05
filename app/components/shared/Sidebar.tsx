"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const pathname = usePathname();


  return (
    <aside className="sidebar">
      <div className="flex h-full flex-col gap-4">
        <Link href="/" className="sidebar-logo">
          <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
        </Link>
        <nav className="sidebar-nav">
          <SignedIn>
            <nav className="flex flex-1 flex-col gap-4">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = link.route === pathname;
                  return (
                    <li key={link.route}>
                      <Link
                        href={link.route}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 ${isActive ? "bg-purple-gradient text-white" : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={24}
                          height={24}
                          className={isActive ? "brightness-200" : ""}
                        />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in"></Link>
            </Button>
          </SignedOut>
        </nav>

      </div>
    </aside>
  );
};

export default Sidebar;