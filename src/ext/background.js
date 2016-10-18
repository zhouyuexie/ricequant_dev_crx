var isInit = false;

const cookieName = 'rqdev';
const cookieSplitMark = '_';
const curState = {};

const getCookie = () => new Promise(resolve => {
    if (isInit) {
        resolve(curState);
        return;
    }

    chrome.cookies.getAll({
        name: cookieName
    }, cookies => {
        isInit = true;
        cookies.length && cookies[0].value && cookies[0].value.split(cookieSplitMark).forEach(v => curState[v] = true);
        resolve(curState);
    });
});
const setCookie = () => Promise.all(
    [
        {
            url: 'https://www.ricequant.com/',
            domain: 'www.ricequant.com'
        }, {
            url: 'http://www.r.com/',
            domain: 'www.r.com'
        }, {
            url: 'http://www.p.com/',
            domain: 'www.p.com'
        }, {
            url: 'http://www.naga.com/',
            domain: 'www.naga.com'
        }
    ].map(item => new Promise(resolve => {
        chrome.cookies.set({
            url: item.url,
            name: cookieName,
            value: Object.keys(curState).filter(k => curState[k]).join(cookieSplitMark),
            domain: item.domain,
            path: '/',
            secure: false,
            httpOnly: false,
            expirationDate: Date.now() + 24 * 60 * 60 * 1000
        }, () => {
            resolve();
        });
    }))
);

const enable = type => (curState[type] = true, setCookie());
const disable = type => (curState[type] = false, setCookie());
const action = [ disable, enable ];

const eventList = {
    switch: data => {
        action[+data.status](data.type);
    },
    test: data => {
        alert(data);
    }
};

chrome.runtime.onMessage.addListener(msg => eventList[msg.event](msg.data));

// init
getCookie();


// export
var sendEmail = (email, subject) => {
        chrome.tabs.create({
            url: `mailto:${email}?subject=[${subject}]`
        }, tab => {
            setTimeout(() => {
                chrome.tabs.remove(tab.id);
            }, 500);
        });
    },
    getSwitchStatus = getCookie,
    getLocalStorage = () => localStorage.getItem('rqcache');