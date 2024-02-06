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
