require('isomorphic-fetch')
import { JSDOM } from 'jsdom'

global.window = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
}).window
global.document = global.window.document
global.navigator = global.window.navigator
global.location = global.window.location
global.HTMLElement = global.window.HTMLElement
if (!global.window.localStorage) {
    const localStorage = {
        getItem() {
            return '{}'
        },
        setItem() {},
    }

    global.window.localStorage = localStorage
    global.localStorage = localStorage
}

//Dont load image files etc, as it results in errors
const noop = () => 1
require.extensions['.css'] = noop
require.extensions['.scss'] = noop
require.extensions['.png'] = noop
require.extensions['.jpg'] = noop
require.extensions['.jpeg'] = noop
require.extensions['.gif'] = noop
require.extensions['.svg'] = noop

//Inject chai and sinon to global, so we don't need to require these.
const chaiAsPromised = require('chai-as-promised')
const sinonChai = require('sinon-chai')
global.chai = require('chai')
global.chai.use(chaiAsPromised)
global.chai.use(sinonChai)
global.sinon = require('sinon')

global.expect = global.chai.expect

process.NODE_ENV = 'test'
