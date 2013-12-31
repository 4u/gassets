goog.provide('gassets');

/**
 * Default path to assets. Can be used only in dev mode
 * @define {string}
 */
gassets.PATH = '/assets/';

/**
 * Global dictionary name with placeholders like '<%= asset_path 'image' %>'
 * @define {boolean}
 */
gassets.DEV_MODE = goog.DEBUG;

/**
 * @param {string} path
 * @return {string}
 */
gassets.path = function(path) {
  if (gassets.DEV_MODE) {
    return gassets.PATH + '/' + path;
  } else if (goog.isDef(goog.global.GASSETS)) {
    return goog.global.GASSETS[path];
  }
  throw new Error('Bad gassets path "' + path + '"');
};
