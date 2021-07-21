import React, { useContext } from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Draggable } from 'react-beautiful-dnd';
import storeApi from '../utils/storeApi';

const useStyle = makeStyles(theme => ({
  card: {
    padding: theme.spacing(1, 1, 1, 2),
    margin: theme.spacing(1)
  }
}));
export default function Card({ card, index, listId }) {
  const classes = useStyle();
  const { handleRemoveCard } = useContext(storeApi);

  return (
    <Draggable draggableId={card.id} index={index}>
      {provided => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <Paper className={classes.card}>
            <span style={{ fontWeight: '600' }}>{card.title}</span>
            <button style={{ float: 'right' }} onClick={() => handleRemoveCard(listId, card.id)}>
              close
            </button>
            <br></br>
            <span>{card.desc}</span>
          </Paper>
        </div>
      )}
    </Draggable>
  );
}
