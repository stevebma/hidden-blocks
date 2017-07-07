document.addEventListener("DOMContentLoaded", ()=> {
    try {
        console.log('Hidden Blocks by Steven Bouma');

        // Create Application, added to window for easy inspection
        window['application'] = new HiddenBlocks.Application();

        // Add the view to the DOM
        document.body.appendChild(window['application'].view);

    } catch(exception) {
        console.warn('Uncaught exception: ' + exception);
    }
});