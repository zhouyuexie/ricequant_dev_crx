const
    bg = chrome.extension.getBackgroundPage(),
    lsTabKey = 'activeTab',
    lsDataKey = 'dataStore',
    activeClass = 'active';
    
const toggleTab = (type, action) => {
    var eleNavItem = document.querySelector(`[data-for="${type}"]`);
    
    document.getElementById(type).classList[action](activeClass);
    eleNavItem.classList[action](activeClass);
    eleNavItem.previousElementSibling && eleNavItem.previousElementSibling.classList[action]('pre-active');
    
    if (action === 'add') eleMask.style.top = `${eleNavItem.offsetTop}px`;
};

var curType = localStorage.getItem(lsTabKey) || 'compress',
    eleMask = document.querySelector('.js-active-mask'); 

toggleTab(curType, 'add');

$('.js-feedback').on('click', () => {
    bg.sendEmail('poppinlp@gmail.com', 'Ricequant Dev Tool Feedback');
});

$('nav').on('click', 'li', e => {
    var type = e.currentTarget.getAttribute('data-for');
    
    toggleTab(curType, 'remove');
    toggleTab(type, 'add');

    localStorage.setItem(lsTabKey, type);
    curType = type;
});

$('main').on('click', '.js-action', e => {
    
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
