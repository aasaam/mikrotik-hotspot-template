/* eslint-disable import/no-extraneous-dependencies */
// @ts-check

const util = require('util');
const fs = require('fs');
const { resolve, parse } = require('path');

const fsp = fs.promises;

const exec = util.promisify(require('child_process').exec);

const projectDir = resolve(__dirname, '..');

const minify = require('@node-minify/core');
const htmlMinifier = require('@node-minify/html-minifier');
const nunjucks = require('nunjucks');
const flat = require('flat');
const { to } = require('await-to-js');
const { merge, uniq } = require('lodash');
const { Organization } = require('@aasaam/information');

const mikrotik = require('./mikrotik');

process.chdir(projectDir);

const { log } = console;

const nunEnv = nunjucks.configure(`${projectDir}/templates`, {
  tags: {
    blockStart: '(%',
    blockEnd: '%)',
    variableStart: '(@',
    variableEnd: '@)',
    commentStart: '<#',
    commentEnd: '#>',
  },
  autoescape: false,
});

let locales = {};
const localeDir = `${projectDir}/locale`;
const localeAddonDir = `${projectDir}/additional/locale`;
const sizes = [];
fs.readdirSync(localeDir).forEach((file) => {
  const { name: lang } = parse(file);
  const p = resolve(localeDir, file);
  const addonPath = resolve(localeAddonDir, file);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  locales[lang] = require(p);

  if (fs.existsSync(addonPath)) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const addon = require(addonPath);
    locales[lang] = merge(locales[lang], addon);
  }

  if (Organization[lang]) {
    locales[lang].aasaam = {
      name: Organization[lang].name,
      description: Organization[lang].description,
      url: Organization[lang].url,
    };
  } else {
    locales[lang].aasaam = {
      name: Organization.en.name,
      description: Organization.en.description,
      url: Organization.en.url,
    };
  }

  sizes.push(Object.keys(flat(locales[lang])).length);
});

// @ts-ignore
if (uniq(sizes).length !== 1) {
  log('Seems translation fields are not equal');
  process.exit();
}

if (process.env.LANGUAGES) {
  const validLanguages = process.env.LANGUAGES.split(',');
  const validLocales = {};
  Object.keys(locales).forEach((lang) => {
    if (validLanguages.includes(lang)) {
      validLocales[lang] = locales[lang];
    }
  });
  locales = validLocales;
}

const languageData = {};
Object.keys(locales).forEach((lang) => {
  // @ts-ignore
  const regionNamesInNative = new Intl.DisplayNames([lang], {
    type: 'language',
  });

  if (!languageData[lang]) {
    languageData[lang] = {};
  }
  languageData[lang][lang] = regionNamesInNative.of(lang);
  Object.keys(locales).forEach((l2) => {
    // @ts-ignore
    const regionNamesInOther = new Intl.DisplayNames([l2], {
      type: 'language',
    });

    languageData[lang][l2] = regionNamesInOther.of(lang);
  });
});

// console.log(languageData);
// process.exit();

const templates = [];
const templateDir = `${projectDir}/templates`;
fs.readdirSync(templateDir).forEach((file) => {
  if (!file.match(/\.html$/)) {
    return;
  }
  templates.push(file);
});

const defaultLanguage = process.env.DEFAULT_LANG
  ? process.env.DEFAULT_LANG
  : 'fa';

