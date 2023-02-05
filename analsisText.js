const bar = document.querySelector('.fill-bar');
const message = document.querySelector('#message');
const percentage_txt = document.querySelector('#percentage');

const openButton = document.querySelector('#window-open');

function analysisRequest(txt) {
    const req = new XMLHttpRequest();
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
            message.innerText = "It is unlikely that it was written by AI.";
        }
    }
}