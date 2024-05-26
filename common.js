const NT_CONTEXT = {
    context_hash: {},
    set: function(key, val) {
        this.context_hash[key] = val;
    },
    has: function(key) {
        return (this.context_hash.hasOwnProperty(key));
    },
    get: function(key, defaultRetVal) {
        if (this.context_hash.hasOwnProperty(key)) {
            return this.context_hash[key];
        } else {
            return defaultRetVal;
        }
    }
};
let __signup_trigger_from = null;
let subdomain = location.host.split('.')[0]

var __STANDARD_DOMAINS = [
    /* Default domains included */
    "aol.com", "att.net", "comcast.net", "facebook.com", "gmail.com", "gmx.com", "googlemail.com",
    "google.com", "hotmail.com", "hotmail.co.uk", "mac.com", "me.com", "mail.com", "msn.com",
    "live.com", "sbcglobal.net", "verizon.net", "yahoo.com", "yahoo.co.uk",

    /* Other global domains */
    "email.com", "fastmail.fm", "games.com" /* AOL */ , "gmx.net", "hush.com", "hushmail.com", "icloud.com",
    "iname.com", "inbox.com", "lavabit.com", "love.com" /* AOL */ , "outlook.com", "pobox.com", "protonmail.ch", "protonmail.com", "tutanota.de", "tutanota.com", "tutamail.com", "tuta.io",
    "keemail.me", "rocketmail.com" /* Yahoo */ , "safe-mail.net", "wow.com" /* AOL */ , "ygm.com" /* AOL */ ,
    "ymail.com" /* Yahoo */ , "zoho.com", "yandex.com",

    /* United States ISP domains */
    "bellsouth.net", "charter.net", "cox.net", "earthlink.net", "juno.com",

    /* British ISP domains */
    "btinternet.com", "virginmedia.com", "blueyonder.co.uk", "live.co.uk",
    "ntlworld.com", "orange.net", "sky.com", "talktalk.co.uk", "tiscali.co.uk",
    "virgin.net", "bt.com",

    /* Domains used in Asia */
    "sina.com", "sina.cn", "qq.com", "naver.com", "hanmail.net", "daum.net", "nate.com", "yahoo.co.jp", "yahoo.co.kr", "yahoo.co.id", "yahoo.co.in", "yahoo.com.sg", "yahoo.com.ph", "163.com", "yeah.net", "126.com", "21cn.com", "aliyun.com", "foxmail.com",

    /* French ISP domains */
    "hotmail.fr", "live.fr", "laposte.net", "yahoo.fr", "wanadoo.fr", "orange.fr", "gmx.fr", "sfr.fr", "neuf.fr", "free.fr",

    /* German ISP domains */
    "gmx.de", "hotmail.de", "live.de", "online.de", "t-online.de" /* T-Mobile */ , "web.de", "yahoo.de",

    /* Italian ISP domains */
    "libero.it", "virgilio.it", "hotmail.it", "aol.it", "tiscali.it", "alice.it", "live.it", "yahoo.it", "email.it", "tin.it", "poste.it", "teletu.it",

    /* Russian ISP domains */
    "bk.ru", "inbox.ru", "list.ru", "mail.ru", "rambler.ru", "yandex.by", "yandex.com", "yandex.kz", "yandex.ru", "yandex.ua", "ya.ru",

    /* Belgian ISP domains */
    "hotmail.be", "live.be", "skynet.be", "voo.be", "tvcablenet.be", "telenet.be",

    /* Argentinian ISP domains */
    "hotmail.com.ar", "live.com.ar", "yahoo.com.ar", "fibertel.com.ar", "speedy.com.ar", "arnet.com.ar",

    /* Domains used in Mexico */
    "yahoo.com.mx", "live.com.mx", "hotmail.es", "hotmail.com.mx", "prodigy.net.mx",

    /* Domains used in Canada */
    "yahoo.ca", "hotmail.ca", "bell.net", "shaw.ca", "sympatico.ca", "rogers.com",

    /* Domains used in Brazil */
    "yahoo.com.br", "hotmail.com.br", "outlook.com.br", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "r7.com", "zipmail.com.br", "globo.com", "globomail.com", "oi.com.br"
];

function NotifyError(errorCode, errorMsg, data) {
    //TODO, this will notify the data and errors along with user info, browser info and screenshot to the backend error logger, for Dev team to look at
}

function isValidEmailAddressSingle(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
};

function isPasswordGoodEnough(passwd) {
    if (typeof passwd != "undefined" && passwd != null && passwd.length >= 8) {
        if (passwd.match(/[*#_!@%&$-]/) != null && passwd.match(/[0-9]/) != null && passwd.match(/[a-z]/) != null && passwd.match(/[A-Z]/) != null)
            return true;
    }
    return false;
}

function getPasswordNotStrongEnoughMsg() {
    return "Entered password is not strong enough. It must be at least 8 characters. It must contain at least one lower case letter, one capital case letter, one special character (*, %, &, _, !, @, #, $, or -) and one digit.";
}

function validatePassword(passwd) {
    return isPasswordGoodEnough(passwd);
    //var re = /^(?=.*\d)(?=.*[!@#$%^&*\(\)_+=-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    //return re.test(password);
}

function isValidEmailAddress(emailAddresses) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    let emailAddressArr = emailAddresses.split(',');
    let retVal = 0;
    for (let i = 0; i < emailAddressArr.length; ++i) {
        let emailAddress = emailAddressArr[i];

        retVal += pattern.test(emailAddress) ? 1 : 0;
    }
    return retVal >= emailAddressArr.length;
}

function isValidDomain(domain) {
    var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,10})$/);
    return domain.match(re);
}

function isValidDomainUnicode(domain) {
    //[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]
    //var re = new RegExp(/^((?:(?:(?:\p{L}[\.\-\+]?)*)\p{L})+)((?:(?:(?:\p{L}[\.\-\+]?){0,62})\p{L})+)\.(\p{L}{2,10})$/);
    var re = new RegExp(/^((?:(?:(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\.\-\+]?)*)[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])+)((?:(?:(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC][\.\-\+]?){0,62})[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC])+)\.([A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]{2,10})$/);
    return domain.match(re);
}

function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}


var _lastClickedEvent;
var pageTitles = {
    "url": {
        "title": "Web Url",
        "type": "static"
    },
    "text": {
        "title": "Text",
        "type": "static"
    },
    "email": {
        "title": "Email",
        "type": "static"
    },
    "sms": {
        "title": "SMS",
        "type": "static"
    },
    "facebook": {
        "title": "SMS",
        "type": "static"
    },
}

var campaignData = null;
var static_short_url = '';
var TotalClicksAllowedCounter = 0;

function showDesignPopUp(idSelector) {
    $(idSelector).click();
    $("#desgin_qrcode_modal").modal("show");
}

const FoldersSection = {
    init: function() {
        FoldersSection.initListeners();
        if ($("#folder-overview-heading").hasClass('d-none')) {
            return;
        }
        showLoaderOnBlock("#folder-Overview-Section");
        let folder_type = page == 'bulkUpload' ? 'bulk' : 'qr';
        $.get("//" + __api_domain + '/user/services/api', {
            cmd: 'getFolderDataOfUser',
            folder_type: folder_type,
            limit: 5
        }, function(response) {
            hideLoader("#folder-Overview-Section")
            if (!empty(response.data)) {
                if (parseInt(extractDataFromArray(response, ['data', 'total_count'], [])) > 5) {
                    $('.folder-overview-view-btn').removeClass("d-none");
                }
                FoldersSection.create(extractDataFromArray(response, ['data', 'all_folders'], []));
                if (extractDataFromArray(response, ['data', 'all_folders'], []).length > 5 && $('.folder-overview-view-btn').hasClass("d-none")) {
                    $('.folder-overview-view-btn').removeClass("d-none")
                }
            }
        });
    },
    create: function(folders) {
        $("#folder-Overview-Section").html('')
        folders.forEach(function(folder, index) {
            $("#folder-Overview-Section").append(FoldersSection.getFolderBoxHtml(folder, index))
        })
    },
    getFolderBoxHtml: function(folder, index) {
        let rmPadding = index == 4 ? 'pr-0' : '';
        let folderIcon = page == 'bulkUpload' ? 'icon-bulk_folder' : 'icon-folder1';
        return `<div class="dash-folder-parent ` + rmPadding + `">
                    <div class="card dashboard-folder-container" id="folderGridCol" data-id="` + folder._id + `" data-type="` + folder.folder_type + `">
                        <div class="btn card-body p-2">
                            <span class="row normal-text-14 ml-2">
                                <i class="` + folderIcon + ` folder-icon-med mr-2 123"></i>
                                <div title="` + folder.folder_name + `" class="grid-folder-text">` + folder.folder_name + `</div>
                            </span>
                            <div> <span class="normal-text-12" style="color: #9FA4B3;">` + getLocalTime(folder.update_time, 'DD-MMM-YYYY') + `</span>
                                <span class="dot normal-text-14 ml-1" id="grid_total_codes">` + folder.total_codes + `</span>
                            </div>
                        </div>
                    </div>
                </div>`
    },
    initListeners: function() {
        $('#folder-Overview-Section').on("mousemove", ".dashboard-folder-container", function(e) {
            $(this).addClass("folder-highlighted");
        });

        $('#folder-Overview-Section').on("mouseout", ".dashboard-folder-container", function(e) {
            $(this).removeClass("folder-highlighted");
        });

        $('#folder-Overview-Section').on("click", ".dashboard-folder-container", function(e) {
            $(this).addClass("folder-highlighted");
            let folder_id = $(this).data('id');
            let folder_type = $(this).data('type');
            window.location.href = '/user/folder-details?folder_id=' + folder_id + '&folder_type=' + folder_type;
        });
    }
}


