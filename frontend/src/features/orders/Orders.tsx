import { useState, useEffect } from "react";
import { Order } from "../../app/models/order";
import LoadingComponent from "../../app/layout/LoadingComponent";
import OrderDetailed from "./OrderDetailed";
import { currencyFormat } from "../../app/util/util";
import api from "../../app/api/api";

export default function Orders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState(0);

  useEffect(() => {
    api.Orders.list()
      .then((orders) => setOrders(orders))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading orders..." />;

  if (selectedOrderNumber > 0)
    return (
      <OrderDetailed
        order={orders?.find((o) => o.id === selectedOrderNumber)!}
        setSelectedOrder={setSelectedOrderNumber}
      />
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Orders</h1>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">
                Order Number
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Total
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Order Date
              </th>
              <th scope="col" className="px-4 py-4 text-right">
                Order Status
              </th>
              <th scope="col" className="px-8 py-4 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order, index) => (
              <tr
                key={order.id}
                className={`border-b ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-right">
                  {currencyFormat(order.total)}
                </td>
                <td className="px-6 py-4 text-right">
                  {order.orderDate.split("T")[0]}
                </td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setSelectedOrderNumber(order.id)}
                    className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 focus:outline-none"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}