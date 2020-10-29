const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const mrcleanMagicPath = 'dist';
  const elementsPath = 'dist/elements';
  await fs.ensureDir(elementsPath);

  await fs.copy(`${mrcleanMagicPath}/main.js`, `${elementsPath}/mrclean-magic.js`);

  let fileExists = await fs.pathExists(`${mrcleanMagicPath}/styles.js`);

  if (fileExists) {
    await fs.copy(`${mrcleanMagicPath}/styles.js`, `${elementsPath}/styles.js`);
    await concat([`${elementsPath}/mrclean-magic.js`, `${elementsPath}/styles.js`], `${elementsPath}/mrclean-magic.js`)
  }

  fileExists = await fs.pathExists(`${mrcleanMagicPath}/styles.css`);

  if (fileExists) {
    await fs.copy(`${mrcleanMagicPath}/styles.css`, `${elementsPath}/mrclean-magic.css`);
  }

  await fs.copy(`${mrcleanMagicPath}/assets/i18n/en-us.json`, `${elementsPath}/en-us.json`);
  await fs.copy(`${mrcleanMagicPath}/assets/i18n/fr-ca.json`, `${elementsPath}/fr-ca.json`);
  await fs.copy(`${mrcleanMagicPath}/assets/i18n/es-mx.json`, `${elementsPath}/es-mx.json`);

})();
