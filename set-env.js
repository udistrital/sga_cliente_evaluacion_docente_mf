const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

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

      let fileContent = fs.readFileSync(targetPath, { encoding: 'utf8' });

      fileContent = fileContent.replace(/USER:\s*'[^']*'/, `USER: '${process.env['USER_KNOWAGE']}'`);
      fileContent = fileContent.replace(/PASSWORD:\s*'[^']*'/, `PASSWORD: '${process.env['PASSWORD_KNOWAGE']}'`);

      fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });

      console.log(`✅ USER = ${process.env['USER_KNOWAGE']} y PASSWORD = ${process.env['PASSWORD_KNOWAGE']} de KNOWAGE actualizados en ${fileName}`);
    } catch (error) {
      console.error(`❌ Error al actualizar ${fileName}: ${error.message}`);
    }
  });
} catch (error) {
  console.error(`❌ Error al actualizar USER y PASSWORD de KNOWAGE: ${error.message}`);
}