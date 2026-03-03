// Theme toggle with system preference detection and localStorage persistence
(function () {
    function applyTheme(theme) {
        const html = document.documentElement;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        updateIcons(theme);
    }

    function updateIcons(theme) {
        const sun = document.getElementById('icon-sun');
        const moon = document.getElementById('icon-moon');
        if (!sun || !moon) return;
        if (theme === 'dark') {
            sun.classList.remove('hidden');
            moon.classList.add('hidden');
        } else {
            sun.classList.add('hidden');
            moon.classList.remove('hidden');
        }
    }

    function getTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Apply immediately (before paint)
    applyTheme(getTheme());

    // On DOM ready, update icons
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { updateIcons(getTheme()); });
    } else {
        updateIcons(getTheme());
    }

    // Listen for OS theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Global toggle
    window.toggleTheme = function () {
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
    };
})();
