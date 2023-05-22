import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaTshirt } from "react-icons/fa";
import LoadingPage from "~/components/loading-page";
import { api } from "~/utils/api";


const currencyMap: Map<string, string> = new Map([['gbp', '£'], ['usd', '$']])

export default function UserProfile() {
    const router = useRouter();
    const { data: sessionData } = useSession();

    const { data: ordersWithShirts, isLoading } = api.order.getAllOrders.useQuery();
    const { username } = router.query;

    const [showOrderItemsModal, setShowOrderItemsModal] = useState(false)

    if (isLoading) {
        return <LoadingPage />
    }

    if (!sessionData || username != sessionData.user.name) {
        return <div>Unauthorized</div>
    }

    const toggleOrderItemsModal = (show: boolean) => {
        setShowOrderItemsModal((_prev) => show);
    }

    const OrderItemsModal = (props: { orderId: string }) => {

        const currentOrderId = props.orderId;

        const currentOrder = ordersWithShirts?.find((orderWithShirts) => orderWithShirts.id === currentOrderId)

        if (!currentOrder) {
            return <div>Empty</div>
        }

        const shirts = currentOrder.shirts;

        return <><div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaTshirt />
                                </div>
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Shirts</h3>
                                    <div className="mt-2">
                                        <p>{shirts.map((shirt)=><div key={shirt.id}>{shirt.description}</div>)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button onClick={() => toggleOrderItemsModal(false)} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    }


    return <>
        <div className="px-4 pt-2">
            <div className="text-center">
                <h1>{username}</h1>
            </div>
            <h2>Orders:</h2>
            <div className="mt-2 overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th>Order ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersWithShirts && ordersWithShirts.map((order) => {
                            return <>
                                <tr key={order.id}>
                                    <td><button onClick={() => toggleOrderItemsModal(true)}>{order.id}</button></td>
                                    <td>{`${(Number(order.amount) / 100).toString()}${currencyMap.get(order.currency) as string}`}</td>
                                    <th>{order.status}</th>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                                {showOrderItemsModal && <OrderItemsModal orderId={order.id} />}
                            </>})}
                    </tbody>
                </table>
            </div>
        </div>
    </>
}
