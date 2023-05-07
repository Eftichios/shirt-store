import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ShirtCard from "~/components/shirt-card";
import { api } from "~/utils/api";

export default function Checkout() {
    const router = useRouter();
    const session = useSession();


    const { data: itemsInBasket, isLoading: numberOfItemsLoading } = api.cart.getNumberOfItemsInCart.useQuery();
    const { data: cartItems, isLoading: shirtsLoading } = api.cart.getAllCartItems.useQuery();

    if (numberOfItemsLoading || shirtsLoading) {
        return <div>Loading...</div>
    }

    if (!session?.data?.user) {
        router.push('/');
    }

    if (itemsInBasket === 0) {
        router.push('/');
    }

    return <>
        <div className="mt-4">
            {cartItems?.map((cartItem, index) =>
                <ShirtCard key={index} shirt={cartItem.shirt} isCheckout={true} quantity={cartItem.quantity} />
            )}
        </div>
    </>

}
