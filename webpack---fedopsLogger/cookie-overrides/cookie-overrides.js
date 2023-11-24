import {
    FEDOPS_OVERRIDES_COOKIE
} from '@wix/fedops-overrides';
import {
    env
} from '../env';
import {
    parseJsonFromNodeOrScalaServers
} from './parse-json-from-node-or-scala-servers';

export const FEDOPS_OVERRIDES_WINDOW_IDENTIFIER =
    '__DEFAULT_FEDOPS_OVERRIDES__';

export class CookieOverrides {
    /**
     * @param {import('@wix/fedops-overrides').FedopsOverrideCookie} overridesCookie
     */
    constructor() {
        this._overridesCookie =
            this._getOverridesFromWindow() ? ?
            this._getOverridesFromDocumentCookieIfExists();
    }

    static persistGlobalOverrides(overridesObject) {
        env()[FEDOPS_OVERRIDES_WINDOW_IDENTIFIER] = overridesObject;
    }

    getGlobalOverrides() {
        return this._overridesCookie;
    }

    getCookieOverridesForApp(appName) {
        return Object.assign({},
            this._overridesCookie.paramsOverrides,
            this._overridesCookie.paramsOverridesForApp &&
            this._overridesCookie.paramsOverridesForApp[appName],
        );
    }

    _getOverridesFromDocumentCookieIfExists() {
        try {
            const overridesCookieContent = getCookie(FEDOPS_OVERRIDES_COOKIE);
            const overridesObject = overridesCookieContent ?
                parseJsonFromNodeOrScalaServers(overridesCookieContent) :
                overridesCookieContent;

            if (overridesObject && typeof overridesObject === 'object') {
                if (overridesObject.paramsOverridesForApp) {
                    overridesObject.paramsOverridesForApp = Object.entries(
                        overridesObject.paramsOverridesForApp,
                    ).reduce(toOverridesWithoutDots, {});
                }

                CookieOverrides.persistGlobalOverrides(overridesObject);
                return overridesObject;
            } else {
                return {};
            }
        } catch (err) {
            console.log(err);
            return {};
        }
    }

    _getOverridesFromWindow() {
        return env()[FEDOPS_OVERRIDES_WINDOW_IDENTIFIER];
    }
}

function toOverridesWithoutDots(overridesMap, [appName, overrides]) {
    return {
        ...overridesMap,
        [appName.replace(/\./g, '-')]: overrides,
    };
}

function getCookie(cookieName) {
    if (!env().document || !env().document.cookie) {
        return '';
    }

    const cookieKeyValuePairs = env()
        .document.cookie.split(';')
        .map((c) => c.trim().split('='));

    const [relevantCookie] = cookieKeyValuePairs.filter(
        ([key]) => key === cookieName,
    );

    if (relevantCookie) {
        const [, value] = relevantCookie;
        return value;
    } else {
        return '';
    }
}