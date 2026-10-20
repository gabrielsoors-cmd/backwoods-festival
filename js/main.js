/* ==========================================================================
   BACKWOODS FESTIVAL – JAVASCRIPT
   1. Mobilmenyn
   2. Cookie-samtycke (Google Analytics laddas först efter "ja")
   3. Nedräkning till festivalen
   4. Kartan (laddas först vid klick)
   5. Förstora bilder (galleriet)
   ========================================================================== */

(function () {
    'use strict';

    /* ---------- Inställningar ---------- */
    var GA_ID = 'G-4Q9FT55M7K';                         // Google Analytics
    var FESTIVALDAG = new Date('2027-05-15T00:00:00+02:00'); // BW-DATUM: ändra inför nästa år
    var COOKIE_NYCKEL = 'bw-cookieval';                 // sparar 'ja' eller 'nej'

    /* ---------- 1. Mobilmenyn ---------- */
    var menyKnapp = document.querySelector('.meny-knapp');
    var meny = document.getElementById('huvudmeny');

    function stangMeny() {
        if (!menyKnapp || !meny) return;
        meny.classList.remove('oppen');
        menyKnapp.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('meny-oppen');
    }

    if (menyKnapp && meny) {
        menyKnapp.addEventListener('click', function () {
            var oppen = menyKnapp.getAttribute('aria-expanded') === 'true';
            if (oppen) {
                stangMeny();
            } else {
                meny.classList.add('oppen');
                menyKnapp.setAttribute('aria-expanded', 'true');
                document.body.classList.add('meny-oppen');
            }
        });
        meny.addEventListener('click', function (e) {
            if (e.target.closest('a')) stangMeny();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') stangMeny();
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 1000) stangMeny();
        });
    }

    /* ---------- 2. Cookie-samtycke ---------- */
    function lasVal() {
        try { return window.localStorage.getItem(COOKIE_NYCKEL); } catch (e) { return null; }
    }
    function sparaVal(varde) {
        try { window.localStorage.setItem(COOKIE_NYCKEL, varde); } catch (e) { /* privat läge */ }
    }
    function rensaVal() {
        try { window.localStorage.removeItem(COOKIE_NYCKEL); } catch (e) { /* privat läge */ }
    }

    var analysLaddad = false;
    function laddaAnalys() {
        if (analysLaddad) return;
        analysLaddad = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
    }

    var ruta = document.getElementById('cookie-ruta');

    function visaRuta() { if (ruta) ruta.hidden = false; }
    function doljRuta() { if (ruta) ruta.hidden = true; }

    var val = lasVal();
    if (val === 'ja') {
        laddaAnalys();
    } else if (val !== 'nej') {
        visaRuta();
    }

    document.addEventListener('click', function (e) {
        var knapp = e.target.closest('[data-cookie]');
        if (!knapp) return;
        var typ = knapp.getAttribute('data-cookie');
        if (typ === 'ja') {
            sparaVal('ja');
            doljRuta();
            laddaAnalys();
        } else if (typ === 'nej') {
            sparaVal('nej');
            doljRuta();
        } else if (typ === 'andra') {
            // Ångrat ett ja? Analysen stoppas från nästa sidvisning.
            rensaVal();
            visaRuta();
        }
    });

    /* ---------- 3. Nedräkning ---------- */
    var nedrakning = document.querySelector('[data-nedrakning]');
    if (nedrakning) {
        var nu = new Date();
        var dagar = Math.ceil((FESTIVALDAG - nu) / 86400000);
        var text = '';
        if (dagar > 1) text = 'Om ' + dagar + ' dagar drar vi igång.';
        else if (dagar === 1) text = 'I morgon drar vi igång!';
        else if (dagar === 0) text = 'Idag är det Backwoods!';
        if (text) {
            nedrakning.textContent = text;
            nedrakning.hidden = false;
        }
    }

    /* ---------- 5. Förstora bilder ----------
       Alla länkar med data-forstora öppnas i en ruta i stället för att
       lämna sidan. Pilar, svep och piltangenter bläddrar, Esc stänger. */
    var forstoraLankar = Array.prototype.slice.call(document.querySelectorAll('a[data-forstora]'));
    if (forstoraLankar.length && typeof HTMLDialogElement === 'function') {
        var ruta2 = document.createElement('dialog');
        ruta2.className = 'ljuslada';
        ruta2.setAttribute('aria-label', 'Förstorad bild');
        ruta2.innerHTML =
            '<div class="ljuslada-topp">' +
                '<span class="ljuslada-raknare" aria-live="polite"></span>' +
                '<button type="button" class="ljuslada-stang" data-stang>Stäng ✕</button>' +
            '</div>' +
            '<figure><img alt=""><figcaption></figcaption></figure>' +
            '<div class="ljuslada-nav">' +
                '<button type="button" data-steg="-1">‹ Föregående</button>' +
                '<button type="button" data-steg="1">Nästa ›</button>' +
            '</div>';
        document.body.appendChild(ruta2);

        var storBild = ruta2.querySelector('img');
        var bildtext = ruta2.querySelector('figcaption');
        var raknare = ruta2.querySelector('.ljuslada-raknare');
        var aktuell = 0;
        var oppnadFran = null;

        function visa(index) {
            aktuell = (index + forstoraLankar.length) % forstoraLankar.length;
            var lank = forstoraLankar[aktuell];
            var liten = lank.querySelector('img');
            var text = liten ? liten.getAttribute('alt') : '';
            storBild.src = lank.getAttribute('href');
            storBild.alt = text;
            bildtext.textContent = text;
            raknare.textContent = 'Bild ' + (aktuell + 1) + ' av ' + forstoraLankar.length;
        }

        function oppna(index, fran) {
            oppnadFran = fran || null;
            visa(index);
            document.documentElement.classList.add('ljuslada-oppen');
            ruta2.showModal();
        }

        ruta2.addEventListener('close', function () {
            document.documentElement.classList.remove('ljuslada-oppen');
            storBild.removeAttribute('src');
            if (oppnadFran) oppnadFran.focus();
        });

        forstoraLankar.forEach(function (lank, i) {
            lank.addEventListener('click', function (e) {
                e.preventDefault();
                oppna(i, lank);
            });
        });

        ruta2.addEventListener('click', function (e) {
            var steg = e.target.closest('[data-steg]');
            if (steg) { visa(aktuell + parseInt(steg.getAttribute('data-steg'), 10)); return; }
            if (e.target.closest('[data-stang]') || e.target === ruta2) ruta2.close();
        });

        ruta2.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowRight') { e.preventDefault(); visa(aktuell + 1); }
            if (e.key === 'ArrowLeft') { e.preventDefault(); visa(aktuell - 1); }
        });

        // Svep på mobilen
        var startX = null;
        ruta2.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        ruta2.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) visa(aktuell + (dx < 0 ? 1 : -1));
            startX = null;
        });
    }

    /* ---------- 4. Kartan ---------- */
    document.querySelectorAll('[data-karta]').forEach(function (knapp) {
        knapp.addEventListener('click', function () {
            var behallare = knapp.closest('.karta');
            var iframe = document.createElement('iframe');
            iframe.src = knapp.getAttribute('data-karta');
            iframe.title = 'Karta över Rotsågen i Rot, Älvdalen';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            behallare.innerHTML = '';
            behallare.appendChild(iframe);
        });
    });
})();
