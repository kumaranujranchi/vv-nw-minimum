(function( $ ) {
    'use strict';
    $(document).ready(function() {
      document.addEventListener("DOMContentLoaded", function () {
        // Wait for the DOM to be fully loaded
        if($("#btnrefeshg").length > 0) {
          var bodyElement = document.getElementById("btnrefeshg");
          bodyElement.click()
        }
      });
    });
})( jQuery );
