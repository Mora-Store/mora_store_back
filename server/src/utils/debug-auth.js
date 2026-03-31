/**
 * Debug script para verificar problemas de autenticación
 * Uso: node server/src/utils/debug-auth.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const main = async () => {
    try {
        await connectDB();
        
        const username = process.env.ADMIN_USER || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';

        console.log('\n🔍 DEBUG AUTH\n');
        console.log(`Buscando usuario: "${username}"`);
        console.log(`Contraseña a probar: "${password}"\n`);

        // Find user
        const user = await User.findOne({ username });
        
        if (!user) {
            console.log(`❌ Usuario NO encontrado en BD`);
            console.log('\n📋 Usuarios en BD:');
            const allUsers = await User.find();
            if (allUsers.length === 0) {
                console.log('   ⚠️ No hay usuarios. Ejecuta el seed: node server/src/utils/seed.js');
            } else {
                allUsers.forEach(u => console.log(`   - ${u.username} (role: ${u.role})`));
            }
            return;
        }

        console.log(`✅ Usuario encontrado: ${user.username}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Hash en BD: ${user.passwordHash.substring(0, 20)}...`);
        
        // Try to compare
        console.log(`\n🔐 Intentando comparar contraseña...`);
        const isMatch = await user.comparePassword(password);
        
        if (isMatch) {
            console.log(`✅ Contraseña CORRECTA`);
        } else {
            console.log(`❌ Contraseña INCORRECTA`);
            console.log('\n💡 Soluciones:');
            console.log('   1. Ejecuta el seed para recrear el usuario: node server/src/utils/seed.js');
            console.log('   2. Verifica que ADMIN_PASSWORD en .env sea correcta');
            console.log('   3. Compara con lo que ingresaste en el frontend');
        }

        // Also try manual hash
        console.log(`\n🧪 Test manual de hash:`);
        const testHash = await bcrypt.hash(password, 12);
        const manualMatch = await bcrypt.compare(password, testHash);
        console.log(`   Nuevo hash: ${testHash.substring(0, 20)}...`);
        console.log(`   ¿Coincide?: ${manualMatch ? '✅ Sí' : '❌ No'}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
    }
};

main();
