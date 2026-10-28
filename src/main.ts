import { ApplicationConfig, Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
 
const monacoConfig = {
   baseUrl: 'assets/monaco/vs'// Ensure this matches your file layout
};


export const appConfig: ApplicationConfig = {
  providers: [

       // ⬇️ Add this line to supply the missing InjectionToken globally
    importProvidersFrom(MonacoEditorModule.forRoot(monacoConfig))
    
     ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));