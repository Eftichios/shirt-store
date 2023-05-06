import Image from "next/image"
import { type RouterOutputs } from "~/utils/api"


type shirtType = RouterOutputs["shirt"]["getAll"][number];
export default function ShirtCard(shirt: shirtType) {
    return <>
        <div className="w-full h-36 rounded-md border mb-1 last:mb-0 border-slate-300 shadow shadow-slate-200">
            <div className="flex flex-row h-full">
                <Image className="rounded-s-md h-full"
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
                    <button className="rounded-md px-2 py-1 bg-slate-400 hover:bg-slate-300">Add to cart</button>
                </div>
            </div>
        </div>
    </>
}
