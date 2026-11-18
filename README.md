openAI에서 제공하는 gpt-2 detector model을 활용한 extension입니다.

## 동작 방식
- Hugging Face Space API 대신 [onnx-community/roberta-base-openai-detector-ONNX](https://huggingface.co/onnx-community/roberta-base-openai-detector-ONNX) 모델을 [transformers.js](https://github.com/huggingface/transformers.js)로 브라우저에서 직접 실행합니다.
- 처음 실행할 때 양자화 모델(`onnx/model_quantized.onnx`, 약 126MB)을 Hugging Face Hub에서 내려받고, 이후에는 브라우저 캐시에서 불러옵니다.
- `lib/` 폴더에는 transformers.js 3.8.1(`transformers.min.js`)과 ONNX Runtime Web wasm 파일이 들어 있습니다. MV3 CSP가 원격 스크립트를 막기 때문에 로컬 파일로 포함합니다.
