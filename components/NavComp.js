"use client";
import React, { Fragment } from "react";
import { Disclosure, Menu, Transition, DisclosurePanel, DisclosureButton,MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

// Organized navigation configuration
const NAVIGATION_CONFIG = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
  ],
  dashboard: [
    { name: "Task Schedule", href: "/Tracker", description: "Manage your daily tasks" },
    { name: "Pomodoro", href: "/services/pomodoro", description: "Focus timer" },
    { name: "Notes", href: "/services/notes", description: "Take and organize notes" },
  ],
  community: [
    { name: "All Posts", href: "/AllPosts", description: "View community posts" },
    { name: "Create Post", href: "/Community", description: "Share with others" },
    { name: "Leaderboard", href: "/LeaderBoard", description: "Top performers" },
    { name: "My Posts", href: "/MyPosts", description: "Your contributions" },
  ],
  profile: [
    { name: "My Profile", href: "/User_Profile", description: "View and edit profile" },
  ]
};

const MenuTransition = ({ children }) => (
  <Transition
    as={Fragment}
    enter="transition ease-out duration-200"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-150"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

const DropdownMenu = ({ items, title }) => (
  <Menu as="div" className="relative">
    <MenuButton className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
      {title}
    </MenuButton>
    <MenuTransition>
      <MenuItems className="absolute z-10 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {items.map((item) => (
          <MenuItem key={item.name}>
            {({ active }) => (
              <Link
                href={item.href}
                className={`${
                  active ? "bg-gray-100" : ""
                } block px-4 py-2 text-sm`}
              >
                <div className="text-gray-700 font-medium">{item.name}</div>
                {item.description && (
                  <div className="text-gray-500 text-xs mt-0.5">{item.description}</div>
                )}
              </Link>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </MenuTransition>
  </Menu>
);

export default function NavComp() {
  const { data: session } = useSession();

  return (
    <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="flex sm:hidden">
                <DisclosureButton className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-white font-bold text-xl">
                  Student Synergy
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                {NAVIGATION_CONFIG.main.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                
                <DropdownMenu items={NAVIGATION_CONFIG.dashboard} title="Dashboard" />
                <DropdownMenu items={NAVIGATION_CONFIG.community} title="Community" />
                
                {session && (
                  <>
                    <DropdownMenu 
                      items={NAVIGATION_CONFIG.profile}
                      title={session.user.name}
                    />
                    <button
                      onClick={() => signOut()}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Sign out
                    </button>
                  </>
                )}
                
                {!session && (
                  <button
                    onClick={() => signIn("google")}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign in
                  </button>
                )}

                {/* Notifications */}
                <Menu as="div" className="relative">
                  <MenuButton className="text-gray-400 hover:text-white p-1 rounded-full">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" />
                  </MenuButton>
                  <MenuTransition>
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <MenuItem>
                        <div className="block px-4 py-2 text-sm text-gray-700">
                          No notifications
                        </div>
                      </MenuItem>
                    </MenuItems>
                  </MenuTransition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {NAVIGATION_CONFIG.main.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              
              <div className="px-3 py-2 text-gray-400 text-sm font-medium">Dashboard</div>
              {NAVIGATION_CONFIG.dashboard.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              
              <div className="px-3 py-2 text-gray-400 text-sm font-medium">Community</div>
              {NAVIGATION_CONFIG.community.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                >
                  {item.name}
                </DisclosureButton>
              ))}
              
              {session && (
                <>
                  <div className="px-3 py-2 text-gray-400 text-sm font-medium">Profile</div>
                  {NAVIGATION_CONFIG.profile.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      href={item.href}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium pl-6"
                    >
                      {item.name}
                    </DisclosureButton>
                  ))}
                  <div className="px-3 py-2">
                    <button
                      onClick={() => signOut()}
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
              
              {!session && (
                <div className="px-3 py-2">
                  <button
                    onClick={() => signIn("google")}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}