import { writeFile, writeTextFile } from '@tauri-apps/api/fs';
import { writable } from 'svelte/store';
import { loadFile } from '../../FileTree/TreeData';
import CodeMirrorEditor from './CodeMirrorEditor.svelte';
export let tabs = writable([]);
export let hidden = writable(true);

class Tab {
    label: string;
    path: string;
    id: number;
    active: boolean;
    editor: CodeMirrorEditor | null;
    editorcontent: string;
    saved: boolean;
    constructor(id: number, tabname: string = "", path: string, editor = null, editorcontent = "", active: boolean = false, saved: boolean = true) {
        this.id = id;
        this.label = tabname === "" ? `Untitled-${id}` : tabname;
        this.path = path;
        this.active = active;
        this.editor = editor
        this.editorcontent = editorcontent
        this.saved = saved;

        let _ = undefined;
        this.editor.$on("input", (e) => {
            clearTimeout(_);
            _ = setTimeout(() => {
                writeFile(this.path, e.detail);
                console.log(`${this.label} saved`)
            }, 1000)
        })
    }    
}

let id = 0;
let activeid;
let tablist: Tab[] = [];
export async function addTab(f) {
    let file = await loadFile(f);
    let editor = new CodeMirrorEditor({ target: document.getElementById("tabview"), props: { content: file.content } });
    let tab = new Tab(id, file.filename, file.path, editor, file.content);
    tablist = [...tablist, tab];
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

export function setActive(id) {
    for (let tab of tablist) {
        if (tab.id === id) {
            activeid = id;
            tab.active = true;
        }
        else {
            tab.active = false;
        }
    }
    tabs.set(tablist);
    updateEditorVisibility();
}

function updateEditorVisibility() {
    for (let tab of tablist) {
        tab.editor.$set({ hidden: !(tab.id === activeid) })
    }
}

export function closeTab(tabid: number) {
    tablist.find(t => t.id === tabid).editor.$destroy();
    tablist = tablist.filter(t => t.id !== tabid);

    for (let i = 0; i < tablist.length - 1; i++) {
        if (tablist[i].id === tabid) {
            
        }
    }
    // TODO: Fix logic here
    if (activeid >= tablist.length - 1) {
        setActive(tabid - 1);
    }
    else {
        setActive(tabid + 1);
    }
    tabs.set(tablist);
    
    updateEditorVisibility();
    if (tablist.length === 0) {
        hidden.set(true);
        id = 0;
    }
}