const textbox = document.querySelector('#textFiled');
const last_submit = null;

const bar = document.querySelector('.fill-bar');
const message = document.querySelector('#message');
const percentage_txt = document.querySelector('#percentage');

const a_start = new Event('a_start');

function update_graph(result) {
    if (result === null) {
        bar.style.width = '50%';
        message.innerText = 'hmm...';
        percentage_txt.innerText = '50%';
    } else {
        const fake_probability = result.fake_probability;
        bar.style.width = `${fake_probability*100}%`;
        percentage_txt.innerText = `${(fake_probability*100).toFixed(2)}%`;
        if (fake_probability * 100 > 50) {
            message.innerText = "It is highly likely that the article was written by AI.";
        } else {
            message.innerText = "It is unlikely that it was written by AI."
        }
    }
}

textbox.oninput = () => {
    if (last_submit) {
        clearTimeout(last_submit);
    }
    if (textbox.value.length === 0) {
        update_graph(null);
        return;
    }
    last_submit = setTimeout(() => {
        let req = new XMLHttpRequest();
        if (textbox.value.length === 0) {
            update_graph(null);
            return;
        }
        //서버에 리퀘스트
        dispatchEvent(req, a_start);
    }, 1000);

};

window.addEventListener('DOMContentLoaded', () => {
    bar.style.width = "50%";
    textbox.focus();
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    textbox.value = request;
    let req = new XMLHttpRequest();
    dispatchEvent(req, a_start);
});

function analysisRequest(req, txt) {
    req.open('GET', "https://openai-openai-detector.hf.space" + '/?' + txt, true);
    req.onreadystatechange = () => {
        if (req.readyState !== 4) return;
        if (req.status !== 200) throw new Error("HTTP status: " + req.status);
        let result = JSON.parse(req.responseText);
        console.log(result);
        update_graph(result);
    };
    req.send();
}

document.addEventListener('a_start', () => {
    console.log('im here');
    analysisRequest(txt);
});