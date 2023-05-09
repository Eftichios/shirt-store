import LoadingPage from "./loading-page";
import ShirtCard from "./shirt-card";
import { type RouterOutputs, api } from "~/utils/api";

type CartItem = RouterOutputs['cart']['getAllCartItems'][number]
export default function ShirtCartContainer() {

    const { data: cartItems, isLoading: shirtsLoading, isError } = api.cart.getAllCartItems.useQuery();

    if (shirtsLoading || !cartItems) {
        return <LoadingPage />
    }

    if (isError) {
        return <div>Something went wrong. Please try refreshing the page.</div>
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
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="p-4 overflow-y-auto w-[80%] max-h-[70%] rounded-lg border-2 border-slate-400 shadow shadow-slate-300">
                {cartItems?.map((cartItem, index) =>
                    <ShirtCard key={index} shirt={cartItem.shirt} isCheckout={true} quantity={cartItem.quantity} />
                )}
            </div>
            <div className="w-[80%] text-right">
                <p> Overall Price: £{calculateTotalPrice()}</p>
                </div>
        </div>
        <div className="flex flex-col justify-center items-center">
            <div className="w-[80%] text-right">
            </div>
        </div>
    </>

}
