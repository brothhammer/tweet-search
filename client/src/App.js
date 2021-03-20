import React, {useEffect, useState} from 'react';
import Tweet from './components/Tweet';
import {Box, InputAdornment, List, makeStyles, OutlinedInput, Typography,} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#fafafa',
  },
  content: {
    width: '100%',
    maxWidth: '70ch',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const getHashTags = (data) => {
  const getHashTagArrays = (
    _.map(data, (value) => {
        return value.entities.hashtags
    })
  )
  const filterEmptyHashTag = _.filter(getHashTagArrays, (value) => {
    if(!_.isEmpty(value)) {
      return value
    }
  })
  const hashTags = _.map(filterEmptyHashTag, (value) =>{
    return _.map(value, (value) => {
      return value.text
    });
  })
  const flatHashTags = [].concat(...hashTags);
  const uniqueHashTags = new Set(flatHashTags);
  const hashTagsArray = [...uniqueHashTags]
  // console.log(hashTagsArray);
  return hashTagsArray;
}

function App() {
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [hashTags, setHashTags] = useState([]);


  useEffect(() => {
    if (search) {
      const payload = { query: `q=%23${search}&result_type=popular&count=5` }
      const getResults= async () => {
        await fetch('http://localhost:4000/search', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
            setResults(data.statuses)
            setHashTags(getHashTags(data.statuses))
            // setNextSearch(getNextSearch(data))
          })
      }
      getResults();
    } else {
      setResults([])
      setHashTags([])
    }
  }, [search])

  console.log(results);

  return (
    <>
      <div className={classes.root}>
        <Box m={1} pt={2}>
          <Typography className={classes.content} variant="subtitle1">
            Tweet Search
          </Typography>
        </Box>

        <Box m={1} pt={2}>
          <OutlinedInput
            className={classes.content}
            id="input-with-icon-adornment"
            type="text"
            value={search}
            placeholder="Search by keyword"
            onChange={(e) => setSearch(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Box>

        {(results.length !== 0) &&
        <Box m={1} pt={2}>
        <List className={classes.content}
              style={{borderWidth: 1, borderColor: 'lightgrey', borderStyle: 'solid', borderRadius:8}}>
          {results.map((result, key) => (
            <Tweet
              key={key}
              index={key}
              result={result}
              onClick={(hashTag) => setSearch(hashTag)}
            />
          ))}
        </List>
        </Box>
        }
      </div>
    </>
  )
}

export default App;
