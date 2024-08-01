"use client";
import React, { useEffect, useState, Fragment } from "react";
import { Disclosure, Menu, Transition,MenuItem,MenuItems,MenuButton,MenuHeading,DisclosurePanel,DisclosureButton } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useSession, signIn, signOut } from "next-auth/react";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "About", href: "/about", current: false },
];

const services = [
  { name: "Pomodoro", href: "/services/pomodoro", current: false },
  { name: "Task Schedule", href: "/services/task-schedule", current: false },
  { name: "Notes", href: "/services/notes", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NavComp() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);

  // Load notifications from local storage when the component mounts
  // useEffect(() => {
  //   const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
  //   setNotifications(savedNotifications);
  // }, []);

  // useEffect(() => {
  //   if (session) {
  //     const ws = new WebSocket(`ws://localhost:8080?user=${encodeURIComponent(session.user.name)}`);
  
  //     ws.onopen = () => {
  //       console.log("Connected to the WebSocket server");
  //     };
  
  //      ws.onmessage = async (event) => {
  //       try {
  //         const message = JSON.parse(event.data);
  //         console.log("Message from server:", message);
  //         setNotifications((prev) => {
  //           const updatedNotifications = [...prev, message];
  //           console.log("Setting the notifications function: ", prev)
  //           // Save notifications to local storage
  //           localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  //           return updatedNotifications;
  //         });
  //       } catch (error) {
  //         console.error("Error parsing message:", error);
  //       }
  //     };
  //     if(ws.readyState===1){
  //     ws.onclose = () => {
  //       console.log("Disconnected from the WebSocket server");
  //     };
  //   }
  
  //     ws.onerror = (error) => {
  //       console.error("WebSocket error:", error);
  //     };
  
  //     return () => {
  //       ws.close();
  //     };
  //   }
  // }, [session]);

  // useEffect(() => {
  //   console.log("Notifications:", notifications);

  // }, [notifications]);
  // function handleNotification(index){
  //   const updatedNotifications = [...notifications];
  //   updatedNotifications.splice(index, 1);
  //   setNotifications(updatedNotifications);
  //   localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  //   console.log("index: ", index)
  // }  

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon
                      aria-hidden="true"
                      className="block h-6 w-6 group-data-[open]:hidden"
                    />
                  ) : (
                    <Bars3Icon
                      aria-hidden="true"
                      className="block h-6 w-6 group-data-[open]:block"
                    />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <p className="font-bold text-white sm:none md:block">Student Synergy</p>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? "page" : undefined}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )}
                      >
                        {item.name}
                      </a>
                    ))}

                    <Menu as="div" className="relative">
                      <div>
                        <MenuButton className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white">
                          Services
                        </MenuButton>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {services.map((item) => (
                            <MenuItem key={item.name}>
                              {({ active }) => (
                                <a
                                  href={item.href}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </a>
                              )}
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                    {session && (
                      <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4 text-white">
                          <button onClick={() => signOut()}>Sign out</button>
                          <p>{session.user.name}</p>
                        </div>
                      </div>
                    )}
                    {!session && (
                      <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4 text-white" >
                          <button onClick={() => signIn("google")}>Sign in</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="relative">
                  <MenuButton className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon aria-hidden="true" className="h-6 w-6" />
                  </MenuButton>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-48">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <MenuItem key={index}>
                            <div className="block px-4 py-2 text-sm text-gray-700" onClick={() => handleNotification(index)}>
                              <span>
                                {notification}
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 64 64">
                                  <path d="M 28 11 C 26.895 11 26 11.895 26 13 L 26 14 L 13 14 C 11.896 14 11 14.896 11 16 C 11 17.104 11.896 18 13 18 L 14.160156 18 L 16.701172 48.498047 C 16.957172 51.583047 19.585641 54 22.681641 54 L 41.318359 54 C 44.414359 54 47.041828 51.583047 47.298828 48.498047 L 49.839844 18 L 51 18 C 52.104 18 53 17.104 53 16 C 53 14.896 52.104 14 51 14 L 38 14 L 38 13 C 38 11.895 37.105 11 36 11 L 28 11 z M 18.173828 18 L 45.828125 18 L 43.3125 48.166016 C 43.2265 49.194016 42.352313 50 41.320312 50 L 22.681641 50 C 21.648641 50 20.7725 49.194016 20.6875 48.166016 L 18.173828 18 z"></path>
                                </svg>
                              </span>
                            </div>
                          </MenuItem>
                        ))
                      ) : (
                        <div className="block px-4 py-2 text-sm text-gray-700">
                          No new notifications
                        </div>
                      )}
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ))}

              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="inline-flex items-center text-sm font-medium text-gray-300 hover:text-white">
                    Services
                  </MenuButton>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute left-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {services.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
