/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   Simple accordion pattern example
 */

'use strict';

Array.prototype.slice.call(document.querySelectorAll('.Accordeon')).forEach(function(accordeon) {

    // Permet aux sections d accordeon multiple d etre ouvert en meme temps
    var allowMultiple = accordeon.hasAttribute('data-allow-multiple');
    // permet a chaque toggle de se fermer individuellement
    var allowToggle = (allowMultiple) ? allowMultiple : accordeon.hasAttribute('data-allow-toggle');

    // permet de creer le tableau de toggle pour chaque groupe d accordeon
    var triggers = Array.prototype.slice.call(accordeon.querySelectorAll('.Accordeon-trigger'));
    var panels = Array.prototype.slice.call(accordeon.querySelectorAll('.Accordeon-panel'));


    accordeon.addEventListener('click', function(event) {
        var target = event.target;

        if (target.classList.contains('Accordeon-trigger')) {
            // verifie si le toggle actif est dans l etat ouvert
            var isExpanded = target.getAttribute('aria-expanded') == 'true';
            var active = accordeon.querySelector('[aria-expanded="true"]');

            // sans l option allowMultiple, on ferme les accordeon ouverts
            if (!allowMultiple && active && active !== target) {
                // Assigne l etat ouvert a l element selectionne
                active.setAttribute('aria-expanded', 'false');
                // Cache les sections accordeon en utilisant les controles aria pour specifier la section choisie
                document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');

                // quand le toggling n est pas permis, on cleane l etat inactif
                if (!allowToggle) {
                    active.removeAttribute('aria-disabled');
                }
            }

            if (!isExpanded) {
                // Pose l etat ouvert pour l element selectionne
                target.setAttribute('aria-expanded', 'true');
                // Cache les sections accordeon en utilisant les controles aria pour specifier la section choisie
                document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');

                // si le toggling n est pas permis on place l etat desactive sur l element selectionne
                if (!allowToggle) {
                    target.setAttribute('aria-disabled', 'true');
                }
            } else if (allowToggle && isExpanded) {
                // on place l etat ouvert sur l element selectionne
                target.setAttribute('aria-expanded', 'false');
                // Cache les sections accordeon en utilisant les controles aria pour specifier la section choisie
                document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
            }

            event.preventDefault();
        }
    });

    // on choppe les evenements clavier sur le container d accordeon
    accordeon.addEventListener('keydown', function(event) {
        var target = event.target;
        var key = event.which.toString();

        var isExpanded = target.getAttribute('aria-expanded') == 'true';
        var allowToggle = (allowMultiple) ? allowMultiple : accordeon.hasAttribute('data-allow-toggle');

        // 33 = Page Up, 34 = Page Down
        var ctrlModifier = (event.ctrlKey && key.match(/33|34/));

        // on teste si ca vient d un entete d accordeon
        if (target.classList.contains('Accordeon-trigger')) {
            // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
            // 38 = Up, 40 = Down
            if (key.match(/38|40/) || ctrlModifier) {
                var index = triggers.indexOf(target);
                var direction = (key.match(/34|40/)) ? 1 : -1;
                var length = triggers.length;
                var newIndex = (index + length + direction) % length;

                triggers[newIndex].focus();

                event.preventDefault();
            } else if (key.match(/35|36/)) {
                // 35 = End, 36 = Home keyboard operations
                switch (key) {
                    // va au premier accordeon
                    case '36':
                        triggers[0].focus();
                        break;
                        // va au dernier accordeon
                    case '35':
                        triggers[triggers.length - 1].focus();
                        break;
                }
                event.preventDefault();

            }

        }
    });

    // Pour styliser l accordeon quand un boutton a le focus
    accordeon.querySelectorAll('.Accordeon-trigger').forEach(function(trigger) {

        trigger.addEventListener('focus', function(event) {
            accordeon.classList.add('focus');
        });

        trigger.addEventListener('blur', function(event) {
            accordeon.classList.remove('focus');
        });

    });

    // permet de placer l etat desactive grace a  aria-disabled, pour
    // les accordeon ouvert/actifs ce qui n est pas permis par le toggled close
    if (!allowToggle) {
        // on recupere le premier accordeon ouvert/actif
        var expanded = accordeon.querySelector('[aria-expanded="true"]');

        // si un accordeon ouvert/actif est trouvé on le desactive
        if (expanded) {
            expanded.setAttribute('aria-disabled', 'true');
        }
    }

});


