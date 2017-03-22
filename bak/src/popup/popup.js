const toggleTab = (type, action) => {
    var eleNavItem = document.querySelector(`[data-for="${type}"]`);
    
    document.getElementById(type).classList[action](activeClass);
    eleNavItem.classList[action](activeClass);
    eleNavItem.previousElementSibling && eleNavItem.previousElementSibling.classList[action]('pre-active');
    
    if (action === 'add') eleMask.style.top = `${eleNavItem.offsetTop}px`;
};

const renderListItem = ({name, title, type}) => `
    <li>
        <span>${name}</span>
        <a href="#" class="js-action" data-action="remove">
            <i class="fa fa-times" aria-hidden="true"></i>
        </a>
    </li>`;

const renderPanel = ({status, title, type, list, idx}) => `
    <div class="panel js-panel" data-type="${type}" data-panel="${title}" data-idx="${idx}">
        <label class="switch fr js-action" data-action="switch">
            <input type="checkbox" ${status}>
            <span></span>
        </label>
        <h2>${title}</h2>
        <ul>
            ${list}
        </ul>
        <div contenteditable class="input js-input"></div>
        <a class="btn js-action" data-action="add" href="#">
            <i class="fa fa-plus" aria-hidden="true"></i>
        </a>
    </div>`;

const renderSwitchStatus = status => status ? 'checked' : '';

const renderSection = (item, idx) => {
    var desc = item.desc,
        onlinePanel = renderPanel({
            status: renderSwitchStatus(item.online.status),
            title: item.online.title,
            type: item.type,
            list: item.online.list.map(name => renderListItem({
                name: name,
                title: item.online.title,
                type: item.type
            })).join(''),
            idx: idx
        }),
        devPanel = renderPanel({
            status: renderSwitchStatus(item.dev.status),
            title: item.dev.title,
            type: item.type,
            list: item.dev.list.map(name => renderListItem({
                name: name,
                title: item.dev.title,
                type: item.type
            })).join(''),
            idx: idx
        });
        
    $(`#${item.type}`).html(`<p>${desc}</p>${onlinePanel}${devPanel}`);
};

const getDefaultOnlineList = (status = false) => ({
    title: 'Online',
    list: [ 'ricequant.com' ],
    status: status
});

const getDefaultDevList = (status = true) => ({
    title: 'Dev',
    list: [ 'naga.com', 'r.com', 'p.com' ],
    status: status
});
    
const
    bg = chrome.extension.getBackgroundPage(),
    lsTabKey = 'activeTab',
    lsSwitchKey = 'switchData',
    activeClass = 'active',
    defaultSwitch = [{
        type: 'compress',
        desc: 'Open this switch will get compressed javascript resource.',
        online: getDefaultOnlineList(true),
        dev: getDefaultDevList(false)
    }, {
        type: 'log',
        desc: 'Open this switch will print some logs in console includes request log, response log, debug log, e.t.c.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }, {
        type: 'debug',
        desc: 'Open this switch will show page in debug mode. You may find some test feature which means we have no responsibility for it\'s stability.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }, {
        type: 'perf',
        desc: 'Open this switch will print performance log in console.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }, {
        type: 'alert',
        desc: 'Open this switch will alert javascript error message.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }, {
        type: 'booter',
        desc: 'Set the booter which you wanna use. Empty means default booter.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }, {
        type: 'facade',
        desc: 'Set the facade which you wanna use. Empty means default facade.',
        online: getDefaultOnlineList(),
        dev: getDefaultDevList(false)
    }];
    
var curType = localStorage.getItem(lsTabKey) || 'compress',
    curSwitch = JSON.parse(localStorage.getItem(lsSwitchKey) || JSON.stringify(defaultSwitch)),
    eleMask = document.querySelector('.js-active-mask'),
    switching; 

// init tab
toggleTab(curType, 'add');

// init switch
curSwitch.forEach(renderSection);

// bind feedback
$('.js-feedback').on('click', () => {
    bg.sendEmail('poppinlp@gmail.com', 'Ricequant Dev Tool Feedback');
});

// update localStorage
window.onpagehide = () => {
    localStorage.setItem(lsSwitchKey, JSON.stringify(curSwitch));
    localStorage.setItem(lsTabKey, curType);
};

// bind tab nav
$('nav').on('click', 'li', e => {
    var type = e.currentTarget.getAttribute('data-for');
    
    toggleTab(curType, 'remove');
    toggleTab(type, 'add');

    curType = type;
});

// bind switchs
$('main').on('click', '.js-action', e => {
    var $panel = $(e.currentTarget).parents('.js-panel'),
        panel = $panel.attr('data-panel').toLowerCase(),
        type = $panel.attr('data-type'),
        idx = $panel.attr('data-idx');
        
    ({
        switch: () => {
            if (switching) {
                switching = null;
                return;
            }
            
            switching = true;
            
            curSwitch[idx][panel].status = !curSwitch[idx][panel].status;
        },
        add: () => {
            alert('This feature is temporarily unavailable');
            return;
            
            var text = e.currentTarget.previousElementSibling.textContent.trim();

            if (!/.+?\.com/i.test(text)) {
                alert('Please check you input');
                return;
            }
        },
        remove: () => {
            alert('This feature is temporarily unavailable');
        }
    })[e.currentTarget.getAttribute('data-action')]();
});

$('main').on('keydown', '.js-input', e => {
    if (e.keyCode !== 13) return;
    
    e.preventDefault();
    $(e.currentTarget).next().trigger('click');
});


$('.js-switch').on('click', e => {
    var $target = $(e.target);
    
    chrome.runtime.sendMessage({
        event: 'switch',
        data: {
            type: $target.attr('data-type'),
            status: $target.prop('checked')
        }
    });
});

bg.getSwitchStatus().then(map => {
    for (let i in map) {
        if (map.hasOwnProperty(i) && map[i]) {
            $(`[data-type=${i}]`).prop('checked', true);
        }
    }
});