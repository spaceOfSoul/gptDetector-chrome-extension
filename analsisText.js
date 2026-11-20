import { pipeline, env } from './lib/transformers.min.js';

// https://huggingface.co/onnx-community/roberta-base-openai-detector-ONNX
const MODEL_ID = 'onnx-community/roberta-base-openai-detector-ONNX';

// 모델 파일은 처음 한 번 Hugging Face Hub에서 내려받고, 이후에는 브라우저 캐시(Cache API)에서 불러온다.
env.allowLocalModels = false;
env.useBrowserCache = true;
// MV3 CSP는 원격 스크립트를 막으므로 ONNX Runtime(wasm)을 확장 프로그램 내부 파일에서 불러온다.
env.backends.onnx.wasm.wasmPaths = chrome.runtime.getURL('lib/');
// 확장 프로그램 페이지는 crossOriginIsolated가 아니라서 멀티스레드를 쓸 수 없다.
env.backends.onnx.wasm.numThreads = 1;

export const bar = document.querySelector('.fill-bar');
const message = document.querySelector('#message');
const percentage_txt = document.querySelector('#percentage');
const footnote = document.querySelector('.footnote');

let classifierPromise = null;
let latestRequestId = 0;
let modelLoading = false;
let analyzing = false;

function getClassifier() {
    if (!classifierPromise) {
        const progress = {};
        modelLoading = true;
        classifierPromise = pipeline('text-classification', MODEL_ID, {
            dtype: 'q8', // onnx/model_quantized.onnx (~126MB)
            device: 'wasm',
            progress_callback: (p) => {
                if (!modelLoading || p.status !== 'progress' || !p.total) return;
                progress[p.file] = p;
                let loaded = 0, total = 0;
                for (const f of Object.values(progress)) {
                    loaded += f.loaded;
                    total += f.total;
                }
                message.innerText = `Downloading model... ${(loaded / total * 100).toFixed(0)}% (first run only)`;
            },
        }).then((classifier) => {
            // 로딩이 끝나면 다운로드 문구와 하단 설명을 숨긴다.
            modelLoading = false;
            if (footnote) footnote.hidden = true;
            if (message.innerText.startsWith('Downloading model')) {
                message.innerText = analyzing ? 'Analyzing...' : '';
            }
            return classifier;
        }).catch((err) => {
            modelLoading = false;
            classifierPromise = null; // 다음 요청에서 다시 시도
            throw err;
        });
    }
    return classifierPromise;
}

// 팝업이 열리자마자 모델 로딩을 시작해 첫 분석 대기 시간을 줄인다.
export function preloadModel() {
    getClassifier().catch((err) => console.error(err));
}

export async function analysisRequest(txt) {
    const requestId = ++latestRequestId;
    analyzing = true;
    message.innerText = 'Analyzing...';
    try {
        const classifier = await getClassifier();
        const output = await classifier(txt, { top_k: null });
        if (requestId !== latestRequestId) return; // 더 최신 요청이 있으면 무시
        analyzing = false;
        const fake = output.find((o) => o.label === 'Fake');
        const result = { fake_probability: fake ? fake.score : 0 };
        console.log(output);
        update_graph(result);
    } catch (err) {
        console.error(err);
        if (requestId !== latestRequestId) return;
        analyzing = false;
        message.innerText = `Error: ${err.message ?? err}`;
    }
}

export function update_graph(result) {
    if (result === null) {
        latestRequestId++; // 진행 중인 분석 결과 무시
        analyzing = false;
        bar.style.width = '50%';
        message.innerText = modelLoading ? message.innerText : 'hmm...';
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
