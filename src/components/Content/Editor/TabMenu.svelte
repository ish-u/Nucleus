<script lang="ts">
    import { ContextMenuOption } from "carbon-components-svelte";
    import ContextMenu from "../../ContextMenu/ContextMenu.svelte";
    import CopyFile from "carbon-icons-svelte/lib/CopyFile.svelte";
    import Cut from "carbon-icons-svelte/lib/Cut.svelte";
    import { clipboard, path, invoke } from "@tauri-apps/api";
    import { closeTab, setActive } from "./Tabs";
    export let id: number;
    export let target;
    export let filename;
    export let filepath;

    async function copyToClipboard(input) {
        await clipboard.writeText(input);
    }
</script>

<ContextMenu {target}>
    <ContextMenuOption indented icon={CopyFile} labelText="Close Tab" on:click={() => { 
        closeTab(id);
    }}>
        <span class="contextshortcut" slot="shortcutText">Ctrl + F4</span>
    </ContextMenuOption>
    <ContextMenuOption indented icon={Cut} labelText="Close Others" on:click={() => {
        let tabs = document.getElementsByClassName("tab");
        for (const tab of tabs) {
            let t = tab.id;
            let tabid = parseInt(t.split("-").pop());
            if (tabid !== id) {
                closeTab(tabid);
            }
        }
        setActive(id);
    }} ></ContextMenuOption>
    <ContextMenuOption indented labelText="Close Saved Tabs" on:click={() => {}}>
        <span class="contextshortcut" slot="shortcutText">Ctrl + X S</span>
    </ContextMenuOption>
    <ContextMenuOption indented labelText="Close All Tabs" on:click={() => {}}>
        <span class="contextshortcut" slot="shortcutText">Ctrl + X A</span>
    </ContextMenuOption>
    <!--TODO: Make this relative instead of file name. Am lazy-->
    <ContextMenuOption on:click={() => copyToClipboard(filename)}>
        <span slot="labelText" title={filename}>Copy File Name</span>
    </ContextMenuOption>
    <ContextMenuOption on:click={() => copyToClipboard(filepath)}>
        <span slot="labelText" title={filepath}>Copy Absolute Path</span>
    </ContextMenuOption>
    <ContextMenuOption labelText="Show in Explorer" on:click={() => {
        invoke("open_in_explorer",{ path:filepath})
    }}></ContextMenuOption>
</ContextMenu>

<style>
    .contextshortcut {
        color: #8c8c8c;
    }
</style>