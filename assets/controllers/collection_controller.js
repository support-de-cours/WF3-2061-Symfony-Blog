import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    // The collection HTML Node 
    // <div data-controller="collection">
    collection;

    // The collection items container
    // <div data-collection-container>
    container;

    // Collection items counter
    // <div data-counter="42>"
    counter;

    // The new item prototype
    // <template>
    prototype;

    // The value of new items on collection init
    // <div data-default-items="2">
    defaultItems;

    // The value of minimum items required
    // <div data-required-items="1">
    requiredItems;

    /**
     * Init the collection
     */
    connect() 
    {
        // Find the collection container node
        this.collection = this.element;

        // Get the value of items counter
        this.counter = this.collection.dataset.counter;

        // Get the number of items to create at the init
        this.defaultItems = parseInt(this.collection.dataset.defaultItems) || 1;

        // Get the minimum required items
        this.requiredItems = parseInt(this.collection.dataset.requiredItems) || 0;

        // Get the items container node
        this.container = this.collection.querySelector(`[data-collection-container]`);

        // Get the template node
        this.prototype = this.collection.querySelector(`template`);

        // Get all item already printed
        let widgets = this.collection.querySelectorAll(`[data-item-serial]`);

        // Count minimum widget printed
        if (widgets.length < this.defaultItems)
        {
            // Count left elements
            let limit = this.defaultItems - widgets.length;
            
            // Add items on collection init
            for (let i=0; i<limit; i++) 
                this.add();
        }
    }

    /**
     * Add a new item to the collection
     */
    add()
    {
        // Create the new Widget
        let widget = this.prototype;

        // Get the value of the counter
        let serial = this.counter++;

        // Replace the default prototype "__name__" by the current serial
        widget = widget.innerHTML.replace(/__name__/g, serial);

        // Update the value of the collection "data-item-counter" attribute
        this.collection.dataset.counter = serial+1;

        // Convert the "widget" string into a HTML Node
        widget = new DOMParser().parseFromString(widget, 'text/html');
        widget = widget.body.firstChild;

        // Add an identifier attribute
        widget.dataset.itemSerial = serial;

        // Add the widget into the collection
        this.container.append( widget );

        // Force to disabled all "remove buttons"
        this._disabledBtn();
    }

    /**
     * Remove widget from the collection
     * @param {Event} event 
     */
    remove(event)
    {
        // Retrieve the button node
        let button = event.target;

        // Retrieve the serial of the item
        let serial = button.dataset.target;

        // Retrieve the widget
        let widget = this.collection.querySelector(`[data-item-serial="${serial}"]`);

        // Count all widgets
        let widgets = this.collection.querySelectorAll(`[data-item-serial]`);

        // Remove the widget
        if (widgets.length > this.requiredItems) widget.remove();

        // Force to disabled all "remove buttons"
        this._disabledBtn();
    }

    /**
     * Toggle disabled of remove buttons 
     */
    _disabledBtn()
    {
        // Retrieve all widgets
        let widgets = this.collection.querySelectorAll(`[data-item-serial]`);
        // console.log( widgets.length > this.requiredItems );

        // The disable button state
        // Compare items length and items required
        let state = widgets.length > this.requiredItems;

        // Change disabled attribute of each button
        widgets.forEach(widget => {
            let button = widget.querySelector('button');

            !state 
                ? button.setAttribute('disabled', true)
                : button.removeAttribute('disabled')
            ;
        });
    }
}