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
    methods: {
        addCard(column) {
            if (!this.column1Locked && column.cards.length < this.getMaxCards(column.id)) {
                const newCard = { title: 'Новая карточка', items: [], columnId: column.id };
                column.cards.push(newCard);

                if (column.id === 1) {
                    const completedCount = newCard.items.filter(item => item.completed).length;
                    const totalCount = newCard.items.length;
                    if (completedCount / totalCount > 0.5 && this.columns[1].cards.length < this.getMaxCards(2)) {
                        this.moveCard(newCard, 1, 2);
                    }
                }
            }
        },
        removeCard(column, card) {
            const index = column.cards.indexOf(card);
            if (index !== -1) {
                column.cards.splice(index, 1);
            }
        },
        getMaxCards(columnId) {
            return columnId === 1 ? 3 : columnId === 2 ? 5 : Infinity;
        },
        addItem(card) {
            if (card.items.length < 5) {
                card.items.push({ text: 'Новый пункт', completed: false });
            }
        },
        removeItem(card, itemIndex) {
            card.items.splice(itemIndex, 1);
        },
        moveCard(card, fromColumnId, toColumnId) {
            const fromColumn = this.columns.find(column => column.id === fromColumnId);
            const toColumn = this.columns.find(column => column.id === toColumnId);
            const index = fromColumn.cards.indexOf(card);
            if (index !== -1) {
                fromColumn.cards.splice(index, 1);
                card.columnId = toColumnId;
                toColumn.cards.push(card);
            }
        },
        moveCardIfCompleted(card) {
            if (card.columnId === 1) {
                const completedCount = card.items.filter(item => item.completed).length;
                const totalCount = card.items.length;
                if (completedCount / totalCount > 0.5 && this.columns[1].cards.length < this.getMaxCards(2)) {
                    this.moveCard(card, 1, 2);
                }
                if (completedCount === totalCount) {
                    this.moveCard(card, 1, 3);
                    card.completedAt = new Date().toLocaleString();
                }
            } else if (card.columnId === 2) {
                const completedCount = card.items.filter(item => item.completed).length;
                const totalCount = card.items.length;
                if (completedCount === totalCount) {
                    this.moveCard(card, 2, 3);
                    card.completedAt = new Date().toLocaleString();
                }
            }
        },
        isCardLocked(card) {
            if (card.columnId === 1 && this.columns[1].cards.length === this.getMaxCards(2)) {
                const completedCount = card.items.filter(item => item.completed).length;
                const totalCount = card.items.length;
                return completedCount / totalCount > 0.5;
            }
            return false;
        },
        saveToLocalStorage() {
            localStorage.setItem('columns', JSON.stringify(this.columns));
        },
    },
    watch: {
        columns: {
            handler() {
                this.column1Locked = this.isColumn1Locked();
                this.saveToLocalStorage();
            },
            deep: true,
        },
    },
    template: `
    <div class="kanban-board">
      <div v-for="column in columns" :key="column.id" class="kanban-column">
        <h2>{{ column.title }}</h2>
        <button @click="addCard(column)" :disabled="column.id === 1 ? column1Locked : false">Добавить карточку</button>
        <div v-for="card in column.cards" :key="card.title" class="kanban-card">
          <h3>{{ card.title }}</h3>
          <ul>
            <li v-for="(item, index) in card.items" :key="index" class="kanban-item">
              <input type="checkbox" v-model="item.completed" @change="moveCardIfCompleted(card)" :disabled="isCardLocked(card)">
              {{ item.text }}
              <button @click="removeItem(card, index)" :disabled="isCardLocked(card)">Удалить пункт</button>
            </li>
          </ul>
          <button @click="addItem(card)" :disabled="isCardLocked(card)">Добавить пункт</button>
          <button @click="removeCard(column, card)" :disabled="isCardLocked(card)">Удалить карточку</button>
          <p v-if="card.completedAt">Последний пункт выполнен: {{ card.completedAt }}</p>
        </div>
      </div>
    </div>
  `,

});

new Vue({
    el: '#app',
});