(async () => {
  const version = Math.random().toString(36).substring(2);

  const commands = [
    `mkdir -p ${projectDir}/tmp`,
    `mkdir -p ${projectDir}/public/js`,
    `mkdir -p ${projectDir}/public/fonts`,
    `mkdir -p ${projectDir}/public/images`,
    `rm -rf ${projectDir}/public/js/_*`,
    `rm -rf ${projectDir}/public/*.html`,
    `cp -rf ${projectDir}/node_modules/@aasaam/noto-font/dist/*Regular* ${projectDir}/public/fonts/`,
    `cp -rf ${projectDir}/node_modules/@aasaam/noto-font/dist/*Bold* ${projectDir}/public/fonts/`,
    `cp -rf ${projectDir}/node_modules/@aasaam/information/logo/icons/favicon.ico ${projectDir}/public/favicon.ico`,
    `cp -rf ${projectDir}/node_modules/@aasaam/information/info/humans.txt ${projectDir}/public/humans.txt`,
    `cp -rf ${projectDir}/node_modules/@aasaam/information/logo/aasaam-mono.svg ${projectDir}/public/images/aasaam.svg`,
    `cp -rf ${projectDir}/node_modules/@aasaam/information/logo/aasaam-mono.svg ${projectDir}/public/images/logo.svg`,
    `cat ${projectDir}/node_modules/angular/angular.js > ${projectDir}/public/js/_frameworks.js`,
    `cat ${projectDir}/lib/md5.js >> ${projectDir}/public/js/_frameworks.js`,
    `cat ${projectDir}/node_modules/chart.js/dist/Chart.js >> ${projectDir}/public/js/_frameworks.js`,
    `echo "\\$version: \\"${version}\\";" > ${projectDir}/public/css/__version.scss`,
    `cp ${projectDir}/node_modules/chart.js/dist/Chart.css ${projectDir}/public/css/__chart.scss`,
  ];

  const logoPath = `${projectDir}/additional/logo.svg`;
  const [, logoExist] = await to(fsp.stat(logoPath));
  if (logoExist) {
    commands.push(
      `cp -rf ${projectDir}/additional/logo.svg ${projectDir}/public/images/logo.svg`,
    );
  }

  await exec(commands.join(' && '));

  await fsp.writeFile(
    resolve(process.cwd(), 'version.js'),
    `module.exports = '${version}';\n`,
  );

  await exec(
    [
      `rm -rf ${projectDir}/public/css/*.css`,
      `rm -rf ${projectDir}/public/css/*.map`,
      `cd ${projectDir}/public/css`,
      `${projectDir}/node_modules/.bin/node-sass main-rtl.scss main-rtl.css --output-style compressed`,
      `${projectDir}/node_modules/.bin/node-sass main-ltr.scss main-ltr.css --output-style compressed`,
      `${projectDir}/node_modules/.bin/node-sass _loading.scss /tmp/_loading.css --output-style compressed`,
    ].join(' && '),
  );

  await fsp.writeFile(
    `${projectDir}/public/js/_i.js`,
    `window.defaultLanguage = ${JSON.stringify(defaultLanguage, null, 2)};\n`,
  );

  await fsp.appendFile(
    `${projectDir}/public/js/_i.js`,
    `window.i18n = ${JSON.stringify(locales, null, 2)};\n`,
  );

  await exec(
    [
      `rm -rf ${projectDir}/public/js/_f.min.js`,
      `cd ${projectDir}/public/js`,
      `${projectDir}/node_modules/.bin/uglifyjs --compress --mangle --source-map "url='_main.min.js.map'" --output _main.min.js _frameworks.js _i.js main.js`,
    ].join(' && '),
  );

  const loading = await fsp.readFile('/tmp/_loading.css', { encoding: 'utf8' });

  let promises = [];
  templates.forEach((file) => {
    promises.push(
      new Promise((res, rej) => {
        nunEnv.render(
          file,
          {
            mikrotik,
            loading,
            version,
            languageData: JSON.stringify(languageData),
          },
          (e, htmlRaw) => {
            if (e) {
              rej(e);
            } else {
              minify({
                compressor: htmlMinifier,
                content: htmlRaw,
                options: {
                  collapseWhitespace: true,
                  removeAttributeQuotes: false,
                  ignoreCustomComments: [/^!/],
                },
                callback: (err, html) => {
                  if (err) {
                    rej(err);
                  } else {
                    res({
                      file,
                      html,
                    });
                  }
                },
              });
            }
          },
        );
      }),
    );
  });

  const htmlList = await Promise.all(promises);

  promises = [];
  htmlList.forEach(({ file, html }) => {
    promises.push(
      new Promise((res, rej) => {
        fsp
          .writeFile(`${projectDir}/public/${file}`, html)
          .then(res)
          .catch(rej);
      }),
    );
  });

  await Promise.all(promises);

  await exec(
    [
      `rm -rf ${projectDir}/tmp/hotspot`,
      `cp -rf ${projectDir}/public ${projectDir}/tmp/hotspot`,
      `cd ${projectDir}/tmp`,
      `zip -r hotspot.zip hotspot`,
    ].join(' && '),
  );

  log('UI GENERATED SUCCESSFULLY');
})();

if (process.env.DEVMON) {
  setInterval(() => {
    /* OK */
  }, 1000);
}
