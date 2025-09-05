// Initialize WebFonts
document.addEventListener('DOMContentLoaded', function() {
    // Load Google Fonts
    WebFont.load({
        google: { 
            families: [
                "Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic",
                "JetBrains Mono:100,200,300,regular,500,600,700,800",
                "Poppins:100,300,regular,500,600,700,800,900",
                "Inter:100,300,regular,500,600,700,800,900,italic,600italic"
            ] 
        }
    });

    // Add touch detection class
    const n = document.documentElement;
    const t = " w-mod-";
    n.className += t + "js";
    if ("ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch)) {
        n.className += t + "touch";
    }
});
