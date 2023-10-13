(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  var history = []; // This list will hold the history of inputs
  var terminalX = "50%";
  var terminalY = "50%";

  history = "<pre style='overflow: hidden;'>\n" +
    "██████╗ ███████╗███╗   ██╗ ██████╗ ██╗   ██╗██╗███╗   ██╗\n" +
    "██╔══██╗██╔════╝████╗  ██║██╔════╝ ██║   ██║██║████╗  ██║\n" +
    "██████╔╝█████╗  ██╔██╗ ██║██║  ███╗██║   ██║██║██╔██╗ ██║\n" +
    "██╔═══╝ ██╔══╝  ██║╚██╗██║██║   ██║██║   ██║██║██║╚██╗██║\n" +
    "██║     ███████╗██║ ╚████║╚██████╔╝╚██████╔╝██║██║ ╚████║\n" +
    "╚═╝     ╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝\n" +
    "</pre>";

  function draw_terminal() {
    // Create a new div element
    var terminal = document.createElement("div");

    // Create a new div element for the toolbar
    var toolbar = document.createElement("div");

    // Style the toolbar
    toolbar.style.backgroundColor = "#808080";
    toolbar.style.height = "30px"; // Standard height for toolbars
    toolbar.style.display = "flex"; // Use flexbox for easy centering
    toolbar.style.justifyContent = "flex-end"; // Align items to the right
    toolbar.style.borderRadius = "5px 5px 0 0";
    toolbar.style.width = "100%";
    toolbar.style.color = "#fff";
    toolbar.style.position = "sticky";
    toolbar.style.top = "0";

    var title = document.createElement("div");
    title.innerHTML = "Penguin terminal v0.0.1";

    title.style.color = "#000";
    title.style.marginRight = "40%";
    title.style.marginTop = "0.5%";

    toolbar.insertBefore(title, closeButton);

    // Create a new button element for the close button
    var closeButton = document.createElement("button");

    // Style the close button like Apple's close button
    closeButton.style.backgroundColor = "#FF5F57"; // Red background
    closeButton.style.borderRadius = "50%"; // Round button
    closeButton.style.width = "15px"; // Small button size
    closeButton.style.height = "15px"; // Small button size
    closeButton.style.border = "none"; // No border
    closeButton.style.margin = "5px"; // Margin to separate buttons

    // Add an event listener to the close button to remove the terminal when clicked
    closeButton.addEventListener("click", function() {
      document.body.removeChild(terminal);
    });

    // Add the close button to the toolbar
    toolbar.appendChild(closeButton);

    var output = document.createElement("div");
    output.style.color = "lime";
    output.style.padding = "20px";
    output.style.overflowWrap = "break-word";
    output.className = "output";
    output.innerHTML = history;
    terminal.insertBefore(output, input);

    // Style the new div
    terminal.style.position = "fixed";
    terminal.style.top = terminalX;
    terminal.style.left = terminalY;
    terminal.style.transform = "translate(-50%, -50%)";
    // Make the terminal background slightly transparent
    terminal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    terminal.style.zIndex = "1000";
    terminal.style.borderRadius = "5px"; // Rounded corners like some terminals
    terminal.style.width = "50%"; // Take up majority of the screen width
    terminal.style.height = "50%"; // Take up majority of the screen height
    terminal.style.overflow = "auto";
    terminal.style.resize = "both";
    terminal.className = "terminal";

    // Add the toolbar to the terminal
    terminal.insertBefore(toolbar, terminal.firstChild);

    // Append the new div to the body of the current document
    document.body.appendChild(terminal);

    // Variables to hold mouse position and whether we are dragging or not
    var drag = { isDragging: false, mouseX: 0, mouseY: 0 };

    // Event listener for mousedown event - this will start the drag
    toolbar.addEventListener('mousedown', function(e) {
      drag.isDragging = true;
      drag.mouseX = e.clientX;
      drag.mouseY = e.clientY;
    });

    // Event listener for mousemove event - this will move the terminal if we are dragging it
    window.addEventListener('mousemove', function(e) {
      if (drag.isDragging) {
        var dx = e.clientX - drag.mouseX;
        var dy = e.clientY - drag.mouseY;
        var style = window.getComputedStyle(terminal);
        var topPixel = parseInt(style.top, 10) + dy;
        var leftPixel = parseInt(style.left, 10) + dx;
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var topPercentage = (topPixel / windowHeight) * 100;
        var leftPercentage = (leftPixel / windowWidth) * 100;
        terminal.style.top = topPercentage + '%';
        terminal.style.left = leftPercentage + '%';
        drag.mouseX = e.clientX;
        drag.mouseY = e.clientY;
        terminalX = terminal.style.top;
        terminalY = terminal.style.left;
      }
    });

    // Event listener for mouseup event - this will end the drag
    window.addEventListener('mouseup', function() {
      drag.isDragging = false;
    });

    // Create a new input element
    var input = document.createElement("input");

    // Style the input element to look like a terminal input:
    input.style.backgroundColor = "rgba(0, 0, 0, 0)";
    input.style.color = "#00FF00"; // Terminal-like green text
    input.style.border = "none"; // No border
    input.style.paddingLeft = "20px";
    input.style.width = "90%";
    input.style.height = "17px";
    input.style.outline = "none";
    input.value = ">>";

    input.focus();

    // Append the input element to the terminal:
    terminal.appendChild(input);

    input.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        // Add the input value to the history list
        history += "<br> >" + input.value;
        output.innerHTML = history;

        // Clear the input field
        input.value = ">>";
      };
    });
  }

  class Terminal {
    getInfo() {
      return {
        id: 'terminal',
        name: 'Terminal',
        blocks: [
          {
            opcode: 'open',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Open terminal',
          },
          {
            opcode: 'close',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Close terminal',
          },
          {
            opcode: 'clear',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Clear terminal',
          },
          {
            opcode: 'log',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Log [MSG] to terminal',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Something has happened!',
              },
            },
          },
          {
            opcode: 'warn',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Warn [MSG] to terminal',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Something might happen!',
              },
            },
          },
          {
            opcode: 'error',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Error [MSG] to terminal',
            arguments: {
              MSG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Something is broken!',
              },
            },
          },
          {
            opcode: 'trace',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Trace [VAR] with name [NAME] and color [COLOR]',
            arguments: {
              VAR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Variable reporter',
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Name',
              },
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#32CD32',
              },
            },
          },
          {
            blockType: Scratch.BlockType.HAT,
            opcode: 'changed',
            text: 'when [VAR] changed',
            isEdgeActivated: false,
            arguments: {
              VAR: {
                type: Scratch.BlockType.STRING,
                defaultValue: 'variable reporter',
              }
            }
          }
        ]
      };
    }
    open() {
      draw_terminal()
    }
    close() {
      var terminalElement = document.querySelector('.terminal');
      if (terminalElement) {
        terminalElement.parentNode.removeChild(terminalElement);
      } else {
        console.log("Element with class name 'terminal' does not exist.");
      }
    }
    clear() {
      this.close();
      history = "<br> > Terminal cleared";
      this.open();
    }
    log(args) {
      this.close();
      history += "<br> >" + args.MSG;
      this.open();
    }
    warn(args) {
      this.close();
      history += "<span style='color: yellow;'>" + "<br> >" + args.MSG + "</span>";
      this.open();
    }
    error(args) {
      this.close();
      history += "<span style='color: red;'>" + "<br> >" + args.MSG + "</span>";
      this.open();
    }
    trace(args) {
      this.close();
      history += `<span style='color: ${args.COLOR}';><br> > ${args.NAME} : ${args.VAR} </span>`;
      this.open();
    }
    changed(args) {
      var previousValue = args.VAR;
      if (args.VAR !== previousValue) {
        return true
      } else {
        return false
      }
    }
  }

  Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
    Scratch.vm.runtime.startHats('terminal_changed');
  });

  Scratch.extensions.register(new Terminal())
})(Scratch);
