import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentPayload, setPaymentPayload] = useState(null);
    const [initiatingPay, setInitiatingPay] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // 1. Fetch order details
                const response = await fetch(`http://localhost:2829/api/v1/orders/${orderId}`);
                if (!response.ok) throw new Error("មិនអាចទាញយកទិន្នន័យ");
                const orderData = await response.json();
                setOrder(orderData);

                // 2. Fetch ABA PayWay signed payment credentials packet from your Spring Boot API
                const payResponse = await fetch('http://localhost:8080/api/payment/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: orderData.totalAmount || 0 })
                });
                
                if (payResponse.ok) {
                    const payData = await payResponse.json();
                    setPaymentPayload(payData);
                }
            } catch (err) {
                console.error("Error setting up payment workflow:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePayNow = () => {
        if (!paymentPayload) return;
        setInitiatingPay(true);

        // Build a standard dynamic HTML form to post parameters directly to ABA PayWay Gateway
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentPayload.abaApiUrl;

        const fields = {
            merchant_id: paymentPayload.merchantId,
            tran_id: paymentPayload.transactionId,
            amount: paymentPayload.amount,
            req_time: paymentPayload.reqTime,
            items: paymentPayload.items,
            shipping: paymentPayload.shipping,
            hash: paymentPayload.hash,
            // Optional: specify layout view redirection defaults if desired
            embed: "0" 
        };

        for (const [key, value] of Object.entries(fields)) {
            const hiddenField = document.createElement('input');
            hiddenField.type = 'hidden';
            hiddenField.name = key;
            hiddenField.value = value;
            form.appendChild(hiddenField);
        }

        document.body.appendChild(form);
        form.submit();
    };

    if (loading) return <div className="p-10 text-center">កំពុងផ្ទុក...</div>;
    if (!order) return <div className="p-10 text-center">រកមិនឃើញការបញ្ជាទិញ។</div>;

    const amount = Number(order.totalAmount || 0).toFixed(2);

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✓</div>
            <h1 className="text-2xl font-black text-slate-800">ការបញ្ជាទិញជោគជ័យ</h1>
            <p className="text-slate-500 mt-2">អរគុណសម្រាប់ការទិញផលិតផលកសិករខ្មែរ</p>

            <div className="bg-slate-50 rounded-2xl p-6 my-6 text-left">
                <div className="flex justify-between py-1">
                    <span className="text-slate-600">លេខរៀង:</span>
                    <span className="font-bold">{orderId}</span>
                </div>
                <div className="flex justify-between py-1">
                    <span className="text-slate-600">សរុប:</span>
                    <span className="font-black text-emerald-700 text-xl">${amount}</span>
                </div>
            </div>

            {paymentPayload ? (
                <button
                    onClick={handlePayNow}
                    disabled={initiatingPay}
                    className="w-full bg-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 shadow-md hover:shadow-lg transition duration-200 disabled:bg-slate-400"
                >
                    {initiatingPay ? "កំពុងប្តូរទៅកាន់ ABA..." : "បង់ប្រាក់ជាមួយ ABA PayWay"}
                </button>
            ) : (
                <p className="text-sm text-red-500 font-medium">
                    មិនអាចរៀបចំប្រព័ន្ធទូទាត់ប្រាក់បានទេ សូមព្យាយាមម្តងទៀត។
                </p>
            )}

            <Link to="/" className="block mt-4 text-sm text-slate-500 hover:text-slate-800 font-medium transition">
                ត្រឡប់ទៅទំព័រដើម
            </Link>
        </div>
    );
};

export default OrderConfirmationPage;