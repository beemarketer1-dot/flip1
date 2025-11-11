$(document).ready(function() {
    // 1. Get references to the flipbook elements
    const $flipbookContainer = $('.flipbook-container');
    const $flipbook = $('.flipbook');
    const totalPages = $flipbook.children().length;
    
    // Function to update the page counter in the controls bar
    function updatePageCounter() {
        const currentPage = $flipbook.turn('page');
        const countElement = $('#page-counter');
        
        if (countElement.length) {
            countElement.text(`Page ${currentPage} of ${totalPages}`);
            
            // Disable navigation buttons at the limits
            $('#prev-btn').prop('disabled', currentPage === 1);
            $('#next-btn').prop('disabled', currentPage === totalPages);
        }
    }
    
    // Function to calculate the appropriate size and view mode for responsiveness
    function setFlipbookSize() {
        // Use a fixed max-width for the flipbook area (e.g., 1000px)
        const maxWidth = 1000;
        const containerWidth = Math.min($flipbookContainer.width(), maxWidth);
        
        // Define "mobile" as any screen width up to 768px (matching CSS breakpoint)
        const isMobile = window.innerWidth <= 768; 

        let newWidth = containerWidth;
        let newHeight = 600; // Default desktop height
        let display = 'double'; 

        if (isMobile) {
            // For single-page mobile view
            display = 'single';
            
            // Set width to a percentage of the viewport width to utilize space
            newWidth = window.innerWidth * 0.9;
            
            // Calculate height using a common book aspect ratio (e.g., 1:1.4)
            const aspectRatio = 1.4; 
            newHeight = newWidth * aspectRatio;
        } else {
            // For double-page desktop view
            display = 'double';
            // In double mode, Turn.js expects the width of two pages.
            // The max-width of the container is used for the entire double spread.
            newWidth = containerWidth;
        }
        
        // Ensure height doesn't exceed the viewport height (minus padding/controls)
        const maxViewportHeight = window.innerHeight - 150; 
        if (newHeight > maxViewportHeight) {
            newHeight = maxViewportHeight;
            // Recalculate width to maintain the aspect ratio if height was capped
            if (isMobile) {
                newWidth = newHeight / 1.4;
            } else {
                // If double page is capped, newWidth remains based on containerWidth
            }
        }
        
        // Apply the calculated size and display mode
        $flipbook.turn('size', newWidth, newHeight);
        $flipbook.turn('display', display);
        
        // Center the book and update the page count
        $flipbook.turn('center');
        updatePageCounter();
    }

    // 2. Initialize the flipbook
    // Use an initial estimate for size, which will be immediately corrected by setFlipbookSize()
    $flipbook.turn({
        width: $flipbookContainer.width(), 
        height: 600, 
        autoCenter: true,
        duration: 800, // Slightly reduced duration for better mobile feel
        gradients: true,
        acceleration: true,
        display: window.innerWidth <= 768 ? 'single' : 'double'
    });
    
    // 3. Apply the initial size and view immediately after initialization
    setFlipbookSize();
    
    // 4. Navigation buttons
    $('#prev-btn').click(function() {
        $flipbook.turn('previous');
    });
    
    $('#next-btn').click(function() {
        $flipbook.turn('next');
    });
    
    // 5. Keyboard navigation
    $(document).keydown(function(e) {
        if (e.keyCode === 37) { // Left arrow
            $flipbook.turn('previous');
        } else if (e.keyCode === 39) { // Right arrow
            $flipbook.turn('next');
        }
    });
    
    // 6. Update counter on page turn event
    $flipbook.bind('turned', function(event, page) {
        updatePageCounter();
    });
    
    // 7. Handle window resize and orientation change (Crucial for responsiveness)
    let resizeTimer;
    $(window).on('resize orientationchange', function() {
        clearTimeout(resizeTimer);
        // Debounce the resize event for performance
        resizeTimer = setTimeout(function() {
            setFlipbookSize();
        }, 200);
    });
    
    // 8. Handle touch events for mobile (improves swipe usability)
    if ('ontouchstart' in window) {
        $flipbook.addClass('touch-enabled');
    }
});