import { signIn, signOut, useSession } from "next-auth/react";
import { BsCart2 } from "react-icons/bs"

const AuthNavbar: React.FC = () => {

    const { data: sessionData } = useSession();


    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <button
                onClick={sessionData ? () => void signOut() : () => void signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );

}


export default function NavbarTop() {
    const { data: sessionData } = useSession();
    let itemsInBasket = 0;

    itemsInBasket = 3;
    return <>
        <div className="px-8 h-12 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex">Shirtly</div>
            <div>
                {sessionData && sessionData.user?.name}
            </div>
            <div className="flex">
                {sessionData &&
                    <div className="mr-4 flex items-center relative">
                        {itemsInBasket != 0 &&
                            <div className="text-sm font-bold absolute w-1 h-1 p-2 flex items-center justify-center top-[-1px] right-[-9px] rounded-full bg-violet-400 text-slate-700">
                                {itemsInBasket}
                            </div>}
                        <BsCart2 className="z-10" />
                    </div>}
                <AuthNavbar />
            </div>
        </div>
    </>

}
