import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "~/components/loading-page";
import ShirtCard from "~/components/shirt-card";
import { api } from "~/utils/api";

export default function Checkout() {
    const router = useRouter();
    const session = useSession();


    const { data: itemsInBasket, isLoading: numberOfItemsLoading } = api.cart.getNumberOfItemsInCart.useQuery();
    const { data: cartItems, isLoading: shirtsLoading } = api.cart.getAllCartItems.useQuery();

    if (numberOfItemsLoading || shirtsLoading) {
        return <LoadingPage />
    }

    if (!session?.data?.user) {
        router.push('/');
    }

    if (itemsInBasket === 0) {
        router.push('/');
    }

    return <>
        <div className="flex justify-center">
            <div className="mt-4 w-[80%]">
                {cartItems?.map((cartItem, index) =>
                    <ShirtCard key={index} shirt={cartItem.shirt} isCheckout={true} quantity={cartItem.quantity} />
                )}
            </div>
        </div>
    </>

}