const PopulateSelectFolderSectionForQR = {
    init: function() {
        if ($("select[name=folder-select-for-qr]").hasClass('d-none')) {
            return;
        }
        // let folder_type = getUrlParameterByName('bulk') == 1 ? 'bulk' : 'qr';
        let qrServicesPages = ['url', 'text', 'email', 'sms', 'vcard', 'facebook', 'event', 'coupons', 'appdownload', 'businesspage', 'businesspage_v0', 'image', 'menu', 'gallery', 'vcardWeb', 'socialMedia', 'rating', 'google', 'googleMaps', 'youtube', 'googleReview', 'googleForms', 'googleCalendar', 'feedbackForm', 'pdf', 'payments', 'presentation', 'googleMeet', 'zoomMeeting', 'meeting', 'calendar', 'videoPreview', 'resume', 'landingpage', 'product', 'whatsapp', 'signin', 'dynamic-url', 'wifi', 'upi', 'smart-rules', 'redeemCoupon', 'digital-business-card', 'digital-business-cards', 'pet-id-tags', 'coupon-code', "medical-alert", "multi-url", 'event-ticket'];
        if (qrServicesPages.includes(page)) {
            $.get("//" + __api_domain + "/user/services/api?cmd=loadFolderSelectionData&folder_type=qr", function(response) {
                if (!empty(response.data)) {
                    if (typeof __JsonPageData == 'undefined') __JsonPageData = {};
                    __JsonPageData.qr_count = extractDataFromArray(response, ['data', 'count'], []);
                    __JsonPageData.required_plan = extractDataFromArray(response, ['data', 'required_plan'])
                    __JsonPageData.user_plan = extractDataFromArray(response, ['data', 'user_plan'])
                    __JsonPageData.folder_limit = extractDataFromArray(response, ['data', 'folder_limit'])
                    PopulateSelectFolderSectionForQR.createOptions(extractDataFromArray(response, ['data', 'all_folders'], []))
                }
            });
        }
    },
    createOptions: function(folders) {
        let selected_folder_id = getUrlParameterByName('folder_id');
        folders.forEach(function(folder) {
            var $option = $("<option />", {
                value: folder['_id'],
                text: folder['folder_name']
            });
            $('select[name=folder-select-for-qr]').append($option);
        })
        if (!empty(selected_folder_id)) {
            $('select[name=folder-select-for-qr]').val(selected_folder_id);
        }
    },
    initListener: function() {}
}

const allowed_shared_actions = {
    'MOVE': 'moved',
    'PAUSE': 'paused',
    'ACTIVATE': 'activated',
    'DELETE': 'deleted',
    'UPDATE': 'updated',
    'COPY': 'copied'
};
const LogSharedInfo = {
    callLoggingApi: function(action, action_on, subject_id, check_for_shared = false) {
        let activeLink = $("#folderTab").find('.active');
        let type = $(activeLink).parents().data('type');
        if (type == 'shared_folders' || getUrlParameterByName('folder_type') == 'shared' || check_for_shared == true) {
            showLoaderOnBlock();
            let formdata = {};
            formdata["cmd"] = "logSharedChanges";
            formdata["action"] = action;
            formdata["action_on"] = action_on;
            formdata['subject_id'] = subject_id;
            formdata['folder_id'] = getUrlParameterByName('folder_id');
            console.log(formdata);

            $.post("//" + __api_domain + '/user/services/api', formdata, function(response) {
                response = parseResponse(response);
                // hideLoader();
                // let errorMsg = getObjectData(response, ['errorMsg']);
                // let errorCode = getObjectData(response, ['errorCode']);
                // if (errorCode === 1) {
                //     // showToastAlert("error", "", (empty(errorMsg) ? "Something went wrong!" : errorMsg));
                // } else if (errorCode === 0) {
                //     //TO DO 
                // }
            });
        }
    },
    hideIrrelevantOptions: function() {
        //console.log(sharedAccessType);
        if (!empty(sharedAccessType)) {
            if (!$('#shared_folder_tab').hasClass('active')) {
                let activeLink = $("#folderTab").find('.active');
                let tab_active = $(activeLink).attr('id');
                $('#' + tab_active).removeClass('active');
                $('#shared_folder_tab').addClass('active')
            }
        }

        if (sharedAccessType == 'view' || sharedAccessType == 'viewexp') {
            $('#requestForAccessMenu').removeClass('d-none');
            $('.request_edit_access').removeClass('d-none');
            $('.action-column-div-css .btn').addClass('disabled');
            $('.dropdown-shared-menu .dropdown-item').addClass('disabled');
            $('.download_qr_code').removeClass('disabled');
            $('.view_bulk_qr_codes').removeClass('disabled');
            $('.edit_folder_name_details').addClass('disabled');
            $('.folder_details_create_qr').addClass('disabled');
            $('.edit_folder_name').addClass('disabled');
            $('.edit_template_name').addClass('disabled');
        }

        if (getUrlParameterByName('folder_type') == 'shared' || !empty(sharedAccessType)) {
            $('.bulk_move_to_folder').addClass('d-none');
            $('.move_to_folder').addClass('d-none');
            $('.delete_folder_details').addClass('d-none');
            $('.folder_details_create_qr').addClass('disabled');
            $('.folder_no_qr_create_qr').addClass('disabled');
        }

        if (getUrlParameterByName('openSharingSettings') == 1) {
            if (extractDataFromArray(__JsonPageData, ['folder_data', 'is_owner']) == true) {
                let url = window.location.href.split('&openSharingSettings')[0];
                window.history.pushState({}, document.title, url);
                $('.share_folder_details').trigger("click");
            }
            // let url = window.location.href.split('&openSharingSettings')[0];
            // window.history.pushState({}, document.title, url);
        }
    }
}

function acceptClose() {
    $('#cookies_div').hide();
    createCookie('privacyAccepted', 'Y', 60);
}

function closeChromeExtensionButton() {
    $('#chrome_extension_btn').remove();
    createCookie('chromeExtensionButton', 'Y', 7);
}

function getFullUrlFromThumbnail(url) {
    var temp = url.split('_t.');
    if (temp.length == 1) {
        return url;
    } else {
        return temp.join('.');
    }
}

function deepCopy(aObject) {
    if (!aObject) {
        return aObject;
    }
    if (typeof aObject == "object" || typeof aObject == "array") //the type of array too is object, but just in case
    {
        let v;
        let bObject = Array.isArray(aObject) ? [] : {};
        for (const k in aObject) {
            if (aObject.hasOwnProperty(k)) {
                v = aObject[k];
                bObject[k] = (typeof v === "object") ? deepCopy(v) : v;
            }
        }
        return bObject;
    }
    return aObject;
}

function extractDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    var data = defaultRetVal;
    if (typeof dataArr != 'undefined') {
        try {
            if (!isEmpty(dataArr) && !isUndefined(paramsArr)) {
                data = dataArr;
                var len = paramsArr.length;
                for (var i = 0; i < len; ++i) {
                    if (!isUndefined(paramsArr[i])) {
                        data = data[paramsArr[i]];
                    }
                }
            }
            if (isUndefined(data)) {
                data = defaultRetVal;
            }
        } catch (e) {
            data = defaultRetVal;
        }
    }
    return data;
}

function extractEscapeHtmlDataFromArray2(dataArr, paramsArr, defaultRetVal = '') {
    return escapeHTML(unescapeHTML(extractUnescapeHtmlDataFromArray(dataArr, paramsArr, defaultRetVal)));
}

function extractEscapeHtmlDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    return escapeHTML(extractDataFromArray(dataArr, paramsArr, defaultRetVal));
}

