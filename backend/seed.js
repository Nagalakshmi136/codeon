require('dotenv').config();
const User = require('./models/User'); 
const connectDB = require('./config/dbConnect'); 

connectDB();

const seedAdmin = async () => {
    try {
        await User.deleteMany({ email: 'admin@example.com' });

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword', 
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