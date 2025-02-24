import { Request, Response } from "express";
import nodemailer from "nodemailer";
import express from 'express';
import { shopify } from '../../utilities/client.ts';

// Configure Nodemailer for sending emails
const transporter = nodemailer.createTransport({
  // ... your email service configuration
  service: "gmail",
  auth: {
    user: "your_email@gmail.com",
    pass: "your_email_password",
  },
});

// Function to handle the webhook
export const handleProductUpdate = async (req: Request, res: Response) => {
  try {
    const webhookPayload = req.body;

    // 1. Log the updated product details (initial payload)
    console.log("Webhook Payload:", JSON.stringify(webhookPayload, null, 2));

    // Extract product ID from the webhook payload (depends on the webhook topic)
    const productId = webhookPayload.id; // Example: Assuming product ID is directly available

    // 2. Use GraphQL to retrieve complete product details
    const query = `
      query getProduct($id: ID!) {
        product(id: $id) {
          title
          variants(first: 1) {
            edges {
              node {
                price
              }
            }
          }
        }
      }
    `;

    const variables = { id: `gid://shopify/Product/${productId}` }; // Construct the GraphQL ID

    const session = await shopify.session.getOfflineToken(SHOP); // Get an offline session
    const graphqlResponse = await shopify.clients.graphql({
      session,
      rawRequest: true,
      data: {
        query,
        variables,
      },
    });

    const productData = graphqlResponse.body.data.product;
    console.log("GraphQL Product Data:", JSON.stringify(productData, null, 2));

    // Extract relevant data
    const productTitle = productData.title;
    const newPrice = parseFloat(productData.variants.edges[0].node.price);

    // Get old price - You'll likely need to store this somewhere (database, etc.)
    // For this example, we'll simulate an old price.
    const oldPrice = 150; // Replace with your logic to retrieve the old price

    // 3. Check for price decrease and send email alert
    const percentageDecrease = ((oldPrice - newPrice) / oldPrice) * 100;

    if (percentageDecrease > 20) {
      const mailOptions = {
        from: "your_email@gmail.com",
        to: "recipient_email@example.com",
        subject: "Product Price Alert",
        text: `
          Product: ${productTitle}
          Old Price: ${oldPrice}
          New Price: ${newPrice}
          Percentage Decrease: ${percentageDecrease.toFixed(2)}%
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    res.status(200).send("Webhook handled successfully");
  } catch (error) {
    console.error("Error handling webhook:", error);
    res.status(500).send("Error handling webhook");
  }
};

const app = express();

app.use(express.json());

app.post('/webhooks/product/update', handleProductUpdate);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});