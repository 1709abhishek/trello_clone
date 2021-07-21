import React, { useState, useContext } from 'react';
import { Paper, InputBase, Button, IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles, fade } from '@material-ui/core/styles';
import storeApi from '../../utils/storeApi';

const useStyle = makeStyles(theme => ({
  card: {
    width: '280px',
    margin: theme.spacing(0, 1, 1, 1),
    paddingBottom: theme.spacing(4)
  },
  input: {
    margin: theme.spacing(1)
  },
  btnConfirm: {
    background: '#5AAC44',
    color: '#fff',
    '&:hover': {
      background: fade('#5AAC44', 0.75)
    }
  },
  confirm: {
    margin: theme.spacing(0, 1, 1, 1)
  }
}));
export default function InputCard({ setOpen, listId, type }) {
  const classes = useStyle();
  const { addMoreCard, addMoreList } = useContext(storeApi);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleOnChange = e => {
    setTitle(e.target.value);
  };
  const handleOnChangeDesc = e => {
    setDesc(e.target.value);
  };
  const handleBtnConfirm = React.useCallback(async () => {
    if (type === 'card') {
      await addMoreCard(title, desc, listId);
      setTitle('');
      setDesc('');
      setOpen(false);
    } else {
      await addMoreList(title);
      setTitle('');
      setOpen(false);
    }
  }, [type, title, listId, desc]);
  return (
    <div>
      <div>
        <Paper className={classes.card}>
          {type === 'card' ? (
            <>
              <InputBase
                onChange={handleOnChange}
                multiline
                // onBlur={() => setOpen(false)}
                fullWidth
                inputProps={{
                  className: classes.input
                }}
                value={title}
                placeholder='Enter a title of this card..'
              />
              <InputBase
                onChange={handleOnChangeDesc}
                multiline
                // onBlur={() => setOpen(false)}
                fullWidth
                inputProps={{
                  className: classes.input
                }}
                value={desc}
                placeholder='Enter a desc of this card..'
              />
            </>
          ) : (
            <InputBase
              onChange={handleOnChange}
              multiline
              // onBlur={() => setOpen(false)}
              fullWidth
              inputProps={{
                className: classes.input
              }}
              value={title}
              placeholder='Enter a title of this List..'
            />
          )}
        </Paper>
      </div>
      <div className={classes.confirm}>
        <Button className={classes.btnConfirm} onClick={type => handleBtnConfirm(type)}>
          {type === 'card' ? 'Add Card' : 'Add List'}
        </Button>
        <IconButton onClick={() => setOpen(false)}>
          <ClearIcon />
        </IconButton>
      </div>
    </div>
  );
}
