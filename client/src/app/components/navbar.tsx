import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar({
  showFullNav,
  isLoggedIn,
  user,
  displayHandler,
}: {
  showFullNav: boolean;
  isLoggedIn: boolean;
  user: any;
  displayHandler: (route: string) => void;
}) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setIsUserDropdownOpen(false); // Close user dropdown when menu  is opened
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    if (!isUserDropdownOpen) {
      setIsMenuOpen(false); // Close menu  when user dropdown is opened
    }
  };

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    setIsMenuOpen(false);
    displayHandler(buttonName);
  };

  const userImageSrc = user?.imageId
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/images/${user.imageId}`
    : "/favicon.ico";

  return (
    // empty canvas for the navbar
    <nav className="bg-white border-gray-200 dark:bg-slate-950 fixed top-0 left-0 right-0 z-[100]">
      {/* navbar at root path, sewjo login when not logged in, sewjo dashboard login when logged in */}
      {!showFullNav && (
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Sewjo
            </span>
          </Link>
          {!isLoggedIn && (
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                className="text-sm font-medium text-gray-900 dark:text-white bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
                onClick={() => displayHandler("auth")}
              >
                Login
              </button>
            </div>
          )}
          {isLoggedIn && (
            <button
              className={`px-4 py-2 rounded-md ${selectedButton === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
              onClick={() => handleButtonClick("dashboard")}
              disabled={selectedButton === "dashboard"}
            >
              Dashboard
            </button>
          )}
          {isLoggedIn && (
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                onClick={toggleUserDropdown}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={userImageSrc}
                  alt="user photo"
                  width={32}
                  height={32}
                />
              </button>
              {isUserDropdownOpen && (
                <div
                  className="z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
                  id="user-dropdown"
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {user?.userName}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {user?.email}
                    </span>
                    <button
                      className="block text-sm text-blue-500"
                      onClick={() => displayHandler("user")}
                    >
                      edit user
                    </button>
                  </div>
                  <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                      <a
                        href="/logout"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
              <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* navbar after logging in as showFullNav is only ever true after we got into the dashboard*/}
      {showFullNav && (
        // full navbar with all the buttons
        <div className="max-w-screen-xl flex flex-wrap md:items-center justify-between mx-auto p-4">
          <button
            onClick={() => handleButtonClick("dashboard")}
            className="flex items-center"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Sewjo
            </span>
          </button>
          <button
            className={`hidden md:block px-4 py-2 rounded-md ${selectedButton === "patterns" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
            onClick={() => handleButtonClick("patterns")}
            disabled={selectedButton === "patterns"}
          >
            Patterns
          </button>
          <button
            className={`hidden md:block px-4 py-2 rounded-md ${selectedButton === "projects" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
            onClick={() => handleButtonClick("projects")}
            disabled={selectedButton === "projects"}
          >
            Projects
          </button>
          <button
            className={`hidden md:block px-4 py-2 rounded-md ${selectedButton === "fabrics" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
            onClick={() => handleButtonClick("fabrics")}
            disabled={selectedButton === "fabrics"}
          >
            Fabrics
          </button>

          {/* here is the mobile section */}
          <div className="flex flex-row gap-4">
            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 ${isMenuOpen ? "bg-gray-300 dark:bg-gray-800" : ""}`}
              aria-controls="navbar-user"
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            {/* <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                <button
                  data-collapse-toggle="navbar-user"
                  type="button"
                  className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                  aria-controls="navbar-user"
                  aria-expanded={isOpen}
                  onClick={toggleNavbar}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1h15M1 7h15M1 13h15"
                    />
                  </svg>
                </button>
              </div> */}
            {isMenuOpen && (
              <div className="absolute translate-y-[48px] right-0 mt-2 w-36 bg-white rounded-md shadow-lg z-[100]">
                <div className="py-1">
                  <button
                    className={`w-full text-left px-4 py-2 ${selectedButton === "patterns" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
                    onClick={() => handleButtonClick("patterns")}
                    disabled={selectedButton === "patterns"}
                  >
                    Patterns
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${selectedButton === "projects" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
                    onClick={() => handleButtonClick("projects")}
                    disabled={selectedButton === "projects"}
                  >
                    Projects
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${selectedButton === "fabrics" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"}`}
                    onClick={() => handleButtonClick("fabrics")}
                    disabled={selectedButton === "fabrics"}
                  >
                    Fabrics
                  </button>
                </div>
              </div>
            )}
            {isLoggedIn && (
              <div className="relative flex flex-row items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  id="user-menu-button"
                  aria-expanded="false"
                  onClick={toggleUserDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userImageSrc}
                    alt="user photo"
                    width={32}
                    height={32}
                  />
                </button>
                {isUserDropdownOpen && (
                  <div
                    className="absolute min-[1420px]:translate-x-[80px] translate-y-[110px] right-0 mt-2 w-48 z-50 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                    id="user-dropdown"
                  >
                    <div className="px-4 py-3 flex flex-col gap-2 ">
                      <span className="block text-sm text-gray-900 dark:text-white text-center ">
                        Hi, {user?.userName}!
                      </span>
                      <span className="block text-sm text-gray-500 truncate dark:text-gray-400 text-center">
                        {user?.email}
                      </span>
                      <button
                        className="block text-sm text-blue-500 my-2 "
                        onClick={() => {
                          handleButtonClick("changeDetails");
                          toggleUserDropdown();
                        }}
                      >
                        Edit User
                      </button>
                    </div>
                    <ul
                      className="py-2 text-center"
                      aria-labelledby="user-menu-button"
                    >
                      <li>
                        <a
                          href="/logout"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Sign Out
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {!isLoggedIn && (
            <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                className="text-sm font-medium text-gray-900 dark:text-white bg-green-500 px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-300 ease-in-out"
                onClick={() => displayHandler("auth")}
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
