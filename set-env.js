const fs = require('fs');
const path = require('path');

// Solo cargar .env si no se está en CI
if (!process.env.CI) {
  require('dotenv').config();
}

try {
  const envFiles = [
    'environment.ts',
    'environment.development.ts',
    'environment.production.ts',
  ];

  envFiles.forEach((fileName) => {
    try {
      const targetPath = path.resolve(__dirname, `./src/environments/${fileName}`);

      if (!fs.existsSync(targetPath)) {
        throw new Error(`El archivo no existe: ${targetPath}`);
      }

      const user_knowage = process.env['USER_KNOWAGE'];
      const password_knowage = process.env['PASSWORD_KNOWAGE'];

      if (!user_knowage || !password_knowage) {
        throw new Error(`Variables USER_KNOWAGE o PASSWORD_KNOWAGE no definidas`);
      }

      let fileContent = fs.readFileSync(targetPath, { encoding: 'utf8' });

      fileContent = fileContent.replace(/USER:\s*'[^']*'/, `USER: '${user_knowage}'`);
      fileContent = fileContent.replace(/PASSWORD:\s*'[^']*'/, `PASSWORD: '${password_knowage}'`);

      fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });

      console.log(`✅ USER = ${user_knowage} y PASSWORD = ${password_knowage} de KNOWAGE actualizados en ${fileName}`);
    } catch (error) {
      console.error(`❌ Error al actualizar ${fileName}: ${error.message}`);
    }
  });
} catch (error) {
  console.error(`❌ Error al actualizar USER y PASSWORD de KNOWAGE: ${error.message}`);
}
