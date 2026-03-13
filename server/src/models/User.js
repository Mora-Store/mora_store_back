const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin'], default: 'admin' },
}, { timestamps: true });

// Hash password before saving
// Mongoose 9: async pre-hooks must NOT call next() — return resolves the hook
userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

// Compare password method
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);