function extractUnescapeHtmlDataFromArray(dataArr, paramsArr, defaultRetVal = '') {
    return unescapeHTML(extractDataFromArray(dataArr, paramsArr, defaultRetVal));
}

function setValueIfEmpty(variable, value) {
    if (empty(variable)) {
        variable = value
    }
    return variable;
}

function isEmpty(str) {
    if (isUndefined(str)) return true;

    if (!empty(str)) {
        str += '';
        if (str == 'undefined') return true;
        str.replace(/^\s+|\s+$/g, '');
        return (str == '' || str == 0);
    }
    return true;
}

function isUndefined(mixed_var) {
    if (typeof mixed_var == "undefined" || mixed_var === undefined || mixed_var === null) {
        return true;
    }
    mixed_var += '';
    if (mixed_var == 'undef' || mixed_var == 'undefined') return true;
    return false;
}

function isDefined(mixed_var) {
    return !isUndefined(mixed_var);
}


function _getTimezoneSpecificTimeObj() {
    var clientOffset = typeof _ClientSpecificTimezoneOffset != "undefined" ? _ClientSpecificTimezoneOffset : 0;
    var momentObj = moment.utc();
    return momentObj.add(clientOffset, 'seconds');
}

function getLocalTime(time, format) {

    var localTime = '';
    try {
        format = empty(format) ? 'DD-MMM-YYYY hh:mm A' : format;

        if (!empty(time)) {
            var momentObj = moment.utc(time);
        } else {
            var momentObj = _getTimezoneSpecificTimeObj();
        }

        if (momentObj.isValid()) {
            //localTime = momentObj.add(_ClientSpecificTimezoneOffset, 'seconds').format(format);
            // localTime = momentObj.tz(_clientsTimezoneStr).format(format);
            localTime = momentObj.tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format(format);
        }
    } catch (e) {
        console.warn(e);
        localTime = '';
    }

    return localTime;
}

function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getObjectData(obj, keysArr, defaultVal = null) {
    return extractDataFromArray(obj, keysArr, defaultVal);
    /*
    var retVal = defaultVal;
    try
    {
        for (let i = 0; i < keysArr.length; ++i) 
        {
            let key = keysArr[i];
            if(typeof obj == 'object' && obj[key] != "undefined" && i < (keysArr.length-1))
            {
                obj = obj[key];
            }
            else if(i == (keysArr.length-1) && typeof obj == 'object' && obj[key] != "undefined")
            {
                retVal = obj[key];
                break;
            }
        }
    }
    catch(err)
    {console.log(err)}
    return retVal;
    */
}

function showAlertModal(heading, text) {
    if (typeof heading == "undefined" || heading == "") heading = "Alert";
    if (typeof text == "undefined" || text == "") heading = "Some error has occurred. Please refresh the page and try again.";
    $(".modal").modal("hide");
    $("#alert_modal #alert_modal_heading").html(heading);
    $("#alert_modal #alert_modal_text").html(text);
    $("#alert_modal").modal("show");
}

function setCssVar($varName, $val, $selector = ":root") {
    try {
        document.querySelector($selector).style.setProperty('--' + $varName, $val);
    } catch (e) {}
}

function getFloat(x, retVal = 0) {
    const parsed = parseFloat(x);
    //console.log(parsed);
    if (isNaN(parsed)) {
        return retVal;
    }
    return parsed;
}

function getInt(x, retVal = 0, base = 10) {
    const parsed = parseInt(x, base);
    if (isNaN(parsed)) {
        return retVal;
    }
    return parsed;
}

function random_int() {
    return Math.floor(Math.random() * 100000);
}

function random_int_length(length) {
    length = length < 1 ? 1 : length
    return Math.floor(Math.random() * Math.pow(10, length - 1));
}

function random_str(length = 8, case_sensitive = 0) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (case_sensitive) {
        characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function nFormatter(num) {
    if (num >= 1024 * 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    if (num >= 1024 * 1024 * 1024) {
        return (num / (1024 * 1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1024 * 1024) {
        return (num / (1024 * 1024)).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1024) {
        return (num / 1024).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}

function showToastAlert(type, title = '', text = '', cb = () => {}) {
    SwalPopup.showSingleButtonPopup({
        icon: type,
        title: title,
        text: text
    }, cb)
}

function showSimpleToast(el, text, duration = 3000) {
    $('#simpleToastAlertDiv').remove();
    var x = $(el).position();
    var html = `
    <div class="toast fade show simpleToastAlertDiv" style="z-index:99999999" id="simpleToastAlertDiv">
        <div class="toast-header">
            <span class="me-auto">` + text + `</span>
            <button type="button" onclick="$('#simpleToastAlertDiv').remove();" class="btn-close" data-bs-dismiss="toast" aria-label="Close"><span aria-hidden="true">×</span></button>
        </div>
    </div>`;
    $('body').append(html);
    setTimeout(() => {
        $('#simpleToastAlertDiv').remove();
    }, duration);
}

function showDeleteConfirmation(title, message, confirmButtonText, callback, dismissCallback = () => {}) {
    if (empty(confirmButtonText)) {
        confirmButtonText = 'Confirm Delete';
    }
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonClass: 'btn btn-danger mr-auto',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        allowEnterKey: false //we dont enter button to work accidently for delete confirmation
    }).then((result) => {
        console.log(result)
        if (typeof callback == "function" && result.isConfirmed) {
            callback(result.value);
        } else if (typeof dismissCallback == "function" && result.isDismissed) {
            dismissCallback();
        }
    });
}

function forceDynamicUsage(url) {
    if (!validURL(url)) {
        return false;
    }
    if (checkIfChimpDomain(url)) {
        $("#dynamic").prop("checked", true)
        $("#dynamic").prop("disabled", true)
    } else {
        $("#dynamic").prop("disabled", false)
    }
    $("#dynamic").trigger("change")
}

function checkIfChimpDomain(url) {
    let parsed_url = new URL(prependHTTP(url))
    return (parsed_url.host.indexOf("qrcodechimp") > -1);
}

function prependHTTP(url) {
    if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url;
    }
    return url;
}

function validURL(str) {

    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}

function isSafariBrowser() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function isChromeBrowser() {
    return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
}

const isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

function expandSectionsWithErrors() {
    $('.text-danger').parents('.card.collapse_card').each(function() {
        if ($(this).find('.card-header').hasClass("collapsed") && !$(this).find('.text-danger.campaign_name_qr_alert').length) {
            // console.log($( this ).find('.text-danger')[0].outerHTML);
            $(this).find('.card-header').click();
        }
    });
}

function shiftArrayToRight(arr, places) {
    for (var i = 0; i < places; i++) {
        arr.unshift(arr.pop());
    }
}

function exponentialBackoff(toTry, max, delay, callback, onFail = () => {
    console.log('we give up');
}) {
    //console.log('max', max, 'next delay', delay);
    var result = toTry();

    if (result) {
        callback();
    } else {
        if (max > 0) {
            setTimeout(function() {
                var updatedDelay = delay / 2 < 1000 ? 1000 : delay / 2;
                exponentialBackoff(toTry, --max, updatedDelay, callback);
            }, delay);

        } else {
            onFail()
        }
    }
}

function checkAndAdjustURL(url, prefix = '//') {
    if (typeof prefix == 'udefined') {
        prefix = '//';
    }
    if (empty(url)) {
        return '';
    }
    let lUrl = url.toLowerCase();
    if (lUrl.indexOf("http://") == 0 || lUrl.indexOf("https://") == 0 || lUrl.indexOf("//") == 0) {
        return url
    } else {
        return prefix + url
    }
}

function showAlertMessage(type, message, callback, preventOutsideClick = 0) {
    if (typeof callback == 'undefined' || callback == null || !callback) {
        callback = function() {};
    }

    let options = {
        title: 'Done',
        icon: 'success',
        text: message,
        onClose: callback
    }

    if (typeof preventOutsideClick != 'undefined' && preventOutsideClick == 1) {
        options['allowOutsideClick'] = false;
        options['allowEscapeKey'] = false;
    }
    if (type == 'E') {
        options['title'] = 'Error';
        options['icon'] = 'error';
    } else if (type == 'S') {
        options['title'] = 'Done';
        options['icon'] = 'success';
    } else if (type == 'W') {
        options['title'] = 'Warning';
        options['icon'] = 'warning';
    }
    SwalPopup.showSingleButtonPopup(options)
}

function fallbackCopyTextToClipboard(text, show_success_popup = true) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        if (show_success_popup) {
            var msg = successful ? 'successful' : 'unsuccessful';
            SwalPopup.showSingleButtonPopup({
                text: 'Copied to Clipboard',
                icon: 'success'
            })
        }
    } catch (err) {
        console.log('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function copyTextToClipboard(text, show_success_popup = true) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text, show_success_popup);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        if (show_success_popup) {

            SwalPopup.showSingleButtonPopup({
                text: 'Copied to Clipboard',
                icon: 'success'
            }, () => {
                if (page == 'claim-qr-code') {
                    ClaimOpenQrcodes.showSuccessPopup()
                }
            })
        }

    }, function(err) {
        console.log('Async: Could not copy text: ', err);
    });
}


