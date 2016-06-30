const bg = chrome.extension.getBackgroundPage();

$('.js-feedback').on('click', () => {
    bg.sendEmail('poppinlp@gmail.com', 'Ricequant Dev Tool Feedback');
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
