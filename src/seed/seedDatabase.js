import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.model.js';
import CustomerProfile from '../model/CustomerProfile.model.js';
import OwnerProfile from '../model/OwnerProfile.model.js';
import Mess from '../model/Mess.model.js';
import Meal from '../model/Meal.model.js';
import Order from '../model/order.model.js';
import Review from '../model/review.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await CustomerProfile.deleteMany({});
    await OwnerProfile.deleteMany({});
    await Mess.deleteMany({});
    await Meal.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('✅ Cleared all collections');

    // Create Customer User
    console.log('👤 Creating customer user...');
    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@customer.com',
      password: 'password123',
      role: 'CUSTOMER',
    });
    console.log(`✅ Customer created: ${customerUser.email}`);

    // Create Customer Profile
    const customerProfile = await CustomerProfile.create({
      userId: customerUser._id,
      phone: '9876543210',
      address: 'Flat 301, Sunshine Apartments, MG Road, Bangalore - 560001',
      isProfileCompleted: true,
    });
    console.log(`✅ Customer profile created for ${customerUser.name}`);

    // Create Owner User
    console.log('👨‍💼 Creating owner user...');
    const ownerUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@owner.com',
      password: 'password123',
      role: 'OWNER',
    });
    console.log(`✅ Owner created: ${ownerUser.email}`);

    // Create Owner Profile
    const ownerProfile = await OwnerProfile.create({
      userId: ownerUser._id,
      phone: '9123456789',
      address: 'House 45, Bharati Nagar, Koramangala, Bangalore - 560034',
      isProfileCompleted: true,
    });
    console.log(`✅ Owner profile created for ${ownerUser.name}`);

    // Create First Mess - Delicious Delights
    console.log('🏪 Creating first mess...');
    const mess1 = await Mess.create({
      ownerId: ownerUser._id,
      name: 'Delicious Delights',
      area: 'Koramangala',
      phone: '9123456789',
      address: 'Shop 12, 5th Block, Koramangala, Bangalore - 560095',
      description: 'Authentic North Indian and South Indian cuisine with homely taste. We serve fresh, hygienic food prepared with love. Special focus on healthy and nutritious meals.',
      is_Active: true,
    });
    console.log(`✅ Mess created: ${mess1.name}`);

    // Create Second Mess - Mama's Kitchen
    console.log('🏪 Creating second mess...');
    const mess2 = await Mess.create({
      ownerId: ownerUser._id,
      name: "Mama's Kitchen",
      area: 'Whitefield',
      phone: '9876501234',
      address: '23, ITPL Main Road, Whitefield, Bangalore - 560066',
      description: 'Traditional home-style cooking with a focus on South Indian delicacies. All meals prepared fresh daily. Perfect for working professionals who miss home food.',
      is_Active: true,
    });
    console.log(`✅ Mess created: ${mess2.name}`);

    // Create Meals for Mess 1 - Delicious Delights (North Indian focused)
    console.log('🍽️  Creating meals for Delicious Delights...');
    const mess1Meals = await Meal.insertMany([
      // Breakfast
      {
        messId: mess1._id,
        name: 'Aloo Paratha with Curd',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Hot potato-stuffed paratha served with fresh curd, pickle, and butter',
        price: 80,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Poha',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Light and fluffy beaten rice with peanuts, curry leaves, and lemon',
        price: 50,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Chole Bhature',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Spicy chickpea curry served with fluffy fried bread and onion salad',
        price: 120,
        is_Available: true,
      },
      // Lunch
      {
        messId: mess1._id,
        name: 'Paneer Butter Masala Thali',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Complete thali with paneer butter masala, dal, 4 rotis, rice, salad, and sweet',
        price: 180,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Dal Makhani Combo',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Creamy dal makhani with jeera rice, 2 butter naan, raita, and papad',
        price: 150,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Chicken Biryani',
        mealType: 'lunch',
        is_Veg: false,
        description: 'Aromatic basmati rice cooked with tender chicken pieces, served with raita',
        price: 220,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Rajma Chawal',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Kidney beans curry served with steamed rice, salad, and papad',
        price: 130,
        is_Available: true,
      },
      // Dinner
      {
        messId: mess1._id,
        name: 'Butter Chicken Thali',
        mealType: 'dinner',
        is_Veg: false,
        description: 'Rich butter chicken with 4 rotis, rice, dal tadka, salad, and gulab jamun',
        price: 250,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Kadai Paneer',
        mealType: 'dinner',
        is_Veg: true,
        description: 'Cottage cheese with bell peppers in kadai masala, served with 3 rotis',
        price: 190,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Tandoori Chicken',
        mealType: 'dinner',
        is_Veg: false,
        description: 'Half tandoori chicken marinated in yogurt and spices, served with green chutney',
        price: 280,
        is_Available: true,
      },
      // Snacks
      {
        messId: mess1._id,
        name: 'Samosa (2 pieces)',
        mealType: 'snack',
        is_Veg: true,
        description: 'Crispy samosas filled with spiced potatoes, served with tamarind chutney',
        price: 40,
        is_Available: true,
      },
      {
        messId: mess1._id,
        name: 'Paneer Tikka',
        mealType: 'snack',
        is_Veg: true,
        description: 'Grilled cottage cheese cubes marinated in tandoori spices',
        price: 180,
        is_Available: true,
      },
    ]);
    console.log(`✅ Created ${mess1Meals.length} meals for Delicious Delights`);

    // Create Meals for Mess 2 - Mama's Kitchen (South Indian focused)
    console.log('🍽️  Creating meals for Mama\'s Kitchen...');
    const mess2Meals = await Meal.insertMany([
      // Breakfast
      {
        messId: mess2._id,
        name: 'Idli Vada Combo',
        mealType: 'breakfast',
        is_Veg: true,
        description: '3 soft idlis and 1 crispy vada served with sambar, coconut chutney, and tomato chutney',
        price: 70,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Masala Dosa',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Crispy rice crepe filled with spiced potato masala, served with sambar and chutneys',
        price: 90,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Pongal',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Traditional rice and lentil porridge tempered with pepper, cumin, and cashews',
        price: 80,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Upma',
        mealType: 'breakfast',
        is_Veg: true,
        description: 'Savory semolina porridge with vegetables, served with coconut chutney',
        price: 60,
        is_Available: true,
      },
      // Lunch
      {
        messId: mess2._id,
        name: 'South Indian Meals',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Unlimited rice, sambar, rasam, 2 vegetable curries, curd, pickle, papad, and payasam',
        price: 140,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Curd Rice',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Cooling yogurt rice with cucumber, pomegranate, and traditional tempering',
        price: 90,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Bisi Bele Bath',
        mealType: 'lunch',
        is_Veg: true,
        description: 'Karnataka-style spicy rice and lentil preparation with vegetables and ghee',
        price: 120,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Fish Curry Meals',
        mealType: 'lunch',
        is_Veg: false,
        description: 'Spicy fish curry with rice, rasam, vegetable, and curd',
        price: 200,
        is_Available: true,
      },
      // Dinner
      {
        messId: mess2._id,
        name: 'Rava Dosa',
        mealType: 'dinner',
        is_Veg: true,
        description: 'Crispy semolina crepe with onion, served with sambar and chutneys',
        price: 85,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Set Dosa (3 pieces)',
        mealType: 'dinner',
        is_Veg: true,
        description: 'Three soft, spongy dosas served with potato curry and chutneys',
        price: 100,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Chicken 65',
        mealType: 'dinner',
        is_Veg: false,
        description: 'Spicy deep-fried chicken pieces with curry leaves and green chilies',
        price: 180,
        is_Available: true,
      },
      // Snacks
      {
        messId: mess2._id,
        name: 'Medu Vada (3 pieces)',
        mealType: 'snack',
        is_Veg: true,
        description: 'Crispy golden lentil donuts served with sambar and chutneys',
        price: 60,
        is_Available: true,
      },
      {
        messId: mess2._id,
        name: 'Bajji (4 pieces)',
        mealType: 'snack',
        is_Veg: true,
        description: 'Mixed vegetable fritters in gram flour batter, served with chutney',
        price: 50,
        is_Available: true,
      },
    ]);
    console.log(`✅ Created ${mess2Meals.length} meals for Mama's Kitchen`);

    // Create Orders for Customer
    console.log('📦 Creating sample orders...');
    
    // Order 1 - Completed order from Mess 1
    const order1 = await Order.create({
      userId: customerUser._id,
      orderItems: [
        {
          mealId: mess1Meals[3]._id, // Paneer Butter Masala Thali
          quantity: 1,
          price: 180,
        },
        {
          mealId: mess1Meals[10]._id, // Samosa
          quantity: 2,
          price: 40,
        },
      ],
      totalAmount: 260,
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
    console.log('✅ Created delivered order');

    // Order 2 - Preparing order from Mess 2
    const order2 = await Order.create({
      userId: customerUser._id,
      orderItems: [
        {
          mealId: mess2Meals[1]._id, // Masala Dosa
          quantity: 2,
          price: 90,
        },
        {
          mealId: mess2Meals[11]._id, // Medu Vada
          quantity: 1,
          price: 60,
        },
      ],
      totalAmount: 240,
      deliveryAddress: customerProfile.address,
      deliveryPhone: customerProfile.phone,
      status: 'PREPARING',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      notes: 'Make it extra crispy',
      createdAt: new Date('2026-02-13T08:00:00'),
    });
    console.log('✅ Created preparing order');

    // Order 3 - Placed order from Mess 1
    const order3 = await Order.create({
      userId: customerUser._id,
      orderItems: [
        {
          mealId: mess1Meals[5]._id, // Chicken Biryani
          quantity: 2,
          price: 220,
        },
      ],
      totalAmount: 440,
      deliveryAddress: customerProfile.address,
      deliveryPhone: customerProfile.phone,
      status: 'PLACED',
      paymentMethod: 'UPI',
      paymentStatus: 'COMPLETED',
      paymentId: 'UPI987654321',
      notes: 'Less spicy please',
      createdAt: new Date('2026-02-13T12:30:00'),
    });
    console.log('✅ Created placed order');

    // Create Reviews
    console.log('⭐ Creating reviews...');
    
    const review1 = await Review.create({
      user: customerUser._id,
      mess: mess1._id,
      rating: 5,
      comment: 'Absolutely loved the food! The paneer butter masala was amazing and reminded me of home. The delivery was on time and the packaging was excellent. Highly recommended!',
    });

    const review2 = await Review.create({
      user: customerUser._id,
      mess: mess2._id,
      rating: 4,
      comment: 'Great authentic South Indian taste! The idli was soft and the sambar was flavorful. The only reason for 4 stars is the portion could be slightly bigger. Overall, very satisfied!',
    });

    console.log('✅ Created 2 reviews');

    // Summary
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('─────────────────────────────────────');
    console.log(`👤 Customer: ${customerUser.name} (${customerUser.email})`);
    console.log(`   Password: password123`);
    console.log(`   Phone: ${customerProfile.phone}`);
    console.log(`\n👨‍💼 Owner: ${ownerUser.name} (${ownerUser.email})`);
    console.log(`   Password: password123`);
    console.log(`   Phone: ${ownerProfile.phone}`);
    console.log(`\n🏪 Mess 1: ${mess1.name} (${mess1.area})`);
    console.log(`   Meals: ${mess1Meals.length} items`);
    console.log(`   Focus: North Indian cuisine`);
    console.log(`\n🏪 Mess 2: ${mess2.name} (${mess2.area})`);
    console.log(`   Meals: ${mess2Meals.length} items`);
    console.log(`   Focus: South Indian cuisine`);
    console.log(`\n📦 Orders: 3 orders (1 DELIVERED, 1 PREPARING, 1 PLACED)`);
    console.log(`⭐ Reviews: 2 reviews`);
    console.log('─────────────────────────────────────');
    console.log('\n✅ You can now test the UI with this data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n👋 Database connection closed');
    process.exit(0);
  }
};

seedDatabase();