function showFolderLimitPopUp(type, user_plan, required_plan, folder_limit) {
    if (user_plan['PLAN'] != 'ULx5') {
        Swal.fire({
            title: "Folder Limit Exceeded",
            html: `<div class="my-2 text-left">Max allowed ` + type + ` folders for this plan : ` + folder_limit + `<br> Please upgrade your plan to create more ` + type + ` folders. </div>
                <div class="text-left">Current Plan : ` + user_plan['LABEL'] + `
                <div class="text-left">Required Plan : ` + required_plan + `
            `,
            showCancelButton: true,
            confirmButtonText: 'Upgrade Plan',
            reverseButtons: true
        }).then(result => {
            if (result.isConfirmed) {
                location.href = '/pricing'
            }
        });
    } else {
        SwalPopup.showSingleButtonPopup({
            title: "Folder Limit Exceeded",
            html: `<div class="my-2 text-left">Max allowed ` + type + ` folders for this plan : ` + folder_limit + `<br> Please contact support team for more information </div>`
        })
    }
}


function showUpgradePopup(heading, text, buttonText, href) {
    if (typeof heading == 'undefined' || heading == '') {
        heading = "Plan Upgrade Required";
    }
    if (typeof text == 'undefined' || text == '') {
        text = "Please upgrade your account to access this feature.";
    }
    if (typeof buttonText == 'undefined' || buttonText == '') {
        buttonText = 'Upgrade Plan';
    }
    if (typeof href == 'undefined' || href == '') {
        href = '/pricing';
    }
    Swal.fire({
        title: heading,
        text: text,
        showCancelButton: true,
        confirmButtonText: buttonText,
        reverseButtons: true
    }).then(result => {
        if (result.isConfirmed) {
            location.href = href;
        }
    })
}

/*
    const PLAN_FREE = 'FR';
    const PLAN_STARTER = 'ST';
    const PLAN_PROFESSIONAL = 'PF';
    const PLAN_ULTIMA = 'UL';
    const PLAN_ULTIMA_X2 = 'ULx2';
*/
var __PlansList = ['FR', 'ST', 'PF', 'UL', 'ULx2', 'ULx3', 'ULx4', 'ULx5', 'ULx6', 'ULx7', 'ULx8', 'ULx9', 'ULx10', 'ULx11', 'ULx12', 'ULx13'];
var __PlansListName = {
    'FR': 'FREE',
    'ST': 'STARTER',
    'PF': 'PRO',
    'UL': 'ULTIMA',
    'ULx2': 'ULTIMA 2x',
    'ULx3': 'ULTIMA 3x',
    'ULx4': 'ULTIMA 4x',
    'ULx5': 'ULTIMA 5x',
    'ULx6': 'ULTIMA 6x',
    'ULx7': 'ULTIMA 7x',
    'ULx8': 'ULTIMA 8x',
    'ULx9': 'ULTIMA 9x',
    'ULx10': 'ULTIMA 10x',
    'ULx11': 'ULTIMA 11x',
    'ULx12': 'ULTIMA 12x',
    'ULx13': 'ULTIMA 13x'
};

function checkPlanShowUpgradePopup(targetPlan, heading, text, buttonText, href) {
    if (typeof targetPlan == 'undefined' || targetPlan == '') {
        targetPlan = 'FR';
    }
    let currentPlan = extractDataFromArray(user_info, ['plan_info', 'plan'], 'FR');
    if (targetPlan != 'FR') {
        let targetI = 0;
        let currentI = 0;
        for (let i = 0; i < __PlansList.length; ++i) {
            if (__PlansList[i] == targetPlan) {
                targetI = i;
            }
            if (__PlansList[i] == currentPlan) {
                currentI = i;
            }
        }
        if (targetI > currentI) {
            if (typeof text == 'undefined' || text == '') {
                let planName = extractDataFromArray(__PlansListName, [targetPlan], 'ULTIMA 14x');
                text = "Please upgrade your account to " + planName + " plan or above to access this feature.";
            }
            showUpgradePopup(heading, text, buttonText, href);
            return true;
        }
    }
    return false;
}

function renderDownloadVcfElement() //will add appropriate html in <span class="addToContact"...></span>
{
    /*
    <a id="addToContact" fname="Gonzalo" lname="de la Barra" mobile="9998887776" tel="" email="abc@xyz.com" designation="boss" street="Market Street" city="San Jose" state="California" country="US" website="https://www.qrcodechimp.com" company="QrCodeChimp" zipcode="95136" href="//"+__api_domain+"/user/services/openapi?cmd=downloadVcfForParams&fname=Gonzalo&...." class="btn-floating btn-primary add_to_contact primary_wrapper_color primary-color-bg">Save To Contacts<i class="icon-contact round_icon"></i></a>
    $.param({a:"1=2", b:"Test 1"})
    */
    if ($('a#addToContact').length > 0) {
        var $elem = $('a#addToContact');
        var params = {
            fname: $elem.attr('fname') == "undefined" ? '' : $elem.attr('fname'),
            lname: $elem.attr('lname') == "undefined" ? '' : $elem.attr('lname'),
            mobile: $elem.attr('mobile') == "undefined" ? '' : $elem.attr('mobile'),
            tel: $elem.attr('tel') == "undefined" ? '' : $elem.attr('tel'),
            email: $elem.attr('email') == "undefined" ? '' : $elem.attr('email'),
            designation: $elem.attr('designation') == "undefined" ? '' : $elem.attr('designation'),
            street: $elem.attr('street') == "undefined" ? '' : $elem.attr('street'),
            city: $elem.attr('city') == "undefined" ? '' : $elem.attr('city'),
            state: $elem.attr('state') == "undefined" ? '' : $elem.attr('state'),
            country: $elem.attr('country') == "undefined" ? '' : $elem.attr('country'),
            company: $elem.attr('company') == "undefined" ? '' : $elem.attr('company'),
            zipcode: $elem.attr('zipcode') == "undefined" ? '' : $elem.attr('zipcode')
        }

        var p = $.param(params);
        var href = `/user/services/openapi?cmd=downloadVcfForParams&${p}`;
        $elem.attr("href", href);
    }

}

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

function isUserLoggedIn() {
    return (typeof user_info != "undefined" && !empty(extractDataFromArray(user_info, ['email'], false))) || amILoggedIn();
}

function isAlphaNumericKeycode(e) {
    var specialKeys = new Array();
    specialKeys.push(8); //Backspace
    specialKeys.push(9); //Tab
    specialKeys.push(46); //Delete
    specialKeys.push(36); //Home
    specialKeys.push(35); //End
    specialKeys.push(37); //Left
    specialKeys.push(39); //Right

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    return ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || keyCode == 32 || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
}

