import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../model/user.model.js';
import CustomerProfile from '../model/CustomerProfile.model.js';
import OwnerProfile from '../model/OwnerProfile.model.js';
import Mess from '../model/Mess.model.js';
import Meal from '../model/Meal.model.js';
import Order from '../model/order.model.js';
import Review from '../model/review.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const calcOrderTotal = (items) => {
  return items.reduce((sum, item) => {
    const extrasTotal = (item.selectedExtras || []).reduce(
      (extraSum, extra) => extraSum + (extra.price || 0),
      0,
    );
    return sum + (item.price + extrasTotal) * item.quantity;
  }, 0);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await CustomerProfile.deleteMany({});
    await OwnerProfile.deleteMany({});
    await Mess.deleteMany({});
    await Meal.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('All collections cleared');

    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@customer.com',
      password: 'password123',
      role: 'CUSTOMER',
    });

    const customerProfile = await CustomerProfile.create({
      userId: customerUser._id,
      phone: '9876543210',
      address: 'Flat 301, Sunshine Apartments, MG Road, Bangalore - 560001',
      isProfileCompleted: true,
    });

    const ownerUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@owner.com',
      password: 'password123',
      role: 'OWNER',
    });

    const ownerProfile = await OwnerProfile.create({
      userId: ownerUser._id,
      phone: '9123456789',
      address: 'House 45, Bharati Nagar, Koramangala, Bangalore - 560034',
      isProfileCompleted: true,
    });

    // Single owner -> single mess for current product phase.
    const primaryMess = await Mess.create({
      ownerId: ownerUser._id,
      name: "Mama's Kitchen",
      area: 'Koramangala',
      phone: '9123456789',
      address: 'Shop 12, 5th Block, Koramangala, Bangalore - 560095',
      description:
        'Home-style Indian food with fresh ingredients and balanced everyday meals.',
      is_Active: true,
    });

    const meals = await Meal.insertMany([
      {
        messId: primaryMess._id,
        name: 'Aloo Paratha with Curd',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Hot potato-stuffed paratha with curd and pickle.',
        price: 80,
        is_Available: true,
        extras: [
          { name: 'Extra Curd', price: 20, is_Available: true },
          { name: 'Butter', price: 15, is_Available: true },
          { name: 'Pickle', price: 10, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Masala Dosa',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Crispy dosa with potato masala, chutney, and sambar.',
        price: 90,
        is_Available: true,
        extras: [
          { name: 'Extra Chutney', price: 10, is_Available: true },
          { name: 'Extra Sambar', price: 15, is_Available: true },
          { name: 'Ghee Roast Add-on', price: 25, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Paneer Butter Masala Thali',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Paneer gravy, dal, roti, rice, salad, and sweet.',
        price: 180,
        is_Available: true,
        extras: [
          { name: 'Papad', price: 15, is_Available: true },
          { name: 'Extra Roti', price: 12, is_Available: true },
          { name: 'Raita', price: 25, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Chicken Biryani',
        mealType: 'lunch',
        is_Veg: false,
        description: 'Aromatic basmati rice with tender chicken pieces.',
        price: 220,
        is_Available: true,
        extras: [
          { name: 'Boiled Egg', price: 20, is_Available: true },
          { name: 'Raita', price: 25, is_Available: true },
          { name: 'Salad', price: 15, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Kadai Paneer',
        mealType: 'dinner',
        is_Veg: true,
        description: 'Paneer and bell peppers in rich kadai masala.',
        price: 190,
        is_Available: true,
        extras: [
          { name: 'Butter Naan', price: 35, is_Available: true },
          { name: 'Jeera Rice', price: 60, is_Available: true },
          { name: 'Green Salad', price: 20, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Tandoori Chicken',
        mealType: 'dinner',
        is_Veg: false,
        description: 'Tender tandoori chicken served with mint chutney.',
        price: 280,
        is_Available: true,
        extras: [
          { name: 'Mint Dip', price: 10, is_Available: true },
          { name: 'Onion Salad', price: 15, is_Available: true },
          { name: 'Roomali Roti', price: 20, is_Available: false },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Samosa (2 pieces)',
        mealType: 'snack',
        is_Veg: true,
        description: 'Crispy samosa served with sweet and spicy chutneys.',
        price: 40,
        is_Available: true,
        extras: [
          { name: 'Green Chutney', price: 8, is_Available: true },
          { name: 'Sweet Chutney', price: 8, is_Available: true },
          { name: 'Fried Chili', price: 5, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Paneer Tikka',
        mealType: 'snack',
        is_Veg: true,
        description: 'Char-grilled paneer cubes with smoky spice flavor.',
        price: 180,
        is_Available: true,
        extras: [
          { name: 'Mint Dip', price: 10, is_Available: true },
          { name: 'Laccha Onion', price: 15, is_Available: true },
          { name: 'Extra Paneer Cubes', price: 60, is_Available: true },
        ],
      },
    ]);

    const paneerThali = meals.find((m) => m.name === 'Paneer Butter Masala Thali');
    const chickenBiryani = meals.find((m) => m.name === 'Chicken Biryani');
    const masalaDosa = meals.find((m) => m.name === 'Masala Dosa');

    const thaliPapad = paneerThali.extras.find((e) => e.name === 'Papad');
    const thaliRaita = paneerThali.extras.find((e) => e.name === 'Raita');
    const biryaniEgg = chickenBiryani.extras.find((e) => e.name === 'Boiled Egg');
    const dosaSambar = masalaDosa.extras.find((e) => e.name === 'Extra Sambar');

    const order1Items = [
      {
        mealId: paneerThali._id,
        quantity: 1,
        price: paneerThali.price,
        selectedExtras: [
          { extraId: thaliPapad?._id, name: thaliPapad.name, price: thaliPapad.price },
          { extraId: thaliRaita?._id, name: thaliRaita.name, price: thaliRaita.price },
        ],
      },
    ];

    const order2Items = [
      {
        mealId: chickenBiryani._id,
        quantity: 2,
        price: chickenBiryani.price,
        selectedExtras: [
          { extraId: biryaniEgg?._id, name: biryaniEgg.name, price: biryaniEgg.price },
        ],
      },
    ];

    const order3Items = [
      {
        mealId: masalaDosa._id,
        quantity: 2,
        price: masalaDosa.price,
        selectedExtras: [
          { extraId: dosaSambar?._id, name: dosaSambar.name, price: dosaSambar.price },
        ],
      },
    ];

    await Order.create({
      userId: customerUser._id,
      orderItems: order1Items,
      totalAmount: calcOrderTotal(order1Items),
      deliveryAddress: customerProfile.address,
      deliveryPhone: customerProfile.phone,
      status: 'DELIVERED',
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      paymentId: 'UPI123456789',
      notes: 'Please deliver before 1 PM',
      deliveryTime: new Date('2026-02-10T13:00:00'),
      createdAt: new Date('2026-02-10T11:30:00'),
    });

    await Order.create({
      userId: customerUser._id,
      orderItems: order2Items,
      totalAmount: calcOrderTotal(order2Items),
      deliveryAddress: customerProfile.address,
      deliveryPhone: customerProfile.phone,
      status: 'PREPARING',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      notes: 'Less spicy please',
      createdAt: new Date('2026-02-13T08:00:00'),
    });

    await Order.create({
      userId: customerUser._id,
      orderItems: order3Items,
      totalAmount: calcOrderTotal(order3Items),
      deliveryAddress: customerProfile.address,
      deliveryPhone: customerProfile.phone,
      status: 'PLACED',
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      paymentId: 'UPI987654321',
      notes: 'Pack chutney separately',
      createdAt: new Date('2026-02-14T12:30:00'),
    });

    await Review.create({
      user: customerUser._id,
      mess: primaryMess._id,
      rating: 5,
      comment:
        'Great taste and timely delivery. Extras are helpful and quality is consistent.',
    });

    console.log('Seed completed successfully');
    console.log('Customer login: rahul@customer.com / password123');
    console.log('Owner login: priya@owner.com / password123');
    console.log(`Mess count: 1 (${primaryMess.name})`);
    console.log(`Meals created: ${meals.length}`);
    console.log('Orders created: 3');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();