import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "~/components/loading-page";
import ShirtCartContainer from "~/components/shirt-cart-container";
import { api } from "~/utils/api";


export default function Checkout() {
    const router = useRouter();
    const session = useSession();


    const { data: itemsInBasket, isLoading: numberOfItemsLoading } = api.cart.getNumberOfItemsInCart.useQuery();

    if (numberOfItemsLoading) {
        return <LoadingPage />
    }

    if (!session?.data?.user) {
        void router.push('/');
    }

    if (itemsInBasket === 0) {
        void router.push('/');
    }


    return <>
        <ShirtCartContainer />
    </>

}
