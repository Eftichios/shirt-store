import Image from "next/image"
import { api, type RouterOutputs } from "~/utils/api"


type shirtType = RouterOutputs["shirt"]["getAll"][number];
export default function ShirtCard({ shirt, isCheckout, quantity }: { shirt: shirtType, isCheckout: boolean, quantity?: number }) {

    const addToCartMutation = api.cart.addToCart.useMutation();
    const removeFromCartMutation = api.cart.removeFromCart.useMutation();

    const handleAddToCart = () => {
        addToCartMutation.mutate({ shirtId: shirt.id })
    }

    const handleRemoveFromCart = () => {
        removeFromCartMutation.mutate({ shirtId: shirt.id })
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
                            <p>Quantity: {quantity}</p>
                            < button onClick={handleRemoveFromCart} className="rounded-md px-2 py-1 bg-violet-400 hover:bg-violet-300">Remove from cart</button>
                        </div> :
                        <button onClick={handleAddToCart} className="rounded-md px-2 py-1 bg-slate-400 hover:bg-slate-300">Add to cart</button>
                    }
                </div>
            </div>
        </div>
    </>
}
