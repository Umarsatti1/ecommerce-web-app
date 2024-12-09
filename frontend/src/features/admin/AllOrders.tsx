import { useState, useEffect } from "react";
import api from "../../app/api/api";
import { Order } from "../../app/models/order";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { currencyFormat } from "../../app/models/util";

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.Admin.fetchAllOrders()
      .then((orders) => setOrders(orders))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent message="Loading all orders..." />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Orders</h1>
      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-4">Order Number</th>
              <th scope="col" className="px-6 py-4 text-right">Buyer</th>
              <th scope="col" className="px-6 py-4 text-right">Total</th>
              <th scope="col" className="px-6 py-4 text-right">Order Date</th>
              <th scope="col" className="px-6 py-4 text-right">Order Status</th>
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
                <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-right">{order.buyerId}</td>
                <td className="px-6 py-4 text-right">{currencyFormat(order.total)}</td>
                <td className="px-6 py-4 text-right">{order.orderDate.split("T")[0]}</td>
                <td className="px-6 py-4 text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.orderStatus === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
