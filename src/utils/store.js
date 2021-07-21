const cards = [
  {
    id: 'card-1',
    title: 'Product',
    desc: '3 pending task to be picked by raj'
  },
  {
    id: 'card-2',
    title: 'Sales',
    desc: 'send proposal to puneet for sale prices'
  }
];

const cardsProd = [
  {
    id: 'card-1',
    title: 'UAT testing',
    desc: 'Ask engineering to set upn infra'
  }
];

const data = {
  lists: {
    'list-1': {
      id: 'list-1',
      title: 'Teams',
      cards
    },
    'list-2': {
      id: 'list-2',
      title: 'Products',
      cards: cardsProd
    }
  },
  listIds: ['list-1', 'list-2']
};

export default data;
