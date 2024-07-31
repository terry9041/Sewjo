import { useState } from "react";
import Link from "next/link";
import ModalLoginForm from "./modalLoginForm";
import ModalRegisterForm from "./modalRegisterForm";

export default function AuthModal({
  setShowAuthModal,
}: {
  setShowAuthModal: (showAuthModal: boolean) => void;
}) {
  const [showLogin, setShowLogin] = useState(true);

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const swapReg = () => {
    setShowLogin(!showLogin);
  };

  return (
    <dialog
      className="fixed left-0 top-0 w-full h-full  bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
      open
      onClick={closeAuthModal}
    >
      <div className="bg-white m-auto p-8 rounded-lg shadow-lg w-[27%] h-fit flex flex-col gap-8" onClick={(e) => e.stopPropagation()} >
        <button
          type="button"
          className="text-s  rounded-lg px-2 self-end"
          onClick={closeAuthModal}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 50 50"
          >
            <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
          </svg>
        </button>
        <div className="flex flex-col items-center">
          {showLogin ? (
            <ModalLoginForm swapReg={swapReg} />
          ) : (
            <ModalRegisterForm swapReg={swapReg} />
          )}
        </div>
      </div>
    </dialog>
  );
}