function saveQRCode(forAutoSave = false) {
    if (typeof QRPageComponents != "undefined" && isComponentBasedUI()) {

        lockQRCodeData = extractDataFromArray(QRPageComponents, ["page_setting", "lock_code"])

        if (lockQRCodeData['enable_lock_code'] && (parseInt(lockQRCodeData['scan_count']) < 1 || lockQRCodeData['scan_count'] == "")) {
            SwalPopup.showSingleButtonPopup({
                    icon: "error",
                    text: "Please enter all mandatory fields from the Lock QR Code section in the Design/Settings tab.",
                    confirmButtonText: "Close",
                },
                (result) => {}
            );
            $(".showErrorScan").addClass("border-danger")

            if (parseInt(lockQRCodeData['scan_count']) < 1) {
                $("#showErrorScan").html("Scan limit can not be 0 or less.").addClass('text-danger');
            } else {
                $("#showErrorScan").html("").removeClass('text-danger');
            }
            return;
        }

        passcodeData = extractDataFromArray(QRPageComponents, [
            "page_setting",
            "passcode",
        ]);
        if (
            parseInt(passcodeData["enable_passcode"]) === 1 &&
            (passcodeData["passcode"] == "" || passcodeData["timeout"] == "")
        ) {
            SwalPopup.showSingleButtonPopup({
                    icon: "error",
                    text: "Please enter all mandatory fields from the Passcode Protection section in the Design/Settings tab.",
                    confirmButtonText: "Close",
                },
                (result) => {

                }
            );
            passcodeData["passcode"] == "" ?
                $(".showErrorPasscode").addClass("border-danger") :
                $(".showErrorPasscode").removeClass("border-danger");
            passcodeData["timeout"] == "" ?
                $(".showErrorTimeout").addClass("border-danger") :
                $(".showErrorTimeout").removeClass("border-danger");
            if (parseInt(passcodeData["timeout"]) >= 1 || passcodeData["timeout"] == '') {
                $("#showErrorTimeout").html("").removeClass('text-danger');
            }
            return
        } else if (parseInt(passcodeData["enable_passcode"]) === 1 && parseInt(passcodeData["timeout"]) < 1) {
            SwalPopup.showSingleButtonPopup({
                    icon: "error",
                    text: "Please enter all mandatory fields from the Passcode Protection section in the Design/Settings tab.",
                    confirmButtonText: "Close",
                },
                (result) => {}
            );
            passcodeData["passcode"] == "" ?
                $(".showErrorPasscode").addClass("border-danger") :
                $(".showErrorPasscode").removeClass("border-danger");
            $(".showErrorTimeout").addClass("border-danger")

            $("#showErrorTimeout").html("Session timeout can not be 0 or less.").addClass('text-danger');
            return
        } else {
            $(".showErrorPasscode").removeClass("border-danger");
            $(".showErrorTimeout").removeClass("border-danger");
            $("#showErrorTimeout").html("").removeClass('text-danger');
            $(".showErrorScan").removeClass("border-danger")
            $("#showErrorScan").html("").removeClass('text-danger');

            QRPageComponents.saveQRCode(null, forAutoSave);
            return
        }
        return;
    }
    var week_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    var fieldsToSkip = ['primary_color', 'secondary_color', 'bg_url', 'pr_url', 'ld_url', 'short_url', 'template_name', 'playstore_url', 'appstore_url', 'dynamic', 'valid_date']
    var data = serializeFormObject($(".page_form"));
    var keys = Object.keys(data);
    var proceed = true;
    if (page != 'whatsapp') {
        $("#whatsapp_input_error").addClass("d-none")
    }
    for (var i = 0; i < keys.length; i++) {
        if (page != 'whatsapp') {
            $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
        }
        if (fieldsToSkip.indexOf(keys[i]) > -1) {
            continue
        }

        if (typeof _required_inputs != "undefined" && _required_inputs.indexOf(keys[i]) == -1) {
            continue
        }
        if (data[keys[i]] == "") {
            if (data['page'] == 'url') {
                if (keys[i] == "dynamic") {
                    continue
                }
            }
            if (data['page'] == 'vcard') {
                if (keys[i] != "first_name" && keys[i] != "phone_number") {
                    continue
                }
            }
            if (data['page'] == 'whatsapp') {
                $("#whatsapp_input_error").removeClass("d-none")
            } else if ($("input[name=" + keys[i] + "]").length == 1 && $("input[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                $("input[name=" + keys[i] + "]").parent().append('<span class="text-danger">Input Required</span>')
            } else if ($("textarea[name=" + keys[i] + "]").length == 1 && $("textarea[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                $("textarea[name=" + keys[i] + "]").parent().append('<span class="text-danger">Input Required</span>')
            }
            if (data['page'] == 'socialMedia' || data['page'] == 'vcardWeb') {
                if (keys[i].indexOf("_link_") > 0 || keys[i].indexOf("_url") > 0) {
                    if ($("." + keys[i].split("_")[0] + "_link").css("display") == "none" || $(".row." + keys[i].split("_")[0]).css("display") == "none") {
                        $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                        continue
                    }
                }
            }
            if (data['page'] == 'businesspage' || data['page'] == 'businesspage_v0') {
                week_days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                if (week_days.indexOf(keys[i].split("_")[0]) > -1) {
                    if ($("input[name=" + keys[i].split("_")[0] + "]").val() == 'true') {
                        if (keys[i].indexOf("_time2_") > 0) {
                            if (($("input[name=" + keys[i].split("_")[0] + "_time2]").val() == 'true')) {
                                $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                                continue
                            }
                        }

                    } else {
                        $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
                        continue
                    }

                }
            }

            proceed = false
        } else if (keys[i] == "email_id") {
            if (!isValidEmailAddress(data[keys[i]])) {
                if ($("input[name=" + keys[i] + "]").length == 1 && $("input[name=" + keys[i] + "]").parent().children('.text-danger').length == 0) {
                    $("input[name=" + keys[i] + "]").parent().append('<span class="text-danger">Invalid Email</span>')
                }
                proceed = false
            } else {
                $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
            }
        } else {
            $("input[name=" + keys[i] + "]").parent().children('.text-danger').remove()
            $("textarea[name=" + keys[i] + "]").parent().children('.text-danger').remove()
        }
    }
    if (typeof SmartRule != "undefined") {
        if (!SmartRule.validate()) {
            proceed = false
        } else {
            data['smart_rules'] = SmartRule.config
        }
    }
    if ($("#website_card_wrapper").length == 1) {
        data['web_urls'] = [];
        var arr = $("#website_card_wrapper .web_url_container")
        for (var i = 0; i < arr.length; i++) {
            // $(arr[i]).find('input[name=website_title]').parent().children('.text-danger').remove()
            // $(arr[i]).find('input[name=website_url]').parent().parent().children('.text-danger').remove()
            var title = $(arr[i]).find('input[name=website_title]').val().trim()
            var url = $(arr[i]).find('input[name=website_url]').val().trim()
            // if (empty(title)) {
            //     $(arr[i]).find('input[name=website_title]').parent().append('<span class="text-danger">Input Required</span>')
            //     proceed = false
            // }
            // if (empty(url)) {
            //     $(arr[i]).find('input[name=website_url]').parent().parent().append('<span class="text-danger">Input Required</span>')
            //     proceed = false
            // }

            data['web_urls'].push({
                'title': title,
                'url': url,
            })

        }
    }

    if (typeof EmailSignature != "undefined") {
        data['email_signature_template'] = 1;
    }
    if (data['page'] == 'landingpage') {
        data['landing_page_html'] = tinymce.get("landing_page_html").getContent();
        if (data['page_type'] == 'html') {
            $("input[name=landing_page_url]").parent().children('.text-danger').remove()
            if (!empty(data['landing_page_html'])) {
                proceed = true
                $("textarea[name=landing_page_html]").parent().children('.text-danger').remove()
            }
        } else {
            $("textarea[name=landing_page_html]").parent().children('.text-danger').remove()
            if (!empty(data['landing_page_url'])) {
                proceed = true
            }

        }
    } else if (data['page'] == 'whatsapp') {
        data['weburl'] = BulkUploadHandler.getQRContentFromQrcode(data)
    }

    if (!proceed) {
        if (!forAutoSave) {
            showAlertModal("Input Required", "Please check and fill the mandatory fields to proceed.");
        }
        expandSectionsWithErrors();
    }
    if (proceed) {
        if (data.hasOwnProperty('dynamic')) {
            if ($("input[id=dynamic]").is(":checked")) {
                data['qr_type'] = 'D'
                data['dynamic'] = 'true'
            } else {
                data['qr_type'] = 'S'
                data['dynamic'] = 'false'
            }
        }
        if (data['page'] == 'socialMedia' || data['page'] == 'vcardWeb') {
            // var arr = $(".social_icon_list li.active")
            // data['link_order'] = [];
            // for (var i = 0; i < arr.length; i++) {
            //     data['link_order'].push($(arr[i]).data('type').split("_")[0])
            // }
            var arr = $(".social_link_container input")
            data['link_order'] = [];
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).parents(".row").css("display") == 'none') {
                    continue
                }
                var social_platform = $(arr[i]).attr('name').split("_")[0];
                if (empty(social_platform)) {
                    continue;
                }
                if (data['link_order'].indexOf(social_platform) == -1) {
                    data['link_order'].push(social_platform)
                }
            }
            if (typeof galleryImages != "undefined")
                data['images'] = galleryImages;
        } else if (data['page'] == 'gallery' || data['page'] == 'image' || data['page'] == 'menu') {
            // var imagesDiv = $(".list_uploaded_img").children()
            // for (var i = 0; i < imagesDiv.length; i++) {
            //     debugger
            // }
            data['images'] = galleryImages;
        } else if (data['page'] == 'businesspage' || data['page'] == 'businesspage_v0') {
            week_days.forEach(day => {
                data[day] = $("input[name=" + day + "]").prop("checked")
            })
        }



        campaignData = data
        var short_url;
        if (campaignData['template_name'] == '') {
            if (!$("#folder-select").hasClass("select2-hidden-accessible")) {
                $("#folder-select").select2({
                    placeholder: "Select Folder",
                    templateResult: function(data, container) {
                        if (data.element) {
                            $(container).addClass($(data.element).attr("class"));
                        }
                        return data.text;
                    }
                });
            }
            $("#template_name_modal").modal("show")
            return

        } else {
            if ($("input[name=short_url]").length == 1) {
                short_url = $("input[name=short_url]").val()
            } else {
                short_url = campaignData['template_name']
                short_url = short_url.toLocaleLowerCase()
                short_url = short_url.replace(/ /g, '_');
            }
            if (!forAutoSave) {
                showLoaderOnBlock();
            }
            if (typeof _qrOptions != "undefined") {
                saveQrCodeTemplate(campaignData, '', null, forAutoSave);
            } else {
                $.post("//" + __api_domain + '/user/services/api', {
                    cmd: 'saveQRCode',
                    qr_img: '',
                    formData: JSON.stringify(campaignData),
                    qrData: JSON.stringify(qrCodeParams),
                }, function(response) {
                    // if (!empty(response.data)) {
                    if (response.errorMsg == "RCP") {
                        $("#signup-free").modal("show")

                    } else if (!empty(response.data)) {
                        getQrImageUrl(short_url, function() {
                            hideLoader()
                            location.href = '/user/dashboard'
                        })
                    } else if (response.data == 0) {
                        $(".campaign_name_qr_alert").text("Name Already Exists")
                        $(".campaign_name_qr_alert").removeClass("d-none")
                    }

                    // }
                })
            }

        }




    }
}

