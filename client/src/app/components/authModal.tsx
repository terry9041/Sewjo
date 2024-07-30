import { useState } from "react";
import Link from "next/link";
import ModalLoginForm from './modalLoginForm';
import ModalRegisterForm from './modalRegisterForm';

export default function AuthModal({ setShowAuthModal }: { setShowAuthModal: (showAuthModal: boolean) => void; }) {
    const [showLogin, setShowLogin] = useState(true);

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const swapReg = () => {
        setShowLogin(!showLogin);
    };

    return (
        <dialog
            className="fixed left-0 top-0 w-full h-full bg-black bg-opacity-50 z-50 overflow-auto backdrop-blur flex justify-center items-center"
            open onClick={closeAuthModal}>
            <div className="bg-white m-auto p-8 rounded-lg shadow-lg" onClick={(e) => e.stopPropagation()}>
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
