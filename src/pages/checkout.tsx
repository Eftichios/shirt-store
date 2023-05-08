import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "~/components/loading-page";
import ShirtCard from "~/components/shirt-card";
import { type RouterOutputs, api } from "~/utils/api";


type CartItem = RouterOutputs['cart']['getAllCartItems'][number]
export default function Checkout() {
    const router = useRouter();
    const session = useSession();


    const { data: itemsInBasket, isLoading: numberOfItemsLoading } = api.cart.getNumberOfItemsInCart.useQuery();
    const { data: cartItems, isLoading: shirtsLoading } = api.cart.getAllCartItems.useQuery();

    if (numberOfItemsLoading || shirtsLoading) {
        return <LoadingPage />
    }

    if (!session?.data?.user) {
        void router.push('/');
    }

    if (itemsInBasket === 0 || !cartItems) {
        void router.push('/');
    }

    const calculateTotalPrice = () => {
        let total = 0;
        if (!cartItems || !cartItems.length) {
            return total;
        }

        for (let i = 0; i < cartItems.length; i++) {
            const cartItem = cartItems.at(i) as CartItem;
            total += cartItem.quantity * Number(cartItem.shirt.price);
        }
        return total;
    }

    return <>
        <div className="flex flex-col justify-center items-center">
            <div className="mt-4 w-[80%]">
                {cartItems?.map((cartItem, index) =>
                    <ShirtCard key={index} shirt={cartItem.shirt} isCheckout={true} quantity={cartItem.quantity} />
                )}
            </div>
            <div className="w-[80%] text-right">
                <p> Overall Price: £{calculateTotalPrice()}</p>
            </div>
        </div>
    </>

}
