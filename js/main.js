Vue.component('notes', {
    data() {
        return {
            columns: [
                { id: 1, title: 'Подготовка', cards: [] },
                { id: 2, title: 'В процессе', cards: [] },
                { id: 3, title: 'Завершенные', cards: [] },
            ],
            column1Locked: false,
        };
    },
});

new Vue({
    el: '#app',
});
