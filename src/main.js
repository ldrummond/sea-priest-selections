import './style.css'

"use strict";

document.addEventListener("DOMContentLoaded", () => {
   const contact_form_el = document.getElementById("contact-form");
   if(contact_form_el) {
      const contact_form_success_message = contact_form_el.querySelector(".form-message.--success");
      const contact_form_error_message = contact_form_el.querySelector(".form-message.--error");
      const contact_form_submit_el = contact_form_el.querySelector("button[type='submit']");
      
      contact_form_el.addEventListener("focusin", () => {
         contact_form_success_message.style.opacity = '0';
         contact_form_error_message.style.opacity = '0';
      })
      
      if(contact_form_el) {
         contact_form_el.addEventListener("submit", (e) => {
            e.preventDefault();
            const form_data = new FormData(contact_form_el);
            contact_form_success_message.style.opacity = '0';
            contact_form_error_message.style.opacity = '0';
            contact_form_submit_el.textContent = 'Processing';
            contact_form_submit_el.disabled = true;
      
            const delay = new Promise((res, rej) => setTimeout(res, 2000));
            const submit_request = fetch("/", {
               method: "POST",
               headers: { "Content-Type": "application/x-www-form-urlencoded" },
               body: new URLSearchParams(form_data).toString()
            })
      
            Promise.all([delay, submit_request])
               .then(() => {
                  contact_form_submit_el.textContent = 'Success';
                  contact_form_success_message.style.opacity = '1'; 
               })
               .catch(() => {
                  contact_form_submit_el.disabled = false;
                  contact_form_submit_el.textContent = 'Submit';
                  contact_form_error_message.style.opacity = '1'; 
               });
         });
      }
   }
});


// https://gist.github.com/getify/150ea5a3b30b8822dee7798883d120b9
function computeViewportDimensions() {
   if (document.documentElement && document.documentElement.style && document.documentElement.style.setProperty) {
      const client_width = document.documentElement.clientWidth;
      if(client_width !== window._client_width) {
         window._client_width = client_width;
         document.documentElement.style.setProperty(
            "--vw-unit",
            (document.documentElement.clientWidth / 100).toFixed(1) + "px"
         );
         document.documentElement.style.setProperty(
            "--vh-unit",
            (document.documentElement.clientHeight / 100).toFixed(1) + "px"
         );
      }
   }
}

(function listenForViewportChanges(){
   // keep the CSS vw-unit/vh-unit CSS variables updated as the viewport changes size (or orientation!)
   window.addEventListener("resize",computeViewportDimensions,false);

   // work-arounds for browsers that don't fire "resize" when the orientation changes
   // ref: https://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/onchange
   if (typeof window.screen != "undefined" && typeof window.screen.orientation != "undefined") {
      window.screen.orientation.addEventListener("change",computeViewportDimensions,false);
   }
   // ref: https://www.reddit.com/r/javascript/comments/lttxdy/js_workaround_for_fixing_how_css_vwvh_units_arent/gp61ghe/
   // ref: https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/matches
   else if (typeof window.matchMedia != "undefined") {
      var query = window.matchMedia("(orientation: landscape)");

      // handle variances in the event handling in various older browsers
      if (typeof query.addEventListener != "undefined") {
         query.addEventListener("change",computeViewportDimensions,false);
      }
      else if (typeof query.addListener != "undefined") {
         query.addListener(computeViewportDimensions);
      }
      else {
         query.onchange = computeViewportDimensions;
      }
   }
    
   // make sure nothing during HTML parsing invalidated the early
   // computation (from the <script> embed)
   //
   // has the DOM already loaded?
   if (document.readyState != "loading") {
      computeViewportDimensions();
   }
   // otherwise, assume we can listen for the future DOM-ready event
   else {
      document.addEventListener("DOMContentLoaded",computeViewportDimensions,false);
   }
})();