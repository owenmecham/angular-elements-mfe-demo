const fs = require('fs-extra');
const concat = require ('concat');

(async function build() {
  const adesaAnnouncementsPath = 'dist';
  const elementsPath = 'dist/elements';
  await fs.ensureDir(elementsPath);

  await fs.copy(`${adesaAnnouncementsPath}/main.js`, `${elementsPath}/adesa-announcements.js`);

  let fileExists = await fs.pathExists(`${adesaAnnouncementsPath}/styles.js`);

  if(fileExists) {
    await fs.copy(`${adesaAnnouncementsPath}/styles.js`, `${elementsPath}/styles.js`);
    await concat([`${elementsPath}/adesa-announcements.js`,`${elementsPath}/styles.js`], `${elementsPath}/adesa-announcements.js`)
  }

  fileExists = await fs.pathExists(`${adesaAnnouncementsPath}/styles.css`);

  if(fileExists) {
    await fs.copy(`${adesaAnnouncementsPath}/styles.css`, `${elementsPath}/adesa-announcements.css`);
  }

  await fs.copy(`${adesaAnnouncementsPath}/assets/i18n/en-us.json`, `${elementsPath}/en-us.json`);
  await fs.copy(`${adesaAnnouncementsPath}/assets/i18n/fr-ca.json`, `${elementsPath}/fr-ca.json`);
  await fs.copy(`${adesaAnnouncementsPath}/assets/i18n/es-mx.json`, `${elementsPath}/es-mx.json`);

})();
