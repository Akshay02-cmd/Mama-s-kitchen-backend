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
      name: "Mumma's Kitchen",
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
        name: 'Poha with Peanut Tadka',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Light and fluffy poha with peanuts, curry leaves, and lemon.',
        image:
          'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=900&q=80',
        price: 45,
        is_Available: true,
        extras: [
          { name: 'Sev Topping', price: 8, is_Available: true },
          { name: 'Extra Lemon', price: 5, is_Available: true },
          { name: 'Curd', price: 15, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Idli Sambar (3 pcs)',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Soft idlis served with home-style sambar and coconut chutney.',
        image:
          'https://images.unsplash.com/photo-1666001086814-228c620c735e?auto=format&fit=crop&w=900&q=80',
        price: 55,
        is_Available: true,
        extras: [
          { name: 'Extra Sambar', price: 12, is_Available: true },
          { name: 'Extra Chutney', price: 10, is_Available: true },
          { name: 'Mini Vada', price: 15, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Masala Dosa',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Crispy masala dosa with potato filling, chutney, and sambar.',
        image:
          'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=900&q=80',
        price: 75,
        is_Available: true,
        extras: [
          { name: 'Extra Sambar', price: 12, is_Available: true },
          { name: 'Ghee Roast Add-on', price: 20, is_Available: true },
          { name: 'Filter Coffee', price: 20, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Aloo Paratha with Curd',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Two homemade aloo parathas served with curd and pickle.',
        image:
          'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=900&q=80',
        price: 70,
        is_Available: true,
        extras: [
          { name: 'Extra Curd', price: 15, is_Available: true },
          { name: 'White Butter', price: 12, is_Available: true },
          { name: 'Pickle', price: 6, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Dal Khichdi Bowl',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Comforting dal khichdi made with rice, moong dal, and ghee tadka.',
        image:
          'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80',
        price: 85,
        is_Available: true,
        extras: [
          { name: 'Papad', price: 10, is_Available: true },
          { name: 'Curd', price: 15, is_Available: true },
          { name: 'Ghee Drizzle', price: 12, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Rajma Chawal',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Slow-cooked rajma served with steamed rice and salad.',
        image:
          'https://images.unsplash.com/photo-1640674786349-2b90f4f8b59f?auto=format&fit=crop&w=900&q=80',
        price: 95,
        is_Available: true,
        extras: [
          { name: 'Extra Rice', price: 20, is_Available: true },
          { name: 'Onion Salad', price: 10, is_Available: true },
          { name: 'Papad', price: 10, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Ghar Ka Veg Thali',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Daily veg thali with dal, sabzi, roti, rice, and pickle.',
        image:
          'https://images.unsplash.com/photo-1626500155537-93690c24099e?auto=format&fit=crop&w=900&q=80',
        price: 110,
        is_Available: true,
        extras: [
          { name: 'Papad', price: 10, is_Available: true },
          { name: 'Extra Roti', price: 12, is_Available: true },
          { name: 'Raita', price: 20, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Egg Curry with Rice',
        mealType: 'dinner',
        is_Veg: false,
        description: 'Home-style egg curry served with jeera rice.',
        image:
          'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=900&q=80',
        price: 105,
        is_Available: true,
        extras: [
          { name: 'Extra Boiled Egg', price: 18, is_Available: true },
          { name: 'Extra Rice', price: 20, is_Available: true },
          { name: 'Onion Salad', price: 10, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Chapati Sabzi Combo',
        mealType: 'dinner',
        is_Veg: true,
        description: 'Four chapatis with seasonal sabzi and dal tadka.',
        image:
          'https://images.unsplash.com/photo-1631452180539-96aca7d48617?auto=format&fit=crop&w=900&q=80',
        price: 90,
        is_Available: true,
        extras: [
          { name: 'Extra Chapati', price: 8, is_Available: true },
          { name: 'Curd', price: 15, is_Available: true },
          { name: 'Jeera Rice', price: 25, is_Available: true },
        ],
      },
      {
        messId: primaryMess._id,
        name: 'Samosa Chaat',
        mealType: 'snack',
        is_Veg: true,
        description: 'Crushed samosa topped with curd, chutneys, and sev.',
        image:
          'https://images.unsplash.com/photo-1606491048802-8342506d6471?auto=format&fit=crop&w=900&q=80',
        price: 50,
        is_Available: true,
        extras: [
          { name: 'Extra Curd', price: 12, is_Available: true },
          { name: 'Extra Sev', price: 8, is_Available: true },
          { name: 'Green Chutney', price: 6, is_Available: true },
        ],
      },
    ]);

    const vegThali = meals.find((m) => m.name === 'Ghar Ka Veg Thali');
    const eggCurryRice = meals.find((m) => m.name === 'Egg Curry with Rice');
    const masalaDosa = meals.find((m) => m.name === 'Masala Dosa');

    const thaliPapad = vegThali.extras.find((e) => e.name === 'Papad');
    const thaliRaita = vegThali.extras.find((e) => e.name === 'Raita');
    const eggAddOn = eggCurryRice.extras.find((e) => e.name === 'Extra Boiled Egg');
    const dosaSambar = masalaDosa.extras.find((e) => e.name === 'Extra Sambar');

    const order1Items = [
      {
        mealId: vegThali._id,
        quantity: 1,
        price: vegThali.price,
        selectedExtras: [
          { extraId: thaliPapad?._id, name: thaliPapad.name, price: thaliPapad.price },
          { extraId: thaliRaita?._id, name: thaliRaita.name, price: thaliRaita.price },
        ],
      },
    ];

    const order2Items = [
      {
        mealId: eggCurryRice._id,
        quantity: 2,
        price: eggCurryRice.price,
        selectedExtras: [
          { extraId: eggAddOn?._id, name: eggAddOn.name, price: eggAddOn.price },
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