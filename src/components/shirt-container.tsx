import LoadingPage from "./loading-page";
import ShirtCard from "./shirt-card";
import { api } from "~/utils/api";

export default function ShirtContainer() {

    const { data: shirts, isLoading, isError } = api.shirt.getAll.useQuery();
    const { data: cartItems, isLoading: shirtsLoading, isError: shirtsError } = api.cart.getAllCartItems.useQuery();

    if (isLoading || !shirts || shirtsLoading) {
        return <LoadingPage />
    }

    if (isError || shirtsError) {
        return <div>Something went wrong. Please try refreshing the page.</div>
    }

    
    return <>
        <div className="w-full h-full flex items-center justify-center">
            <div className="p-4 w-[70%] overflow-y-auto h-[70%] rounded-lg border-2 border-slate-400 shadow shadow-slate-300">
                {shirts.map((shirt, index)=>
                    <ShirtCard shirtsInCart={cartItems} key={index} shirt={shirt} isCheckout={false} />
                )}
            </div>
        </div>
    </>

}
