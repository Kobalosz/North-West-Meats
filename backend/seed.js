import mongoose from "mongoose";
import Product from "./models/product.js";
import Order from "./models/order.js";
import Contact from "./models/Contact.js";
import dotenv from "dotenv";

dotenv.config();

const products = [
  {
    name: "Premium Beef Ribeye Steak",
    price: 24.99,
    desc: "Premium quality ribeye steak, perfectly marbled for maximum flavor and tenderness. Cut to 1.5 inches thick.",
    img: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=500&h=500&fit=crop",
    stock: 25,
    available: true,
  },
  {
    name: "Organic Chicken Breast",
    price: 12.99,
    desc: "Fresh, organic chicken breast from free-range farms. Perfect for grilling or baking.",
    img: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&h=500&fit=crop",
    stock: 40,
    available: true,
  },
  {
    name: "Ground Beef 80/20",
    price: 8.99,
    desc: "Premium ground beef with 80% lean meat. Perfect for burgers, meatballs, or tacos.",
    img: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=500&h=500&fit=crop",
    stock: 50,
    available: true,
  },
  {
    name: "Pork Tenderloin",
    price: 15.99,
    desc: "Tender and juicy pork tenderloin, ideal for roasting. Approximately 1.5 lbs per piece.",
    img: "https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?w=500&h=500&fit=crop",
    stock: 20,
    available: true,
  },
  {
    name: "Lamb Chops",
    price: 19.99,
    desc: "Premium lamb chops, trimmed and ready to cook. Pack of 4 chops.",
    img: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop",
    stock: 15,
    available: true,
  },
  {
    name: "Turkey Breast",
    price: 11.99,
    desc: "Fresh turkey breast, skinless and boneless. Perfect for healthy meals.",
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop",
    stock: 30,
    available: true,
  },
  {
    name: "Beef Sirloin Steak",
    price: 18.99,
    desc: "Lean and flavorful sirloin steak, cut to perfection. Great for grilling.",
    img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=500&h=500&fit=crop",
    stock: 22,
    available: true,
  },
  {
    name: "Pork Sausages",
    price: 9.99,
    desc: "Traditional pork sausages with herbs and spices. Pack of 8 sausages.",
    img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=500&h=500&fit=crop",
    stock: 35,
    available: true,
  },
  {
    name: "Beef Brisket",
    price: 22.99,
    desc: "Perfect for slow cooking or smoking. Approximately 3-4 lbs per piece.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=500&fit=crop",
    stock: 12,
    available: true,
  },
  {
    name: "Chicken Thighs (Bone-in)",
    price: 10.99,
    desc: "Juicy chicken thighs with bone and skin. Pack of 6 pieces.",
    img: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=500&h=500&fit=crop",
    stock: 0,
    available: false,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Contact.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Added ${createdProducts.length} products`);

    // Create sample orders
    const sampleOrders = [
      {
        customerName: "John Smith",
        customerEmail: "john.smith@example.com",
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            price: createdProducts[0].price,
            quantity: 2,
          },
          {
            product: createdProducts[2]._id,
            name: createdProducts[2].name,
            price: createdProducts[2].price,
            quantity: 1,
          },
        ],
        totalAmount: 2 * 24.99 + 1 * 8.99,
        status: "ready",
      },
      {
        customerName: "Emily Johnson",
        customerEmail: "emily.johnson@example.com",
        items: [
          {
            product: createdProducts[1]._id,
            name: createdProducts[1].name,
            price: createdProducts[1].price,
            quantity: 3,
          },
        ],
        totalAmount: 3 * 12.99,
        status: "processing",
      },
      {
        customerName: "Michael Brown",
        customerEmail: "michael.brown@example.com",
        items: [
          {
            product: createdProducts[4]._id,
            name: createdProducts[4].name,
            price: createdProducts[4].price,
            quantity: 1,
          },
          {
            product: createdProducts[6]._id,
            name: createdProducts[6].name,
            price: createdProducts[6].price,
            quantity: 2,
          },
        ],
        totalAmount: 1 * 19.99 + 2 * 18.99,
        status: "ready",
      },
      {
        customerName: "Sarah Davis",
        customerEmail: "sarah.davis@example.com",
        items: [
          {
            product: createdProducts[3]._id,
            name: createdProducts[3].name,
            price: createdProducts[3].price,
            quantity: 2,
          },
          {
            product: createdProducts[7]._id,
            name: createdProducts[7].name,
            price: createdProducts[7].price,
            quantity: 1,
          },
        ],
        totalAmount: 2 * 15.99 + 1 * 9.99,
        status: "processing",
      },
      {
        customerName: "David Wilson",
        customerEmail: "david.wilson@example.com",
        items: [
          {
            product: createdProducts[8]._id,
            name: createdProducts[8].name,
            price: createdProducts[8].price,
            quantity: 1,
          },
        ],
        totalAmount: 1 * 22.99,
        status: "ready",
      },
    ];

    // Insert orders and update product stock
    for (const orderData of sampleOrders) {
      const order = await Order.create(orderData);

      // Update stock for each product in the order
      for (const item of orderData.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      console.log(`✅ Created order for ${orderData.customerName}`);
    }

    // Create sample contact inquiries
    const sampleInquiries = [
      {
        name: "Jennifer Martinez",
        email: "jennifer.martinez@example.com",
        message: "Hi! I'm interested in placing a bulk order for a company event. Do you offer any discounts for large orders? We would need around 50 pounds of various meats. Please let me know the options available.",
        status: "new",
      },
      {
        name: "Robert Taylor",
        email: "robert.taylor@example.com",
        message: "Do you have grass-fed beef available? I'm looking for organic and sustainably raised options. Also, what are your delivery options?",
        status: "new",
      },
      {
        name: "Lisa Anderson",
        email: "lisa.anderson@example.com",
        message: "I received my order yesterday and everything was perfect! The ribeye steaks were amazing. Thank you for the excellent quality and service!",
        status: "responded",
        adminNotes: "Customer very satisfied. Sent thank you email and 10% discount code for next order.",
      },
      {
        name: "James Thompson",
        email: "james.thompson@example.com",
        message: "What are your business hours? I'd like to come by this weekend to pick up an order. Also, do you accept pre-orders for specific cuts?",
        status: "read",
        adminNotes: "Customer inquiring about weekend hours and custom cuts. Need to follow up with availability.",
      },
      {
        name: "Patricia White",
        email: "patricia.white@example.com",
        message: "I'm planning a barbecue for 30 people next month. Can you help me figure out how much meat I would need? What would you recommend?",
        status: "responded",
        adminNotes: "Provided BBQ planning guide and recommended 6-8oz per person. Customer placed $450 order.",
      },
      {
        name: "Christopher Lee",
        email: "christopher.lee@example.com",
        message: "Are your chicken products antibiotic-free? I'm trying to make healthier choices for my family. Also interested in knowing about your sourcing practices.",
        status: "new",
      },
    ];

    const createdInquiries = await Contact.insertMany(sampleInquiries);
    console.log(`✅ Created ${createdInquiries.length} contact inquiries`);

    console.log("\n🎉 Database seeded successfully!");
    console.log(`📦 Total Products: ${createdProducts.length}`);
    console.log(`📋 Total Orders: ${sampleOrders.length}`);
    console.log(`📧 Total Inquiries: ${createdInquiries.length}`);
    console.log(`💰 Total Revenue: $${sampleOrders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n👋 Disconnected from MongoDB");
  }
};

seedDatabase();
