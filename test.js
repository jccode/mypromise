;
(function(window) {

    window.onload = function() {
        start();
    };

    function start() {
        var pa = $q(function(resolve, reject) {
            setTimeout(function() {
                addLinks("A");
                resolve("addLink A");
            }, 100);
        });
        
        var pb = $q(function(resolve, reject) {
            setTimeout(function() {
                addLinks("B");
                resolve("addLink B");
            }, 1000);
        });

        /*
        pb.then(function(result) {
            console.log( "b done" );
            console.log( result );

        });
         */

        $q.all([pa, pb]).then(function(result) {
            console.log( "all ok " );
            console.log( result );

            setTimeout(function() {
                var links= document.getElementsByTagName("a");
                for(var i=0, l=links.length; i<l; i++) {
                    links[i].innerHTML="C"; // change all links text
                }
            }, 500);
        });
    }

    function addLinks(text) {
        for(var i=0; i<10; i++) {
            addLink(text);
        }
    }


    function addLink(text) {
        var el = document.getElementById("d1"),
            a = document.createElement("a"),
            t = document.createTextNode(text);
        a.appendChild(t);
        a.setAttribute('href', '#');
        el.appendChild(a);
    }

    
})(window);
