import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@testing-library/jest-dom';

global.Telegram = {
    WebApp: {
        ready: jest.fn(),
        initDataUnsafe: {}
    }
};
