// CSV cleanup worker | TypeScript
import { cleanCSV, type CleanupOptions } from "./csv-workbench";
self.onmessage=(event:MessageEvent<{text:string;options:CleanupOptions}>)=>{try{self.postMessage({result:cleanCSV(event.data.text,event.data.options)});}catch(error){self.postMessage({error:error instanceof Error?error.message:"Could not process CSV."});}};
