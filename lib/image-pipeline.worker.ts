// Image transformation worker | TypeScript
import {transformImage,type ImageOptions} from "./image-pipeline";
self.onmessage=async(event:MessageEvent<{file:File;options:ImageOptions}>)=>{try{self.postMessage({blob:await transformImage(event.data.file,event.data.options)});}catch(error){self.postMessage({error:error instanceof Error?error.message:"Could not process image."});}};
