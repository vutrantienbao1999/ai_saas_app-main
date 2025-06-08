"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { navLinks } from "@/constants"
import { Button } from "@/components/ui/button"

const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
      </Link>

      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <Sheet>
            <SheetTrigger>
              <Image src="/assets/icons/menu.svg" alt="menu" width={32} height={32} className="cursor-pointer" />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <SheetHeader>
                <SheetTitle><Image src="/assets/images/logo-text.svg" alt="logo" width={152} height={23} className="pt-4 pl-4" /></SheetTitle>
              </SheetHeader>
              <ul className="header-nav_elements">
                {navLinks.map((link) => {
                  const isActive = link.route === pathname;

                  return (
                    <li key={link.route} className={`${isActive && "gradient-text"} p-2 flex whitespace-nowrap text-dark-700`}>
                      <Link
                        href={link.route}
                        className="sidebar-link cursor-pointer"
                      >
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={24}
                          height={24}
                        />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in"></Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default MobileNav