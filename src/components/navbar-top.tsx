import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs"
import { api } from "~/utils/api";

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

    const { data: noItems } = api.cart.getNumberOfItemsInCart.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined },
    );

    itemsInBasket = noItems as number;
    return <>
        <div className="px-8 h-12 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex"><Link href='/'>Shirtly</Link></div>
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
                        {itemsInBasket !== 0 ? <Link href='/checkout'><BsCart2 className="z-10" /></Link> : <BsCart2 className="z-10" />}
                    </div>}
                <AuthNavbar />
            </div>
        </div>
    </>

}
