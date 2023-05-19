import { useRouter } from "next/router";
import LoadingPage from "./loading-page";
import ShirtCard from "./shirt-card";
import { type RouterOutputs, api } from "~/utils/api";
import { useState } from "react";
import { BsCart2 } from "react-icons/bs"
import { loadStripe } from '@stripe/stripe-js';
import { env } from "~/env.mjs";

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

type CartItem = RouterOutputs['cart']['getAllCartItems'][number]
export default function ShirtCartContainer() {

    const { data: cartItems, isLoading: shirtsLoading, isError } = api.cart.getAllCartItems.useQuery();
    const removeAllFromCartMutation = api.cart.removeAllFromCart.useMutation();
    const stripeMutation = api.stripe.checkout.useMutation();
    const ctx = api.useContext();
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

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

    const clearCart = () => {
        removeAllFromCartMutation.mutate(undefined,
            {
                onSuccess: () => {
                    void ctx.cart.getAllCartItems.invalidate();
                    void ctx.cart.getNumberOfItemsInCart.invalidate();
                    void router.push('/');
                }
            });
    }

    const handleStripe = async () => {
        const shirtItems = []
        for (let i = 0; i < cartItems.length; i++) {
            const cartItem = cartItems.at(i) as CartItem;
            shirtItems.push({
                id: cartItem.shirt.id,
                description: cartItem.shirt.description,
                price: Number(cartItem.shirt.price),
                quantity: cartItem.quantity,
                url: cartItem.shirt.url
            })
        }
        const result = await stripeMutation.mutateAsync({ shirts: shirtItems })
        if (result?.sessionId) {
            const stripe = await stripePromise;

            if (stripe) {
                await stripe.redirectToCheckout({
                    sessionId: result.sessionId
                })
            }
        }

    }


const CheckoutModal = () => {

    return <><div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <BsCart2 />
                            </div>
                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Checkout</h3>
                                <div className="mt-2">
                                    <div className="flex flex-col gap-2">
                                        <input className="pl-1" type="text" placeholder="Address 1" />
                                        <input className="pl-1" type="text" placeholder="Address 2" />
                                        <input className="pl-1" type="text" placeholder="Post Code" />
                                        <input className="pl-1" type="text" placeholder="City" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button onClick={() => void handleStripe()} className="inline-flex w-full justify-center rounded-md bg-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 sm:ml-3 sm:w-auto">Payment {'>'}</button>
                        <button onClick={() => toggleCheckoutModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
}

const toggleCheckoutModal = (show: boolean) => {
    setShowModal((_prev) => show);
}

return <>
    <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-[80%] text-right">
            <button onClick={clearCart} className="border border-slate-500 py-1 px-2 bg-slate-200 hover:bg-slate-100 shadow shadow-slate-300 rounded-sm mb-2" > Clear All Items </button>
        </div>
        <div className="p-4 overflow-y-auto w-[80%] max-h-[70%] rounded-lg border-2 border-slate-400 shadow shadow-slate-300">
            {cartItems?.map((cartItem, index) =>
                <ShirtCard key={index} shirt={cartItem.shirt} isCheckout={true} quantity={cartItem.quantity} />
            )}
        </div>
        <div className="w-[80%] text-right">
            <p> Overall Price: £{calculateTotalPrice()}</p>
        </div>
        <div className="flex flex-col justify-center items-center">
            <div className="w-[80%] text-right">
                <button onClick={() => toggleCheckoutModal(true)} className="rounded-sm px-2 py-1 bg-violet-400 hover:bg-violet-300 shadow shadow-violet-300">Checkout</button>
            </div>
        </div>
    </div>
    {showModal && <CheckoutModal />}
</>

}
