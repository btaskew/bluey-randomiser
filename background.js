chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url.includes('/en-gb/video')) {
        chrome.scripting.executeScript({
            target: {tabId},
            function: listenForEndOfEpisode,
            args: [{tabId: tabId}]
        });
    }
});

function listenForEndOfEpisode(params) {
    const interval = setInterval(() => {
        const nextEpisodeBtn = document.getElementsByClassName('sc-ePAWwb')[0];

        if (nextEpisodeBtn) {
            clearInterval(interval);

            chrome.runtime.sendMessage({message: 'episodeEnded', tabId: params.tabId});
        }
    }, 2000);
}

chrome.runtime.onMessage.addListener((request) => {
    if (request.message === 'episodeEnded') {
        loadNextEpisode(request.tabId);
    }
});

function loadNextEpisode(tabId) {
    let episodeIndex = Math.floor(Math.random() * episodes.length);
    let episodeUrl = episodes[episodeIndex];
    episodes.splice(episodeIndex, 1);

    chrome.tabs.update(tabId, {url: episodeUrl});
}

let episodes = [
    'https://www.disneyplus.com/en-gb/video/655f7202-f7de-4d0b-84cd-2e190aaed851',
    'https://www.disneyplus.com/en-gb/video/4c77c88a-dcce-46eb-a117-cc9e9ca36013',
    'https://www.disneyplus.com/en-gb/video/822e2c14-d332-45f9-99c7-96688adc04cd',
    'https://www.disneyplus.com/en-gb/video/e4bebfcf-8eef-44a5-8440-41721fa81abb',
    'https://www.disneyplus.com/en-gb/video/4f6fbd14-982e-451f-83a1-322f3d7fc211',
    'https://www.disneyplus.com/en-gb/video/c541762b-83d7-4a8a-a50c-e19caf7a4f77',
    'https://www.disneyplus.com/en-gb/video/294d4741-8286-41b3-8b93-e26f5c1d2bcf',
    'https://www.disneyplus.com/en-gb/video/0198495c-cce5-4f6f-a4c6-e44e2c2db0c4',
    'https://www.disneyplus.com/en-gb/video/a697425d-e18f-40da-8b42-b872ba3c1bed',
    'https://www.disneyplus.com/en-gb/video/a1dedd29-c59b-4d20-9144-48c8ae412383',
];
