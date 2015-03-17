;
(function(window) {

    window.onload = function() {
        start();
    };

    function start() {
        var pa = $q(function() {
            asyncAddLinks("A", 200);
        });
        var pb = $q(function() {
            asyncAddLinks("B", 1000);
        });

        $q.all([pa, pb]).then(function(result) {
            alert('c');
            console.log('C');
            var links= document.getElementsByTagName("a");
            for(var i=0, l=links.length; i<l; i++) {
                links[i].innerHTML="C"; // change all links text
            }
        });

    }

    function asyncAddLinks(txt, timeout) {
        setTimeout(function() {
            
            for(var i=0; i<10; i++) {
                addLink(txt);
            }
            
        }, timeout);
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
