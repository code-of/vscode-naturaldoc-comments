# natural-doc-comments

Inserts 'Natural-Docs'-conform comments for the selected text, which is one these types: 
    - Function (with parameters + returntype)
    - Struct (with all variables)
    - Enum (with all definitions)
    - Typedef (NEW: with function-pointers)
    - Macro (with parameters)
    - Variable (only declarations)
    - Define (simple comments)

## Preview

![Alt Text](https://e-p-s.org/thekeys/natural-doc-comments.gif)

## How it works

1. Install the extension
2. Restart VSCode
3. Open a C-Sourcefile
4. Select a function-prototype and right-click to open context menu.
5. Click on 'New 'Natural-Docs' Comment'.
6. You're done.

If everything worked out fine a Comment will be posted above your function-prototype.

### Latest change

#### 02/05/18 - version 1.2.2
##### added: 
        - able to build simple 'function-pointer'-comment
        - able to build a comment from a 'typedef struct/enum'
##### changed:
        - overall-code-alignment
        - some RegExp-change to be more or less greedy
