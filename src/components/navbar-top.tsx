import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs"
import { FaTshirt } from "react-icons/fa"
import { api } from "~/utils/api";
import Image from "next/image";

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
            <div>
                <Link href='/'>
                    <div className="flex gap-2 items-center">
                        <FaTshirt />
                        <span>Shirt Store</span>
                    </div>
                </Link>
            </div>
            {sessionData && <div className="flex gap-2">
                <Image className="rounded-sm" src={sessionData.user.image as string} width={25} height={25} alt="User profile picture" />
                <Link href={`/user/${sessionData.user.name as string}`}>{sessionData.user?.name}</Link>
            </div>
            }
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
