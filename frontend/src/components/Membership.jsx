// src/components/Membership.jsx
import { Link } from "react-router-dom";

export default function Membership() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      priceSub: "forever",
      features: ["300-word limit", "5 reports / day"],
      cta: "Current Plan",
      primary: false,
    },
    {
      name: "Pro",
      price: "$0.99",
      priceSub: "per month",
      features: ["Unlimited words", "5 reports / day"],
      cta: "Upgrade",
      primary: true, // highlight middle card
    },
    {
      name: "Elite",
      price: "$5",
      priceSub: "per month",
      features: ["Unlimited words", "Unlimited reports"],
      cta: "Upgrade",
      primary: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold mb-12">
          Choose Your Membership
        </h1>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-8 border bg-gray-800/80 backdrop-blur
                          flex flex-col shadow-lg transition-all duration-300
                          hover:-translate-y-1 hover:shadow-2xl
                          ${
                            plan.primary
                              ? "border-blue-500 ring-2 ring-blue-500 scale-105"
                              : "border-gray-700"
                          }`}
            >
              {/* Plan header */}
              <h2 className="text-2xl font-bold mb-4 text-white">
                {plan.name}
              </h2>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-gray-400"> / {plan.priceSub}</span>
              </div>

              {/* Feature list */}
              <ul className="space-y-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-300">
                    • {f}
                  </li>
                ))}
              </ul>

              {/* Call-to-action */}
              <button
                disabled={plan.cta === "Current Plan"}
                className={`mt-8 w-full rounded-full py-2 text-sm font-semibold
                            transition-colors ${
                              plan.cta === "Current Plan"
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="text-center mt-12">
          <Link to="/" className="text-blue-400 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

