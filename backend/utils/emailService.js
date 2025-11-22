import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send order confirmation email
export const sendOrderConfirmation = async (order) => {
  try {
    const itemsList = order.items
      .map(
        (item) =>
          `<li>${item.name} - Quantity: ${item.quantity} - $${item.price * item.quantity}</li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customerEmail,
      subject: "Order Confirmation - North West Meats",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Hi ${order.customerName},</p>
        <p>We've received your order and it's being processed.</p>

        <h3>Order Details:</h3>
        <ul>
          ${itemsList}
        </ul>

        <p><strong>Total Amount: $${order.totalAmount}</strong></p>
        <p><strong>Status: ${order.status}</strong></p>

        <p>We'll notify you when your order is ready for pickup!</p>

        <p>Best regards,<br>North West Meats Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error(`Error sending order confirmation email: ${error.message}`);
  }
};

// Send order status update email
export const sendOrderStatusUpdate = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.customerEmail,
      subject: "Order Status Update - North West Meats",
      html: `
        <h2>Order Status Update</h2>
        <p>Hi ${order.customerName},</p>
        <p>Your order status has been updated to: <strong>${order.status}</strong></p>

        ${
          order.status === "ready"
            ? "<p>Your order is ready for pickup! Please visit our store at your convenience.</p>"
            : "<p>Your order is being processed. We'll notify you when it's ready.</p>"
        }

        <p><strong>Order Total: $${order.totalAmount}</strong></p>

        <p>Best regards,<br>North West Meats Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${order.customerEmail}`);
  } catch (error) {
    console.error(`Error sending order status update email: ${error.message}`);
  }
};

// Send generic email
export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw error;
  }
};
