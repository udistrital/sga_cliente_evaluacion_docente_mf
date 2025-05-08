const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

try {
  let envFileName;

  switch (process.env['NOMBRE_ARCH_ENVIRONMENT']) {
    case 'environment.development.ts':
      envFileName = 'environment.development.ts';
      break;
    case 'environment.production.ts':
      envFileName = 'environment.production.ts';
      break;
    case 'environment.ts':
      envFileName = 'environment.ts';
      break;
    default:
      envFileName = 'environment.ts';
      break;
  }

  const targetPath = path.resolve(__dirname, `./src/environments/${envFileName}`);

  let fileContent = fs.readFileSync(targetPath, { encoding: 'utf8' });

  fileContent = fileContent.replace(/USER:\s*'[^']*'/, `USER: '${process.env['USER_KNOWAGE']}'`);
  fileContent = fileContent.replace(/PASSWORD:\s*'[^']*'/, `PASSWORD: '${process.env['PASSWORD_KNOWAGE']}'`);

  fs.writeFileSync(targetPath, fileContent, { encoding: 'utf8' });

  console.log(`✅ USER y PASSWORD de KNOWAGE actualizados en ${envFileName}`);
} catch (error) {
  console.error(`❌ Error al actualizar USER y PASSWORD de KNOWAGE: ${error.message}`);
}