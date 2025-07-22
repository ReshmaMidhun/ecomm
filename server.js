const express = require("express");
const stripe = require("stripe");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();
const app = express();

// ✅ Enable CORS for your GitHub Pages domain
app.use(cors({
    origin: "https://reshmamidhun.github.io", // GitHub Pages domain
    methods: ["POST", "GET"],
    credentials: false
}));



// ✅ Middleware
app.use(express.static(__dirname));
app.use(express.json());


// ✅ Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


app.get("/success", (req, res) => {
    res.sendFile(path.join(__dirname, "success.html"));
});

app.get("/cancel", (req, res) => {
    res.sendFile(path.join(__dirname, "cancel.html"));
});

// ✅ Stripe config
const stripeGateway = stripe(process.env.stripe_api);
const DOMAIN = process.env.DOMAIN;


// ✅ Stripe checkout endpoint
app.post("https://ecomm-ab86.onrender.com/stripe-checkout", async(req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") *100);
        return {
            price_data : {
                currency : "usd",
                product_data : {
                    name : item.title,
                    images : [item.productImg]
                },
                unit_amount : unitAmount,
            },
            
            quantity : item.quantity,
        };
    });
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types : ["card"],
        mode : "payment",
        success_url : `${DOMAIN}/success`,
        cancel_url : `${DOMAIN}/cancel`,
        line_items : lineItems,
        billing_address_collection : "required",
    });
    res.json(session.url);
});

// ✅ Dynamic PORT for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
