import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import List from './components/List/List';
import store from './utils/store';
import StoreApi from './utils/storeApi';
import InputContainer from './components/Input/InputContainer';
import { makeStyles } from '@material-ui/core/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useLocalStorage } from './utils/useLocalStorage';
import { compare } from './utils/helper';

const useStyle = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    background: 'green',
    width: '100%',
    overflowY: 'auto'
  },
  listContainer: {
    display: 'flex'
  }
}));

export default function App() {
  const [localData, setLocalData] = useLocalStorage('data', {});

  const temp = Object.keys(localData).length === 0 ? store : localData;
  console.log(temp, '#', localData);
  const [data, setData] = useState(temp);

  const [backgroundUrl, setBackgroundUrl] = useState('');
  React.useEffect(() => {
    console.log(localData, 'asas', temp);
    setLocalData(store);
  }, []);
  React.useEffect(() => {
    setLocalData(data);
  }, [data]);
  const classes = useStyle();
  const addMoreCard = (title, description, listId) => {
    console.log(title, listId, description);

    const newCardId = uuid();
    const newCard = {
      id: newCardId,
      title,
      desc: description,
      date: Date.now()
    };

    const list = data.lists[listId];
    list.cards = [...list.cards, newCard];
    list.cards.sort(compare);

    const newState = {
      ...data,
      lists: {
        ...data.lists,
        [listId]: list
      }
    };
    console.log(newState);
    setData(newState);
  };

  const addMoreList = title => {
    const newListId = uuid();
    const newList = {
      id: newListId,
      title,
      cards: []
    };
    const newState = {
      listIds: [...data.listIds, newListId],
      lists: {
        ...data.lists,
        [newListId]: newList
      }
    };
    setData(newState);
  };

  const updateListTitle = (title, listId) => {
    const list = data.lists[listId];
    list.title = title;

    const newState = {
      ...data,
      lists: {
        ...data.lists,
        [listId]: list
      }
    };
    setData(newState);
  };

  const handleRemoveList = listId => {
    const newData = data.listIds.filter(ele => ele !== listId);
    const temp = data?.lists;
    for (let i in temp) {
      if (temp[i] === listId) {
        delete temp[i];
      }
    }

    setData({ lists: temp, listIds: newData });
  };

  const handleRemoveCard = (listId, CardId) => {
    const temp = data?.lists;
    const tempId = data?.listIds;
    // console.log(CardId, listId);
    for (let i in temp) {
      //   console.log(temp[i]);
      if (temp[i].id === listId) {
        console.log(temp[i].cards);
        // for (let x = 0; x < temp[i]?.cards.length; x++) {
        //   console.log(temp[i]?.cards[x].id);
        //   if (temp[i]?.cards[x].id === CardId) {
        //     console.log('yes');
        //   }
        // }
        const arr = temp[i]?.cards.filter(ele => ele.id !== CardId);
        temp[i].cards = arr;
        temp[i].cards.sort(compare);
      }
    }
    // console.log(temp);
    setData({ lists: temp, listIds: tempId });
  };

  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    console.log('destination', destination, 'source', source, draggableId);

    if (!destination) {
      return;
    }
    if (type === 'list') {
      const newListIds = data.listIds;
      newListIds.splice(source.index, 1);
      newListIds.splice(destination.index, 0, draggableId);
      return;
    }

    const sourceList = data.lists[source.droppableId];
    const destinationList = data.lists[destination.droppableId];
    const draggingCard = sourceList.cards.filter(card => card.id === draggableId)[0];

    if (source.droppableId === destination.droppableId) {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);
      destinationList.cards.sort(compare);
      sourceList.cards.sort(compare);
      const newSate = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList
        }
      };
      setData(newSate);
    } else {
      sourceList.cards.splice(source.index, 1);
      destinationList.cards.splice(destination.index, 0, draggingCard);
      destinationList.cards.sort(compare);
      sourceList.cards.sort(compare);
      const newState = {
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList
        }
      };
      setData(newState);
    }
  };

  return (
    <StoreApi.Provider
      value={{ addMoreCard, addMoreList, updateListTitle, handleRemoveList, handleRemoveCard }}
    >
      <div
        className={classes.root}
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='app' type='list' direction='horizontal'>
            {provided => (
              <div
                className={classes.listContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {data?.listIds?.map((listId, index) => {
                  const list = data.lists[listId];
                  return <List list={list} key={listId} index={index} />;
                })}
                <InputContainer type='list' />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </StoreApi.Provider>
  );
}
