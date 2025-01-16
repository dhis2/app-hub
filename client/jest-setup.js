import '@testing-library/jest-dom'
import { configure } from '@testing-library/dom'
const util = require('util')
const { TextEncoder, TextDecoder } = util
Object.assign(global, { TextDecoder, TextEncoder })

configure({ testIdAttribute: 'data-test' })
