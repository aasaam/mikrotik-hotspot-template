/* eslint-disable vars-on-top */
/* eslint-disable object-shorthand */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable prefer-template */
/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
window.angular
  .module('app', [])
  .filter('i18n', [
    function i18n() {
      return function replace(source, params) {
        var s = source;
        params.forEach(function regexReplace(n, i) {
          s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
        });
        return s;
      };
    },
  ])
  .filter('trust', [
    '$sce',
    function trust($sce) {
      return function returnTrust(htmlCode) {
        return $sce.trustAsHtml(htmlCode);
      };
    },
  ])
  .directive('chartPie', function dataChart() {
    return {
      restrict: 'A',
      scope: {
        chartLabels: '@',
        chartNumbers: '@',
        chartTitle: '@',
      },
      link: function link(scope, element, attr) {
        var config;
        var numbers = [];
        var labels = [];

        if (attr.chartNumbers && attr.chartLabels) {
          try {
            numbers = JSON.parse(attr.chartNumbers);
            labels = JSON.parse(attr.chartLabels);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }

        numbers = numbers
          .map(function toInt(o) {
            return parseInt(o, 10);
          })
          .filter(function noneZero(o) {
            return o > 0;
          });

        if (numbers.length && numbers.length === labels.length) {
          config = {
            type: 'pie',
            data: {
              labels: labels,
              datasets: [
                {
                  backgroundColor: [
                    '#ff9800',
                    '#009688',
                    '#9c27b0',
                    '#4caf50',
                  ].slice(0, numbers.length),
                  data: numbers,
                },
              ],
            },
            defaultFontFamily: 'aasaam-Noto',
            options: {
              maintainAspectRatio: false,
              title: {
                display: true,
                text: attr.chartTitle,
              },
            },
          };
          // eslint-disable-next-line prettier/prettier, no-new
          new window.Chart(element, config);
        }
      },
    };
  })
  .directive('chartBar', function dataChart() {
    return {
      restrict: 'A',
      scope: {
        chartLabels: '@',
        chartNumbers: '@',
        chartTitle: '@',
      },
      link: function link(scope, element, attr) {
        var config;
        var numbers = [];
        var labels = [];

        if (attr.chartNumbers && attr.chartLabels) {
          try {
            numbers = JSON.parse(attr.chartNumbers);
            labels = JSON.parse(attr.chartLabels);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
          }
        }

        numbers = numbers
          .map(function toInt(o) {
            return parseInt(o, 10);
          })
          .filter(function noneZero(o) {
            return o > 0;
          });

        if (numbers.length && numbers.length === labels.length) {
          config = {
            type: 'horizontalBar',
            data: {
              labels: labels,
              datasets: [
                {
                  backgroundColor: [
                    '#ff9800',
                    '#009688',
                    '#9c27b0',
                    '#4caf50',
                  ].slice(0, numbers.length),
                  data: numbers,
                },
              ],
            },
            defaultFontFamily: 'aasaam-Noto',
            options: {
              maintainAspectRatio: false,
              legend: { display: false },
              title: {
                display: true,
                text: attr.chartTitle,
              },
              scales: {
                xAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            },
          };
          // eslint-disable-next-line prettier/prettier, no-new
          new window.Chart(element, config);
        }
      },
    };
  })
  .run([
    '$timeout',
    '$rootScope',
    // eslint-disable-next-line sonarjs/cognitive-complexity
    function run($timeout, $rootScope) {
      window.Chart.defaults.global.defaultFontFamily =
        "'aasaam-Noto', sans-serif";

      var rtlLanguages = ['ar', 'dv', 'fa', 'he', 'ps', 'ur', 'yi'];
      var mikrotik = {};
      var initLang = window.localStorage.getItem('defaultLanguage')
        ? window.localStorage.getItem('defaultLanguage')
        : window.defaultLanguage;

      $rootScope.randomId = function randomId() {
        return Math.random().toString(36).substring(2);
      };

      $rootScope.languageData = window.languageData;

      $rootScope.changeLanguage = function changeLanguage(lang) {
        $rootScope.i18n = window.i18n[lang];
        $rootScope.lang = lang;
        $rootScope.dir =
          rtlLanguages.indexOf($rootScope.lang) !== -1 ? 'rtl' : 'ltr';
        $rootScope.right = $rootScope.dir === 'ltr' ? 'right' : 'left';
        $rootScope.left = $rootScope.dir === 'ltr' ? 'left' : 'right';
        window.localStorage.setItem('defaultLanguage', lang);
      };

      $rootScope.changeLanguage(initLang);

      $rootScope.uptimeProgress = {
        getTimes: function getTimes(uptime, left) {
          var sd = new Date();
          var ed = new Date();

          sd.setTime(sd.getTime() - uptime * 1000);
          ed.setTime(ed.getTime() + left * 1000);

          return {
            s: sd.getTime(),
            e: ed.getTime(),
          };
        },
        value: function value(uptime, left) {
          var times = $rootScope.uptimeProgress.getTimes(uptime, left);

          var now = new Date().getTime();

          return Math.round(now - times.s);
        },
        max: function max(uptime, left) {
          var times = $rootScope.uptimeProgress.getTimes(uptime, left);

          var now = new Date().getTime();

          return times.e - now;
        },
        percent: function percent(uptime, left) {
          var times = $rootScope.uptimeProgress.getTimes(uptime, left);

          var total = times.e - times.s;
          var now = new Date().getTime() - times.s;

          return Math.round((now / total) * 100);
        },
      };

      $rootScope.humanBytes = function humanBytes(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';

        // eslint-disable-next-line vars-on-top
        var i = Math.floor(Math.log(bytes) / Math.log(1024));

        // eslint-disable-next-line no-restricted-properties
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      };

      $rootScope.humanSeconds = function humanSeconds(seconds, num) {
        if (!('Intl' in window) || !('RelativeTimeFormat' in window.Intl)) {
          return seconds;
        }

        // eslint-disable-next-line vars-on-top
        var formatter = new Intl.RelativeTimeFormat($rootScope.lang, {
          style: 'narrow',
        });

        if (seconds > 172800) {
          return formatter.format(num * Math.round(seconds / 86400), 'day');
        }

        if (seconds > 7200) {
          return formatter.format(num * Math.round(seconds / 3600), 'hours');
        }

        if (seconds > 120) {
          return formatter.format(num * Math.round(seconds / 60), 'minute');
        }

        return formatter.format(num * seconds, 'second');
      };

      document
        .querySelectorAll('meta[name^="mikrotik"]')
        .forEach(function mikrotikMeta(e) {
          // eslint-disable-next-line no-unused-vars
          var name = e.getAttribute('name').match(/mikrotik\.(.*)/)[1];
          var value = e.getAttribute('content');
          if (e.hasAttribute('data-type')) {
            switch (e.getAttribute('data-type')) {
              case 'int':
                if (value.match(/^[-]+$/)) {
                  value = undefined;
                } else if (value.match(/^[0-9]+$/)) {
                  value = parseInt(value, 10);
                } else {
                  value = 0;
                }
                break;
              case 'bool':
                if (value === 'true' || value === 'yes' || value === '1') {
                  value = true;
                } else {
                  value = false;
                }
                break;
              default:
                throw new Error('Invalid data type');
            }
          }
          mikrotik[name] = value;
        });

      $rootScope.mikrotik = mikrotik;
      $rootScope.homePage = mikrotik;
      var homeParser = new URL(mikrotik['link-login']);
      $rootScope.homePage = new URL(
        // eslint-disable-next-line prettier/prettier
        homeParser.protocol + '//' + homeParser.host
      );

      $timeout(function loading() {
        document.querySelector('body > div.sk-circle').remove();
        document.querySelector('body > div.main').style.display = 'block';
      }, 1000);
    },
  ])
  .controller('ErrorController', [
    '$rootScope',
    function ErrorController($rootScope) {
      $rootScope.title = 'error';
    },
  ])
  .controller('LoginController', [
    '$scope',
    '$rootScope',
    function LoginController($scope, $rootScope) {
      $rootScope.title = 'login';
      $scope.calculatePassword = function calculatePassword() {
        if (window.chapId) {
          var cnt =
            window.chapId +
            document.querySelector('#password').value +
            window.chapChallenge;
          var hash = window.hexMD5(cnt);
          $scope.password = hash;
        } else {
          $scope.password = $scope.rawPassword;
        }
      };
    },
  ])
  .controller('ALoginController', [
    '$scope',
    '$rootScope',
    function ALoginController($scope, $rootScope) {
      $rootScope.title = 'redirecting';

      if ($rootScope.mikrotik.popup) {
        var sw = Math.round(window.screen.width / 3) - 32;
        if (sw < 320) {
          sw = 320;
        }
        var sh = window.screen.height - 256;
        if (sh < 320) {
          sh = 320;
        }
        window.open(
          $rootScope.mikrotik['link-status'],
          'hotspot_status',
          // eslint-disable-next-line prettier/prettier
          'toolbar=0,location=0,directories=0,status=0,menubars=0,resizable=1,width=' + sw + ',height=' + sh
        );
      }
      window.location.href = unescape(
        // eslint-disable-next-line prettier/prettier
        $rootScope.mikrotik['link-redirect-esc']
      );
    },
  ])
  .controller('StatusController', [
    '$rootScope',
    function StatusController($rootScope) {
      $rootScope.title = 'status';
    },
  ])
  .controller('AdvertisementController', [
    '$scope',
    '$timeout',
    '$rootScope',
    function AdvertisementController($scope, $timeout, $rootScope) {
      var popup;
      $rootScope.title = 'advertisement';

      $scope.openOrig = function openOrig() {
        if (window.focus && popup) popup.focus();
        window.location.href = unescape(
          // eslint-disable-next-line prettier/prettier
          $rootScope.mikrotik['link-redirect-esc']
        );
      };

      $scope.openAd = function openAd() {
        window.location.href = unescape(
          // eslint-disable-next-line prettier/prettier
          $rootScope.mikrotik['link-redirect-esc']
        );
      };

      if (window.name !== 'hotspot_advert') {
        popup = window.open(
          $rootScope.mikrotik['link-redirect'],
          'hotspot_advert',
          // eslint-disable-next-line prettier/prettier
          ''
        );
        $timeout(function runOpenOrig() {
          $scope.openOrig();
        }, 1000);
      } else {
        $timeout(function runOpenOrig() {
          $scope.openAd();
        }, 1000);
      }
    },
  ])
  .controller('LogoutController', [
    '$rootScope',
    function LogoutController($rootScope) {
      $rootScope.title = 'logout';

      $rootScope.openLogin = function openLogin() {
        if (window.name === 'hotspot_logout') {
          window.open($rootScope.mikrotik['link-login'], '_blank', '');
          window.close();
        } else {
          window.location.href = $rootScope.mikrotik['link-login'];
        }
      };
    },
  ]);
