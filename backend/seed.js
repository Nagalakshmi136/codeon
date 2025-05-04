// Example seed.js (run once with `node seed.js`)
require('dotenv').config();
const User = require('./models/User'); // Adjust path
const connectDB = require('./config/dbConnect'); // Adjust path

connectDB();

const seedAdmin = async () => {
    try {
        await User.deleteMany({ email: 'admin@example.com' }); // Clear existing admin

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword', // Store hashed password
            role: 'admin',
            status: 'approved'
        });

        await adminUser.save();
        console.log('Admin user seeded!');
        process.exit();
    } catch (error) {
        console.error(`Error seeding admin: ${error.message}`);
        process.exit(1);
    }
}

seedAdmin();