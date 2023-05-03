import { signIn, signOut, useSession } from "next-auth/react";

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
    return <div className="px-8 h-12 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex">Shirtly</div>
        <div>
            {sessionData && sessionData.user?.name}
        </div>
        <div className="flex">
            <div className="mr-4">Cart</div>

            <AuthNavbar />
        </div>
    </div>

}