function cleanName(name) {
    name = htmlDecode(name);
    name = name.replace(/'/g, "_");
    name = name.replace(/"/g, "_");
    return name.replace(/&#039;/g, "_");
}

function cleanFileName(name) {
    name = cleanName(name)
    return name.replace(/[@\-\+ ]/g, "_");
}

function cleanQRNameForDownload(file_name, dontClean = 0) {
    let temp_split = file_name.split("::");
    if (temp_split.length > 1) {
        file_name = temp_split[1];
    } else {
        file_name = temp_split[0];
    }
    if (typeof dontClean == 'undefined') {
        dontClean = 0;
    }

    return ((dontClean) ? file_name : cleanFileName(file_name));
}

function parseResponse(response) {
    if (response == undefined || response == null || typeof response != "object") //beware null typeof is object
    {
        response = {
            errorCode: "-1",
            errorMsg: "Unknown Error, malformed response received.",
            html: ""
        };
    }
    return response;
}

function parseResponseData(response, supressErrorPopup) {
    var showErrorPopup = typeof supressErrorPopup != 'undefined' ? !supressErrorPopup : true;
    var json = {
        '_parseCode': false
    };

    if (response != null && typeof response == "object") {
        json = response;
    } else if (typeof response == 'undefined' || response == null) {
        if (showErrorPopup) {
            showAlertMessage('E', "Unknown Error, malformed response received.");
        }
        json['_parseCode'] = false;
        return json;
    } else if (response != '' && typeof response == "string") {
        try {
            json = $.parseJSON(response);
        } catch (e) {
            if (showErrorPopup) {
                showAlertMessage('E', "Error in Parsing the server response. Please refresh the page and try again.");
            }
            json['_parseCode'] = false;
            return json;
        }
    }

    if (!empty(json) && json.hasOwnProperty('errorCode') && json['errorCode'] != '0' && json['errorCode'] != '' && json['errorCode'] != 0) {
        if (json['errorMsg'].localeCompare('RCP') == 0) {
            if (showErrorPopup) {
                showAlertMessage('E', 'Your session has expired. Please login again to continue.');
            }
        } else {
            if (showErrorPopup) {
                showAlertMessage('E', json['errorMsg']);
            }
        }
        json['_parseCode'] = false;
        return json;
    }
    json['_parseCode'] = true;
    return json;
}

function eventPreventDefault(e) {
    if (typeof e.cancelable !== 'boolean' || e.cancelable) {
        // The event can be canceled, so we do so.
        e.preventDefault();
    } else {
        // The event cannot be canceled, so it is not safe
        // to call preventDefault() on it.
        console.warn(`The following event couldn't be canceled:`);
        console.dir(e);
    }
}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (typeof is_xhtml == 'undefined' || is_xhtml) ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


function getCurrentEnvironment() {
    var env = '';
    env = location.host.split('.')[0] == 'dev' ? 'DEV' : env;
    env = location.host.split('.')[0] == 'l' ? 'LOCAL' : env;
    return env;
}

function isPageType(type) //'LANDING'
{
    return (typeof type != 'undefined' && typeof __PageType != 'undefined' && __PageType == type);
}


function isCurrentPage(pageId) {
    return (typeof pageId != 'undefined' && typeof page != 'undefined' && page == pageId);
}

function FAQPageListeners() {

}


function checkForSignupAndshow() {
    if (amILoggedIn()) {
        $('#view_all_designs').modal('hide');
        $('.open_design_code_popup').click();
        if (typeof window.scrollTo != "undefined") {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    } else {
        $('#signup-free').modal('show');
    }
}

function downloadJson(data, file_name) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", file_name);
    dlAnchorElem.click();
}


function getMainDomain() {
    const subdomain = location.host.split('.')[0]
    if (subdomain == 'dashboard') {
        return '//www.qrcodechimp.com'
    }
    return '//' + (subdomain.split('-dashboard')[0]) + '.qrcodechimp.com'
}



function newTemplatePageListeners() {
    $(document).scroll(function() {
        if ($(document).scrollTop() > 300) {
            $('.qr_code_page_preview').addClass("card_fixed")
        } else {
            $('.qr_code_page_preview').removeClass("card_fixed")
        }
    });

    $(".preview_nav .btn-group button").on("click", function(e) {
        $(".preview_nav .btn-group button").removeClass('active')
        $(this).addClass('active')
        if ($(this).data("view") == 'page') {
            $(".landing_page_preview_frame").show()
            $(".qr_page_code_preview").hide()
        } else {
            $(".landing_page_preview_frame").hide()
            $(".qr_page_code_preview").show()
        }
    })
}

function showVideoPopup(videoSrc) {
    if ($('#quick_video').length == 0) {
        var html = `
            <div class="modal fade" id="quick_video" role="dialog" aria-hidden="true" tabindex="-1">
                <div class="modal-dialog qr-modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body qr-modal-body" style="padding:0;"><button type="button" class="close qr-close" style="padding:0 5px;" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <!-- 16:9 aspect ratio -->
                            <div class="embed-responsive embed-responsive-16by9 mt-1"><iframe width="100%" class="embed-responsive-item" src="" id="iframeVideo" allowfullscreen="1" allowscriptaccess="always" allow="autoplay"></iframe></div>
                        </div>
                    </div>
                </div>
            </div>`;
        $('body').append(html);

        // stop playing the youtube video when I close the modal
        $("#quick_video").on("hide.bs.modal", function(e) {
            $("#quick_video #iframeVideo").attr("src", '');
        })
    }

    //console.log(videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
    $("#quick_video").modal().show();
    $("#quick_video #iframeVideo").attr("src", videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");

}



function pingAPI() {
    $.post("//" + __api_domain + "/user/services/api", {
        cmd: 'ping'
    }, function(response) {
        if (response.errorMsg == 'RCP') {
            location.href = '/user/signin?done=' + location.pathname + location.search
            return
        }
    })
}

function checkAndUpdateShortUrl() {
    if ($("input[name=short_url]").length && $("input[name=id]").val() == 'new') {
        $.post("//" + __api_domain + "/user/services/openapi", {
            cmd: 'checkAndUpdateShortUrl',
            short_url: $("input[name=short_url]").val()
        }, function(response) {
            let short_url = extractDataFromArray(response, ['data'], '')
            if (!empty(short_url)) {
                $("input[name=short_url]").val(short_url)
            }
        })
    }
}

var __escape = document.createElement('textarea');

function escapeHTML(html) {
    __escape.textContent = html;
    return __escape.innerHTML;
}

function unescapeHTML(html) {
    __escape.innerHTML = html;
    return __escape.textContent.replace(/"/g, '&quot;');
}

String.prototype.cleanReplace = function(searchFor, replaceBy, replaceAll = false) {
    if (replaceAll) {
        return this.replaceAll(searchFor, replaceBy.replace(/\$/g, '$$$$'));
    }
    return this.replace(searchFor, replaceBy.replace(/\$/g, '$$$$'));
}


function captureDivToPng(selector, callback) {
    //get this enabled first by adding the js file => include_js("/view/common/js/plugins/html2canvas.min.js");
    if (typeof html2canvas === 'function') {
        html2canvas(document.querySelector(selector)).then(canvas => {
            //document.body.appendChild(canvas)
            callback(canvas.toDataURL("image/png"));
        });
    } else {
        callback(null);
    }
}

function cleanJSTags(text) {
    var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>/gi;
    while (SCRIPT_REGEX.test(text)) {
        text = text.replace(SCRIPT_REGEX, "");
    }
    if (typeof String.prototype.replaceAll == "undefined") {
        return text.replace(/<script/gi, "");
    }
    return text.replaceAll(/<script/gi, "");
}

function displayPrivacyPopup() {
    if (!isUserLoggedIn() && ((readCookie('privacyAccepted') != 'Y') && (typeof __white_labelled_domain == 'undefined' || !__white_labelled_domain)) &&
        (typeof __disable_privacy_popup == 'undefined' || !__disable_privacy_popup)) {
        $('body').append(`<div class="cookies_msg" id="cookies_div">
        <div class="cookies_msg_inner"style="">
            <div class="cookies_smg_text">
                <strong>Privacy &amp; Cookies:</strong> This site uses cookies. By continuing to use this website, you agree to their use.
                To find out more, including how to control cookies, see here :
                <a href="/privacy" style="display: inline;">Cookie Policy</a>
            </div>
        </div>
        <a class="cookies_accept" onclick="acceptClose()">Accept &amp; Close</a>
    </div>`);
    }
}

function validateShortUrlCode(short_url_code) {
    short_url_code = short_url_code.trim()
    if (short_url_code == '') {
        return "Short url slug cannot be empty"
    } else if (short_url_code.length < 5) {
        return "Minimum 5 characters required"
    } else if (short_url_code.length > 32) {
        return "Maximum 32 characters allowed"
    } else {
        var testExp = new RegExp("^[a-zA-Z0-9][a-zA-Z0-9\-]+$", "gi");
        if (!testExp.test(($("#short_url_input_popup").val()).trim())) {
            return "Only alphanumeric and hypen is allowed."
        }
    }
    return '';
}

function shouldDisplaySection(sectionId) {
    if (empty(sectionId))
        return true;
    var sId = "displaysection_" + sectionId;
    return (readCookie(sId) != 'closed');
}

function markSectionClosed(sectionId, days, hide = true) {
    if (empty(sectionId))
        return;

    if (typeof hide == 'undefined' || hide)
        $('#' + sectionId).hide();

    if (empty(days))
        days = 30;

    var sId = "displaysection_" + sectionId;
    createCookie(sId, 'closed', days);
}


/*  Provide the Objects this way
searchBoxObj = $('#dataTableId input');
dataTableObj = $('#dataTableId').DataTable();
*/
function ReattachDTableSearch(searchBoxObj, dataTableObj, timeout) {
    var lastSearchTimeout = 0;
    var text = "";
    if (typeof timeout == "undefined") timeout = 800;
    if (searchBoxObj.length == 0) {
        return;
    }

    if (searchBoxObj[0].nodeName != 'INPUT') {
        searchBoxObj = searchBoxObj.find("input")
    }
    searchBoxObj.unbind();
    searchBoxObj.bind('input change', function(e) {
        text = this.value.trim();
        if (text.length >= 2 || e.keyCode == 13 || text == '') {
            if (lastSearchTimeout) clearTimeout(lastSearchTimeout);
            lastSearchTimeout = setTimeout(function() {
                dataTableObj.search(text).draw();
            }, timeout);
        }
    });
}


function getFromObject(object, paramsArr, defaultRetVal = '') {
    //for now just return
    return extractDataFromArray(object, paramsArr, defaultRetVal = '');
}

function putIntoObject(object, paramsArr, value, forceMakePath = 0) {
    var retVal = false;
    try {
        if (!isEmpty(object) && !isUndefined(paramsArr) && !isUndefined(value)) {
            obj = object;
            var len = paramsArr.length;
            for (var i = 0; i < len; ++i) {
                if (!isUndefined(paramsArr[i])) {
                    if (i == len - 1) {
                        obj[paramsArr[i]] = value;
                        retVal = true;
                        break;
                    }
                    if (isUndefined(obj[paramsArr[i]])) {
                        if (forceMakePath) {
                            obj[paramsArr[i]] = [];
                            obj = obj[paramsArr[i]];
                        } else {
                            retVal = false;
                            break;
                        }
                    } else {
                        obj = obj[paramsArr[i]];
                    }
                }
            }
        }

    } catch (e) {}
    return retVal;
}


function goBack() {
    if (location.href.endsWith("#")) {
        history.back()
    }
    history.back()
}


function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) {
        return map[m];
    });
}

function toggleTextPass(element) {
    if (element.attr('type') == 'text') {
        element.attr('type', 'password');
    } else {
        element.attr('type', 'text');
    }
}

function toggleClass(element, className) {
    if (element.hasClass(className)) {
        element.removeClass(className);
    } else {
        element.addClass(className);
    }
}

function hideShowSelectors(hideSelector, showSelector) {
    $(hideSelector).hide();
    $(showSelector).show();
}

function getCdnUrl() {
    let url = typeof __CDN_URL === "undefined" ? '' : __CDN_URL
    return empty(url) ? window.location.origin : url
}

function getCdnAssetUrl() {
    let url = typeof __CDN_ASSET_URL === "undefined" ? '' : __CDN_ASSET_URL;
    return empty(url) ? window.location.origin : url
}

function getLastUpdatedTimeStamp() {
    return typeof __LAST_UPDATE_TIMESTAMP === "undefined" ? 0 : __LAST_UPDATE_TIMESTAMP;
}

function wrapperUrlWithCdn(url, asset = 0, timestamp = 0) {
    if (url.indexOf('//') != 0 && url.indexOf('https://') != 0 && url.indexOf('http://') != 0) {
        url = (asset ? getCdnAssetUrl() : getCdnUrl()) + url;
    } else {
        let indx = url.indexOf('//qrcodechimp.s3.amazonaws.com/');
        if (indx > -1 && indx < 10) {
            url = url.replace('//qrcodechimp.s3.amazonaws.com/', (getCdnAssetUrl() + '/'));
        }
    }
    if (timestamp > -1) {
        if (url.indexOf("?v=") == -1 && url.indexOf("&v=") == -1) {
            timestamp = empty(timestamp) ? getLastUpdatedTimeStamp() : timestamp;
            url = url.indexOf("?") > -1 ? url += "&v=" + timestamp : url += "?v=" + timestamp
        }
    }
    return url
}

function wrapperUrlWithCdnS3(url, timestamp = 0) {
    return wrapperUrlWithCdn(url, 1, timestamp);
}

function sharedUserLoggedIn() {
    return (typeof __shared_page_loggedin != "undefined" && __shared_page_loggedin == 1);
}

var __shared_page_loggedin = 0;
var __shared_page_loggedin_token_id = '';

function loginSharedUser(tid) {
    __shared_page_loggedin = 1;
    __shared_page_loggedin_token_id = tid;
}

function isSharedPage() {
    return (typeof __sharedPage != "undefined" && __sharedPage == 1);
}

/******* Begin - Email Correction Code ******/
var __EMAIL_MISSPELLS = {
    "gmail.com": ',gmail.con,gmial.com,gmil.com,gmal.com,gamail.com,gmaill.com,gail.com,gmai.com,gmai.co,gmaiil.com,gmail.cim,gmail.cpm,gmail.vom,gmailc.om,gmailco.m,gmai.lcom,hmail.com,gmsil.com,gmali.com,gail.com,gmail.cm,gmail.co,gmail.c,gmail.om,gmail.m,',
    "yahoo.com": ',yhoo.com,yahoo.cm,yaho.com,',
    "hotmail.com": ',htmail.com,hotmail.cm,hotmai.com,'
}

function getCorrectedEmailSuggestion(email) {
    let emComponents = email.split('@', 2);
    if (emComponents.length > 1) {
        let em = ',' + emComponents[1].toLowerCase() + ',';
        for (const dm in __EMAIL_MISSPELLS) {
            if (__EMAIL_MISSPELLS[dm].indexOf(em) != -1) {
                return emComponents[0].toLowerCase() + '@' + dm;
            }
        }
    }
    return email;
}
/******* End - Email Correction Code ******/

function isOfficialEmail(em) {
    if (!empty(em)) {
        let emComponents = em.split('@');
        if (emComponents.length == 2 && !__STANDARD_DOMAINS.includes(emComponents[1].toLowerCase())) {
            return true;
        }
    }
    return false;
}

var _editAccessAllowedPages = ['digital-business-card', 'digital-business-cards', 'pet-id-tags', 'medical-alert', 'url', 'googlereview']; //needed in lowercase
var _editAccessAllowedPagesBulk = ['digital-business-card', 'digital-business-cards', 'pet-id-tags', 'medical-alert']; //needed in lowercase
function isEditAccessAllowed(pageId, bulk = 0) {
    // return bulk? _editAccessAllowedPagesBulk.includes(pageId) :_editAccessAllowedPages.includes(pageId);
    return _editAccessAllowedPagesBulk.includes(pageId);
}

function isDBCType(pageId) {
    return (pageId.indexOf('digital-business-card') == 0);
}

function getApiDomainUrl(url) {
    if (url != '') {
        if (url.indexOf('//') == 0 || url.indexOf('https://') == 0 || url.indexOf('http://') == 0) {
            return url;
        }
        if (url.indexOf('/') != 0) {
            url = '/' + url;
        }
        if (__api_domain != '')
            return "//" + __api_domain + url;
    }
    return url;
}

const PlanPopup = {
    init: () => {
        $(".merchandise_wl_sidebar_link").on("click", function(e) {
            e.preventDefault()
            if (!PlanPopup.showPurchasePopupForMerchandiseWhitelabel()) {
                location.href = '/user/merchandise-wl'
            }
        })
    },
    showPurchasePopupForMerchandiseWhitelabel: () => {
        function showPopup() {
            Swal.fire({
                width: 600,
                html: `
                <div class="cstm_form_content upgrade_box_wrapper">
                <h3 class="upgrade_popup_title">Please upgrade to <br/>
                    Ultima Plan or above to avail <br/>
                    Whitelabeled Merchandise feature</h3>
                <div class="row equal">
                    <div class="col p-2">
                        <div class="upgrade_box wd_card_3 p-4">
                            <strong>ULTIMA</strong><br />
                            Starts From<br />
                            <strong>$` + extractDataFromArray(__plan_info, ['UL', 'PRICE', 'STRIPE', 'YEARLY'], '13.99') + `</strong>/month
                        </div>
                    </div>
                    <div class="col p-2">
                        <div class="upgrade_box wd_card_2 p-4">
                            <strong>ULTIMA 2X</strong><br />
                            Starts From<br />
                            <strong>$` + extractDataFromArray(__plan_info, ['ULx2', 'PRICE', 'STRIPE', 'YEARLY'], '34.99') + `</strong>/month
                        </div>
                    </div>
                </div>
                <div class="row mt-4">
                    <div class="col p-2">
                        <a href="/pricing" class="btn btn-primary btn-dark  py-2 btn-block">Upgrade Now</a>
                    </div>
                </div>
            </div>
            `,
                showCloseButton: true,
                showConfirmButton: false,
                customClass: {
                    popup: 'swal_popup_with_no_padding',
                    content: 'swal_popup_with_no_padding',
                    close: 'swal_popup_close',
                },
            }).then((result) => {
                // if(result.isDismissed && page == "merchandise-wl")
                // {
                //     location.href = "/merchandise-wl"
                // }
            })
        }
        if (extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan']), 'WHITE_LABELLING_MERCHANDISE'], 0) < 1) {
            showPopup()
            return true
        }
        return false;
    }
}


function checkAndWhiteLabelCdnS3Url(url) {
    if (typeof __CDN_WL_S3_DOMAIN == 'undefined' || empty(__CDN_WL_S3_DOMAIN)) {
        if (typeof user_info != 'undefined' && !empty(user_info)) {
            __CDN_WL_S3_DOMAIN = extractDataFromArray(user_info, ['white_label_domain_config', 'cdn_wl_s3_domain'], '');
        }
    }
    let cdnS3Url = (typeof __CDN_ASSET_URL != 'undefined' && !empty(__CDN_ASSET_URL)) ? __CDN_ASSET_URL : '//cdn0030.qrcodechimp.com';
    if (typeof __CDN_WL_S3_DOMAIN != 'undefined' && !empty(__CDN_WL_S3_DOMAIN) && !empty(url) && typeof url == 'string') {
        return url.replace(cdnS3Url + '/', '//' + __CDN_WL_S3_DOMAIN + '/');
    }
    return url;
}

__PageIdToUrlArr = {
    'pet-id-tags': 'pet-id-tags',
    'digital-business-cards': 'digital-business-cards',
    'digital-business-card': 'digital-business-cards',
    'pdf-gallery': 'qr-code-pdf-gallery',
    'medical-alert': 'medical-alert-tag',
    'multi-url': 'multi-url-qr-code',
    'event-ticket': 'event-ticket-qr-code',
    'googleReview': 'qr-code-generator-for-googleReview'
};

function getPageIdToUrl(pageId) {
    let url = 'qr-code-solutions';
    if (typeof pageId != 'undefined' && !empty(pageId)) {
        url = extractDataFromArray(__PageIdToUrlArr, [pageId], url);
    }
    return "/" + url;
}


function getMD5(str) {
    var RotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    };
    var AddUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var F = function(x, y, z) {
        return (x & y) | ((~x) & z);
    };
    var G = function(x, y, z) {
        return (x & z) | (y & (~z));
    };
    var H = function(x, y, z) {
        return (x ^ y ^ z);
    };
    var I = function(x, y, z) {
        return (y ^ (x | (~z)));
    };

    var FF = function(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var GG = function(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var HH = function(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var II = function(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    var ConvertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };

    var WordToHex = function(lValue) {
        var WordToHexValue = "",
            WordToHexValue_temp = "",
            lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };

    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22;
    var S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20;
    var S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23;
    var S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

    str = utf8_encode(str);
    x = ConvertToWordArray(str);
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;

    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}

function utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if ((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

let PlanCheck = {
    checkForWhiteLabelling: function() {
        if (extractDataFromArray(__plan_info, [extractDataFromArray(user_info, ['plan_info', 'plan']), 'WHITE_LABELLING'], 0) < 1) {
            PlanCheck.showPopup('Please upgrade to <br>Ultima Plan or above to avail<br>White Labelling Feature', ['UL'], 'whitelabel')
            return true
        }
        return false
    },
    checkForTracking: function() {
        if (extractDataFromArray(user_info, ['plan_info', 'plan'], '') == "FR") {
            PlanCheck.showPopup('Please upgrade to <br>Starter Plan or above to avail<br>Tracking & Analytics Feature', ['ST', 'PF'], 'tracking')
            return true
        }
        return false
    },
    showPopup: function(message = "", plans = [], image = '') {
        if (document.getElementById('purchase_higher_popup') == null) {
            $('body').append(`
            <div class="modal cstm_modal  fade upgrade_custom_modal" id="purchase_higher_popup">
               <div class="modal-dialog modal-dialog-centered">
                   <div class="modal-content">
                       <!-- Modal body -->
                       <div class="modal-body text-center">
                           <div class="close_btn" data-dismiss="modal">&times;</div>
                           <div class="row justify-content-end">
       
                               <div class="col-7 order-md-2">
                                   <div class="cstm_form_content upgrade_box_wrapper">
                                       <h3 class="upgrade_popup_title"></h3>
                                       <div class="row equal upgrade_popup_plans">
                                       </div>
                                       <div class="row mt-4">
                                           <div class="col p-2">
                                               <a href="/pricing" class="btn btn-primary btn-dark  py-2 btn-block">Upgrade Now</a>
                                           </div>
                                       </div>
                                   </div>
                               </div>
                               <div class="col-5 mt-4 cstm_modal_left_img order-md-1 text-center">
                                   <img class="img-fluid" src="/images/bulkupload.png" />
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
           </div>`)
        }
        $("#purchase_higher_popup img").attr("src", '')
        $("#purchase_higher_popup img").attr("src", '/images/' + image)
        $("#purchase_higher_popup img").attr("style", image == "whitelabel" ? 'width: 80%; margin-top: 40px; margin-left: 40px;' : 'width: 90%; margin-top: 70px;margin-left:40px')
        $("#purchase_higher_popup .upgrade_popup_plans").html('')
        plans.forEach((plan, index) => {
            $("#purchase_higher_popup .upgrade_popup_plans").append(`
                <div class="col p-2">
                    <div class="upgrade_box ` + (index % 2 == 0 ? 'wd_card_2' : 'wd_card_3') + ` p-4">
                        <strong>` + extractDataFromArray(__plan_info, [plan, 'LABEL'], '') + `</strong><br />
                        Starts From<br />
                        <strong>$` + extractDataFromArray(__plan_info, [plan, 'PRICE', 'STRIPE', 'YEARLY'], '13.99') + `</strong>/month
                    </div>
                </div>`)
        })

        $("#purchase_higher_popup .upgrade_popup_title").html(message)
        $("#purchase_higher_popup").modal("show")
    }
}