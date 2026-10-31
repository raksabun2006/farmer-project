import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from "react-i18next";

const OrderConfirmationPage = () => {
    const { t } = useTranslation();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [isPolling, setIsPolling] = useState(false);

    useEffect(() => {
        const fetchOrderAndGenerateQR = async () => {
            try {
                const orderResponse = await fetch(`http://localhost:2829/api/v1/orders/${orderId}`);
                if (!orderResponse.ok) throw new Error("មិនអាចទាញយកព័ត៌មានបញ្ជាទិញ");
                const orderData = await orderResponse.json();

                const paymentResponse = await fetch("http://localhost:2829/api/payment/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ orderId: orderId, amount: orderData.totalAmount })
                });

                if (paymentResponse.ok) {
                    const paymentData = await paymentResponse.json();
                    setOrder({
                        ...orderData,
                        qrString: paymentData.qrString,
                        md5: paymentData.md5, 
                        transactionId: paymentData.transactionId 
                    });
                    setIsPolling(true);
                } else {
                    setOrder(orderData);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderAndGenerateQR();
        }
    }, [orderId]);

    useEffect(() => {
        let intervalId;
        if (isPolling && order?.md5) {
            intervalId = setInterval(async () => {
                try {
                    const response = await fetch("http://localhost:2829/api/payment/verify", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({ orderId: orderId, md5: order.md5, md5Hash: order.md5, transactionId: order.transactionId })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result && String(result.responseCode) === "0") {
                            setPaymentSuccess(true);
                            setIsPolling(false);
                            clearInterval(intervalId);
                        }
                    }
                } catch (err) {
                    console.error("Error encountered during payment status polling layout:", err);
                }
            }, 4000); 
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPolling, order]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium text-sm animate-pulse">{t("loadingOrder")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-sm w-full text-center">
                    <p className="text-red-500 font-semibold text-sm">{error}</p>
                    <Link to="/" className="mt-5 inline-block text-xs font-bold text-slate-500 hover:text-slate-800 underline">{t("backHome")}</Link>
                </div>
            </div>
        );
    }

    const amount = Number(order?.totalAmount || 0).toFixed(2);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 antialiased">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden transition-all duration-300">
                
                {/* Header Status Section */}
                <div className={`p-8 pb-4 text-center transition-colors duration-500 ${paymentSuccess ? 'bg-emerald-50/40' : 'bg-white'}`}>
                    {paymentSuccess ? (
                        <div className="scale-up-animation">
                            <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-emerald-200">
                                ✓
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t("paymentSuccess")}</h1>
                            <p className="text-emerald-600 font-semibold text-sm mt-1.5">ប្រព័ន្ធបានទទួលប្រាក់របស់អ្នករួចរាល់ហើយ</p>
                        </div>
                    ) : (
                        <div>
                            <div className="inline-flex items-center space-x-1 bg-amber-50 px-3 py-1 rounded-full mb-3 text-[11px] font-bold text-amber-700 tracking-wide uppercase border border-amber-100">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                                <span>{t("paymentPending")}</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{t("checkout")}</h1>
                            <p className="text-slate-400 text-xs font-medium mt-1">{t("orderDetails")}</p>
                        </div>
                    )}
                </div>

                {/* Invoice Details Box */}
                <div className="px-8 py-2">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/80 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-medium">{t("orderNumber")}</span>
                            <span className="font-bold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200/60 shadow-sm">
                                #{orderId}
                            </span>
                        </div>
                        <div className="h-[1px] bg-dashed bg-slate-200 w-full my-1"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium text-sm">{t("amountDue")}</span>
                            <span className="font-black text-emerald-600 text-2xl tracking-tight">
                                ${amount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* QR Display Area */}
                <div className="px-8 py-6 text-center">
                    {!paymentSuccess ? (
                        <div className="space-y-5">
                            <div className="relative inline-block bg-white p-5 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 transition-transform duration-300 hover:scale-[1.02]">
                                {order?.qrString ? (
                                    <div className="relative">
                                        <QRCodeSVG 
                                            value={order.qrString} 
                                            size={220} 
                                            includeMargin={false}
                                            className="mx-auto rounded-xl"
                                        />
                                        <div className="absolute inset-0 border-2 border-transparent pointer-events-none rounded-xl"></div>
                                    </div>
                                ) : (
                                    <div className="w-[220px] h-[220px] bg-slate-50 flex flex-col items-center justify-center rounded-xl text-slate-400 space-y-2">
                                        <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-[11px] font-medium">កំពុងបង្កើត KHQR...</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Polling Indicator Toast */}
                            <div className="bg-slate-50/80 border border-slate-100 rounded-xl py-3 px-4 max-w-xs mx-auto">
                                <div className="flex items-center justify-center space-x-2 text-emerald-600 text-xs font-bold">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span>កំពុងរង់ចាំលោកអ្នកស្កេនទូទាត់...</span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                                    បើកកម្មវិធី <span className="font-bold text-slate-600">ABA Mobile</span> ឬកម្មវិធីធនាគារណាមួយដើម្បីស្កេន
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-6 px-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 max-w-xs mx-auto">
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                ការទិញដូរ កសិផលខ្មែរ របស់អ្នកបានសម្រេចរួចរាល់។ លោកអ្នកអាចរង់ចាំការដឹកជញ្ជូន ឬត្រឡប់ទៅកាន់ទំព័រដើម។
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Navigation CTA */}
                <div className="p-8 pt-2 bg-slate-50/50 border-t border-slate-50 text-center">
                    <Link 
                        to="/" 
                        className="block w-full bg-slate-900 text-white py-3.5 px-4 rounded-xl font-bold text-sm hover:bg-slate-800 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-slate-900/10 tracking-wide"
                    >
                        ត្រឡប់ទៅទំព័រដើម
                    </Link>
                    <p className="text-[10px] text-slate-400 mt-4 font-medium">អរគុណសម្រាប់ការគាំទ្រកសិផលខ្មែរ</p>
                </div>

            </div>
        </div>
    );
};

export default OrderConfirmationPage;