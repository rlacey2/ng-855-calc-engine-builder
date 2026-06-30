import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class MonacoOptionsService {

  /*
  theme: 'myCustomTheme',
  language: 'json',
  roundedSelection: true,
  autoIndent: true,
  folding: true,
  showFoldingControls: 'always',
  foldingStrategy: "auto",
  formatOnPaste: true,
  formatOnType: true,
  wordWrap: "on",
  codeLens: false
*/
 
  public editorDefaultOptions = {
    language: 'json',
    roundedSelection: true,
    autoIndent: true,
    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true,
    formatOnType: true,
    wordWrap: "on",
    codeLens: false,
    automaticLayout: true
  }
 
  public editorOptions = {
    theme: 'vs-dark', language: 'json',
    roundedSelection: true,
    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true, // Requires true to activate auto-formatting on paste
    formatOnType: true,  // Good to have for auto-indentation while typing
    autoIndent: 'full',
    wordWrap: "on",
    codeLens: false,
    readOnly: false
  };


  public editorOptionsDiff = {
    theme: 'vs-dark',
    // language: 'json',
    roundedSelection: true,
    folding: true,
    showFoldingControls: 'always',
    foldingStrategy: "auto",
    formatOnPaste: true, // Requires true to activate auto-formatting on paste
    formatOnType: true,  // Good to have for auto-indentation while typing
    autoIndent: 'full',
    wordWrap: "on",
    codeLens: false,
    readOnly: false,
    renderSideBySide: true,
    useInlineViewWhenSpaceIsLimited: false // Forces side-by-side even in small spaces
  };



  mergeMonacoOptions(partialOptions: any) {
    let x = {
      ...this.editorDefaultOptions,
      ...partialOptions
    };
    console.log(x)
    return x
  }

}
