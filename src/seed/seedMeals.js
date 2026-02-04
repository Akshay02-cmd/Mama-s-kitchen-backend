import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Meal from '../model/Meal.model.js';
import Mess from '../model/Mess.model.js';
import User from '../model/user.model.js';
import OwnerProfile from '../model/OwnerProfile.model.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

// 200 diverse Indian meals - mealType: breakfast, lunch, dinner, snack
const mealData = [
  // North Indian Meals
  { name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry with aromatic spices', price: 250, mealType: 'lunch', is_Veg: false },
  { name: 'Paneer Butter Masala', description: 'Cottage cheese cubes in rich tomato gravy', price: 180, mealType: 'lunch', is_Veg: true },
  { name: 'Dal Makhani', description: 'Black lentils cooked slowly with butter and cream', price: 150, mealType: 'lunch', is_Veg: true },
  { name: 'Chole Bhature', description: 'Spicy chickpeas served with fried bread', price: 120, mealType: 'breakfast', is_Veg: true },
  { name: 'Aloo Paratha', description: 'Potato-stuffed flatbread served with butter', price: 80, mealType: 'breakfast', is_Veg: true },
  { name: 'Chicken Tikka Masala', description: 'Grilled chicken chunks in spicy tomato sauce', price: 280, mealType: 'dinner', is_Veg: false },
  { name: 'Palak Paneer', description: 'Cottage cheese cubes in fresh spinach gravy', price: 170, mealType: 'lunch', is_Veg: true },
  { name: 'Rajma Chawal', description: 'Kidney beans curry served with steamed rice', price: 130, mealType: 'lunch', is_Veg: true },
  { name: 'Kadai Paneer', description: 'Cottage cheese with bell peppers in kadai masala', price: 190, mealType: 'dinner', is_Veg: true },
  { name: 'Tandoori Chicken', description: 'Yogurt-marinated chicken roasted in clay oven', price: 300, mealType: 'dinner', is_Veg: false },
  { name: 'Malai Kofta', description: 'Cottage cheese balls in creamy cashew gravy', price: 200, mealType: 'dinner', is_Veg: true },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice with spiced chicken pieces', price: 220, mealType: 'lunch', is_Veg: false },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables', price: 160, mealType: 'lunch', is_Veg: true },
  { name: 'Shahi Paneer', description: 'Royal cottage cheese in rich cashew gravy', price: 210, mealType: 'dinner', is_Veg: true },
  { name: 'Aloo Gobi', description: 'Potato and cauliflower dry curry with spices', price: 140, mealType: 'lunch', is_Veg: true },
  
  // South Indian Meals
  { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potato', price: 90, mealType: 'breakfast', is_Veg: true },
  { name: 'Idli Sambar', description: 'Soft steamed rice cakes with lentil vegetable soup', price: 70, mealType: 'breakfast', is_Veg: true },
  { name: 'Hyderabadi Biryani', description: 'Spicy aromatic rice with tender mutton pieces', price: 280, mealType: 'lunch', is_Veg: false },
  { name: 'Medu Vada', description: 'Crispy golden lentil donuts served with chutney', price: 60, mealType: 'breakfast', is_Veg: true },
  { name: 'Uttapam', description: 'Thick rice pancake topped with fresh vegetables', price: 85, mealType: 'breakfast', is_Veg: true },
  { name: 'Bisi Bele Bath', description: 'Spicy Karnataka-style rice and lentil mix', price: 120, mealType: 'lunch', is_Veg: true },
  { name: 'Chicken 65', description: 'Spicy deep-fried chicken appetizer with curry leaves', price: 180, mealType: 'snack', is_Veg: false },
  { name: 'Pongal', description: 'Savory rice and lentil porridge tempered with spices', price: 80, mealType: 'breakfast', is_Veg: true },
  { name: 'Rasam Rice', description: 'Tangy tamarind soup mixed with steamed rice', price: 110, mealType: 'lunch', is_Veg: true },
  { name: 'Curd Rice', description: 'Cooling yogurt rice with tempering and cucumber', price: 90, mealType: 'lunch', is_Veg: true },
  { name: 'Pesarattu', description: 'Green gram dosa with onion and chili topping', price: 95, mealType: 'breakfast', is_Veg: true },
  { name: 'Upma', description: 'Savory semolina porridge with vegetables', price: 65, mealType: 'breakfast', is_Veg: true },
  { name: 'Rava Dosa', description: 'Crispy semolina crepe with instant preparation', price: 85, mealType: 'breakfast', is_Veg: true },
  { name: 'Coconut Chutney Rice', description: 'Steamed rice mixed with fresh coconut chutney', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Andhra Fish Curry', description: 'Spicy tamarind-based fish curry with spices', price: 250, mealType: 'lunch', is_Veg: false },
  
  // Punjabi Cuisine
  { name: 'Sarson Ka Saag', description: 'Mustard greens curry served with makki roti', price: 160, mealType: 'lunch', is_Veg: true },
  { name: 'Amritsari Kulcha', description: 'Stuffed bread served with spicy chole curry', price: 110, mealType: 'breakfast', is_Veg: true },
  { name: 'Pindi Chole', description: 'Spicy chickpeas prepared in authentic Punjabi style', price: 140, mealType: 'lunch', is_Veg: true },
  { name: 'Butter Naan', description: 'Soft leavened bread brushed with melted butter', price: 40, mealType: 'lunch', is_Veg: true },
  { name: 'Lassi', description: 'Sweet creamy yogurt drink served chilled', price: 60, mealType: 'snack', is_Veg: true },
  { name: 'Amritsari Fish', description: 'Spicy fried fish marinated in gram flour batter', price: 280, mealType: 'dinner', is_Veg: false },
  { name: 'Kadhi Pakora', description: 'Yogurt curry with gram flour fritters', price: 130, mealType: 'lunch', is_Veg: true },
  { name: 'Aloo Tikki', description: 'Spiced potato patties served with chutneys', price: 70, mealType: 'snack', is_Veg: true },
  { name: 'Paneer Tikka', description: 'Grilled cottage cheese cubes marinated in spices', price: 190, mealType: 'snack', is_Veg: true },
  { name: 'Tandoori Roti', description: 'Whole wheat bread baked in traditional tandoor', price: 25, mealType: 'lunch', is_Veg: true },
  
  // Gujarati Cuisine
  { name: 'Dhokla', description: 'Steamed fermented chickpea flour savory cake', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Khandvi', description: 'Rolled gram flour snack with mustard tempering', price: 90, mealType: 'snack', is_Veg: true },
  { name: 'Thepla', description: 'Spiced whole wheat flatbread perfect for travel', price: 60, mealType: 'breakfast', is_Veg: true },
  { name: 'Undhiyu', description: 'Mixed vegetable curry with traditional spices', price: 150, mealType: 'lunch', is_Veg: true },
  { name: 'Gujarati Kadhi', description: 'Sweet and tangy yogurt curry with spices', price: 110, mealType: 'lunch', is_Veg: true },
  { name: 'Fafda Jalebi', description: 'Crispy snack with sweet jalebi, breakfast favorite', price: 70, mealType: 'breakfast', is_Veg: true },
  { name: 'Handvo', description: 'Savory rice and lentil baked cake with vegetables', price: 85, mealType: 'snack', is_Veg: true },
  { name: 'Dal Dhokli', description: 'Wheat dumplings cooked in spiced lentil curry', price: 120, mealType: 'lunch', is_Veg: true },
  { name: 'Sev Tameta', description: 'Tomato curry topped with crispy gram flour noodles', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Methi Thepla', description: 'Fenugreek flavored flatbread with aromatic spices', price: 65, mealType: 'breakfast', is_Veg: true },
  
  // Bengali Cuisine
  { name: 'Machher Jhol', description: 'Traditional Bengali fish curry with light spices', price: 220, mealType: 'lunch', is_Veg: false },
  { name: 'Shorshe Ilish', description: 'Hilsa fish cooked in mustard sauce Bengali style', price: 350, mealType: 'lunch', is_Veg: false },
  { name: 'Aloo Posto', description: 'Potato cooked in poppy seed paste, Bengali delicacy', price: 130, mealType: 'lunch', is_Veg: true },
  { name: 'Chingri Malai Curry', description: 'Prawns cooked in rich coconut milk gravy', price: 300, mealType: 'dinner', is_Veg: false },
  { name: 'Kosha Mangsho', description: 'Spicy slow-cooked mutton curry Bengali style', price: 320, mealType: 'dinner', is_Veg: false },
  { name: 'Luchi with Alur Dom', description: 'Fried bread served with spicy potato curry', price: 100, mealType: 'breakfast', is_Veg: true },
  { name: 'Mishti Doi', description: 'Sweet caramelized yogurt dessert from Bengal', price: 70, mealType: 'snack', is_Veg: true },
  { name: 'Begun Bhaja', description: 'Fried eggplant slices lightly seasoned', price: 90, mealType: 'snack', is_Veg: true },
  { name: 'Cholar Dal', description: 'Bengali style chana dal with coconut and spices', price: 110, mealType: 'lunch', is_Veg: true },
  { name: 'Doi Katla', description: 'Fish cooked in creamy yogurt gravy Bengali style', price: 240, mealType: 'lunch', is_Veg: false },
  
  // Maharashtrian Cuisine
  { name: 'Vada Pav', description: 'Spiced potato fritter in soft bread bun, Mumbai favorite', price: 40, mealType: 'snack', is_Veg: true },
  { name: 'Misal Pav', description: 'Spicy mixed sprouts curry served with bread', price: 90, mealType: 'breakfast', is_Veg: true },
  { name: 'Pav Bhaji', description: 'Mashed spiced vegetables with buttered bread', price: 100, mealType: 'snack', is_Veg: true },
  { name: 'Puran Poli', description: 'Sweet lentil stuffed flatbread, festival special', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Kolhapuri Chicken', description: 'Fiery red chicken curry from Kolhapur region', price: 260, mealType: 'dinner', is_Veg: false },
  { name: 'Bharli Vangi', description: 'Stuffed baby eggplant cooked in spicy gravy', price: 150, mealType: 'lunch', is_Veg: true },
  { name: 'Sabudana Khichdi', description: 'Tapioca pearl stir-fry with peanuts, fasting food', price: 85, mealType: 'breakfast', is_Veg: true },
  { name: 'Batata Vada', description: 'Spiced potato fritters with gram flour coating', price: 50, mealType: 'snack', is_Veg: true },
  { name: 'Thalipeeth', description: 'Multi-grain flatbread with aromatic spices', price: 70, mealType: 'breakfast', is_Veg: true },
  { name: 'Solkadhi', description: 'Kokum and coconut milk drink, digestive coolant', price: 60, mealType: 'snack', is_Veg: true },
  
  // Kerala Cuisine
  { name: 'Kerala Sadya', description: 'Traditional vegetarian feast on banana leaf', price: 200, mealType: 'lunch', is_Veg: true },
  { name: 'Appam with Stew', description: 'Rice pancake served with coconut vegetable curry', price: 120, mealType: 'breakfast', is_Veg: true },
  { name: 'Fish Moilee', description: 'Fish cooked in mild coconut milk gravy', price: 240, mealType: 'lunch', is_Veg: false },
  { name: 'Puttu Kadala', description: 'Steamed rice cake with chickpea curry', price: 90, mealType: 'breakfast', is_Veg: true },
  { name: 'Kerala Parotta', description: 'Layered flatbread with crispy flaky texture', price: 35, mealType: 'dinner', is_Veg: true },
  { name: 'Beef Fry', description: 'Spicy fried beef with Kerala spices, very popular', price: 280, mealType: 'dinner', is_Veg: false },
  { name: 'Avial', description: 'Mixed vegetables in coconut and yogurt gravy', price: 130, mealType: 'lunch', is_Veg: true },
  { name: 'Karimeen Pollichathu', description: 'Pearl spot fish wrapped in banana leaf and grilled', price: 320, mealType: 'dinner', is_Veg: false },
  { name: 'Payasam', description: 'Sweet milk dessert with vermicelli or rice', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Thoran', description: 'Stir-fried vegetables with grated coconut', price: 110, mealType: 'lunch', is_Veg: true },
  
  // Rajasthani Cuisine
  { name: 'Dal Baati Churma', description: 'Lentils with baked wheat balls and sweet churma', price: 160, mealType: 'lunch', is_Veg: true },
  { name: 'Laal Maas', description: 'Fiery red mutton curry with Rajasthani spices', price: 340, mealType: 'dinner', is_Veg: false },
  { name: 'Gatte Ki Sabzi', description: 'Gram flour dumplings in spicy yogurt curry', price: 140, mealType: 'lunch', is_Veg: true },
  { name: 'Ker Sangri', description: 'Desert beans and berries dry curry, unique dish', price: 170, mealType: 'lunch', is_Veg: true },
  { name: 'Pyaaz Kachori', description: 'Onion-stuffed fried pastry, crispy and spicy', price: 60, mealType: 'snack', is_Veg: true },
  { name: 'Mirchi Vada', description: 'Large green chili stuffed and fried, very spicy', price: 70, mealType: 'snack', is_Veg: true },
  { name: 'Bajre Ki Roti', description: 'Pearl millet flatbread with ghee, winter special', price: 30, mealType: 'lunch', is_Veg: true },
  { name: 'Papad Ki Sabzi', description: 'Papad cooked in spicy yogurt gravy, unique curry', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Mawa Kachori', description: 'Sweet stuffed pastry with khoya filling', price: 50, mealType: 'snack', is_Veg: true },
  { name: 'Mohan Thaal', description: 'Sweet gram flour fudge with cardamom flavor', price: 90, mealType: 'snack', is_Veg: true },
  
  // Street Food & Snacks
  { name: 'Pani Puri', description: 'Crispy hollow shells filled with tangy spicy water', price: 50, mealType: 'snack', is_Veg: true },
  { name: 'Bhel Puri', description: 'Puffed rice mixed with chutneys and vegetables', price: 60, mealType: 'snack', is_Veg: true },
  { name: 'Dahi Puri', description: 'Crispy puri filled with yogurt and sweet chutney', price: 70, mealType: 'snack', is_Veg: true },
  { name: 'Sev Puri', description: 'Crispy puri topped with sev and tangy chutneys', price: 65, mealType: 'snack', is_Veg: true },
  { name: 'Samosa', description: 'Fried triangular pastry with spiced potato filling', price: 20, mealType: 'snack', is_Veg: true },
  { name: 'Kachori', description: 'Spicy lentil-filled fried bread, crispy and tasty', price: 25, mealType: 'snack', is_Veg: true },
  { name: 'Pakora', description: 'Mixed vegetable fritters in chickpea batter', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Momos', description: 'Steamed or fried dumplings with spicy filling', price: 100, mealType: 'snack', is_Veg: true },
  { name: 'Raj Kachori', description: 'Large crispy kachori filled with chutneys and curd', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Papdi Chaat', description: 'Crispy wafers with chickpeas, yogurt and chutneys', price: 75, mealType: 'snack', is_Veg: true },
  
  // Tamil Cuisine
  { name: 'Chettinad Chicken', description: 'Spicy aromatic chicken curry from Chettinad region', price: 270, mealType: 'lunch', is_Veg: false },
  { name: 'Ven Pongal', description: 'Rice and lentil comfort food with pepper and ghee', price: 90, mealType: 'breakfast', is_Veg: true },
  { name: 'Sambar', description: 'Lentil vegetable stew with tamarind and spices', price: 80, mealType: 'lunch', is_Veg: true },
  { name: 'Poriyal', description: 'Stir-fried vegetables with coconut and mustard', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Kothu Parotta', description: 'Shredded flatbread stir-fry with vegetables or meat', price: 140, mealType: 'dinner', is_Veg: true },
  { name: 'Fish Fry', description: 'Crispy fried fish marinated in South Indian spices', price: 200, mealType: 'dinner', is_Veg: false },
  { name: 'Vadai', description: 'Crispy lentil fritters served with coconut chutney', price: 50, mealType: 'snack', is_Veg: true },
  { name: 'Murukku', description: 'Crunchy rice flour spiral snack, festival favorite', price: 60, mealType: 'snack', is_Veg: true },
  { name: 'Banana Leaf Meals', description: 'Complete traditional meal served on banana leaf', price: 180, mealType: 'lunch', is_Veg: true },
  { name: 'Filter Coffee', description: 'South Indian filter coffee with chicory', price: 40, mealType: 'snack', is_Veg: true },
  
  // Goan Cuisine
  { name: 'Fish Curry Rice', description: 'Goan fish curry served with steamed rice', price: 210, mealType: 'lunch', is_Veg: false },
  { name: 'Vindaloo', description: 'Spicy tangy pork curry with vinegar and spices', price: 290, mealType: 'dinner', is_Veg: false },
  { name: 'Xacuti', description: 'Coconut-based spicy curry with complex spice blend', price: 250, mealType: 'lunch', is_Veg: false },
  { name: 'Bebinca', description: 'Layered coconut dessert, traditional Goan sweet', price: 120, mealType: 'snack', is_Veg: true },
  { name: 'Prawn Balchão', description: 'Spicy pickled prawns in tangy tomato sauce', price: 280, mealType: 'dinner', is_Veg: false },
  { name: 'Sorpotel', description: 'Spicy pork curry with liver, authentic Goan dish', price: 270, mealType: 'dinner', is_Veg: false },
  { name: 'Feijoada', description: 'Goan kidney bean curry with coconut milk', price: 140, mealType: 'lunch', is_Veg: true },
  { name: 'Poee', description: 'Goan bread, soft and fluffy, breakfast favorite', price: 20, mealType: 'breakfast', is_Veg: true },
  { name: 'Fish Recheado', description: 'Stuffed fried fish with red masala paste', price: 260, mealType: 'dinner', is_Veg: false },
  { name: 'Sanna', description: 'Steamed rice cakes made with coconut toddy', price: 70, mealType: 'breakfast', is_Veg: true },
  
  // Kashmiri Cuisine
  { name: 'Rogan Josh', description: 'Aromatic lamb curry with Kashmiri spices, signature dish', price: 350, mealType: 'dinner', is_Veg: false },
  { name: 'Gushtaba', description: 'Minced mutton balls in creamy yogurt gravy', price: 320, mealType: 'dinner', is_Veg: false },
  { name: 'Dum Aloo', description: 'Baby potatoes cooked in Kashmiri spices and yogurt', price: 160, mealType: 'lunch', is_Veg: true },
  { name: 'Yakhni', description: 'Yogurt-based lamb curry with cardamom flavor', price: 300, mealType: 'dinner', is_Veg: false },
  { name: 'Nadru Yakhni', description: 'Lotus stem cooked in creamy yogurt gravy', price: 180, mealType: 'lunch', is_Veg: true },
  { name: 'Kahwa', description: 'Traditional Kashmiri green tea with saffron', price: 50, mealType: 'snack', is_Veg: true },
  { name: 'Tabak Maaz', description: 'Fried lamb ribs marinated in spices, crispy dish', price: 340, mealType: 'dinner', is_Veg: false },
  { name: 'Modur Pulav', description: 'Sweet saffron rice with dry fruits and nuts', price: 150, mealType: 'lunch', is_Veg: true },
  { name: 'Haak', description: 'Collard greens curry cooked simply with spices', price: 120, mealType: 'lunch', is_Veg: true },
  { name: 'Kashmiri Pulao', description: 'Fragrant rice with dry fruits, nuts and saffron', price: 170, mealType: 'lunch', is_Veg: true },
  
  // Awadhi Cuisine
  { name: 'Lucknowi Biryani', description: 'Fragrant rice with meat cooked in dum style', price: 280, mealType: 'lunch', is_Veg: false },
  { name: 'Galouti Kebab', description: 'Melt-in-mouth mutton kebab, extremely soft texture', price: 320, mealType: 'snack', is_Veg: false },
  { name: 'Shahi Tukda', description: 'Royal bread pudding soaked in sweetened milk', price: 100, mealType: 'snack', is_Veg: true },
  { name: 'Kakori Kebab', description: 'Spiced minced meat skewers, very delicate', price: 300, mealType: 'snack', is_Veg: false },
  { name: 'Korma', description: 'Mild creamy curry with nuts and aromatic spices', price: 260, mealType: 'dinner', is_Veg: false },
  { name: 'Nihari', description: 'Slow-cooked meat stew, breakfast delicacy', price: 290, mealType: 'breakfast', is_Veg: false },
  { name: 'Sheermal', description: 'Saffron-flavored mildly sweet flatbread', price: 45, mealType: 'dinner', is_Veg: true },
  { name: 'Boti Kebab', description: 'Grilled marinated meat chunks on skewers', price: 310, mealType: 'dinner', is_Veg: false },
  { name: 'Pasanda', description: 'Tender meat in rich almond and cashew gravy', price: 330, mealType: 'dinner', is_Veg: false },
  { name: 'Kulfi', description: 'Traditional dense creamy frozen dessert', price: 60, mealType: 'snack', is_Veg: true },
  
  // Assamese Cuisine
  { name: 'Masor Tenga', description: 'Tangy fish curry with tomatoes and elephant apple', price: 200, mealType: 'lunch', is_Veg: false },
  { name: 'Khar', description: 'Alkaline preparation with raw papaya, unique dish', price: 140, mealType: 'lunch', is_Veg: true },
  { name: 'Pitha', description: 'Rice cake delicacy, sweet or savory variations', price: 70, mealType: 'snack', is_Veg: true },
  { name: 'Duck Curry', description: 'Spicy duck meat curry with black pepper', price: 280, mealType: 'dinner', is_Veg: false },
  { name: 'Aloo Pitika', description: 'Mashed potato with mustard oil and green chilies', price: 90, mealType: 'lunch', is_Veg: true },
  { name: 'Laksa', description: 'Sweet dessert made with sticky rice and jaggery', price: 80, mealType: 'snack', is_Veg: true },
  { name: 'Pork with Bamboo Shoot', description: 'Traditional pork curry cooked with bamboo shoots', price: 260, mealType: 'dinner', is_Veg: false },
  { name: 'Xaak Bhaji', description: 'Mixed leafy greens stir-fry with garlic', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Omita Khar', description: 'Papaya cooked with alkaline water, traditional dish', price: 130, mealType: 'lunch', is_Veg: true },
  { name: 'Til Pitha', description: 'Sesame rice cake with sweet jaggery filling', price: 60, mealType: 'snack', is_Veg: true },
  
  // Additional Popular Dishes
  { name: 'Egg Curry', description: 'Boiled eggs simmered in spicy onion tomato gravy', price: 140, mealType: 'lunch', is_Veg: false },
  { name: 'Mushroom Masala', description: 'Spiced mushroom curry cooked in rich gravy', price: 170, mealType: 'dinner', is_Veg: true },
  { name: 'Mixed Veg Curry', description: 'Assorted vegetables cooked in traditional gravy', price: 150, mealType: 'lunch', is_Veg: true },
  { name: 'Jeera Rice', description: 'Cumin-flavored basmati rice, aromatic and light', price: 100, mealType: 'lunch', is_Veg: true },
  { name: 'Plain Rice', description: 'Steamed white basmati rice, simple and fluffy', price: 80, mealType: 'lunch', is_Veg: true },
  { name: 'Raita', description: 'Yogurt mixed with cucumber, onion and spices', price: 60, mealType: 'lunch', is_Veg: true },
  { name: 'Green Salad', description: 'Fresh mixed vegetable salad with lemon dressing', price: 70, mealType: 'lunch', is_Veg: true },
  { name: 'Papad', description: 'Crispy thin lentil wafer, roasted or fried', price: 20, mealType: 'snack', is_Veg: true },
  { name: 'Pickle Mix', description: 'Assorted Indian pickles - mango, lime, chili', price: 30, mealType: 'snack', is_Veg: true },
  { name: 'Sweet Lassi', description: 'Sweet creamy yogurt drink, refreshing beverage', price: 50, mealType: 'snack', is_Veg: true },
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultUser = async () => {
  try {
    // Check if default owner exists
    let owner = await User.findOne({ email: 'owner@mamaskitchen.com' });
    
    if (!owner) {
      owner = await User.create({
        name: 'Mama\'s Kitchen Owner',
        email: 'owner@mamaskitchen.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: "password"
        role: 'OWNER'
      });
      console.log('✅ Default owner created');
    } else {
      console.log('ℹ️  Default owner already exists');
    }

    // Check if owner profile exists
    let ownerProfile = await OwnerProfile.findOne({ userId: owner._id });
    if (!ownerProfile) {
      ownerProfile = await OwnerProfile.create({
        userId: owner._id,
        phone: '9876543210',
        address: 'Main Street, Food District, Mumbai, Maharashtra'
      });
      console.log('✅ Owner profile created');
    } else {
      console.log('ℹ️  Owner profile already exists');
    }

    return owner._id;
  } catch (error) {
    console.error('Error creating default user:', error);
    throw error;
  }
};

const createDefaultMess = async (ownerId) => {
  try {
    let mess = await Mess.findOne({ name: 'Mama\'s Kitchen Central' });
    
    if (!mess) {
      mess = await Mess.create({
        name: 'Mama\'s Kitchen Central',
        ownerId: ownerId,
        area: 'Central Mumbai',
        phone: '9876543210',
        address: 'Shop 12, Food Court, Mumbai Central, Maharashtra 400008',
        description: 'Authentic home-style Indian food with diverse regional cuisines from all over India',
        is_Active: true
      });
      console.log('✅ Default mess created');
    } else {
      console.log('ℹ️  Default mess already exists');
    }

    return mess._id;
  } catch (error) {
    console.error('Error creating default mess:', error);
    throw error;
  }
};

const seedMeals = async () => {
  try {
    await connectDB();
    
    console.log('\n🔄 Starting seed process...\n');
    
    // Create default owner and mess
    const ownerId = await createDefaultUser();
    const messId = await createDefaultMess(ownerId);

    // Clear existing meals
    const deleteResult = await Meal.deleteMany({});
    console.log(`\n🗑️  Cleared ${deleteResult.deletedCount} existing meals\n`);

    // Add messId to all meals and create them
    const mealsToInsert = mealData.map(meal => ({
      ...meal,
      messId: messId,
      is_Available: true
    }));

    await Meal.insertMany(mealsToInsert);
    console.log(`\n✅ Successfully seeded ${mealsToInsert.length} Indian meals!\n`);
    
    // Display summary
    const vegCount = mealsToInsert.filter(m => m.is_Veg).length;
    const nonVegCount = mealsToInsert.filter(m => !m.is_Veg).length;
    const breakfastCount = mealsToInsert.filter(m => m.mealType === 'breakfast').length;
    const lunchCount = mealsToInsert.filter(m => m.mealType === 'lunch').length;
    const dinnerCount = mealsToInsert.filter(m => m.mealType === 'dinner').length;
    const snackCount = mealsToInsert.filter(m => m.mealType === 'snack').length;
    
    console.log('📊 Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   🥗 Vegetarian: ${vegCount}`);
    console.log(`   🍖 Non-Vegetarian: ${nonVegCount}`);
    console.log(`   🌅 Breakfast: ${breakfastCount}`);
    console.log(`   🍽️  Lunch: ${lunchCount}`);
    console.log(`   🌙 Dinner: ${dinnerCount}`);
    console.log(`   🍿 Snacks: ${snackCount}`);
    console.log(`   📦 Total: ${mealsToInsert.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding meals:', error);
    process.exit(1);
  }
};

seedMeals();
