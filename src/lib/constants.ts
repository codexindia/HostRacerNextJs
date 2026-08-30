/** States and union territories, for billing addresses and GST. */
export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
] as const;

export type PaymentMethodId = "upi" | "card" | "netbanking";

export const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  blurb: string;
  icon: string;
  badge?: string;
}[] = [
  {
    id: "upi",
    label: "UPI",
    blurb: "GPay, PhonePe, Paytm or any UPI app",
    icon: "Smartphone",
    badge: "Fastest",
  },
  {
    id: "card",
    label: "Card",
    blurb: "Visa, Mastercard, RuPay, Amex",
    icon: "CreditCard",
  },
  {
    id: "netbanking",
    label: "Net banking",
    blurb: "All major Indian banks",
    icon: "Landmark",
  },
];
