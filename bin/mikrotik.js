/* eslint-disable import/no-extraneous-dependencies */
const faker = require('faker');
const { shuffle } = require('lodash');
const prettysize = require('prettysize');

const defaultHost = '127.0.0.1:9000';

const { errors } = require('../locale/en');

module.exports = [
  {
    name: 'hostname',
    fake() {
      return defaultHost;
    },
  },
  {
    name: 'identity',
    fake() {
      return 'MikroTik';
    },
  },
  {
    name: 'login-by',
    fake() {
      return shuffle(['mac', 'trial', ''])[0];
    },
  },
  {
    name: 'plain-passwd',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'ssl-login',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'server-address',
    fake() {
      return defaultHost;
    },
  },
  {
    name: 'server-name',
    fake() {
      return defaultHost;
    },
  },
  {
    name: 'link-login',
    fake() {
      return `http://127.0.0.1:9000/login.html?dst=${faker.internet.url()}`;
    },
  },
  {
    name: 'link-login-only',
    fake() {
      return `http://127.0.0.1:9000/login.html`;
    },
  },
  {
    name: 'link-logout',
    fake() {
      return `http://127.0.0.1:9000/logout.html`;
    },
  },
  {
    name: 'link-redirect',
    fake() {
      return `http://127.0.0.1:9000/logout.html`;
    },
  },
  {
    name: 'link-redirect-esc',
    fake() {
      return `http://127.0.0.1:9000/logout.html`;
    },
  },
  {
    name: 'link-status',
    fake() {
      return `http://127.0.0.1:9000/status.html`;
    },
  },
  {
    name: 'link-orig',
    fake() {
      return faker.internet.url();
    },
  },
  {
    name: 'link-orig-esc',
    fake() {
      return encodeURIComponent(faker.internet.url());
    },
  },
  {
    name: 'domain',
    fake() {
      return 'localhost';
    },
  },
  {
    name: 'interface-name',
    fake() {
      return shuffle(['eth0', 'wl0'])[0];
    },
  },
  {
    name: 'ip',
    fake() {
      return `192.168.199.${faker.random.number({ min: 0, max: 255 })}`;
    },
  },
  {
    name: 'logged-in',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'mac',
    fake() {
      return faker.internet.mac();
    },
  },
  {
    name: 'trial',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'username',
    fake() {
      return faker.internet.userName().toLocaleLowerCase();
    },
  },
  {
    name: 'host-ip',
    fake() {
      return '127.0.0.1';
    },
  },
  {
    name: 'idle-timeout',
    fake() {
      if (Math.random() > 0.5) {
        return '0m60s';
      }
      return '';
    },
  },
  {
    name: 'idle-timeout-secs',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 30, max: 120 });
      }
      return '';
    },
  },
  {
    name: 'limit-bytes-in',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 });
      }
      return '---';
    },
  },
  {
    name: 'limit-bytes-out',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 * 5 });
      }
      return '---';
    },
  },
  {
    name: 'refresh-timeout',
    fake() {
      if (Math.random() > 0.5) {
        return '0m10s';
      }
      return '';
    },
  },
  {
    name: 'refresh-timeout-secs',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 30, max: 45 });
      }
      return '';
    },
  },
  {
    name: 'session-timeout',
    fake() {
      if (Math.random() > 0.5) {
        return '5h';
      }
      return '';
    },
  },
  {
    name: 'session-timeout-secs',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 1800, max: 14400 });
      }
      return '';
    },
  },
  {
    name: 'session-time-left',
    fake() {
      if (Math.random() > 0.5) {
        return '2h';
      }
      return '';
    },
  },
  {
    name: 'session-time-left-secs',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 3600, max: 14400 });
      }
      return '';
    },
  },
  {
    name: 'uptime',
    fake() {
      if (Math.random() > 0.5) {
        return '10h';
      }
      return '';
    },
  },
  {
    name: 'uptime-secs',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({ min: 3600, max: 36000 });
      }
      return '';
    },
  },
  {
    name: 'bytes-in',
    type: 'int',
    fake() {
      return faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 * 1024 });
    },
  },
  {
    name: 'bytes-in-nice',
    fake() {
      return prettysize(
        faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 * 1024 }),
      );
    },
  },
  {
    name: 'bytes-out',
    type: 'int',
    fake() {
      return faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 * 1024 });
    },
  },
  {
    name: 'bytes-out-nice',
    fake() {
      return prettysize(
        faker.random.number({ min: 1024, max: 1024 * 1024 * 1024 * 512 }),
      );
    },
  },
  {
    name: 'packets-in',
    type: 'int',
    fake() {
      return faker.random.number({ min: 10000, max: 10000000 });
    },
  },
  {
    name: 'packets-out',
    fake() {
      return faker.random.number({ min: 10000, max: 10000000 });
    },
  },
  {
    name: 'remain-bytes-in',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({
          min: 1024,
          max: 1024 * 1024 * 1024 * 256,
        });
      }
      return '---';
    },
  },
  {
    name: 'remain-bytes-out',
    type: 'int',
    fake() {
      if (Math.random() > 0.5) {
        return faker.random.number({
          min: 1024,
          max: 1024 * 1024 * 1024 * 128,
        });
      }
      return '---';
    },
  },
  {
    name: 'session-id',
    fake() {
      return faker.random.uuid();
    },
  },
  {
    name: 'var',
    fake() {
      return faker.random.uuid();
    },
  },
  {
    name: 'error',
    fake() {
      if (Math.random() > 0.5) {
        return shuffle(Object.keys(errors))[0];
      }
      return '';
    },
  },
  {
    name: 'error-orig',
    fake() {
      if (Math.random() > 0.5) {
        return shuffle([
          'invalid username or password',
          'RADIUS server is not responding',
        ])[0];
      }
      return '';
    },
  },
  {
    name: 'chap-id',
    fake() {
      return '\\371';
    },
  },
  {
    name: 'chap-challenge',
    fake() {
      return '\\357\\015\\330\\013\\021\\234\\145\\245\\303\\253\\142\\246\\133\\175\\375\\316';
    },
  },
  {
    name: 'popup',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'advert-pending',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'login-by-mac',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
  {
    name: 'blocked',
    type: 'bool',
    fake() {
      return shuffle(['yes', 'no'])[0];
    },
  },
];
