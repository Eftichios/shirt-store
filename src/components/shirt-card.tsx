import Image from "next/image"
import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "~/utils/api"
import { BsCart2 } from "react-icons/bs"
import { toast } from "react-hot-toast";


type shirtType = RouterOutputs["shirt"]["getAll"][number];
type cartItemType = RouterOutputs["cart"]["getAllCartItems"][number]
export default function ShirtCard({ shirtsInCart, shirt, isCheckout, quantity }: { shirtsInCart: cartItemType[], shirt: shirtType, isCheckout: boolean, quantity?: number }) {

    const [quantityState, setQuantityState] = useState(quantity);
    const [isShirtInCart, setIsShirtInCart] = useState(false);
    const ctx = api.useContext();

    useEffect(function() {
        if (!shirtsInCart || shirtsInCart.length == 0) {
            setIsShirtInCart(false);
        }

        const isInCart = shirtsInCart.find((cartItem) => cartItem.shirtId === shirt.id);

        setIsShirtInCart(Boolean(isInCart));

    }, [shirtsInCart, shirt.id])


    const addToCartMutation = api.cart.addToCart.useMutation({
        async onMutate() {
            await ctx.cart.getNumberOfItemsInCart.cancel();

            const prevCartNumber = ctx.cart.getNumberOfItemsInCart.getData();

            ctx.cart.getNumberOfItemsInCart.setData(undefined, (_old) => _old as number + 1);

            return { prevCartNumber };
        },
        onError(_err, _prev, mutCtx) {
            ctx.cart.getNumberOfItemsInCart.setData(undefined, mutCtx?.prevCartNumber);
        },
        onSettled() {
            void ctx.cart.getNumberOfItemsInCart.invalidate();
            setIsShirtInCart(true);
        }
    });

    const removeFromCartMutation = api.cart.removeFromCart.useMutation({
        async onMutate({ shirtId }) {
            await ctx.cart.getNumberOfItemsInCart.cancel();
            await ctx.cart.getAllCartItems.cancel();

            const prevCartNumber = ctx.cart.getNumberOfItemsInCart.getData();
            const prevCartData = ctx.cart.getAllCartItems.getData();

            ctx.cart.getNumberOfItemsInCart.setData(undefined, (_old) => _old as number - 1);
            ctx.cart.getAllCartItems.setData(undefined, (_old) => _old?.filter((item) => item.shirtId != shirtId));

            return { prevCartNumber, prevCartData };
        },
        onError(_err, _prev, mutCtx) {
            ctx.cart.getNumberOfItemsInCart.setData(undefined, mutCtx?.prevCartNumber);
            ctx.cart.getAllCartItems.setData(undefined, mutCtx?.prevCartData);
        },
        onSettled() {
            void ctx.cart.getNumberOfItemsInCart.invalidate();
            void ctx.cart.getAllCartItems.invalidate();
            setIsShirtInCart(false);
        }
    });

    const updateQuantityMutation = api.cart.updateShirtQuantity.useMutation();

    const handleAddToCart = () => {
        addToCartMutation.mutate({ shirtId: shirt.id },
            {
                onSuccess: () => {
                    toast.success(`Added ${shirt.description} to cart`);
                }
            })
    }

    const handleRemoveFromCart = () => {
        removeFromCartMutation.mutate({ shirtId: shirt.id },
            {
                onSuccess: () => {
                    toast.success("Removed from cart");
                }
            })

    }

    const handleUpdateQuantity = () => {
        updateQuantityMutation.mutate({ shirtId: shirt.id, quantity: quantityState as number },
            {
                onSuccess: () => {
                    toast.success(`Updated quantity to ${quantityState as number}`);
                }
            }
        )
    }

    return <>
        <div className="w-full h-36 rounded-md border mb-1 last:mb-0 border-slate-300 shadow shadow-slate-200">
            <div className="flex flex-row h-full">
                <Image className="rounded-s-md w-36 h-full"
                    src={shirt.url}
                    width={200}
                    height={100}
                    alt="The image of the shirt to be sold" />
                <div className="pl-2">
                    <h2>{shirt.description}</h2>
                    <p>Price: £{`${shirt.price.toString()}`}</p>
                    <p>Gender: {shirt.gender}</p>
                </div>
                <div className="grow p-2 flex justify-end items-end">
                    {isCheckout ?
                        <div>
                            <div className="flex flex-row gap-1 mb-1">
                                <div>
                                    <label htmlFor="quantity" className="text-center">Quantity: </label>
                                    <input min="1" onChange={(e) => setQuantityState(Number(e.target.value))} className="w-12 pl-1 rounded-sm border" id="quantity" type="number" value={quantityState} />
                                </div>
                                <p> Total: {quantityState && `£${quantityState * Number(shirt.price)}`} </p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <button onClick={handleUpdateQuantity} className="rounded-sm px-2 py-1 bg-slate-200 hover:bg-slate-100 shadow shadow-slate-300">Update Quantity</button>
                                <button onClick={handleRemoveFromCart} className="rounded-sm px-2 py-1 bg-violet-400 hover:bg-violet-300 shadow shadow-violet-300">Remove from cart</button>
                            </div>
                        </div> :
                        <div className="flex gap-1 items-center">

                            {(isShirtInCart ?
                                <BsCart2 />
                                :
                                <button onClick={handleAddToCart} className="rounded-sm px-2 py-1 bg-violet-400 hover:bg-violet-300 shadow shadow-violet-300">Add to cart</button>
                            )
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    </>
}
